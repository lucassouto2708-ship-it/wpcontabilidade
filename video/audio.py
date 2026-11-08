"""Gera trilha + efeitos sonoros sincronizados com as cenas (somente numpy).
Uso: python3 audio.py saida.wav"""
import sys, wave, numpy as np

SR = 48000
DUR = 40.0
N = int(SR * DUR)
t = np.arange(N) / SR
rng = np.random.default_rng(7)
mix = np.zeros((N, 2))

def lp(x, cutoff):
    a = np.exp(-2 * np.pi * cutoff / SR); y = np.empty_like(x); z = 0.0
    for i, v in enumerate(x):
        z = (1 - a) * v + a * z; y[i] = z
    return y

def env(n, a, r):
    e = np.ones(n); ia = int(a * SR); ir = int(r * SR)
    e[:ia] = np.linspace(0, 1, ia); e[-ir:] *= np.linspace(1, 0, ir) ** 2
    return e

def add(sig, at, gain=1.0, pan=0.0):
    i = int(at * SR); sig = sig[: N - i]
    mix[i:i + len(sig), 0] += sig * gain * (1 - pan) ** .5 / 2 ** -.5 * .707
    mix[i:i + len(sig), 1] += sig * gain * (1 + pan) ** .5 / 2 ** -.5 * .707

hz = lambda m: 440 * 2 ** ((m - 69) / 12)

# --- Pad: progressão Dmaj9 – Bm9 – Gmaj7 – A6sus, 8 s por acorde
chords = [[50, 57, 61, 64, 66], [47, 54, 57, 61, 62], [43, 50, 54, 59, 62], [45, 52, 57, 59, 64]]
for k in range(5):
    notes = chords[k % 4]; dur = 8.6; n = int(dur * SR); tt = np.arange(n) / SR
    s = np.zeros(n)
    for m in notes:
        for det in (-0.08, 0.08):
            f = hz(m + det)
            s += np.sin(2 * np.pi * f * tt) + .25 * np.sin(4 * np.pi * f * tt + 1)
    s = lp(s, 1400) * env(n, 2.0, 2.5) * (1 + .15 * np.sin(2 * np.pi * .2 * tt))
    add(s / len(notes), k * 8, .15)

# --- Batida suave (92 BPM) a partir da cena 2
beat = 60 / 92
kick_n = int(.35 * SR); kt = np.arange(kick_n) / SR
kick = np.sin(2 * np.pi * (48 + 70 * np.exp(-kt * 30)) * kt) * np.exp(-kt * 9)
hat = lp(rng.standard_normal(int(.05 * SR)), 9000); hat = (rng.standard_normal(len(hat)) - hat) * np.exp(-np.arange(len(hat)) / SR * 90)
b = 6.3; i = 0
while b < 37.5:
    if i % 2 == 0: add(kick, b, .32)
    add(hat, b + beat / 2, .018, pan=.3 if i % 2 else -.3)
    b += beat; i += 1

# --- Pluck arpejado discreto
def pluck(f, d=.9):
    n = int(d * SR); tt = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * tt) + .3 * np.sin(6 * np.pi * f * tt)) * np.exp(-tt * 5)
arp = [74, 78, 81, 78, 73, 76, 81, 76]
b = 13.3; i = 0
while b < 34:
    add(pluck(hz(arp[i % 8])), b, .05, pan=[-.4, .4][i % 2]); b += beat / 2; i += 1

# --- SFX
def whoosh(d=.9, rise=True):
    n = int(d * SR); x = rng.standard_normal(n); tt = np.linspace(0, 1, n)
    cut = 300 + 4000 * (tt if rise else 1 - tt) ** 2
    y = np.empty(n); z = z2 = 0.0
    for k in range(n):
        a = np.exp(-2 * np.pi * cut[k] / SR); z = (1 - a) * x[k] + a * z; z2 = (1 - a) * z + a * z2; y[k] = z2
    return y * np.sin(np.pi * tt) ** 2 * 2.2
def pop(f=880):
    n = int(.18 * SR); tt = np.arange(n) / SR
    return np.sin(2 * np.pi * f * tt * (1 + .4 * np.exp(-tt * 40))) * np.exp(-tt * 28)
def tick():
    n = int(.04 * SR); tt = np.arange(n) / SR
    return (np.sin(2 * np.pi * 2400 * tt) + .5 * rng.standard_normal(n) * np.exp(-tt * 400)) * np.exp(-tt * 120)
def shimmer():
    n = int(3 * SR); tt = np.arange(n) / SR; s = np.zeros(n)
    for m in (86, 90, 93, 98): s += np.sin(2 * np.pi * hz(m) * tt) * np.exp(-tt * 1.4)
    return s * np.minimum(1, tt * 30) / 4

for at in (5.6, 12.6, 19.6, 26.6, 33.8): add(whoosh(1.0), at, .12)          # transições
for at, p in ((7.6, -.5), (8.2, 0), (8.6, .5), (14.4, .2), (21.6, 0), (28.4, .4), (29.2, -.4)):
    add(pop(hz(81 + (p > 0) * 4)), at + .05, .10, pan=p)                     # cards saltando
for at in (10.25, 31.45): add(tick(), at, .22)                               # toques
add(pop(hz(69)), .35, .12); add(shimmer(), 35.2, .14)                        # logo / final

# --- master
fade = np.minimum(1, t / 1.0) * np.minimum(1, (DUR - t) / 2.5)
mix *= fade[:, None]
mix = np.tanh(mix * 1.4) / np.tanh(1.4)
mix *= .89 / np.abs(mix).max()
pcm = (mix * 32767).astype(np.int16)
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
