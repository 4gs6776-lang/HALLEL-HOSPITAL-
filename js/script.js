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

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
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

  // Chatbot toggle
  const chatToggle = document.getElementById('chatbot-toggle');
  const chatWindow = document.getElementById('chatbot-window');
  const chatClose = document.getElementById('chatbot-close');
  const chatMessages = document.getElementById('chatbot-messages');

  const openChat = () => {
    chatWindow.classList.remove('chatbot-hidden');
    if (chatMessages && !chatMessages.dataset.greeted) {
      chatMessages.innerHTML = `<p style="background:#F8FAFC;padding:10px 14px;border-radius:12px;margin-bottom:8px;">Hi! 👋 How can we help you today? For urgent matters, please call +234 704 288 2756.</p>`;
      chatMessages.dataset.greeted = 'true';
    }
  };
  chatToggle && chatToggle.addEventListener('click', () => {
    chatWindow.classList.contains('chatbot-hidden') ? openChat() : chatWindow.classList.add('chatbot-hidden');
  });
  chatClose && chatClose.addEventListener('click', () => chatWindow.classList.add('chatbot-hidden'));

  const chatInput = document.getElementById('chatbot-input');
  const chatSend = document.getElementById('chatbot-send');
  const sendMessage = () => {
    if (!chatInput.value.trim()) return;
    const msg = document.createElement('p');
    msg.style.cssText = 'background:#0F4C81;color:#fff;padding:10px 14px;border-radius:12px;margin-bottom:8px;margin-left:auto;max-width:80%;';
    msg.textContent = chatInput.value;
    chatMessages.appendChild(msg);
    chatInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;
    setTimeout(() => {
      const reply = document.createElement('p');
      reply.style.cssText = 'background:#F8FAFC;padding:10px 14px;border-radius:12px;margin-bottom:8px;max-width:80%;';
      reply.textContent = "Thanks for reaching out! Our team will get back to you shortly. For emergencies, please call us directly.";
      chatMessages.appendChild(reply);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 600);
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
