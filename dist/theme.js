(() => {
  // Avatar Orb Gradients & Doctor Initials Helpers
  const AVATAR_GRADIENTS = [
    'radial-gradient(circle at 32% 28%, #bbf7d0 0%, #38bdf8 36%, #818cf8 68%, #4f46e5 100%)', // cyan-blue-violet (signature)
    'radial-gradient(circle at 32% 28%, #a5f3fc 0%, #60a5fa 38%, #a855f7 72%, #581c87 100%)', // sky-iris-purple
    'radial-gradient(circle at 32% 28%, #99f6e4 0%, #38bdf8 42%, #6366f1 78%, #312e81 100%)', // mint-azure-indigo
    'radial-gradient(circle at 32% 28%, #fbcfe8 0%, #c084fc 40%, #7c3aed 76%, #4c1d95 100%)', // lavender-violet
    'radial-gradient(circle at 32% 28%, #dbeafe 0%, #38bdf8 40%, #2563eb 75%, #1e1b4b 100%)'  // ice-sapphire
  ];

  window.getDoctorInitials = function(name) {
    if (!name || !name.trim()) return 'AP';
    const cleaned = name.replace(/^(?:dr\.|prof\.|conf\.|asist\.)\s*/i, '').trim();
    const parts = cleaned.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return cleaned.slice(0, 2).toUpperCase() || 'AP';
  };

  window.getDoctorGradient = function(name = '') {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length];
  };

  // Seed default doctor session if not present or update legacy session
  try {
    const raw = localStorage.getItem('medora_user');
    let user = raw ? JSON.parse(raw) : null;
    const defaultName = 'Dr. Andrei Popescu';
    if (!user) {
      user = {
        name: defaultName,
        email: 'andrei.popescu@spital.ro',
        fallback: window.getDoctorInitials(defaultName),
        gradient: AVATAR_GRADIENTS[0],
        role: 'Medicină de familie · Activ'
      };
      localStorage.setItem('medora_user', JSON.stringify(user));
    } else {
      user.fallback = window.getDoctorInitials(user.name || defaultName);
      user.gradient = user.gradient || window.getDoctorGradient(user.name || defaultName);
      localStorage.setItem('medora_user', JSON.stringify(user));
    }
  } catch (_) {}

  // Appearance follows iOS: system default, with light/dark override.
  // The old 7-palette picker (medora-theme) is retired — the brand is locked,
  // so any stored palette resolves to the same tokens and is cleaned up.
  try { localStorage.removeItem('medora-theme'); } catch (_) {}
  try { delete document.documentElement.dataset.medoraTheme; } catch (_) {}

  const storageKey = 'medora-appearance';
  const modes = [
    { id: 'system', label: 'Sistem' },
    { id: 'light', label: 'Luminos' },
    { id: 'dark', label: 'Întunecat' }
  ];

  const validMode = id => modes.some(mode => mode.id === id) ? id : 'system';
  const getSavedMode = () => {
    try { return validMode(localStorage.getItem(storageKey)); }
    catch (_) { return 'system'; }
  };
  const saveMode = id => {
    try { localStorage.setItem(storageKey, id); }
    catch (_) {}
  };

  const selected = validMode(document.documentElement.dataset.medoraAppearance || getSavedMode());
  document.documentElement.dataset.medoraAppearance = selected;

  const control = document.createElement('div');
  control.className = 'medora-theme-control';
  control.innerHTML = `
    <div class="medora-theme-menu" id="medora-theme-menu" hidden>
      <div class="medora-theme-title">Aspect</div>
      <div class="medora-theme-options" role="radiogroup" aria-label="Aspect"></div>
    </div>
    <button class="medora-theme-trigger" type="button" aria-expanded="false" aria-controls="medora-theme-menu" aria-label="Schimbă aspectul">
      <span class="medora-theme-dots" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
      <span>Aspect</span>
    </button>`;

  const options = control.querySelector('.medora-theme-options');
  const menu = control.querySelector('.medora-theme-menu');
  const trigger = control.querySelector('.medora-theme-trigger');

  const renderSelection = id => {
    control.querySelectorAll('.medora-theme-option').forEach(button => {
      button.setAttribute('aria-checked', String(button.dataset.appearance === id));
    });
  };

  modes.forEach(mode => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'medora-theme-option';
    button.dataset.appearance = mode.id;
    button.setAttribute('role', 'radio');
    button.setAttribute('aria-checked', String(mode.id === selected));
    button.innerHTML = `<span>${mode.label}</span>`;
    button.addEventListener('click', () => {
      document.documentElement.dataset.medoraAppearance = mode.id;
      saveMode(mode.id);
      renderSelection(mode.id);
      menu.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
      trigger.focus();
      window.dispatchEvent(new CustomEvent('medora-appearance-change', { detail: { appearance: mode.id } }));
    });
    options.append(button);
  });

  trigger.addEventListener('click', () => {
    const open = menu.hidden;
    menu.hidden = !open;
    trigger.setAttribute('aria-expanded', String(open));
    if (open) control.querySelector('.medora-theme-option[aria-checked="true"]')?.focus();
  });

  document.addEventListener('click', event => {
    if (!control.contains(event.target)) {
      menu.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !menu.hidden) {
      menu.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
      trigger.focus();
    }
  });

  document.body.append(control);
})();
