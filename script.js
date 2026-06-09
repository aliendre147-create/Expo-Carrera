/* =====================================================
   FACEN EXPO CARRERAS – script.js  (Hub layout)
   ===================================================== */

// ── STICKY HEADER ─────────────────────────────────
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── REVEAL ON SCROLL ──────────────────────────────
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => revealObs.observe(el));

// ── ACORDEÓN HUB ──────────────────────────────────
const hubSections = document.querySelectorAll('.hub-section');

hubSections.forEach(section => {
  const trigger = section.querySelector('.hub-section__trigger');
  const panelId = trigger.getAttribute('aria-controls');
  const panel   = document.getElementById(panelId);
  if (!trigger || !panel) return;

  trigger.addEventListener('click', () => {
    const isOpen = section.classList.contains('open');

    // Cerrar todos los demás
    hubSections.forEach(s => {
      if (s !== section) {
        s.classList.remove('open');
        const t = s.querySelector('.hub-section__trigger');
        const p = document.getElementById(t?.getAttribute('aria-controls'));
        if (t) t.setAttribute('aria-expanded', 'false');
        if (p) p.hidden = true;
      }
    });

    // Toggle este
    section.classList.toggle('open', !isOpen);
    trigger.setAttribute('aria-expanded', String(!isOpen));
    panel.hidden = isOpen;

    // Scroll suave al abrir
    if (!isOpen) {
      setTimeout(() => {
        section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 50);
    }
  });
});

// Abrir sección "Carreras" por defecto
// const firstSection = document.querySelector('.hub-section');
// if (firstSection) firstSection.querySelector('.hub-section__trigger')?.click();

// ── CHATBOT ──────────────────────────────────────
const chatbotBtn  = document.getElementById('chatbot-btn');
const chatModal   = document.getElementById('chat-modal');
const chatClose   = document.getElementById('chat-close');
const chatBody    = document.getElementById('chat-body');
const chatInput   = document.getElementById('chat-input');
const chatSend    = document.getElementById('chat-send');
const chatOpts    = document.getElementById('chat-options');
const tooltip     = document.getElementById('chatbot-tooltip');
const tooltipX    = document.getElementById('tooltip-close');

tooltipX.addEventListener('click', () => tooltip.classList.add('hidden'));
setTimeout(() => tooltip.classList.add('hidden'), 6000);
window.addEventListener('scroll', () => tooltip.classList.add('hidden'), { once: true, passive: true });

function openChat() {
  chatModal.classList.add('open');
  chatModal.setAttribute('aria-hidden', 'false');
  chatbotBtn.classList.add('active');
  tooltip.classList.add('hidden');
  setTimeout(() => chatInput.focus(), 350);
}
function closeChat() {
  chatModal.classList.remove('open');
  chatModal.setAttribute('aria-hidden', 'true');
  chatbotBtn.classList.remove('active');
}

chatbotBtn.addEventListener('click', () => chatModal.classList.contains('open') ? closeChat() : openChat());
chatClose.addEventListener('click', closeChat);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeChat(); });

// Respuestas bot
const botDB = {
  default: [
    'Para más info podés escribirnos a info@exactas.unca.edu.ar o pasar por la secretaría de alumnos 😊',
    '¡Buena pregunta! Esa la saben mejor los profes. Seguí las redes de FACEN UNCa para estar al tanto.',
  ],
  '¿Cuáles son las carreras?': '📚 En FACEN hay 3 licenciaturas:\n\n• **Ciencias de Datos** – IA y Machine Learning\n• **Informática** – Software y ciberseguridad\n• **Matemática** – Teoría, docencia e investigación\n\nTodas tienen excelente salida laboral 🚀',
  '¿Cómo me inscribo?': '📋 Son 4 pasos:\n\n1️⃣ Pre-inscripción en SIU-Guaraní\n2️⃣ DNI + título secundario\n3️⃣ Curso de Ingreso (febrero)\n4️⃣ ¡Arrancás en marzo! 🎉',
  '¿Hay becas?': '🎓 ¡Sí! Podés acceder a:\n\n• 🍽️ Comedor universitario\n• 📄 Subsidio de fotocopias\n• 💰 Becas económicas mensuales\n• 💻 Laboratorios y equipos\n\nTodo gratis. Todo tuyo.',
  '¿Cuándo arranca?': '📅 El cursado arranca en **marzo**. El Curso de Ingreso es en **febrero** y la inscripción abre en **noviembre/diciembre**.\n\n¡Anotá las fechas! 📆',
};

function getReply(msg) {
  if (botDB[msg]) return botDB[msg];
  const m = msg.toLowerCase();
  if (m.includes('carrera') || m.includes('licenciat') || m.includes('estudiar')) return botDB['¿Cuáles son las carreras?'];
  if (m.includes('inscrib') || m.includes('anot') || m.includes('trámit')) return botDB['¿Cómo me inscribo?'];
  if (m.includes('beca') || m.includes('beneficio') || m.includes('comedor')) return botDB['¿Hay becas?'];
  if (m.includes('cuando') || m.includes('cuándo') || m.includes('fecha') || m.includes('arranca')) return botDB['¿Cuándo arranca?'];
  return botDB.default[Math.floor(Math.random() * botDB.default.length)];
}

function now() { return new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }); }
function esc(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function addUser(text) {
  const d = document.createElement('div');
  d.className = 'chat-msg chat-msg--user';
  d.innerHTML = `<div class="chat-msg__bubble">${esc(text)}</div><div class="chat-msg__time">${now()}</div>`;
  chatBody.appendChild(d);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function addBot(text) {
  return new Promise(res => {
    // typing
    const t = document.createElement('div');
    t.className = 'chat-msg chat-msg--bot chat-typing';
    t.innerHTML = `<div class="chat-msg__bubble"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>`;
    chatBody.appendChild(t);
    chatBody.scrollTop = chatBody.scrollHeight;

    setTimeout(() => {
      t.remove();
      const d = document.createElement('div');
      d.className = 'chat-msg chat-msg--bot';
      const html = esc(text).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
      d.innerHTML = `<div class="chat-msg__bubble">${html}</div><div class="chat-msg__time">${now()}</div>`;
      chatBody.appendChild(d);
      chatBody.scrollTop = chatBody.scrollHeight;
      res();
    }, 1100);
  });
}

async function send(text) {
  const t = text.trim();
  if (!t) return;
  if (chatOpts) chatOpts.style.display = 'none';
  addUser(t);
  chatInput.value = '';
  chatInput.disabled = chatSend.disabled = true;
  await addBot(getReply(t));
  chatInput.disabled = chatSend.disabled = false;
  chatInput.focus();
}

chatSend.addEventListener('click', () => send(chatInput.value));
chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); send(chatInput.value); } });
chatOpts?.addEventListener('click', e => { const b = e.target.closest('.chat-opt'); if (b) send(b.dataset.msg); });

// ── SMOOTH SCROLL PARA ANCHORS ─────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});