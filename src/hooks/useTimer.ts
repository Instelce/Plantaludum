import {useCallback, useEffect, useState} from "react";

const interval = (delay = 0) => callback => {
  useEffect(() => {
    const id = setInterval(callback, delay);

    return () => clearInterval(id);
  }, [callback]);
};

const useSecondsInterval = interval(1000);

export const useTimer = ({
                           initiallyRunning = false,
                           initialSeconds = 60,
                           type = "DECREMENT",
                           end = 0,
                         } = {}) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [running, setRunning] = useState(initiallyRunning);

  const tick = useCallback(
    () => (running ?
      setSeconds((seconds) =>
        type == "DECREMENT" ?
          seconds > end ? seconds - 1 : end :
          seconds < end ? seconds + 1: end)
      : undefined),
    [running]
  );

  const start = () => setRunning(true);
  const pause = () => setRunning(false);
  const reset = () => setSeconds(initialSeconds);
  const stop = () => {
    pause();
    reset();
  };
  let formattedTime = new Date(seconds * 1000).toISOString().substring(14, 19)

  useSecondsInterval(tick);

  return {pause, reset, running, seconds, formattedTime, start, stop};
};