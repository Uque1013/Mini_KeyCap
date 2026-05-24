'use strict';

const SW_META = {
  blue:  { name: '청축', label: 'Clicky',  vcolor: '#82B4CC' },
  red:   { name: '적축', label: 'Linear',  vcolor: '#D8A4A0' },
  brown: { name: '갈축', label: 'Tactile', vcolor: '#C4AA84' },
};

let count   = 4;
let swType  = 'blue';
let vizTimer = null;

/* ── 체인 렌더 ── */
function buildChain() {
  const el = document.getElementById('chain');
  el.innerHTML = '';
  const links = 4 + Math.floor(count * .35);
  for (let i = 0; i < links; i++) {
    const l = document.createElement('div');
    l.className = 'chain-link';
    el.appendChild(l);
  }
}

/* ── 케이스 + 키캡 렌더 ── */
function buildCase() {
  const kc = document.getElementById('keyCase');
  kc.innerHTML = '';

  /* 6개 이상 → 한 줄에 3개씩 */
  kc.classList.toggle('multi', count >= 6);

  for (let i = 0; i < count; i++) {
    const unit = document.createElement('div');
    unit.className = 'cap-unit';
    unit.style.animationDelay = (i * .048) + 's';

    const cap = document.createElement('button');
    cap.className = 'keycap ' + swType;
    cap.setAttribute('aria-label', `키캡 ${i + 1} — ${SW_META[swType].name}`);

    const kn = document.createElement('span');
    kn.className = 'kn';
    kn.textContent = i + 1;
    cap.appendChild(kn);

    cap.addEventListener('pointerdown', e => {
      e.preventDefault();
      cap.classList.add('pressed');
      SoundEngine.play(swType);
      updateLog(i + 1);
      showBadge(cap);
      triggerViz();
    });
    cap.addEventListener('pointerup',    () => cap.classList.remove('pressed'));
    cap.addEventListener('pointerleave', () => cap.classList.remove('pressed'));

    unit.appendChild(cap);
    kc.appendChild(unit);
  }
}

/* ── 로그 업데이트 ── */
function updateLog(keyNum) {
  const meta = SW_META[swType];
  const lk = document.getElementById('logKey');
  const ls = document.getElementById('logSub');
  lk.textContent = `KEY ${keyNum}  ·  ${meta.name}  ·  ${meta.label}`;
  lk.classList.add('on');
  ls.textContent = '소리가 재생됩니다';
  ls.classList.add('on');
}

/* ── 팝 뱃지 ── */
function showBadge(cap) {
  const b = document.createElement('div');
  b.className = 'pop-badge';
  b.textContent = SW_META[swType].label;
  cap.appendChild(b);
  setTimeout(() => b.remove(), 740);
}

/* ── 비주얼라이저 ── */
function triggerViz() {
  const wrap = document.getElementById('vizWrap');
  wrap.style.setProperty('--vcolor', SW_META[swType].vcolor);
  wrap.classList.add('on');
  clearTimeout(vizTimer);

  let frame = 0;
  const tick = () => {
    for (let i = 0; i < 7; i++) {
      document.getElementById('vb' + i).style.height =
        Math.max(3, Math.random() * 22 + (frame < 5 ? 5 : 0)) + 'px';
    }
    frame++;
    if (frame < 16) {
      requestAnimationFrame(tick);
    } else {
      for (let i = 0; i < 7; i++)
        document.getElementById('vb' + i).style.height = '3px';
      vizTimer = setTimeout(() => wrap.classList.remove('on'), 260);
    }
  };
  requestAnimationFrame(tick);
}

/* ── 스위치 변경 ── */
function setSw(type) {
  swType = type;
  document.querySelectorAll('.sw-toggle button').forEach(b =>
    b.classList.toggle('on', b.dataset.sw === type)
  );
  render();
}

/* ── 전체 렌더 ── */
function render() {
  document.getElementById('countDisplay').textContent = count;
  buildChain();
  buildCase();
}

/* ── 이벤트 바인딩 ── */
document.getElementById('btnMinus').addEventListener('click', () => {
  if (count > 3) { count--; render(); }
});
document.getElementById('btnPlus').addEventListener('click', () => {
  if (count < 9) { count++; render(); }
});

document.querySelectorAll('.sw-toggle button').forEach(btn =>
  btn.addEventListener('click', () => setSw(btn.dataset.sw))
);

/* 최초 렌더 */
render();