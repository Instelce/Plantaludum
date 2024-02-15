import { useEffect, useState } from "react";

function useDebounce<T>(value: T, delay: number): T | null {
  const [debounceValue, setDebounceValue] = useState<T | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    return () => {
      clearInterval(timer);
    };
  }, [value, delay]);

  return debounceValue;
}

export default useDebounce;
