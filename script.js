const K = 8.99e9;

function showTab(id, el) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById('panel-' + id).classList.add('active');
  el.classList.add('active');
}

function resetR(id) {
  document.getElementById(id).classList.remove('show');
}

function fmt(n) {
  if (isNaN(n) || !isFinite(n)) return '—';
  if (Math.abs(n) >= 1e5 || (Math.abs(n) < 0.001 && n !== 0)) return n.toExponential(4);
  return parseFloat(n.toFixed(6)).toString();
}

function setResult(resId, valId, lblId, val, lbl) {
  document.getElementById(resId).classList.add('show');
  document.getElementById(valId).textContent = val;
  document.getElementById(lblId).textContent = lbl;
}

function getNum(id) { return parseFloat(document.getElementById(id).value); }
function getStr(id) { return document.getElementById(id).value; }

/* ── OHM ── */
function calcOhm() {
  const t = getStr('ohm-target'), a = getNum('ohm-a'), b = getNum('ohm-b');
  if (isNaN(a) || isNaN(b)) return;
  let res, unit;

  if (t === 'V') { res = a * b; unit = 'V'; }
  else if (t === 'I') { res = a / b; unit = 'A'; }
  else { res = a / b; unit = 'Ω'; }

  setResult(
    'ohm-res','ohm-val','ohm-lbl',
    fmt(res) + ' ' + unit,
    t === 'V'
      ? `V = ${fmt(a)} A × ${fmt(b)} Ω`
      : t === 'I'
      ? `I = ${fmt(a)} V ÷ ${fmt(b)} Ω`
      : `R = ${fmt(a)} V ÷ ${fmt(b)} A`
  );
}

function parseList(id) {
  return getStr(id).split(',').map(Number).filter(v => !isNaN(v) && v > 0);
}

function calcSerie() {
  const v = parseList('res-list');
  if (!v.length) return;
  const r = v.reduce((a, b) => a + b, 0);

  setResult(
    'res-res','res-val','res-lbl',
    fmt(r) + ' Ω',
    'R_eq (serie) = ' + v.join(' + ') + ' = ' + fmt(r) + ' Ω'
  );
}

function calcParalelo() {
  const v = parseList('res-list');
  if (!v.length) return;
  const r = 1 / v.reduce((a, b) => a + 1/b, 0);

  setResult(
    'res-res','res-val','res-lbl',
    fmt(r) + ' Ω',
    'R_eq (paralelo) = ' + fmt(r) + ' Ω'
  );
}

/* ── COULOMB ── */
function calcCoulomb() {
  const q1 = getNum('cou-q1'), q2 = getNum('cou-q2'), r = getNum('cou-r');
  if (isNaN(q1) || isNaN(q2) || isNaN(r) || r <= 0) return;

  const F = K * Math.abs(q1 * q2) / (r * r);
  const tipo = q1 * q2 > 0 ? 'Repulsión' : 'Atracción';

  setResult(
    'cou-res','cou-val','cou-lbl',
    fmt(F) + ' N',
    `F = k|q₁q₂|/r² = ${fmt(F)} N  —  ${tipo}`
  );
}

/* ── CAMPO ── */
function calcCampo() {
  const q = getNum('ce-q'), r = getNum('ce-r');
  if (isNaN(q) || isNaN(r) || r <= 0) return;

  const E = K * Math.abs(q) / (r * r);

  setResult(
    'ce-res','ce-val','ce-lbl',
    fmt(E) + ' N/C',
    `E = k|q|/r² = ${fmt(E)} N/C`
  );
}

function calcMovPart() {
  const q = getNum('mp-q'), m = getNum('mp-m'), e = getNum('mp-e');
  if (isNaN(q) || isNaN(m) || isNaN(e) || m <= 0) return;

  const a = Math.abs(q) * e / m;

  setResult(
    'mp-res','mp-val','mp-lbl',
    fmt(a) + ' m/s²',
    `a = |q|E/m = ${fmt(a)} m/s²`
  );
}

/* ── POTENCIAL ── */
function calcPotencial() {
  const q = getNum('pot-q'), r = getNum('pot-r');
  if (isNaN(q) || isNaN(r) || r <= 0) return;

  const V = K * q / r;

  setResult(
    'pot-res','pot-val','pot-lbl',
    fmt(V) + ' V',
    `V = kq/r = ${fmt(V)} V`
  );
}

function calcEnergiaPot() {
  const q1 = getNum('ep-q1'), q2 = getNum('ep-q2'), r = getNum('ep-r');
  if (isNaN(q1) || isNaN(q2) || isNaN(r) || r <= 0) return;

  const U = K * q1 * q2 / r;

  setResult(
    'ep-res','ep-val','ep-lbl',
    fmt(U) + ' J',
    `U = kq₁q₂/r = ${fmt(U)} J`
  );
}

/* ── CAPACITORES ── */
function calcCap() {
  const t = getStr('cap-target'), a = getNum('cap-a'), b = getNum('cap-b');
  if (isNaN(a) || isNaN(b)) return;

  let res, unit;
  if (t === 'C') { res = a / b; unit = 'F'; }
  else if (t === 'Q') { res = a * b; unit = 'C'; }
  else { res = a / b; unit = 'V'; }

  setResult(
    'cap-res','cap-val','cap-lbl',
    fmt(res) + ' ' + unit,
    `Resultado: ${fmt(res)} ${unit}`
  );
}

function calcEnCap() {
  const c = getNum('uc-c'), v = getNum('uc-v');
  if (isNaN(c) || isNaN(v)) return;

  const U = 0.5 * c * v * v;

  setResult(
    'uc-res','uc-val','uc-lbl',
    fmt(U) + ' J',
    `U = ½CV² = ${fmt(U)} J`
  );
}

function calcCapSerie() {
  const v = parseList('capn-list');
  if (!v.length) return;

  const c = 1 / v.reduce((a, b) => a + 1/b, 0);

  setResult(
    'capn-res','capn-val','capn-lbl',
    fmt(c) + ' F',
    `C_eq (serie) = ${fmt(c)} F`
  );
}

function calcCapPar() {
  const v = parseList('capn-list');
  if (!v.length) return;

  const c = v.reduce((a, b) => a + b, 0);

  setResult(
    'capn-res','capn-val','capn-lbl',
    fmt(c) + ' F',
    `C_eq (paralelo) = ${fmt(c)} F`
  );
}

/* ── KIRCHHOFF ── */
function calcDivisor() {
  const vs = getNum('dv-vs'), r1 = getNum('dv-r1'), r2 = getNum('dv-r2');
  if (isNaN(vs) || isNaN(r1) || isNaN(r2) || r1 + r2 === 0) return;

  const v2 = vs * r2 / (r1 + r2);

  setResult(
    'dv-res','dv-val','dv-lbl',
    fmt(v2) + ' V',
    `V₂ = ${fmt(vs)} × ${fmt(r2)} / (${fmt(r1)}+${fmt(r2)}) = ${fmt(v2)} V`
  );
}

function calcKVL() {
  const fem = getNum('kv-fem'), r1 = getNum('kv-r1'), r2 = getNum('kv-r2');
  if (isNaN(fem) || isNaN(r1) || isNaN(r2) || r1 + r2 === 0) return;

  const I = fem / (r1 + r2);
  const vr1 = I * r1;
  const vr2 = I * r2;

  setResult(
    'kv-res','kv-val','kv-lbl',
    `I = ${fmt(I)} A`,
    `V_R1 = ${fmt(vr1)} V  |  V_R2 = ${fmt(vr2)} V  |  Verificación: ${fmt(vr1 + vr2)} V ≈ FEM`
  );
}

/* ── POTENCIA ── */
function calcPotencia() {
  const mode = getStr('pw-mode'), a = getNum('pw-a'), b = getNum('pw-b');
  if (isNaN(a) || isNaN(b)) return;

  let p;
  if (mode === 'VI') p = a * b;
  else if (mode === 'IR') p = a * a * b;
  else p = a * a / b;

  setResult(
    'pw-res','pw-val','pw-lbl',
    fmt(p) + ' W',
    `P = ${fmt(p)} W`
  );
}

function calcJoule() {
  const i = getNum('j-i'), r = getNum('j-r'), t = getNum('j-t');
  if (isNaN(i) || isNaN(r) || isNaN(t)) return;

  const q = i * i * r * t;

  setResult(
    'j-res','j-val','j-lbl',
    fmt(q) + ' J',
    `Q = I²Rt = ${fmt(q)} J`
  );
}

/* ── MATERIALES ── */
function setRho() {
  const sel = document.getElementById('mat-sel').value;
  if (sel !== 'custom') document.getElementById('rho-val').value = sel;
}

function calcResistividad() {
  const rho = getNum('rho-val'), l = getNum('rho-l'), a = getNum('rho-a');
  if (isNaN(rho) || isNaN(l) || isNaN(a) || a <= 0) return;

  const R = rho * l / a;

  setResult(
    'rho-res','rho-val2','rho-lbl',
    fmt(R) + ' Ω',
    `R = ρL/A = ${fmt(rho)} × ${fmt(l)} / ${fmt(a)} = ${fmt(R)} Ω`
  );
}