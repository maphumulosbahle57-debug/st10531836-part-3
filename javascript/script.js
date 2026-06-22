/**
 * BALE Studios — script.js
 * Covers: product search, contact form validation,
 *         enquiry form validation, wishlist (localStorage).
 */

/* ── SEARCH ──────────────────────────────────────────────── */

function setupSearch(inputId) {
  const input = document.querySelector(inputId);
  if (!input) return;
  const cards = document.querySelectorAll('.product-card');
  if (!cards.length) return;
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    cards.forEach(c => {
      c.style.display = c.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });
}

setupSearch('#women-search');
setupSearch('#men-search');
setupSearch('#kids-search');

/* ── VALIDATION HELPERS ──────────────────────────────────── */

function showError(fieldEl, errorEl, msg) {
  fieldEl.classList.add('invalid');
  errorEl.textContent = msg;
}

function clearError(fieldEl, errorEl) {
  fieldEl.classList.remove('invalid');
  errorEl.textContent = '';
}

function validateEmail(val) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
}

function validatePhone(val) {
  return val === '' || /^[0-9\s\+\-]{7,15}$/.test(val);
}

/* ── CHAR COUNTER ─────────────────────────────────────────── */

function setupCharCount(textareaId, counterId, max) {
  const ta = document.getElementById(textareaId);
  const ct = document.getElementById(counterId);
  if (!ta || !ct) return;
  ta.addEventListener('input', () => {
    ct.textContent = `${ta.value.length} / ${max}`;
  });
}

setupCharCount('contact-msg', 'char-count', 1000);
setupCharCount('enq-notes', 'enq-char-count', 800);

/* ── CONTACT FORM ────────────────────────────────────────── */

(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const name   = document.getElementById('contact-name');
  const email  = document.getElementById('contact-email');
  const phone  = document.getElementById('contact-phone');
  const msg    = document.getElementById('contact-msg');
  const success = document.getElementById('form-success');

  const errName  = document.getElementById('err-name');
  const errEmail = document.getElementById('err-email');
  const errPhone = document.getElementById('err-phone');
  const errMsg   = document.getElementById('err-msg');

  // Live validation on blur
  name.addEventListener('blur', () => {
    if (name.value.trim().length < 2)
      showError(name, errName, 'Please enter your full name (at least 2 characters).');
    else clearError(name, errName);
  });

  email.addEventListener('blur', () => {
    if (!validateEmail(email.value.trim()))
      showError(email, errEmail, 'Please enter a valid email address.');
    else clearError(email, errEmail);
  });

  phone.addEventListener('blur', () => {
    if (!validatePhone(phone.value.trim()))
      showError(phone, errPhone, 'Phone number must be 7–15 digits.');
    else clearError(phone, errPhone);
  });

  msg.addEventListener('blur', () => {
    if (msg.value.trim().length < 10)
      showError(msg, errMsg, 'Your message must be at least 10 characters.');
    else clearError(msg, errMsg);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    if (name.value.trim().length < 2) {
      showError(name, errName, 'Please enter your full name (at least 2 characters).');
      valid = false;
    } else clearError(name, errName);

    if (!validateEmail(email.value.trim())) {
      showError(email, errEmail, 'Please enter a valid email address.');
      valid = false;
    } else clearError(email, errEmail);

    if (!validatePhone(phone.value.trim())) {
      showError(phone, errPhone, 'Phone number must be 7–15 digits.');
      valid = false;
    } else clearError(phone, errPhone);

    if (msg.value.trim().length < 10) {
      showError(msg, errMsg, 'Your message must be at least 10 characters.');
      valid = false;
    } else clearError(msg, errMsg);

    if (valid) {
      success.textContent = '✓ Message sent — we\'ll be in touch within 24 hours.';
      form.reset();
      document.getElementById('char-count').textContent = '0 / 1000';
    }
  });
})();

/* ── ENQUIRY FORM ────────────────────────────────────────── */

(function () {
  const form = document.getElementById('enquiry-form');
  if (!form) return;

  const fields = {
    name:     { el: document.getElementById('enq-name'),              err: document.getElementById('enq-err-name'),     validate: v => v.trim().length >= 2,          msg: 'Please enter your full name (at least 2 characters).' },
    email:    { el: document.getElementById('enq-email'),             err: document.getElementById('enq-err-email'),    validate: v => validateEmail(v.trim()),         msg: 'Please enter a valid email address.' },
    phone:    { el: document.getElementById('enq-phone'),             err: document.getElementById('enq-err-phone'),    validate: v => validatePhone(v.trim()),         msg: 'Phone number must be 7–15 digits.' },
    contact:  { el: document.getElementById('enq-preferred-contact'), err: document.getElementById('enq-err-contact'),  validate: v => v !== '',                        msg: 'Please choose a preferred contact method.' },
    category: { el: document.getElementById('enq-category'),          err: document.getElementById('enq-err-category'), validate: v => v !== '',                        msg: 'Please select a category.' },
    item:     { el: document.getElementById('enq-item'),              err: document.getElementById('enq-err-item'),     validate: v => v.trim().length >= 2,            msg: 'Please enter the item name.' },
    size:     { el: document.getElementById('enq-size'),              err: document.getElementById('enq-err-size'),     validate: v => v !== '',                        msg: 'Please select a size.' },
    qty:      { el: document.getElementById('enq-qty'),               err: document.getElementById('enq-err-qty'),      validate: v => parseInt(v) >= 1 && parseInt(v) <= 20, msg: 'Quantity must be between 1 and 20.' },
  };

  // Live blur validation
  Object.values(fields).forEach(({ el, err, validate, msg }) => {
    if (!el) return;
    el.addEventListener('blur', () => {
      if (!validate(el.value)) showError(el, err, msg);
      else clearError(el, err);
    });
  });

  const success = document.getElementById('enq-form-success');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    Object.values(fields).forEach(({ el, err, validate, msg }) => {
      if (!el) return;
      if (!validate(el.value)) {
        showError(el, err, msg);
        valid = false;
      } else clearError(el, err);
    });

    if (valid) {
      success.textContent = '✓ Enquiry submitted — we\'ll respond within 24 hours.';
      form.reset();
      document.getElementById('enq-char-count').textContent = '0 / 800';
    }
  });
})();

/* ── WISHLIST ─────────────────────────────────────────────── */

(function () {
  const input    = document.getElementById('wishlist-input');
  const addBtn   = document.getElementById('wishlist-add-btn');
  const list     = document.getElementById('wishlist-list');
  const empty    = document.getElementById('wishlist-empty');
  const clearBtn = document.getElementById('wishlist-clear-btn');
  const errEl    = document.getElementById('wishlist-err');

  if (!input || !addBtn || !list) return;

  const STORAGE_KEY = 'bale_wishlist';

  function loadItems() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
  }

  function saveItems(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  function render(items) {
    list.innerHTML = '';
    if (items.length === 0) {
      empty.style.display = '';
      clearBtn.style.display = 'none';
      return;
    }
    empty.style.display = 'none';
    clearBtn.style.display = '';

    items.forEach((name, i) => {
      const li = document.createElement('li');
      li.className = 'wishlist-item';
      li.innerHTML = `
        <span class="wishlist-item-name">${name}</span>
        <button class="wishlist-remove-btn" data-index="${i}" aria-label="Remove ${name}">Remove</button>
      `;
      list.appendChild(li);
    });
  }

  function addItem() {
    const val = input.value.trim();
    if (!val) {
      errEl.textContent = 'Please enter or select an item.';
      input.focus();
      return;
    }
    errEl.textContent = '';
    const items = loadItems();
    if (items.map(x => x.toLowerCase()).includes(val.toLowerCase())) {
      errEl.textContent = `"${val}" is already in your wishlist.`;
      return;
    }
    items.push(val);
    saveItems(items);
    render(items);
    input.value = '';
  }

  addBtn.addEventListener('click', addItem);

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addItem(); }
  });

  list.addEventListener('click', (e) => {
    const btn = e.target.closest('.wishlist-remove-btn');
    if (!btn) return;
    const i = parseInt(btn.dataset.index);
    const items = loadItems();
    items.splice(i, 1);
    saveItems(items);
    render(items);
  });

  clearBtn.addEventListener('click', () => {
    if (confirm('Clear your entire wishlist?')) {
      saveItems([]);
      render([]);
    }
  });

  // Initial render
  render(loadItems());
})();
