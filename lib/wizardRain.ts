// Chuva de bruxinhos 🧙 — renderizada num único <canvas> via requestAnimationFrame.
// Uma só camada no compositor (sem dezenas de nós DOM animados), o que evita
// travamentos mesmo sobre o backdrop-blur do modal.

let running = false;

const rnd = (min: number, max: number) =>
  Math.random() * (max - min) + min;

interface Wizard {
  x: number;
  size: number;
  speed: number; // px por ms
  delay: number; // ms
  swayAmp: number;
  swayFreq: number;
  phase: number;
}

/**
 * Dispara a animação. `onComplete` é chamado quando a chuva já está visível
 * (ideal para então redirecionar). Reentrância é bloqueada.
 */
export function wizardRain(onComplete?: () => void) {
  if (typeof document === "undefined") {
    onComplete?.();
    return;
  }

  const reduceMotion = window.matchMedia?.(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (reduceMotion || running) {
    onComplete?.();
    return;
  }
  running = true;

  const w = window.innerWidth;
  const h = window.innerHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  const canvas = document.createElement("canvas");
  canvas.className = "wizard-rain-container";
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    running = false;
    onComplete?.();
    return;
  }
  ctx.scale(dpr, dpr);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const QUANTITY = 20;
  const wizards: Wizard[] = Array.from({ length: QUANTITY }, () => ({
    x: rnd(0, w),
    size: rnd(28, 60),
    speed: rnd(0.28, 0.55), // px/ms → sobe a tela em ~1,2–2,5s
    delay: rnd(0, 600),
    swayAmp: rnd(8, 22),
    swayFreq: rnd(0.002, 0.004),
    phase: rnd(0, Math.PI * 2),
  }));

  const TOTAL = 2000;
  const REDIRECT_AT = 900;
  const start = performance.now();
  let raf = 0;
  let redirected = false;

  function cleanup() {
    cancelAnimationFrame(raf);
    canvas.remove();
    running = false;
  }

  function frame(now: number) {
    const t = now - start;
    ctx!.clearRect(0, 0, w, h);

    for (const p of wizards) {
      const lt = t - p.delay;
      if (lt < 0) continue;
      const y = h + p.size - p.speed * lt;
      if (y < -p.size) continue;
      const x = p.x + Math.sin(p.phase + lt * p.swayFreq) * p.swayAmp;
      ctx!.font = `${p.size}px serif`;
      ctx!.fillText("🧙", x, y);
    }

    if (t >= REDIRECT_AT && !redirected) {
      redirected = true;
      onComplete?.();
    }

    if (t < TOTAL) {
      raf = requestAnimationFrame(frame);
    } else {
      cleanup();
    }
  }

  raf = requestAnimationFrame(frame);
}
