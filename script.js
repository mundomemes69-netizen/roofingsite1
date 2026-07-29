document.addEventListener('DOMContentLoaded', () => {

  /* ============ Sticky / transparent header ============ */
  const header = document.getElementById('siteHeader');
  const toggleHeaderState = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  toggleHeaderState();
  window.addEventListener('scroll', toggleHeaderState, { passive: true });

  /* ============ Mobile nav toggle ============ */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ============ Scroll reveal ============ */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ============ Animated counters ============ */
  const counters = document.querySelectorAll('.count');
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1600;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target).toLocaleString('en-US');
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  counters.forEach((el) => counterObserver.observe(el));

  /* ============ FAQ accordion ============ */
  const accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach((item) => {
    const trigger = item.querySelector('.accordion-trigger');
    const panel = item.querySelector('.accordion-panel');

    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';

      accordionItems.forEach((other) => {
        other.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
        other.querySelector('.accordion-panel').style.maxHeight = null;
      });

      if (!isOpen) {
        trigger.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  /* ============ Before / After slider ============ */
  const slider = document.getElementById('baSlider');
  const beforeWrap = document.getElementById('baBeforeWrap');
  const handle = document.getElementById('baHandle');

  if (slider && beforeWrap && handle) {
    let dragging = false;

    const setSlider = (clientX) => {
      const rect = slider.getBoundingClientRect();
      let percent = ((clientX - rect.left) / rect.width) * 100;
      percent = Math.max(0, Math.min(100, percent));
      beforeWrap.style.width = percent + '%';
      handle.style.left = percent + '%';
    };

    const startDrag = () => { dragging = true; };
    const stopDrag = () => { dragging = false; };
    const onMove = (e) => {
      if (!dragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      setSlider(clientX);
    };

    handle.addEventListener('mousedown', startDrag);
    slider.addEventListener('mousedown', (e) => { startDrag(); setSlider(e.clientX); });
    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('mousemove', onMove);

    handle.addEventListener('touchstart', startDrag, { passive: true });
    slider.addEventListener('touchstart', (e) => { startDrag(); setSlider(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('touchend', stopDrag);
    window.addEventListener('touchmove', onMove, { passive: true });
  }

  /* ============ Estimate form validation ============ */
  const form = document.getElementById('estimateForm');
  const successMessage = document.getElementById('formSuccess');

  if (form) {
    const fields = {
      ctaName: {
        input: document.getElementById('ctaName'),
        error: document.getElementById('err-ctaName'),
        validate: (v) => v.trim().length >= 3,
        message: 'Please enter your full name.'
      },
      ctaPhone: {
        input: document.getElementById('ctaPhone'),
        error: document.getElementById('err-ctaPhone'),
        validate: (v) => /^[0-9()+\-\s]{7,}$/.test(v.trim()),
        message: 'Please enter a valid phone number.'
      },
      ctaZip: {
        input: document.getElementById('ctaZip'),
        error: document.getElementById('err-ctaZip'),
        validate: (v) => /^\d{5}(-\d{4})?$/.test(v.trim()),
        message: 'Please enter a valid ZIP code.'
      }
    };

    Object.values(fields).forEach(({ input }) => {
      input.addEventListener('input', () => {
        input.classList.remove('invalid');
        const key = Object.keys(fields).find((k) => fields[k].input === input);
        fields[key].error.textContent = '';
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      successMessage.classList.remove('visible');
      let isValid = true;

      Object.values(fields).forEach((field) => {
        const value = field.input.value || '';
        if (!field.validate(value)) {
          isValid = false;
          field.input.classList.add('invalid');
          field.error.textContent = field.message;
        } else {
          field.input.classList.remove('invalid');
          field.error.textContent = '';
        }
      });

      if (!isValid) {
        const firstInvalid = form.querySelector('.invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      console.log('Free inspection request submitted:', {
        name: fields.ctaName.input.value.trim(),
        phone: fields.ctaPhone.input.value.trim(),
        zip: fields.ctaZip.input.value.trim()
      });

      successMessage.classList.add('visible');
      form.reset();
      setTimeout(() => successMessage.classList.remove('visible'), 6000);
    });
  }

  /* ============ Footer year ============ */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
