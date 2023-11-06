import {useEffect, useRef, useState} from "react";

function useFormFilled() {
  const form = useRef(null)
  const [fields, setFields] = useState({})
  const [isFilled, setIsFilled] = useState(false)

  const handleFormChange = (e) => {
    let countInputFilled = 0;
    const inputs = form.current.querySelectorAll('input').length
    let lastFields = fields
    lastFields[e.id] = e.value

    setFields({
      ...fields,
      [e.id]: e.value
    })

    console.log(fields)
      for (const value of Object.values(lastFields)) {
        if (value !== "") {
          countInputFilled++;
        }
      }

      if (countInputFilled === inputs) {
        setIsFilled(true)
      } else {
        setIsFilled(false)
      }
  }

  return {form: form, handleFormChange: handleFormChange, isFilled: isFilled}
}

export default useFormFilled;