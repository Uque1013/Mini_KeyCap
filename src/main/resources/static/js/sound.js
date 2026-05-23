let actx = null;

function getCtx() {
  if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
  return actx;
}

const SoundEngine = {
  play(t) {
    const c = getCtx(), n = c.currentTime;
    if      (t === 'blue')  this._clicky(c, n);
    else if (t === 'red')   this._linear(c, n);
    else if (t === 'brown') this._tactile(c, n);
  },

  _clicky(c, n) {
    const o = c.createOscillator(), g = c.createGain();
    o.type = 'square';
    o.frequency.setValueAtTime(1150, n);
    o.frequency.exponentialRampToValueAtTime(300, n + .025);
    g.gain.setValueAtTime(.3, n);
    g.gain.exponentialRampToValueAtTime(.0001, n + .065);
    o.connect(g); g.connect(c.destination); o.start(n); o.stop(n + .08);

    const o2 = c.createOscillator(), g2 = c.createGain();
    o2.type = 'triangle';
    o2.frequency.setValueAtTime(2000, n + .018);
    o2.frequency.exponentialRampToValueAtTime(700, n + .045);
    g2.gain.setValueAtTime(.16, n + .018);
    g2.gain.exponentialRampToValueAtTime(.0001, n + .055);
    o2.connect(g2); g2.connect(c.destination); o2.start(n + .018); o2.stop(n + .065);
  },

  _linear(c, n) {
    const o = c.createOscillator(), g = c.createGain(), f = c.createBiquadFilter();
    f.type = 'bandpass'; f.frequency.value = 820; f.Q.value = .7;
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(380, n);
    o.frequency.exponentialRampToValueAtTime(180, n + .06);
    g.gain.setValueAtTime(.25, n);
    g.gain.exponentialRampToValueAtTime(.0001, n + .13);
    o.connect(f); f.connect(g); g.connect(c.destination); o.start(n); o.stop(n + .15);

    const nb = c.createBuffer(1, c.sampleRate * .04, c.sampleRate);
    const nd = nb.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = (Math.random() * 2 - 1) * .1;
    const ns = c.createBufferSource(), ng = c.createGain();
    ns.buffer = nb;
    ng.gain.setValueAtTime(.15, n);
    ng.gain.exponentialRampToValueAtTime(.0001, n + .04);
    ns.connect(ng); ng.connect(c.destination); ns.start(n);
  },

  _tactile(c, n) {
    [0, .028].forEach((d, i) => {
      const o = c.createOscillator(), g = c.createGain(), f = c.createBiquadFilter();
      f.type = 'bandpass'; f.frequency.value = 650; f.Q.value = 1.1;
      o.type = 'square';
      o.frequency.setValueAtTime(i === 0 ? 540 : 310, n + d);
      o.frequency.exponentialRampToValueAtTime(155, n + d + .042);
      g.gain.setValueAtTime(i === 0 ? .2 : .14, n + d);
      g.gain.exponentialRampToValueAtTime(.0001, n + d + .052);
      o.connect(f); f.connect(g); g.connect(c.destination);
      o.start(n + d); o.stop(n + d + .062);
    });
  }
};