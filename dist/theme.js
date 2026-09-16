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

  const storageKey = 'medora-theme';
  const themes = [
    { id: 'iridescent', label: 'Iridescent', colors: ['#fef2f1', '#e5f1fa', '#f6edfb', '#9567bf'] },
    { id: 'sage', label: 'Sage clinic', colors: ['#e4edd8', '#ddf1e8', '#f5e3e8', '#72865d'] },
    { id: 'lavender', label: 'Lavandă', colors: ['#ede4fa', '#e2eefa', '#f8e2ef', '#8064a8'] },
    { id: 'ivory', label: 'Ivory cald', colors: ['#f4e6d4', '#f8ddd2', '#dfe8d5', '#856f58'] },
    { id: 'ice', label: 'Ice blue', colors: ['#dcecf5', '#ddf4f1', '#e9e7f7', '#527487'] },
    { id: 'pharmacy', label: 'Soft pharmacy', colors: ['#dde9d4', '#f5e8bb', '#f3dce6', '#657a55'] },
    { id: 'premium', label: 'Alb premium', colors: ['#faf0f1', '#eff5fa', '#f3eff8', '#756582'] }
  ];

  const validTheme = id => themes.some(theme => theme.id === id) ? id : 'iridescent';
  const getSavedTheme = () => {
    try { return validTheme(localStorage.getItem(storageKey)); }
    catch (_) { return 'iridescent'; }
  };
  const saveTheme = id => {
    try { localStorage.setItem(storageKey, id); }
    catch (_) {}
  };

  const selected = validTheme(document.documentElement.dataset.medoraTheme || getSavedTheme());
  document.documentElement.dataset.medoraTheme = selected;

  const control = document.createElement('div');
  control.className = 'medora-theme-control';
  control.innerHTML = `
    <div class="medora-theme-menu" id="medora-theme-menu" hidden>
      <div class="medora-theme-title">Alege atmosfera</div>
      <div class="medora-theme-options" role="radiogroup" aria-label="Tema cromatică"></div>
    </div>
    <button class="medora-theme-trigger" type="button" aria-expanded="false" aria-controls="medora-theme-menu" aria-label="Schimbă tema cromatică">
      <span class="medora-theme-dots" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
      <span>Temă</span>
    </button>`;

  const options = control.querySelector('.medora-theme-options');
  const menu = control.querySelector('.medora-theme-menu');
  const trigger = control.querySelector('.medora-theme-trigger');

  const renderSelection = id => {
    control.querySelectorAll('.medora-theme-option').forEach(button => {
      button.setAttribute('aria-checked', String(button.dataset.theme === id));
    });
  };

  themes.forEach(theme => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'medora-theme-option';
    button.dataset.theme = theme.id;
    button.setAttribute('role', 'radio');
    button.setAttribute('aria-checked', String(theme.id === selected));
    const blocks = theme.colors.map(color => `<i style="background:${color}"></i>`).join('');
    button.innerHTML = `<span class="medora-theme-swatch" aria-hidden="true">${blocks}</span><span>${theme.label}</span>`;
    button.addEventListener('click', () => {
      document.documentElement.dataset.medoraTheme = theme.id;
      saveTheme(theme.id);
      renderSelection(theme.id);
      menu.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
      trigger.focus();
      window.dispatchEvent(new CustomEvent('medora-theme-change', { detail: { theme: theme.id } }));
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
