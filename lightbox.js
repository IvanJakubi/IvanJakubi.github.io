/* Simple lightbox for case study pages.
   Screenshots (gallery, cover and inline shots) form one group,
   design document pages form another. Click opens a popup,
   arrows / keys / swipe move through the group, Esc closes. */
(function () {
  function collect() {
    var groups = { shots: [] };
    var seen = {};
    function add(group, el, full, caption) {
      if (!full || seen[group + full]) return;
      groups[group] = groups[group] || [];
      seen[group + full] = true;
      var index = groups[group].length;
      groups[group].push({ src: full, caption: caption || '' });
      el.style.cursor = 'zoom-in';
      el.addEventListener('click', function (e) {
        e.preventDefault();
        open(group, index);
      });
    }
    document.querySelectorAll('.cs-cover img, .cs-shot img').forEach(function (img) {
      add('shots', img, img.currentSrc || img.src, img.alt);
    });
    document.querySelectorAll('.gallery a').forEach(function (a) {
      var img = a.querySelector('img');
      add('shots', a, a.href, img ? img.alt : '');
    });
    document.querySelectorAll('.doccard').forEach(function (a) {
      var cap = a.querySelector('.doccap');
      var sec = a.closest('section');
      add('docs-' + (sec && sec.id ? sec.id : 'x'), a, a.href, cap ? cap.textContent : '');
    });
    return groups;
  }

  var groups, current, idx = 0, box, stage, img, capEl, countEl, prevBtn, nextBtn;

  function build() {
    box = document.createElement('div');
    box.className = 'lb';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.innerHTML =
      '<button class="lb-close" aria-label="Close">&times;</button>' +
      '<button class="lb-nav lb-prev" aria-label="Previous image">&#8249;</button>' +
      '<div class="lb-stage"><img alt=""></div>' +
      '<button class="lb-nav lb-next" aria-label="Next image">&#8250;</button>' +
      '<div class="lb-bar"><span class="lb-cap"></span><span class="lb-count"></span></div>';
    document.body.appendChild(box);
    stage = box.querySelector('.lb-stage');
    img = stage.querySelector('img');
    capEl = box.querySelector('.lb-cap');
    countEl = box.querySelector('.lb-count');
    prevBtn = box.querySelector('.lb-prev');
    nextBtn = box.querySelector('.lb-next');

    box.querySelector('.lb-close').addEventListener('click', close);
    prevBtn.addEventListener('click', function (e) { e.stopPropagation(); step(-1); });
    nextBtn.addEventListener('click', function (e) { e.stopPropagation(); step(1); });
    box.addEventListener('click', function (e) {
      if (e.target === box || e.target === stage) close();
    });

    var x0 = null;
    box.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
      x0 = null;
    });

    document.addEventListener('keydown', function (e) {
      if (!box.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
    });
  }

  function show() {
    var item = current[idx];
    box.classList.toggle('lb-doc', current !== groups.shots);
    img.src = item.src;
    img.alt = item.caption;
    capEl.textContent = item.caption;
    countEl.textContent = (idx + 1) + ' / ' + current.length;
    var single = current.length < 2;
    prevBtn.hidden = single;
    nextBtn.hidden = single;
    stage.scrollTop = 0;
    [idx - 1, idx + 1].forEach(function (n) {
      var it = current[(n + current.length) % current.length];
      if (it) { var p = new Image(); p.src = it.src; }
    });
  }

  function open(group, i) {
    current = groups[group];
    idx = i;
    show();
    box.classList.add('open');
    document.documentElement.style.overflow = 'hidden';
  }

  function close() {
    box.classList.remove('open');
    document.documentElement.style.overflow = '';
  }

  function step(d) {
    idx = (idx + d + current.length) % current.length;
    show();
  }

  document.addEventListener('DOMContentLoaded', function () {
    build();
    groups = collect();
  });
})();
