// Shared contact behavior; archive-only controls are guarded when absent.
(() => {
  const menu = document.getElementById('nav-menu');
  const toggle = document.getElementById('nav-toggle');
  const close = document.getElementById('nav-close');
  toggle?.addEventListener('click', () => menu?.classList.add('show-menu'));
  close?.addEventListener('click', () => menu?.classList.remove('show-menu'));
  document.querySelectorAll('.nav__link').forEach((link) => {
    link.addEventListener('click', () => menu?.classList.remove('show-menu'));
  });
  const header = document.getElementById('header');
  if (header) {
    const updateHeader = () => header.classList.toggle('scroll-header', window.scrollY >= 50);
    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();
  }
  const switcher = document.querySelector('.style__switcher');
  document.querySelector('.style__switcher-toggler')?.addEventListener('click', () => switcher?.classList.toggle('open'));
  if (switcher) window.addEventListener('scroll', () => switcher.classList.remove('open'), { passive: true });
  window.setActiveStyle = (color) => {
    document.querySelectorAll('.alternate-style').forEach((style) => { style.disabled = style.title !== color; });
  };

  const form = document.getElementById('contact-form');
  const status = document.getElementById('contact-message');
  if (!form || !status) return;
  const submit = form.querySelector('button[type="submit"]');
  let sending = false;
  const fallback = 'Message could not be sent. Your text has been kept. Please email abundojonalene@gmail.com directly or try again.';
  if (!window.emailjs) status.textContent = 'The contact service is unavailable. Please email abundojonalene@gmail.com directly.';
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (sending || !form.reportValidity()) return;
    const fields = ['name', 'email', 'message'].map((name) => form.elements.namedItem(name));
    if (fields.some((field) => !field || !field.value.trim())) {
      status.textContent = 'Please complete your name, email, and message.';
      fields.find((field) => field && !field.value.trim())?.focus();
      return;
    }
    if (!window.emailjs) { status.textContent = fallback; return; }
    sending = true;
    submit.disabled = true;
    form.setAttribute('aria-busy', 'true');
    status.textContent = 'Sending your message…';
    try {
      await window.emailjs.sendForm('service_aq07ojd', 'template_fjgxf0j', form, 'GhWi_CA14Lsatqb-7');
      status.textContent = 'Message sent. Thank you for getting in touch.';
      form.reset();
    } catch {
      status.textContent = fallback;
    } finally {
      sending = false;
      submit.disabled = false;
      form.removeAttribute('aria-busy');
    }
  });
})();
