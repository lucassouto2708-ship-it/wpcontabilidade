(() => {
  "use strict";
  const C = window.SITE_CONFIG;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* ---------------- Métricas (GA4 / Meta Pixel) ---------------- */
  // Carregadas somente se os IDs estiverem configurados em config.js
  const { ga4Id, metaPixelId } = C.analytics || {};
  if (ga4Id) {
    const s = document.createElement("script");
    s.async = true; s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(ga4Id);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag("js", new Date()); gtag("config", ga4Id);
  }
  if (metaPixelId) {
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq("init", metaPixelId); fbq("track", "PageView");
  }
  const track = (event, params = {}) => {
    if (window.gtag) gtag("event", event, params);
    if (window.fbq) fbq(event === "form_submit" ? "track" : "trackCustom", event === "form_submit" ? "Lead" : event, params);
    window.dataLayer && dataLayer.push({ event, ...params });
  };

  /* ---------------- WhatsApp ---------------- */
  const waUrl = (text) => `https://wa.me/${C.whatsapp.number}?text=${encodeURIComponent(text)}`;
  $$("[data-wa]").forEach((a) => {
    a.href = waUrl(C.messages[a.dataset.wa] || C.messages.default);
    a.target = "_blank"; a.rel = "noopener";
  });
  $$("[data-wa-display]").forEach((el) => (el.textContent = C.whatsapp.display));
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-track]");
    if (!a) return;
    const ev = a.dataset.track;
    track(ev, { label: a.dataset.label || "", service: a.dataset.wa || "" });
    if (ev !== "whatsapp_click" && a.dataset.wa) track("whatsapp_click", { label: a.dataset.label });
  });

  /* ---------------- Dados opcionais (somente se preenchidos) ---------------- */
  const fc = $("#footer-contact");
  const li = (html) => { const l = document.createElement("li"); l.innerHTML = html; fc.appendChild(l); };
  if (C.instagram) {
    li(`<a href="${C.instagram}" target="_blank" rel="noopener"><svg class="i"><use href="#ic-ig"/></svg>Instagram</a>`);
    const ig = $("#contact-ig"); ig.href = C.instagram; ig.hidden = false;
  }
  const A = C.address;
  const addrLine1 = A ? `${A.street}, ${A.district}` : "";
  const addrLine2 = A ? `${A.city}/${A.state} · <span class="nowrap">CEP ${A.zip}</span>` : "";
  const mapsLink = C.mapQuery ? "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(C.mapQuery) : "";
  if (C.phone) li(`<a href="tel:+${C.phone.number}" data-track="phone_click" data-label="footer"><svg class="i"><use href="#ic-phone"/></svg>${C.phone.display}</a>`);
  if (C.email) li(`<a href="mailto:${C.email}" data-track="email_click" data-label="footer"><svg class="i"><use href="#ic-mail"/></svg>${C.email}</a>`);
  if (A) li(`<a href="${mapsLink}" target="_blank" rel="noopener" data-track="map_click" data-label="footer" class="footer__addr"><svg class="i"><use href="#ic-pin"/></svg><span>${addrLine1}<br>${addrLine2}</span></a>`);

  // Linhas extras na seção Contato
  const cl = $("#contact-lines");
  const line = (href, ic, label, value, ext, ev) => cl.insertAdjacentHTML("beforeend",
    `<a class="contact__line" href="${href}"${ext ? ' target="_blank" rel="noopener"' : ""} data-track="${ev}" data-label="contato"><span class="contact__ic"><svg class="i"><use href="#${ic}"/></svg></span><span><small>${label}</small><strong>${value}</strong></span></a>`);
  if (C.phone) line(`tel:+${C.phone.number}`, "ic-phone", "Telefone", C.phone.display, false, "phone_click");
  if (C.email) line(`mailto:${C.email}`, "ic-mail", "E-mail", C.email, false, "email_click");
  if (A) line(mapsLink, "ic-pin", "Endereço", `${addrLine1}<br><span class="contact__sub">${addrLine2}</span>`, true, "map_click");

  // Bloco de endereço + mapa na seção Atendimento
  if (A) {
    const ab = $("#address-block");
    ab.innerHTML = `<span class="addr__ic"><svg class="i"><use href="#ic-building"/></svg></span>
      <div class="addr__txt"><small>Escritório</small><strong>${addrLine1}</strong><span>${addrLine2}</span></div>
      <a class="addr__go" href="${mapsLink}" target="_blank" rel="noopener" data-track="map_click" data-label="atendimento">Como chegar <svg class="i"><use href="#ic-arrow"/></svg></a>`;
    ab.hidden = false;
  }
  if (C.mapQuery) {
    const m = $("#map-block");
    m.innerHTML = `<a class="map__fallback" href="${mapsLink}" target="_blank" rel="noopener" data-track="map_click" data-label="mapa"><svg class="i"><use href="#ic-pin"/></svg><span>Ver localização no Google Maps</span></a><iframe src="https://maps.google.com/maps?q=${encodeURIComponent(C.mapQuery)}&z=16&output=embed" loading="lazy" title="Mapa: ${addrLine1}, ${A.city}/${A.state}" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
    m.hidden = false;
  }
  const legal = [C.crc && "CRC " + C.crc].filter(Boolean).join(" · ");
  if (legal) $("#footer-legal").textContent = " · " + legal;
  if (C.cnpj) $$("[data-cnpj]").forEach((el) => { el.textContent = C.cnpj; el.closest("[hidden]")?.removeAttribute("hidden"); });
  if (C.email) $$("[data-email]").forEach((el) => { el.textContent = C.email; el.href = "mailto:" + C.email; });

  /* ---------------- Depoimentos ou Compromissos ---------------- */
  const tHead = $("#testimonials-head"), tWrap = $("#testimonials");
  const star = '<svg class="i"><use href="#ic-star"/></svg>';
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  if (C.testimonials && C.testimonials.length) {
    tHead.innerHTML = `<span class="eyebrow">Depoimentos</span><h2>A confiança dos nossos clientes é o que nos motiva.</h2><p>Conheça a experiência de quem já conta com nossos serviços.</p>`;
    tWrap.innerHTML = C.testimonials.map((t) => `
      <figure class="tex-card tcard reveal"><div class="tex-card__inner">
        ${t.rating ? `<div class="tcard__stars" aria-label="Avaliação ${t.rating} de 5">${star.repeat(Math.min(5, t.rating))}</div>` : ""}
        <blockquote>“${esc(t.text)}”</blockquote>
        <footer><strong>${esc(t.name)}</strong>${t.service ? `<span>${esc(t.service)}</span>` : ""}</footer>
      </div></figure>`).join("");
  } else {
    $("#depoimentos").setAttribute("aria-label", "Nossos compromissos");
    tHead.innerHTML = `<span class="eyebrow">Nossos compromissos</span><h2>O que você pode esperar do nosso atendimento.</h2><p>Princípios que orientam a forma como cuidamos de cada cliente.</p>`;
    const items = [
      ["ic-chat", "Comunicação clara", "Explicações objetivas sobre obrigações, prazos e próximos passos, sem linguagem complicada."],
      ["ic-check-shield", "Cuidado com informações", "Tratamento responsável dos dados e documentos compartilhados com o escritório."],
      ["ic-user", "Atenção a cada caso", "Orientação de acordo com a realidade de cada empresa ou pessoa atendida."],
    ];
    tWrap.innerHTML = items.map(([ic, h, p]) => `
      <div class="tex-card commit reveal"><div class="tex-card__inner">
        <span class="commit__ic"><svg class="i"><use href="#${ic}"/></svg></span>
        <div><h3>${h}</h3><p>${p}</p></div>
      </div></div>`).join("");
  }

  /* ---------------- Header / menu ---------------- */
  const header = $("#header"), nav = $("#nav"), burger = $("#burger");
  const onScroll = () => header.classList.toggle("is-scrolled", scrollY > 8);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  const setMenu = (open) => {
    nav.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  };
  burger.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  nav.addEventListener("click", (e) => e.target.closest("a") && setMenu(false));
  addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));

  // Link ativo conforme a seção visível
  const links = $$('.nav a[href^="#"]');
  const sections = links.map((l) => $(l.getAttribute("href"))).filter(Boolean);
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === "#" + en.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => spy.observe(s));

  /* ---------------- Reveal ---------------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
  const observeReveal = () => $$(".reveal:not(.is-visible)").forEach((el) => {
    const sib = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
    el.style.setProperty("--rd", Math.min(sib.indexOf(el), 5) * 0.07 + "s");
    io.observe(el);
  });
  observeReveal();

  /* ---------------- FAQ accordion suave ---------------- */
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  $$(".faq__item").forEach((d) => {
    const sum = $("summary", d), body = $(".faq__body", d);
    sum.addEventListener("click", (e) => {
      e.preventDefault();
      if (d.open) {
        d.classList.remove("is-open");
        if (reduce) d.open = false;
        else body.addEventListener("transitionend", () => { if (!d.classList.contains("is-open")) d.open = false; }, { once: true });
      } else {
        $$(".faq__item.is-open").forEach((o) => { if (o !== d) { o.classList.remove("is-open"); setTimeout(() => o.open = false, reduce ? 0 : 300); } });
        d.open = true;
        requestAnimationFrame(() => requestAnimationFrame(() => d.classList.add("is-open")));
      }
    });
  });

  /* ---------------- Formulário → WhatsApp ---------------- */
  const form = $("#contact-form");
  const phone = $("#f-phone");
  phone.addEventListener("input", () => {
    let v = phone.value.replace(/\D/g, "").slice(0, 11);
    if (v.length > 6) v = `(${v.slice(0, 2)}) ${v.slice(2, v.length - 4)}-${v.slice(-4)}`;
    else if (v.length > 2) v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    phone.value = v;
  });
  const check = (input, ok) => { input.closest(".field").classList.toggle("is-invalid", !ok); return ok; };
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#f-name"), service = $("#f-service"), msg = $("#f-msg"), consent = $("#f-consent");
    const digits = phone.value.replace(/\D/g, "");
    const ok = [
      check(name, name.value.trim().length >= 2),
      check(phone, digits.length >= 10),
      check(service, !!service.value),
    ].every(Boolean);
    $(".field__err--consent").classList.toggle("show", !consent.checked);
    if (!ok || !consent.checked) { (form.querySelector(".is-invalid input, .is-invalid select") || consent).focus(); return; }
    const text = [
      "Olá! Gostaria de solicitar atendimento.",
      "",
      `*Nome:* ${name.value.trim()}`,
      `*WhatsApp:* ${phone.value}`,
      `*Serviço:* ${service.value}`,
      msg.value.trim() ? `*Mensagem:* ${msg.value.trim()}` : "",
    ].filter((l, i) => l || i === 1).join("\n");
    track("form_submit", { service: service.value });
    window.open(waUrl(text), "_blank", "noopener");
  });
  $$("#contact-form input, #contact-form select").forEach((el) =>
    el.addEventListener("input", () => el.closest(".field")?.classList.remove("is-invalid")));

  /* ---------------- Política de privacidade ---------------- */
  const dlg = $("#privacy");
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-open-privacy]")) { e.preventDefault(); dlg.showModal(); }
    if (e.target.closest("[data-close-privacy]") || e.target === dlg) dlg.close();
  });
  if (location.hash === "#privacidade") dlg.showModal();

  /* ---------------- Botão flutuante (Family Button) ---------------- */
  const fab = $("#fab"), fabBtn = $("#fab-btn");
  setTimeout(() => fab.classList.add("is-in"), 900);
  const setFab = (open) => { fab.classList.toggle("is-open", open); fabBtn.setAttribute("aria-expanded", open); };
  fabBtn.addEventListener("click", () => {
    const open = !fab.classList.contains("is-open");
    setFab(open);
    if (open) track("whatsapp_menu_open", { label: "botao_flutuante" });
  });
  document.addEventListener("click", (e) => { if (!fab.contains(e.target) || e.target.closest(".fab__panel a")) setFab(false); });
  addEventListener("keydown", (e) => { if (e.key === "Escape") setFab(false); });
  // Esconde o botão no mobile quando o formulário ou o CTA final estão na tela
  const visible = new Set();
  const fabIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => en.isIntersecting ? visible.add(en.target) : visible.delete(en.target));
    fab.classList.toggle("is-hidden", innerWidth < 768 && visible.size > 0);
  }, { threshold: 0.25 });
  [$("#contact-form"), $(".cta-final__box")].forEach((z) => z && fabIO.observe(z));

  /* ---------------- Text Animate (título do hero) ---------------- */
  const h1 = $(".text-animate");
  if (h1 && !reduce) {
    let wi = 0;
    const wrap = (node) => [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(part));
          else { const w = document.createElement("span"); w.className = "w"; w.style.setProperty("--wi", wi++); w.textContent = part; frag.appendChild(w); }
        });
        n.replaceWith(frag);
      } else wrap(n);
    });
    wrap(h1);
  }

  /* ---------------- Navegação interna ----------------
     Rolagem feita por JS (não depende da URL). Garante funcionamento quando o
     arquivo é aberto via file:// ou content:// (ex.: aberto pelo WhatsApp no Android). */
  const goTo = (id) => {
    const el = id === "#inicio" || id === "#" ? document.body : $(id);
    if (!el) return false;
    const top = el === document.body ? 0 : el.getBoundingClientRect().top + scrollY - header.offsetHeight - 8;
    scrollTo({ top: Math.max(0, top), behavior: reduce ? "auto" : "smooth" });
    return true;
  };
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.hasAttribute("data-wa") || a.hasAttribute("data-open-privacy") || a.classList.contains("float-chip")) return;
    const href = a.getAttribute("href");
    if (href.length > 1 && !$(href)) return;
    e.preventDefault();
    setMenu(false);
    goTo(href);
  });

  /* ---------------- Chips do hero → card do serviço ---------------- */
  $$("a.float-chip").forEach((a) => a.addEventListener("click", (e) => {
    const card = $(a.getAttribute("href"));
    if (!card) return;
    e.preventDefault();
    e.stopPropagation();
    card.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    card.classList.remove("is-target");
    setTimeout(() => card.classList.add("is-target"), reduce ? 0 : 500);
    card.addEventListener("animationend", () => card.classList.remove("is-target"), { once: true });
    track("hero_service_chip", { label: card.id });
  }));

  /* ---------------- Spotlight ---------------- */
  if (matchMedia("(hover: hover)").matches) {
    $$(".spotlight").forEach((el) => el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", e.clientX - r.left + "px");
      el.style.setProperty("--my", e.clientY - r.top + "px");
    }));
  }
})();
