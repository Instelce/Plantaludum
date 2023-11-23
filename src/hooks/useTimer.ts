import {useEffect, useState} from "react";


export function useTimer({startValue= 5}) {
    const [timer, setTimer] = useState({
        minutes: startValue,
        seconds: 0
    })
    const [toggle, setToggle] = useState(false)

    useEffect(() => {
        const timerFunc = setTimeout(() => {
            // console.log('effect', toggle, timer)
            if (toggle && timer['minutes'] > 0) {
                setTimer(v => ( {...timer, seconds: v['seconds'] - 1} ))
                if (timer['seconds'] === 0) {
                    setTimer(v => ( {minutes: v['minutes'] - 1, seconds: 59} ))
                }
            }
        }, 1000)

        return () => clearTimeout(timerFunc)
    }, [timer, toggle]);

    const reset = () => {
        setTimer({
            minutes: startValue,
            seconds: 0
        })
    }

    return {
        seconds: timer['seconds'],
        minutes: timer['minutes'],
        stringTime: `${timer['minutes'] > 9 ? "" : "0"}${timer['minutes']}:${timer['seconds'] > 9 ? "" : "0"}${timer['seconds']}`,
        start: () => setToggle(true),
        pause: () => setToggle(false),
        reset: reset
    }
}