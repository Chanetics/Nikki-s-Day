/* ========= EDIT YOUR PHOTOS HERE =========
   Put your images inside an "images" folder next to index.html.
   If a file is missing, a green placeholder shows instead. */
const SPONTY_PICS = ['picture/sponty1.jpg','picture/sponty2.jpg','picture/sponty3.jpg','picture/sponty4.jpg','picture/sponty5.jpg','picture/sponty6.jpg'];
const FINAL_PIC   = 'picture/BABY.jpg'; // only ONE picture here

const $ = s => document.querySelector(s);
const go = n => { document.querySelectorAll('.slide').forEach(s => s.classList.remove('active')); $('#s' + n).classList.add('active'); };
function pic(src, label) {
  const d = document.createElement('div'); d.className = 'ph'; d.style.cssText = 'width:100%;height:100%';
  const i = new Image(); i.src = src; i.alt = label;
  i.onload = () => { d.textContent = ''; d.appendChild(i); };
  d.textContent = '🌿 ' + label; return d;
}

/* ===== SLIDE 1 ===== */
$('#envelope').onclick = () => {
  $('#letter').classList.remove('hidden');
  setTimeout(() => $('#go2').classList.remove('hidden'), 9000); // appears after reading time
};
$('#go2').onclick = () => { $('#letter').classList.add('hidden'); go(2); startGame(); };

/* ===== SOUND (synthesized, no files needed) ===== */
let AC = null, muted = false, musicTimer = null;
function ac() { if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume(); return AC; }
function tone(f, dur, type = 'sine', vol = .15, slideTo = null, delay = 0) {
  if (muted) return; const a = ac(), t = a.currentTime + delay, o = a.createOscillator(), g = a.createGain();
  o.type = type; o.frequency.setValueAtTime(f, t); if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.001, t + dur); o.connect(g).connect(a.destination); o.start(t); o.stop(t + dur);
}
const sfx = {
  plant: () => { tone(220, .12, 'triangle', .2, 440); tone(330, .15, 'triangle', .15, 660, .08); },
  shoot: () => tone(700, .09, 'square', .06, 300),
  hit: () => { tone(160, .12, 'sawtooth', .12, 70); tone(900, .05, 'square', .05, 500); },
  groan: () => tone(90 + Math.random() * 30, .8, 'sawtooth', .07, 55),
  die: () => { tone(200, .5, 'sawtooth', .15, 40); tone(120, .6, 'square', .08, 30, .1); },
  good: () => { tone(523, .12, 'triangle', .2); tone(659, .12, 'triangle', .2, null, .1); tone(784, .2, 'triangle', .2, null, .2); },
  bad: () => { tone(200, .25, 'sawtooth', .15, 120); },
  boss: () => { tone(70, 1.2, 'sawtooth', .2, 45); tone(105, 1.2, 'square', .1, 60, .15); },
  collect: () => { [660, 880, 1320].forEach((f, i) => tone(f, .14, 'triangle', .18, null, i * .06)); },
  pop: () => tone(400, .15, 'sine', .25, 1200),
  win: () => [523, 587, 659, 784, 1047].forEach((f, i) => tone(f, .25, 'triangle', .2, null, i * .12))
};
let bgm = null;
const BGM_SOURCES = ['picture/bgm.mp3', 'audio/bgm.mp3', 'bgm.mp3']; // first one that exists is used
function startMusic() {
  stopMusic(); if (muted) return;
  (function tryBgm(i) {
    if (i >= BGM_SOURCES.length) { synthMusic(); return; } // no file found: play the built-in tune
    const a = new Audio(BGM_SOURCES[i]); a.loop = true; a.volume = .5;
    a.play().then(() => { bgm = a; if (muted) a.pause(); }).catch(() => tryBgm(i + 1));
  })(0);
}
function synthMusic() {
  const mel = [440,0,523,0,659,587,523,0, 494,0,587,0,659,587,494,0, 440,0,523,0,659,784,659,0, 587,523,494,523,440,0,0,0];
  const bass = [110,110,87,87,98,98,82,82];
  let i = 0;
  musicTimer = setInterval(() => {
    const m = mel[i % 32]; if (m) tone(m, .2, 'triangle', .08);
    if (i % 4 === 0) tone(bass[(i / 4) % 8], .45, 'square', .035);
    if (i % 2 === 1) tone(2400, .03, 'square', .012);
    i++;
  }, 165);
}
function stopMusic() { clearInterval(musicTimer); musicTimer = null; if (bgm) bgm.pause(); }
$('#mute').onclick = () => { muted = !muted; $('#mute').textContent = muted ? '🔇' : '🔊'; muted ? stopMusic() : startMusic(); };

/* ===== SLIDE 1 ===== */
$('#envelope').onclick = () => {
  ac(); sfx.pop();
  $('#letter').classList.remove('hidden');
  setTimeout(() => $('#go2').classList.remove('hidden'), 6000);
};
$('#go2').onclick = () => { $('#letter').classList.add('hidden'); go(2); startMusic(); $('#reminder').classList.remove('hidden'); };
$('#startGameBtn').onclick = () => { $('#reminder').classList.add('hidden'); startGame(); };

/* ===== SLIDE 2: PLANTS VS ZOMBIES ===== */
const PEA_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 70"><path d="M30 68V40" stroke="#2e7d32" stroke-width="6"/><path d="M30 55q-20-2-22-14 14-2 22 14zM30 55q20-2 22-14-14-2-22 14z" fill="#43a047"/><circle cx="28" cy="26" r="18" fill="#7ccf3a"/><circle cx="47" cy="27" r="8" fill="#5fb52a"/><ellipse cx="53" cy="27" rx="4" ry="6" fill="#2d5a14"/><circle cx="23" cy="20" r="5.5" fill="#fff"/><circle cx="25" cy="20" r="2.6" fill="#000"/></svg>';
const ZOMBIE_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 100"><ellipse cx="35" cy="96" rx="22" ry="5" fill="#0005"/><rect x="24" y="66" width="9" height="28" fill="#5a4632" stroke="#2a1d10" stroke-width="2"/><rect x="37" y="66" width="9" height="28" fill="#6a5238" stroke="#2a1d10" stroke-width="2"/><path d="M22 66h28l-3-30H25z" fill="#7a5b3a" stroke="#2a1d10" stroke-width="2"/><path d="M35 40l-4 10 4 14 4-14z" fill="#c0392b" stroke="#2a1d10" stroke-width="1.5"/><path d="M26 42L4 48l2 8 22-4z" fill="#a9b88a" stroke="#2a1d10" stroke-width="2"/><circle cx="35" cy="26" r="16" fill="#b4c493" stroke="#2a1d10" stroke-width="2"/><circle cx="29" cy="24" r="5" fill="#fff" stroke="#2a1d10"/><circle cx="30" cy="25" r="2" fill="#000"/><circle cx="41" cy="24" r="4" fill="#fff" stroke="#2a1d10"/><circle cx="42" cy="25" r="1.6" fill="#000"/><path d="M27 34q8 5 16 0" stroke="#2a1d10" stroke-width="2" fill="none"/><path d="M22 14l4-8 4 6 5-8 4 8 6-5-1 10z" fill="#2e2418"/></svg>';
const TOTAL_ZOMBIES = 15, BOSS_HP = 45;
let gameOn = false;
function mk(cls, txt, parent) { const e = document.createElement('div'); e.className = cls; e.textContent = txt; parent.appendChild(e); return e; }
function inRow(z, r) { return z.boss ? (r >= z.r && r < z.r + 3) : z.r === r; }
function startGame() {
  if (gameOn) return; gameOn = true;
  const board = $('#board'), layer = $('#layer'), sky = $('#sky');
  let have = 0, spawned = 0, killed = 0, spawnT = 2, skyT = 1, bossOn = false, bossDead = false;
  const zombies = [], shooters = [], peas = [], occupied = new Set();
  const status = () => { $('#gameHint').textContent = bossOn ? '👹 BOSS FIGHT! Keep catching and planting Peashooters to defeat the giant zombie!' : 'Zombies defeated: ' + killed + ' / ' + TOTAL_ZOMBIES + '  •  Catch falling Peashooters, then plant them!'; };
  const updCount = () => { $('#pCount').textContent = '×' + have; board.classList.toggle('armed', have > 0); };
  status();
  function spawnZombie() {
    const r = Math.floor(Math.random() * 5), el = document.createElement('div'); el.className = 'ent zombie';
    el.innerHTML = '<span class="sprite">' + ZOMBIE_SVG + '</span><div class="hp"><i style="width:100%"></i></div>';
    layer.appendChild(el); zombies.push({ r, x: 100, hp: 4, max: 4, el, dead: false, speed: 2 + Math.random() * .8 }); spawned++;
    if (spawned === 1) sfx.groan();
  }
  function spawnBoss() {
    bossOn = true; status(); sfx.boss();
    const r = Math.floor(Math.random() * 3), el = document.createElement('div'); el.className = 'ent zombie boss'; // giant: covers 3 rows
    el.innerHTML = '<span class="sprite">' + ZOMBIE_SVG + '</span><div class="hp"><i style="width:100%"></i></div><b class="tag">BOSS</b>';
    layer.appendChild(el); zombies.push({ r, x: 100, hp: BOSS_HP, max: BOSS_HP, el, dead: false, speed: 1.1, boss: true });
  }
  function dropPea() {
    const rect = board.getBoundingClientRect(), d = document.createElement('button');
    d.className = 'faller'; d.innerHTML = PEA_SVG; d.style.left = rect.left + 8 + Math.random() * (rect.width * .2) + 'px'; // left side only
    d.onclick = () => { d.remove(); have++; updCount(); sfx.collect(); const k = document.createElement('div'); k.className = 'stk'; k.innerHTML = PEA_SVG; $('#stack').appendChild(k); };
    d.onanimationend = () => d.remove(); sky.appendChild(d);
  }
  for (let r = 0; r < 5; r++) for (let c = 0; c < 9; c++) {
    const b = document.createElement('button'); b.className = 'cell';
    b.onclick = () => {
      const k = r + '-' + c; if (occupied.has(k)) return;
      if (have < 1) { sfx.bad(); $('#gameHint').textContent = 'Catch a falling Peashooter first! 🌱'; setTimeout(status, 1500); return; }
      have--; updCount(); if ($('#stack').lastChild) $('#stack').lastChild.remove(); occupied.add(k); b.classList.add('taken'); sfx.plant();
      const el = document.createElement('div'); el.className = 'ent plant';
      el.innerHTML = '<span class="sprite">' + PEA_SVG + '</span>'; el.style.top = r * 20 + '%'; el.style.left = c * 11.11 + '%'; layer.appendChild(el);
      shooters.push({ r, x: c * 11.11, t: 0, el });
    };
    board.insertBefore(b, layer);
  }
  let last = performance.now(), groanT = 4;
  (function loop(now) {
    const dt = Math.min((now - last) / 1000, .1); last = now;
    if (killed === TOTAL_ZOMBIES && !bossOn) spawnBoss();
    spawnT -= dt; if (spawnT <= 0 && spawned < TOTAL_ZOMBIES) { spawnZombie(); spawnT = 3 + Math.random(); }
    if (!bossDead) {
      skyT -= dt; if (skyT <= 0) { dropPea(); skyT = 3.2 + Math.random() * 1.5; }
      groanT -= dt; if (groanT <= 0) { sfx.groan(); groanT = 4 + Math.random() * 4; }
    }
    zombies.forEach(z => {
      if (z.dead) return;
      z.x -= z.speed * dt; if (z.x < -5) z.x = 100; // zombies restart, so she can never lose
      z.el.style.left = z.x + '%'; z.el.style.top = z.r * 20 + '%';
    });
    shooters.forEach(s => {
      s.t -= dt;
      if (s.t <= 0 && zombies.some(z => !z.dead && inRow(z, s.r) && z.x + (z.boss ? 12 : 0) > s.x)) {
        peas.push({ r: s.r, x: s.x + 8, el: mk('pea', '', layer) }); s.t = .9; sfx.shoot();
        s.el.classList.add('fire'); setTimeout(() => s.el.classList.remove('fire'), 150);
      }
    });
    for (let i = peas.length - 1; i >= 0; i--) {
      const p = peas[i]; p.x += 40 * dt; p.el.style.left = p.x + '%'; p.el.style.top = p.r * 20 + '%';
      const z = zombies.find(z => !z.dead && inRow(z, p.r) && (z.boss ? (p.x > z.x + 4 && p.x < z.x + 20) : Math.abs(z.x + 4 - p.x) < 4));
      if (z) {
        z.hp--; z.el.querySelector('i').style.width = z.hp / z.max * 100 + '%'; sfx.hit();
        z.el.classList.add('flash'); setTimeout(() => z.el.classList.remove('flash'), 150);
        p.el.remove(); peas.splice(i, 1);
        if (z.hp <= 0) {
          z.dead = true; sfx.die(); z.el.classList.add('die'); setTimeout(() => z.el.remove(), 700);
          if (z.boss) { bossDead = true; setTimeout(bossWon, 1200); }
          else { killed++; status(); }
        }
      } else if (p.x > 100) { p.el.remove(); peas.splice(i, 1); }
    }
    requestAnimationFrame(loop);
  })(last);
}
function bossWon() {
  sfx.win(); $('#gameHint').textContent = 'Boss defeated! 🎉 You saved the garden!';
  $('#bossReminder').classList.remove('hidden');
}
$('#go3b').onclick = () => { $('#bossReminder').classList.add('hidden'); stopMusic(); go(3); };
$('#go3').onclick = () => { stopMusic(); go(3); };

/* ===== SLIDE 3: TREES (the user controls the watering) ===== */
const scene = $('#scene'), trees = [...document.querySelectorAll('.tree')], soils = [...document.querySelectorAll('.soil')];
let plantedCount = 0, pouring = false, canX = 0, canY = 0, treesDone = false;
const sc = new Map(); // tree -> current scale
soils.forEach((soil, i) => soil.onclick = () => {
  if (soil.classList.contains('used')) return;
  soil.classList.add('used'); sfx.plant();
  const t = trees[i], st = +t.dataset.start; sc.set(t, st);
  t.classList.remove('hidden'); t.style.transform = `translateX(-50%) scale(${st})`;
  if (++plantedCount === 3) {
    $('#treeHint').textContent = 'Drag the watering can over a tree, then press and HOLD to water it 💧';
    $('#can').classList.remove('hidden'); moveCan(scene.clientWidth / 2, 70);
  } else $('#treeHint').textContent = plantedCount + ' of 3 planted... 🌱';
});
function moveCan(x, y) { canX = x; canY = y; const c = $('#can'); c.style.left = x + 'px'; c.style.top = y + 'px'; }
function scenePos(e) { const r = scene.getBoundingClientRect(); return [Math.max(30, Math.min(r.width - 30, e.clientX - r.left)), Math.max(30, Math.min(r.height * .6, e.clientY - r.top - 30))]; }
scene.addEventListener('pointerdown', e => { if (plantedCount < 3 || treesDone) return; pouring = true; moveCan(...scenePos(e)); });
scene.addEventListener('pointermove', e => { if (plantedCount < 3 || treesDone) return; moveCan(...scenePos(e)); });
addEventListener('pointerup', () => pouring = false);
setInterval(() => {
  if (!pouring || treesDone) return;
  const d = document.createElement('div'); d.className = 'drop'; d.textContent = '💧';
  d.style.left = canX - 8 + (Math.random() * 20 - 10) + 'px'; d.style.top = canY + 30 + 'px'; scene.appendChild(d); setTimeout(() => d.remove(), 800);
  if (Math.random() < .3) tone(700, .05, 'sine', .03, 400);
  trees.forEach(t => {
    if (!sc.has(t) || Math.abs(t.offsetLeft - canX) > 60) return;
    const max = +t.dataset.max; let s = Math.min(max, sc.get(t) + .04 * (max / 2)); sc.set(t, s);
    t.style.transform = `translateX(-50%) scale(${s})`; t.textContent = s < max * .4 ? '🌱' : s < max * .75 ? '🌿' : '🌳';
  });
  if (trees.every(t => sc.get(t) >= +t.dataset.max - .01)) finishTrees();
}, 100);
function finishTrees() {
  treesDone = true; pouring = false; $('#can').classList.add('hidden');
  $('#treeHint').textContent = 'Now drag the needle 🪡 to the big tree and pop it!';
  const big = trees[1], n = $('#needle'); n.classList.remove('hidden'); n.style.transition = 'none'; n.style.left = '10px'; n.style.top = '25%';
  let drag = false;
  n.onpointerdown = e => { drag = true; n.setPointerCapture(e.pointerId); e.preventDefault(); };
  n.onpointerup = () => { drag = false; };
  n.onpointermove = e => {
    if (!drag) return;
    const r = scene.getBoundingClientRect(); n.style.left = (e.clientX - r.left - 27) + 'px'; n.style.top = (e.clientY - r.top - 27) + 'px';
    const b = big.getBoundingClientRect(), p = n.getBoundingClientRect(), cx = p.left + p.width / 2, cy = p.top + p.height / 2;
    if (cx > b.left + b.width * .15 && cx < b.right - b.width * .15 && cy > b.top + b.height * .15 && cy < b.bottom - b.height * .1) {
      drag = false; n.classList.add('hidden'); sfx.pop(); big.style.setProperty('--s', 3.2); big.classList.add('burst');
      scene.insertAdjacentHTML('beforeend', '<div class="drop" style="left:' + (big.offsetLeft - 35) + 'px;top:35%;font-size:70px">💥</div>');
      setTimeout(showSponty, 900);
    }
  };
}
function showSponty() {
  $('#sponty').classList.remove('hidden');
  const g = $('#spontyGrid');
  SPONTY_PICS.forEach((src, i) => {
    const c = document.createElement('div'); c.className = 'card-photo'; c.style.animationDelay = i * .25 + 's';
    c.appendChild(pic(src, 'Sponty Laag #' + (i + 1))); g.appendChild(c);
  });
  setTimeout(() => $('#go4').classList.remove('hidden'), 2000);
}
$('#go4').onclick = () => { $('#sponty').classList.add('hidden'); go('P'); showPeriodic(); };
$('#goQuiz').onclick = () => { go(4); renderQ(); };

/* ===== PERIODIC TABLE PUZZLE ===== */
const CAT = { alk: ['Alkali Metal', '#b9dcff'], ae: ['Alkaline Earth', '#ffd9a8'], tm: ['Transition Metal', '#c4d4f0'], post: ['Post-Transition Metal', '#cfd3d8'], non: ['Nonmetal', '#c5e8b8'], hal: ['Halogen', '#ffc2d1'], ng: ['Noble Gas', '#fff0a0'], lan: ['Lanthanide', '#d8c4f2'], act: ['Actinide', '#9fdcdc'], meta: ['Metalloid', '#d3e8b0'], gold: ['Transition Metal', '#ffe2a0'] };
const EL = {
  Fe: [26, 'Iron', '55.85', 'tm'], N: [7, 'Nitrogen', '14.01', 'non'], Au: [79, 'Gold', '196.97', 'gold'], Nd: [60, 'Neodymium', '144.24', 'lan'],
  I: [53, 'Iodine', '126.90', 'hal'], K: [19, 'Potassium', '39.10', 'alk'], Al: [13, 'Aluminum', '26.98', 'post'], La: [57, 'Lanthanum', '138.91', 'lan'],
  C: [6, 'Carbon', '12.01', 'non'], U: [92, 'Uranium', '238.03', 'act'], As: [33, 'Arsenic', '74.92', 'meta'], S: [16, 'Sulfur', '32.06', 'non'],
  H: [1, 'Hydrogen', '1.01', 'non'], O: [8, 'Oxygen', '16.00', 'non'], Na: [11, 'Sodium', '22.99', 'alk'], Cl: [17, 'Chlorine', '35.45', 'hal'], Ca: [20, 'Calcium', '40.08', 'ae'], He: [2, 'Helium', '4.00', 'ng']
};
function mkTile(sym, delay) {
  const [num, nm, mass, cat] = EL[sym], t = document.createElement('div');
  t.className = 'ptile'; t.style.background = CAT[cat][1]; t.style.animationDelay = (delay || 0) + 's';
  t.innerHTML = '<small>' + num + '</small><b>' + sym + '</b><span>' + nm + '</span><em>' + mass + '</em>'; return t;
}
// the name to arrange: NIKKI / ALGUNAS  (letter shown on the slot, element that belongs there)
const NAME_ROWS = [
  [['N', 'N'], ['I', 'I'], ['K', 'K'], ['K', 'K'], ['I', 'I']],
  [['A', 'Al'], ['L', 'La'], ['G', 'C'], ['U', 'U'], ['N', 'N'], ['A', 'As'], ['S', 'S']]
];
let periodicDone = false;
function showPeriodic() {
  if (periodicDone) return; periodicDone = true;
  const box = $('#ptable'), pool = $('#ppool'); let placed = 0, selected = null, dragged = null; const total = 12;
  function place(tile, slot) {
    if (!tile || !slot) return;
    if (tile.dataset.sym === slot.dataset.sym) {
      sfx.collect(); const nt = mkTile(slot.dataset.sym, 0); slot.replaceWith(nt); tile.remove(); selected = dragged = null; placed++;
      $('#pmsg').textContent = placed < total ? 'Nice! ' + (total - placed) + ' more to go 🌿' : '';
      if (placed === total) {
        $('#pname').textContent = 'NIKKI ALGUNAS'; $('#pmsg').textContent = 'You arranged your name! 🎉 Happy Birthday!';
        pool.classList.add('hidden'); sfx.win(); setTimeout(() => $('#goQuiz').classList.remove('hidden'), 800);
      }
    } else {
      sfx.bad(); [tile, slot].forEach(e => { e.classList.add('shake'); setTimeout(() => e.classList.remove('shake'), 400); });
      $('#pmsg').textContent = 'Not that slot, try another one! 🤔';
    }
  }
  NAME_ROWS.forEach(row => {
    const r = document.createElement('div'); r.className = 'prow'; const w = document.createElement('div'); w.className = 'pword';
    row.forEach(([letter, sym]) => {
      const sl = document.createElement('div'); sl.className = 'pslot'; sl.dataset.sym = sym;
      /* blank slot: no letter or element hint, the player works out the order herself */
      sl.onclick = () => place(selected, sl);
      sl.ondragover = e => e.preventDefault(); sl.ondrop = e => { e.preventDefault(); place(dragged, sl); };
      w.appendChild(sl);
    });
    r.appendChild(w); box.appendChild(r);
  });
  NAME_ROWS.flat().map(x => x[1]).sort(() => Math.random() - .5).forEach((sym, i) => {
    const t = mkTile(sym, i * .08); t.classList.add('pick'); t.dataset.sym = sym; t.draggable = true;
    t.onclick = () => { if (selected) selected.classList.remove('sel'); selected = selected === t ? null : t; if (selected) { t.classList.add('sel'); sfx.pop(); } };
    t.ondragstart = () => { dragged = t; };
    pool.appendChild(t);
  });
  const lg = $('#legend'); ['alk', 'post', 'non', 'hal', 'lan', 'act', 'meta'].forEach(k => lg.insertAdjacentHTML('beforeend', '<span><i style="background:' + CAT[k][1] + '"></i>' + CAT[k][0] + '</span>'));
}

/* ===== SLIDE 4: QUIZ ===== */
const QS = [
  { t: 'mc', q: 'What is the chemical symbol for gold?', o: ['Fe', 'Pb', 'Au', 'Ag'], a: 2 },
  { t: 'mc', q: 'Which organelle is known as the powerhouse of the cell?', o: ['Golgi apparatus', 'Mitochondrion', 'Ribosome', 'Nucleus'], a: 1 },
  { t: 'mc', q: 'What is the planet closest to the Sun?', o: ['Earth', 'Mercury', 'Mars', 'Venus'], a: 1 },
  { t: 'mc', q: 'What is the approximate value of the speed of light in a vacuum?', o: ['3×10<sup>4</sup> m/s', '3×10<sup>10</sup> m/s', '3×10<sup>8</sup> m/s', '3×10<sup>6</sup> m/s'], a: 2 },
  { t: 'id', q: 'Which French naturalist, who coined the word "biology" in 1802, wrote Philosophie Zoologique (1809)? (Answer the first name only)', a: ['jean', 'jean-baptiste', 'jean baptiste'] },
  { t: 'yn', q: 'Is Channy cute?' }
];
let qi = 0;
function renderQ() {
  const q = QS[qi], body = $('#qBody'); body.innerHTML = ''; $('#qMsg').textContent = '';
  $('#qNum').textContent = 'Question ' + (qi + 1) + ' of ' + QS.length; $('#qText').textContent = q.q;
  if (q.t === 'mc') q.o.forEach((o, i) => {
    const b = document.createElement('button'); b.className = 'opt'; b.innerHTML = String.fromCharCode(65 + i) + '. ' + o;
    b.onclick = () => i === q.a ? right() : wrong(b); body.appendChild(b);
  });
  if (q.t === 'id') {
    const inp = document.createElement('input'); inp.type = 'text'; inp.id = 'ans'; inp.placeholder = 'Type your answer...'; inp.autocomplete = 'off'; inp.spellcheck = false;
    const btn = document.createElement('button'); btn.className = 'btn'; btn.textContent = 'Submit';
    const check = () => q.a.includes(inp.value.trim().toLowerCase().replace(/\s+/g, ' ')) ? right() : wrong(inp);
    btn.onclick = check; inp.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
    body.append(inp, btn); setTimeout(() => inp.focus(), 50);
  }
  if (q.t === 'yn') {
    body.innerHTML = '<div class="yn"><button class="btn yes" id="yes">YES</button><button class="btn no" id="no" tabindex="-1">NO</button></div>';
    const yes = $('#yes'), no = $('#no'); yes.onclick = right; let bump = 0;
    const dodge = (x, y) => {
      no.classList.add('flying');
      let nx, ny, tries = 0;
      do { nx = 10 + Math.random() * (innerWidth - no.offsetWidth - 20); ny = 10 + Math.random() * (innerHeight - no.offsetHeight - 20); }
      while (Math.hypot(nx - x, ny - y) < 250 && ++tries < 20);
      no.style.left = nx + 'px'; no.style.top = ny + 'px'; bump = Math.min(bump + .2, 2.5);
    };
    const upd = (x, y, press) => {
      const r = no.getBoundingClientRect(), d = Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2));
      if (d < 130 || (press && d < 200)) dodge(x, y);
      yes.style.setProperty('--ys', 1 + bump + (d < 160 ? (160 - d) / 160 : 0));
    };
    $('#s4').onpointermove = e => upd(e.clientX, e.clientY, false);
    $('#s4').onpointerdown = e => upd(e.clientX, e.clientY, true);
  }
}
function right() {
  sfx.good(); $('#qMsg').textContent = '✅ Correct!'; $('#qMsg').style.color = '#2f7a49';
  setTimeout(() => { qi++; if (qi < QS.length) renderQ(); else { $('#s4').onpointermove = $('#s4').onpointerdown = null; go(5); confetti(); sfx.win(); setTimeout(startBirthday, 1200); } }, 800);
}
function wrong(el) {
  sfx.bad(); $('#qMsg').textContent = '❌ Try again!'; $('#qMsg').style.color = '#c0392b';
  el.classList.add('shake'); setTimeout(() => el.classList.remove('shake'), 400);
}

/* ===== SLIDE 5 ===== */
function confetti() {
  const c = $('#confetti');
  for (let i = 0; i < 40; i++) {
    const l = document.createElement('div'); l.className = 'leaf'; l.textContent = ['🍃', '🌿', '🌸', '🎉'][i % 4];
    l.style.left = Math.random() * 100 + '%'; l.style.animationDuration = 4 + Math.random() * 5 + 's'; l.style.animationDelay = Math.random() * 5 + 's'; c.appendChild(l);
  }
}
$('#miniEnv').onclick = () => {
  sfx.pop();
  $('#finalOverlay').classList.remove('hidden');
  const g = $('#finalGrid'); g.innerHTML = '';
  const c = document.createElement('div'); c.className = 'card-photo single';
  c.appendChild(pic(FINAL_PIC, 'Our photo')); g.appendChild(c);
};
$('#finalClose').onclick = () => $('#finalOverlay').classList.add('hidden');

/* ===== HAPPY BIRTHDAY BACKGROUND MUSIC (final slide) =====
   Optional: drop a real recording named birthday.mp3 into the "picture" or "audio" folder
   (or next to index.html) and it will be used. Otherwise the built-in tune plays. */
const BDAY_SOURCES = ['picture/birthday.mp3', 'audio/birthday.mp3', 'birthday.mp3'];
function startBirthday() {
  stopMusic(); if (muted) return;
  (function tryFile(i) {
    if (i >= BDAY_SOURCES.length) { synthBirthday(); return; }
    const a = new Audio(BDAY_SOURCES[i]); a.loop = true; a.volume = .7;
    a.play().then(() => { bgm = a; }).catch(() => tryFile(i + 1));
  })(0);
}
function synthBirthday() {
  const G4 = 392, A4 = 440, B4 = 494, C5 = 523, D5 = 587, E5 = 659, F5 = 698, G5 = 784, beat = 440;
  const seq = [
    [G4,.75],[G4,.25],[A4,1],[G4,1],[C5,1],[B4,2],
    [G4,.75],[G4,.25],[A4,1],[G4,1],[D5,1],[C5,2],
    [G4,.75],[G4,.25],[G5,1],[E5,1],[C5,1],[B4,1],[A4,2],
    [F5,.75],[F5,.25],[E5,1],[C5,1],[D5,1],[C5,2],
    [0,2]
  ];
  let i = 0;
  (function next() {
    const [f, b] = seq[i % seq.length];
    if (f && !muted) { tone(f, b * beat / 1000 * .95, 'triangle', .2); tone(f / 2, b * beat / 1000 * .95, 'sine', .07); }
    i++; musicTimer = setTimeout(next, b * beat);
  })();
}