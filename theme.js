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


  // Boring Avatars "beam", the same maths the iOS app draws natively, so a person
  // gets the same face on both. Seeded by email first: a rename must not change
  // someone's avatar.
  const AVATAR_PALETTES = [
    ['#8656B3', '#ACDAFD', '#F2A8CF', '#8FA99A', '#F4A261'],
    ['#2F6FD6', '#ACDAFD', '#F3E6D4', '#52B788', '#4A8BD4'],
    ['#E76F51', '#F4A261', '#E9C46A', '#2A9D8F', '#5FA8D3'],
    ['#9567BF', '#F8AD9D', '#FBC4AB', '#68D8D6', '#07B1CA'],
    ['#3D5A80', '#98C1D9', '#E0FBFC', '#EE6C4D', '#293241']
  ];

  const avatarHash = name => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
    return Math.abs(hash);
  };
  const digit = (n, ntn) => Math.floor((n / Math.pow(10, ntn)) % 10);
  const bool = (n, ntn) => !(digit(n, ntn) % 2);
  const unit = (n, range, index) => {
    const value = n % range;
    return index && digit(n, index) % 2 === 0 ? -value : value;
  };
  const contrast = hex => {
    const h = hex.replace('#', '');
    const yiq = (parseInt(h.slice(0, 2), 16) * 299 + parseInt(h.slice(2, 4), 16) * 587 + parseInt(h.slice(4, 6), 16) * 114) / 1000;
    return yiq >= 128 ? '#181817' : '#FFFFFF';
  };

  window.medoraAvatarSvg = function (seed = 'Medora', size = 36) {
    const key = String(seed || 'Medora');
    const colors = AVATAR_PALETTES[avatarHash(key) % AVATAR_PALETTES.length];
    const n = avatarHash(key);
    const range = colors.length;
    const wrapperColor = colors[n % range];
    const face = contrast(wrapperColor);
    const preX = unit(n, 10, 1);
    const preY = unit(n, 10, 2);
    const x = preX < 5 ? preX + 4 : preX;
    const y = preY < 5 ? preY + 4 : preY;
    const mouthSpread = unit(n, 3);
    const eyeSpread = unit(n, 5);
    const mouth = bool(n, 2)
      ? `<path d="M14.5,${19 + mouthSpread} a3.5,3.5 0 0,0 7,0" fill="none" stroke="${face}" stroke-width="1.5" stroke-linecap="round"/>`
      : `<path d="M13,${19 + mouthSpread} a5,4.5 0 0,0 10,0 z" fill="${face}"/>`;

    return `<svg viewBox="0 0 36 36" width="${size}" height="${size}" role="img" aria-label="Avatar" style="display:block">
      <mask id="m${n}"><rect width="36" height="36" rx="18" fill="#fff"/></mask>
      <g mask="url(#m${n})">
        <rect width="36" height="36" fill="${colors[(n + 13) % range]}"/>
        <rect width="36" height="36" fill="${wrapperColor}" rx="${bool(n, 1) ? 36 : 6}"
              transform="translate(${x} ${y}) rotate(${unit(n, 360)} 18 18) scale(${1 + unit(n, 3) / 10})"/>
        <g transform="translate(${x > 6 ? x / 2 : unit(n, 8, 1)} ${y > 6 ? y / 2 : unit(n, 7, 2)}) rotate(${unit(n, 10, 3)} 18 18)">
          ${mouth}
          <rect x="${14 - eyeSpread}" y="14" width="1.8" height="2.4" rx="1.2" fill="${face}"/>
          <rect x="${20 + eyeSpread}" y="14" width="1.8" height="2.4" rx="1.2" fill="${face}"/>
        </g>
      </g>
    </svg>`;
  };

  // Paints one of the page's avatar elements, replacing the gradient-and-initials
  // placeholder the web used before.
  window.renderMedoraAvatar = function (element, seed) {
    if (!element) return;
    element.innerHTML = window.medoraAvatarSvg(seed, element.offsetWidth || 36);
    element.style.background = 'none';
    element.style.overflow = 'hidden';
  };

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

  // No appearance control in the web pages: the palette follows the system, and
  // the switch lives in the app, where someone is already changing settings.
})();
