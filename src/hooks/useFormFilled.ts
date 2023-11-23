import {useEffect, useRef, useState} from "react";
import {Form} from "react-router-dom";

function useFormFilled() {
  const form = useRef(null)
  const [isFilled, setIsFilled] = useState(false)

  const handleFormChange = (e) => {
    let countInputFilled = 0;
    const inputs = Array.from(form.current.querySelectorAll('input, textarea')).filter(input => input.type !== "checkbox");
    const inputsNum = inputs.length;

    // loop all inputs and check their value
    for (const input of inputs) {
      // console.log(input.value)
      if (input.value !== "" && input.type !== "checkbox") {
        countInputFilled++;
      }
    }

    if (countInputFilled === inputsNum) {
      setIsFilled(true)
    } else {
      setIsFilled(false)
    }
  }

  return {formRef: form, handleFormChange: handleFormChange, isFilled: isFilled}
}

export default useFormFilled;