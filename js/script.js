document.addEventListener('DOMContentLoaded', () => {

  // Dark mode toggle
  const themeToggle = document.getElementById('theme-toggle');
  const applyTheme = (isDark) => {
    document.body.classList.toggle('dark-mode', isDark);
    if (themeToggle) {
      themeToggle.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    }
  };
  let savedTheme = null;
  try { savedTheme = localStorage.getItem('hallel-theme'); } catch (e) {}
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(savedTheme ? savedTheme === 'dark' : prefersDark);
  themeToggle && themeToggle.addEventListener('click', () => {
    const isDark = !document.body.classList.contains('dark-mode');
    applyTheme(isDark);
    try { localStorage.setItem('hallel-theme', isDark ? 'dark' : 'light'); } catch (e) {}
  });

  // Image lightbox
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox-overlay';
  lightbox.innerHTML = '<button class="lightbox-close" aria-label="Close"><i class="fa-solid fa-xmark"></i></button><img src="" alt="">';
  document.body.appendChild(lightbox);
  const lightboxImg = lightbox.querySelector('img');
  const lightboxClose = lightbox.querySelector('.lightbox-close');

  const openLightbox = (src, alt) => {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };
  document.querySelectorAll('.lightbox-img').forEach(img => {
    img.addEventListener('click', () => openLightbox(img.src, img.alt));
  });
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

  // Preloader
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader && preloader.classList.add('loaded'), 300);
  });
  setTimeout(() => preloader && preloader.classList.add('loaded'), 1500);

  // Header scroll state
  const header = document.querySelector('header');
  const backToTop = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 40;
    header && header.classList.toggle('scrolled', scrolled);
    backToTop && backToTop.classList.toggle('show', window.scrollY > 500);
  });

  backToTop && backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Mobile nav toggle
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  navToggle && navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('open');
  });
  navLinks && navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    question && question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });

  // Scroll reveal with stagger
  const revealEls = document.querySelectorAll('.reveal');
  revealEls.forEach(el => {
    const parent = el.parentElement;
    const idx = Array.from(parent.children).filter(c => c.classList.contains('reveal')).indexOf(el);
    el.style.transitionDelay = Math.min(idx * 90, 360) + 'ms';
  });

  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  // Animated stat counters
  const statEls = document.querySelectorAll('.stat-card h2');
  if ('IntersectionObserver' in window && statEls.length) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const raw = el.textContent.trim();
        const match = raw.match(/^([\d,]+)(.*)$/);
        if (!match) return;
        const target = parseInt(match[1].replace(/,/g, ''), 10);
        const suffix = match[2];
        const duration = 1400;
        const start = performance.now();
        const step = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(target * eased);
          el.textContent = current.toLocaleString() + suffix;
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        countObserver.unobserve(el);
      });
    }, { threshold: 0.4 });
    statEls.forEach(el => countObserver.observe(el));
  }

  // Chatbot toggle
  const chatToggle = document.getElementById('chatbot-toggle');
  const chatWindow = document.getElementById('chatbot-window');
  const chatClose = document.getElementById('chatbot-close');
  const chatMessages = document.getElementById('chatbot-messages');

  const openChat = () => {
    chatWindow.classList.remove('chatbot-hidden');
    if (chatMessages && !chatMessages.dataset.greeted) {
      chatMessages.innerHTML = `<p style="background:var(--bg-secondary);color:var(--text);padding:10px 14px;border-radius:12px;margin-bottom:8px;max-width:85%;">Hi! 👋 I'm the Hallel Assistant. Ask me about opening hours, location, services, appointments, HMO cover, or emergencies.</p>`;
      chatMessages.dataset.greeted = 'true';
    }
  };
  chatToggle && chatToggle.addEventListener('click', () => {
    chatWindow.classList.contains('chatbot-hidden') ? openChat() : chatWindow.classList.add('chatbot-hidden');
  });
  chatClose && chatClose.addEventListener('click', () => chatWindow.classList.add('chatbot-hidden'));

  const chatInput = document.getElementById('chatbot-input');
  const chatSend = document.getElementById('chatbot-send');

  const KB = [
    { keys: ['hour', 'open', 'time', 'close', 'when'], reply: "We're open 24/7, 365 days a year — including weekends and public holidays. Our emergency department never closes." },
    { keys: ['location', 'address', 'where', 'direction', 'find you'], reply: "We're located at #5, Harmony Close, Eneka, Port Harcourt, Rivers State. You can find directions on our Contact page." },
    { keys: ['emergency', 'urgent', 'critical', 'ambulance'], reply: "For emergencies, call us right away at +234 704 288 2756 or come in directly — no appointment needed. Our emergency team is available 24/7." },
    { keys: ['appointment', 'book', 'schedule', 'visit'], reply: 'You can book an appointment on our Appointment page — just pick a service and preferred date, and our team will confirm shortly. <a href="appointment.html" style="color:var(--accent);font-weight:600;">Book now →</a>' },
    { keys: ['hmo', 'insurance', 'cover'], reply: "We accept major HMOs. Call +234 704 288 2756 with your HMO card or policy number ready and our team will confirm your coverage." },
    { keys: ['maternity', 'delivery', 'pregnan', 'antenatal', 'anc'], reply: "We offer full antenatal care and safe, compassionate maternity & delivery services. You can book a consultation on our Appointment page." },
    { keys: ['doctor', 'physician', 'specialist'], reply: 'Our medical team includes Dr. Anosike, Dr. Abel, and Dr. Chigozie, covering general practice and surgery. See the Doctors page for details. <a href="doctors.html" style="color:var(--accent);font-weight:600;">Meet the team →</a>' },
    { keys: ['service', 'offer', 'treat', 'what do you'], reply: 'We offer general consultation, maternity & delivery, obstetrics & gynaecology, paediatrics, surgery, lab services, ultrasound, eye clinic, immunization, family planning, and 24/7 emergency care. <a href="services.html" style="color:var(--accent);font-weight:600;">See all services →</a>' },
    { keys: ['pay', 'cost', 'price', 'fee', 'how much'], reply: "We accept cash, bank transfers, POS, and approved HMO plans. Emergencies are treated first, before any payment discussion." },
    { keys: ['contact', 'phone', 'number', 'call', 'email'], reply: "You can reach us at +234 704 288 2756 or hospitalhallel@gmail.com — or use the WhatsApp button in the corner for a quick chat." },
    { keys: ['child', 'paediatric', 'baby', 'kid'], reply: "Our paediatrics team provides dedicated care for infants, children, and adolescents in a friendly, caring environment." },
    { keys: ['thank', 'thanks'], reply: "You're very welcome! Is there anything else I can help you with?" },
    { keys: ['hi', 'hello', 'hey'], reply: "Hello! 👋 I can help with opening hours, location, services, appointments, HMO coverage, or emergency contact — what would you like to know?" },
  ];

  const findReply = (text) => {
    const t = text.toLowerCase();
    for (const entry of KB) {
      if (entry.keys.some(k => t.includes(k))) return entry.reply;
    }
    return "I'm not totally sure about that one. For anything specific, please call +234 704 288 2756 or email hospitalhallel@gmail.com — our team can help directly.";
  };

  const addMessage = (text, fromUser) => {
    const msg = document.createElement('p');
    if (fromUser) {
      msg.style.cssText = 'background:var(--primary);color:#fff;padding:10px 14px;border-radius:12px;margin-bottom:8px;margin-left:auto;max-width:80%;';
    } else {
      msg.style.cssText = 'background:var(--bg-secondary);color:var(--text);padding:10px 14px;border-radius:12px;margin-bottom:8px;max-width:85%;';
    }
    msg.innerHTML = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  const sendMessage = () => {
    if (!chatInput.value.trim()) return;
    const question = chatInput.value;
    addMessage(question, true);
    chatInput.value = '';
    setTimeout(() => addMessage(findReply(question), false), 500);
  };
  chatSend && chatSend.addEventListener('click', sendMessage);
  chatInput && chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

  // Smooth anchor scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Form success messages (Formspree AJAX)
  ['appointment-form', 'contact-form'].forEach(id => {
    const form = document.getElementById(id);
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const successId = id === 'appointment-form' ? 'form-success' : 'contact-success';
      const successEl = document.getElementById(successId);
      try {
        const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        if (res.ok) {
          form.style.display = 'none';
          successEl && successEl.classList.add('show');
        }
      } catch (err) {
        console.error('Form submission error:', err);
      }
    });
  });
});
