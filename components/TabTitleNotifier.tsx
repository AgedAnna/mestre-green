"use client";

import { useEffect } from "react";

const TITLES_ON_BLUR = [
  "🧙🏽 Volte! Seus palpites te esperam",
  "🟢 Não perca os próximos jogos",
  "🔥 Palpites ao vivo rolando agora",
];

const ROTATE_MS = 1000;

function TabTitleNotifier() {
  useEffect(() => {
    const originalTitle = document.title;
    let index = 0;
    let timer: ReturnType<typeof setInterval> | undefined;

    const restore = () => {
      if (timer) clearInterval(timer);
      timer = undefined;
      document.title = originalTitle;
    };

    const swap = () => {
      if (timer) return;
      index = 0;
      document.title = TITLES_ON_BLUR[index];
      timer = setInterval(() => {
        index = (index + 1) % TITLES_ON_BLUR.length;
        document.title = TITLES_ON_BLUR[index];
      }, ROTATE_MS);
    };

    window.addEventListener("focus", restore);
    window.addEventListener("blur", swap);

    return () => {
      window.removeEventListener("focus", restore);
      window.removeEventListener("blur", swap);
      if (timer) clearInterval(timer);
      document.title = originalTitle;
    };
  }, []);

  return null;
}

export { TabTitleNotifier };
