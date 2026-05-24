'use strict';

let _audioCtx = null;

function getCtx() {
  if (!_audioCtx) {
    _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return _audioCtx;
}

const SoundEngine = {
  play(type) {
    const ctx = getCtx();
    const t = ctx.currentTime;
    switch (type) {
      case 'blue':  this._clicky(ctx, t);  break;
      case 'red':   this._linear(ctx, t);  break;
      case 'brown': this._tactile(ctx, t); break;
    }
  },

  /* 청축 — 또렷한 클릭 */
  _clicky(ctx, t) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'square';
    o.frequency.setValueAtTime(1200, t);
    o.frequency.exponentialRampToValueAtTime(320, t + .022);
    g.gain.setValueAtTime(.32, t);
    g.gain.exponentialRampToValueAtTime(.0001, t + .06);
    o.connect(g); g.connect(ctx.destination);
    o.start(t); o.stop(t + .075);

    const o2 = ctx.createOscillator(), g2 = ctx.createGain();
    o2.type = 'triangle';
    o2.frequency.setValueAtTime(2200, t + .016);
    o2.frequency.exponentialRampToValueAtTime(750, t + .044);
    g2.gain.setValueAtTime(.18, t + .016);
    g2.gain.exponentialRampToValueAtTime(.0001, t + .054);
    o2.connect(g2); g2.connect(ctx.destination);
    o2.start(t + .016); o2.stop(t + .065);
  },

  /* 적축 — 부드러운 리니어 */
  _linear(ctx, t) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    const f = ctx.createBiquadFilter();
    f.type = 'bandpass'; f.frequency.value = 850; f.Q.value = .7;
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(400, t);
    o.frequency.exponentialRampToValueAtTime(190, t + .06);
    g.gain.setValueAtTime(.26, t);
    g.gain.exponentialRampToValueAtTime(.0001, t + .13);
    o.connect(f); f.connect(g); g.connect(ctx.destination);
    o.start(t); o.stop(t + .15);

    /* 노이즈 레이어 */
    const buf = ctx.createBuffer(1, ctx.sampleRate * .04, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * .1;
    const ns = ctx.createBufferSource(), ng = ctx.createGain();
    ns.buffer = buf;
    ng.gain.setValueAtTime(.14, t);
    ng.gain.exponentialRampToValueAtTime(.0001, t + .04);
    ns.connect(ng); ng.connect(ctx.destination);
    ns.start(t);
  },

  /* 갈축 — 두 번 끊기는 택타일 */
  _tactile(ctx, t) {
    [0, .030].forEach((delay, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      const f = ctx.createBiquadFilter();
      f.type = 'bandpass'; f.frequency.value = 660; f.Q.value = 1.1;
      o.type = 'square';
      o.frequency.setValueAtTime(i === 0 ? 560 : 320, t + delay);
      o.frequency.exponentialRampToValueAtTime(160, t + delay + .042);
      g.gain.setValueAtTime(i === 0 ? .22 : .15, t + delay);
      g.gain.exponentialRampToValueAtTime(.0001, t + delay + .052);
      o.connect(f); f.connect(g); g.connect(ctx.destination);
      o.start(t + delay); o.stop(t + delay + .062);
    });
  }
};