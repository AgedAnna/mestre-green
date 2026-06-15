"use client";

import { useEffect } from "react";

const TITLE_ON_BLUR = "🧙🏽​ Volte! Seus palpites te esperam";

function TabTitleNotifier() {
  useEffect(() => {
    const originalTitle = document.title;

    const restore = () => {
      document.title = originalTitle;
    };
    const swap = () => {
      document.title = TITLE_ON_BLUR;
    };

    window.addEventListener("focus", restore);
    window.addEventListener("blur", swap);

    return () => {
      window.removeEventListener("focus", restore);
      window.removeEventListener("blur", swap);
      document.title = originalTitle;
    };
  }, []);

  return null;
}

export { TabTitleNotifier };
