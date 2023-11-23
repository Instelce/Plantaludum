import {useEffect, useState} from "react";

function useDebounce (value, delay) {
  const [debounceValue, setDebounceValue] = useState(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceValue(value)
    }, delay)

    return () => {
      clearInterval(timer)
    }
  }, [value, delay]);

  return debounceValue;
}


export default useDebounce;