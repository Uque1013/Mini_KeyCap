const SW = {
  blue:  { n: '청축', s: '딸깍! (Clicky)' },
  red:   { n: '적축', s: '도각~ (Linear)' },
  brown: { n: '갈축', s: '서각! (Tactile)' }
};
const PA = ['p0', 'p1', 'p2'];

let cnt = 3, sw = 'blue', vt = null;

function buildChain() {
  const chain = document.getElementById('chain');
  chain.innerHTML = '';
  for (let i = 0; i < 3 + Math.floor(cnt * .4); i++) {
    const l = document.createElement('div');
    l.className = 'cl';
    chain.appendChild(l);
  }
}

function buildTray() {
  const tray = document.getElementById('tray');
  tray.innerHTML = '';
  tray.classList.toggle('multi', cnt >= 6);

  for (let i = 0; i < cnt; i++) {
    const cc = i >= 3 ? PA[(i - 3) % 3] : sw;

    const unit = document.createElement('div');
    unit.className = 'unit';
    unit.style.animationDelay = (i * .05) + 's';

    const stem = document.createElement('div');
    stem.className = 'stem ' + sw;

    const hous = document.createElement('div');
    hous.className = 'hous';

    const cap = document.createElement('button');
    cap.className = 'keycap ' + cc;
    cap.textContent = i + 1;
    cap.setAttribute('aria-label', `키캡 ${i + 1} — ${SW[sw].n}`);

    cap.addEventListener('pointerdown', e => {
      e.preventDefault();
      cap.classList.add('dn');
      SoundEngine.play(sw);
      document.getElementById('slog').textContent =
        `KEY ${i + 1} (${SW[sw].n}): ${SW[sw].s}`;
      const b = document.createElement('div');
      b.className = 'badge';
      b.textContent = SW[sw].s.split(' ')[0];
      cap.appendChild(b);
      setTimeout(() => b.remove(), 760);
      runViz();
    });
    cap.addEventListener('pointerup',    () => cap.classList.remove('dn'));
    cap.addEventListener('pointerleave', () => cap.classList.remove('dn'));

    unit.appendChild(stem);
    unit.appendChild(hous);
    unit.appendChild(cap);
    tray.appendChild(unit);
  }
}

function runViz() {
  const v = document.getElementById('viz');
  v.classList.add('on');
  clearTimeout(vt);
  let f = 0;
  const go = () => {
    for (let i = 0; i < 7; i++)
      document.getElementById('v' + i).style.height =
        Math.max(2, Math.random() * 16 + (f < 4 ? 5 : 0)) + 'px';
    f++;
    if (f < 14) requestAnimationFrame(go);
    else {
      for (let i = 0; i < 7; i++)
        document.getElementById('v' + i).style.height = '2px';
      vt = setTimeout(() => v.classList.remove('on'), 250);
    }
  };
  requestAnimationFrame(go);
}

function setSw(t) {
  sw = t;
  document.querySelectorAll('.swtog button').forEach(b =>
    b.classList.toggle('on', b.dataset.sw === t)
  );
  render();
}

function render() {
  document.getElementById('cd').textContent = cnt;
  buildChain();
  buildTray();
}

document.getElementById('bm').addEventListener('click', () => { if (cnt > 3) { cnt--; render(); } });
document.getElementById('bp').addEventListener('click', () => { if (cnt < 9) { cnt++; render(); } });

render();