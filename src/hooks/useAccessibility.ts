import { useEffect } from "react";

function useAccessibility({
  keysAction: keys = {
    ArrowDown: {
      condition: true,
      action: null,
    },
    ArrowUp: {
      condition: true,
      action: null,
    },
    Enter: {
      condition: true,
      action: null,
    },
  },
  refresh,
}) {
  useEffect(() => {
    const accessibility = (e) => {
      switch (e.key) {
        case "ArrowDown":
          if (keys.ArrowDown.condition) {
            keys.ArrowDown.action?.();
          }
          break;
        case "ArrowUp":
          if (keys.ArrowUp.condition) {
            keys.ArrowUp.action?.();
          }
          break;
        case "Enter":
          if (keys.Enter.condition) {
            keys.Enter.action?.();
          }
          break;
      }
    };

    window.addEventListener("keydown", accessibility);

    return () => {
      window.removeEventListener("keydown", accessibility);
    };
  }, []);
}

export default useAccessibility;
