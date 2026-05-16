import { session } from './sessions.js';

const stage = document.getElementById('stage');
const aiEl = document.getElementById('ai');
const optionsEl = document.getElementById('options');

// Parchment → obsidian palette
const PARCHMENT = { bg: [236, 228, 210], ink: [26, 22, 18] };
const OBSIDIAN  = { bg: [12, 12, 14],    ink: [232, 226, 212] };

const lerp = (a, b, t) => a + (b - a) * t;
const lerpColor = (a, b, t) => [
  Math.round(lerp(a[0], b[0], t)),
  Math.round(lerp(a[1], b[1], t)),
  Math.round(lerp(a[2], b[2], t)),
];
const rgb = ([r, g, b]) => `rgb(${r}, ${g}, ${b})`;

// Ease so the descent feels gradual early and committal late.
const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

function applyShade(progress) {
  const t = easeInOutCubic(Math.max(0, Math.min(1, progress)));
  const bg = lerpColor(PARCHMENT.bg, OBSIDIAN.bg, t);
  const ink = lerpColor(PARCHMENT.ink, OBSIDIAN.ink, t);
  document.body.style.backgroundColor = rgb(bg);
  document.body.style.color = rgb(ink);
}

// Longest path from a given start node to any terminal. Used to scale the
// background shift so the descent feels right regardless of which opener fires.
function maxDepth(session, startId) {
  const seen = new Map();
  function walk(id) {
    if (seen.has(id)) return seen.get(id);
    const node = session.nodes[id];
    if (!node) return 0;
    if (node.terminal) { seen.set(id, 1); return 1; }
    let best = 1;
    for (const opt of node.options || []) {
      best = Math.max(best, 1 + walk(opt.next));
    }
    seen.set(id, best);
    return best;
  }
  return walk(startId);
}

function wait(ms) { return new Promise(r => setTimeout(r, ms)); }
// Prime style before adding transition class. setTimeout(0) instead of RAF so
// background tabs (preview, etc.) don't stall the sequence.
function nextFrame() { return wait(20); }

async function renderNode(session, nodeId, depth, totalDepth) {
  const node = session.nodes[nodeId];
  if (!node) return;

  applyShade(depth / Math.max(1, totalDepth - 1));

  // Fade out existing options before swapping
  const existingOptions = optionsEl.querySelectorAll('.option');
  if (existingOptions.length) {
    existingOptions.forEach(b => b.classList.add('fading-out'));
    existingOptions.forEach(b => b.disabled = true);
    await wait(450);
  }

  // Swap AI text
  aiEl.innerHTML = '';
  optionsEl.innerHTML = '';
  const p = document.createElement('p');
  p.textContent = node.ai;
  if (node.terminal) aiEl.classList.add('terminal');
  aiEl.appendChild(p);
  await nextFrame();
  p.classList.add('in');

  if (node.terminal) {
    document.body.classList.add('terminal');
    await wait(1200);
    const restart = document.createElement('button');
    restart.className = 'restart';
    restart.type = 'button';
    restart.textContent = 'begin again';
    restart.addEventListener('click', () => start(), { once: true });
    optionsEl.appendChild(restart);
    await nextFrame();
    restart.classList.add('in');
    return;
  }

  // Render options with a small stagger
  await wait(900);
  node.options.forEach((opt, i) => {
    const b = document.createElement('button');
    b.className = 'option';
    b.type = 'button';
    b.textContent = opt.text;
    b.addEventListener('click', () => {
      renderNode(session, opt.next, depth + 1, totalDepth);
    }, { once: true });
    optionsEl.appendChild(b);
    setTimeout(() => b.classList.add('in'), 120 * i);
  });
}

function pickStart() {
  return session.starts[Math.floor(Math.random() * session.starts.length)];
}

function start() {
  document.body.classList.remove('terminal');
  aiEl.classList.remove('terminal');
  optionsEl.innerHTML = '';
  aiEl.innerHTML = '';
  const startId = pickStart();
  const total = maxDepth(session, startId);
  renderNode(session, startId, 0, total);
}

start();
