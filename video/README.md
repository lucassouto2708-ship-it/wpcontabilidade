# Vídeo de apresentação do site

1. Sirva o site: `python3 -m http.server 8811` (na raiz do repo)
2. Capturas: `node video/shoot.js video/shots` e `node video/els.js video/shots`
3. Frames: `node video/render.js $PWD/video /tmp/frames 60`
4. MP4: `ffmpeg -framerate 60 -i /tmp/frames/%05d.jpg -c:v libx264 -pix_fmt yuv420p -crf 18 video/wp-apresentacao.mp4`

Cenas e tempos ficam no array `T` de `scene.html` (`show(id, entra, sai, opções)` e `tap(id, tempo)`).

## Versão 9:16 e áudio
- Vertical: `SCENE=scene-vertical.html W=1080 H=1920 node video/render.js $PWD/video /tmp/vframes 60`
- Trilha + efeitos (sincronizados aos tempos das cenas): `python3 video/audio.py video/trilha.wav`
- Junte com `-i trilha.wav -c:a aac -shortest` no ffmpeg.
