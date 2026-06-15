// Chuva de bruxinhos 🧙 — sobem da base da viewport com tamanho, atraso e
// velocidade aleatórios. CSS puro, um único elemento + uma animação por emoji
// (sobe e balança juntos) para manter poucas camadas no compositor.

let running = false;

const rnd = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Dispara a animação. `onComplete` é chamado quando a chuva já está bem
 * visível (ideal para então redirecionar). Reentrância é bloqueada.
 */
export function wizardRain(onComplete?: () => void) {
  if (typeof document === "undefined") {
    onComplete?.();
    return;
  }

  // Respeita usuários que pedem menos animação
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    onComplete?.();
    return;
  }

  if (running) {
    onComplete?.();
    return;
  }
  running = true;

  const container = document.createElement("div");
  container.className = "wizard-rain-container";

  const QUANTITY = 20;
  const fragment = document.createDocumentFragment();
  let maxTime = 0;

  for (let i = 0; i < QUANTITY; i++) {
    const scale = Math.random() * 0.5 + 0.5; // 0.5–1.0
    const delay = rnd(0, 700);
    const duration = rnd(1100, 1700);
    maxTime = Math.max(maxTime, delay + duration);

    const el = document.createElement("div");
    el.className = "wizard-rain-emoji";
    el.textContent = "🧙";
    el.style.left = `${rnd(0, 100)}%`;
    el.style.fontSize = `${(scale * 2.4).toFixed(2)}rem`;
    el.style.animationDuration = `${duration}ms`;
    el.style.animationDelay = `${delay}ms`;
    fragment.appendChild(el);
  }

  container.appendChild(fragment);
  document.body.appendChild(container);

  // Redireciona quando a chuva já está visível
  window.setTimeout(() => onComplete?.(), Math.min(maxTime, 1000));

  // Limpeza
  window.setTimeout(() => {
    container.remove();
    running = false;
  }, maxTime + 200);
}
