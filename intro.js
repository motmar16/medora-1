(() => {
  // Launch intro, once per session — the web equivalent of the iOS cold-start
  // intro. No audio: browsers block autoplay, and a chime is never worth
  // interrupting someone's music (same rule as the iOS ambient session).
  let seen = false;
  try { seen = sessionStorage.getItem('medora-intro-seen') === '1'; } catch (_) {}
  if (seen || !document.body) return;

  const el = document.createElement('div');
  el.id = 'medora-intro';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML =
    '<div class="mi-blobs" aria-hidden="true">' +
      '<span class="mi-blob b1"></span>' +
      '<span class="mi-blob b2"></span>' +
      '<span class="mi-blob b3"></span>' +
      '<span class="mi-blob b4"></span>' +
    '</div>' +
    '<div class="mi-flacon-drop">' +
      '<div class="mi-flacon-squash">' +
        '<img class="mi-flacon-float" src="capsule-hero.png?v=1" alt="">' +
      '</div>' +
    '</div>' +
    '<div class="mi-word-mask"><span class="mi-word">salutare</span></div>';

  document.body.prepend(el);

  let done = false;
  const remember = () => {
    try { sessionStorage.setItem('medora-intro-seen', '1'); } catch (_) {}
  };
  // Natural end: the exit fade already made it invisible — just remove.
  el.addEventListener('animationend', (event) => {
    if (event.target !== el || done) return;
    done = true;
    remember();
    el.remove();
  });
  // Skip means skip: quick fade, then gone.
  el.addEventListener('click', () => {
    if (done) return;
    done = true;
    remember();
    el.classList.add('mi-leave');
    setTimeout(() => el.remove(), 260);
  });
  // Safety net if animation events never fire.
  setTimeout(() => {
    if (done) return;
    done = true;
    remember();
    el.remove();
  }, 4500);
})();
