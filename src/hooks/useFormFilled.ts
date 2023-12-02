import {MutableRefObject, useEffect, useRef, useState} from "react";

type UseFormFilledReturnType = {
  formRef: MutableRefObject<HTMLFormElement | null>;
  handleFormChange: () => void;
  isFilled: boolean;
};

function useFormFilled(): UseFormFilledReturnType {
  const form = useRef<HTMLFormElement>(null);
  const [isFilled, setIsFilled] = useState(false);

  const handleFormChange = () => {
    let countInputFilled = 0;
    const inputsElements = form.current?.querySelectorAll("input, textarea");
    console.log(inputsElements)

    if (inputsElements) {
      // remove checkbox from inputs
      const inputs = Array.from(inputsElements).filter(
        (input: Element) =>
          input &&
          !input.attributes.getNamedItem("data-not-count"),
      );
      const inputsCount = inputs.length;

      // loop all inputs and check their value
      inputs.forEach((input: Element) => {
        const inputElement = input as HTMLInputElement;
        console.log(inputElement.value)

        if (inputElement.value !== "" && inputElement.type !== "checkbox") {
          countInputFilled++;
        }
      });

      if (countInputFilled === inputsCount) {
        setIsFilled(true);
      } else {
        setIsFilled(false);
      }
    }
  };

  useEffect(() => {
    if (form.current) {
      handleFormChange()
    }
  }, []);

  return {
    formRef: form,
    handleFormChange: handleFormChange,
    isFilled: isFilled,
  };
}

export default useFormFilled;
