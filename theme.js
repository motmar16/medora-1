(() => {
  // Seed active user session with HeroUI avatar
  try {
    if (!localStorage.getItem('medora_user')) {
      localStorage.setItem('medora_user', JSON.stringify({
        name: 'Dr. Andrei Popescu',
        email: 'andrei.popescu@spital.ro',
        avatarUrl: 'https://img.heroui.chat/image/avatar?w=400&h=400&u=3',
        fallback: 'AP',
        role: 'Medicină de familie · Activ'
      }));
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
