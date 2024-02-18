import React, {
  ButtonHTMLAttributes,
  Children,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import "./Dropdown.scss";
import Button from "../../Atoms/Buttons/Button";
import classNames from "classnames";
import Option, { OptionProps } from "../../Atoms/Option/Option";
import { ChevronDown } from "react-feather";
import { SizeProp } from "../../../types/helpers";

type DropdownProps = {
  inputId?: string;
  label: string;
  size?: SizeProp;
  defaultValue?: string | undefined;
  // eslint-disable-next-line no-unused-vars
  handleValueChange?: (value: string) => void;
  children: React.ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

function Dropdown({
  inputId,
  label,
  size = "large",
  defaultValue = undefined,
  handleValueChange,
  children,
  ...props
}: DropdownProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [currentValue, setCurrentValue] = useState<string>("");
  const [currentRealValue, setCurrentRealValue] = useState<string | undefined>(undefined);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const [buttonFocus, setButtonFocus] = useState(true);
  const [mouseOnOptions, setMouseOnOptions] = useState(false);
  const optionsRef = useRef(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const id = useId();

  useEffect(() => {
    // get options in array
    const childrens = Children.toArray(children).filter(
      (child) => React.isValidElement(child) && child.type === Option,
    );
    const newOptions: string[] = [];
    childrens.map((child) => {
      if (React.isValidElement(child)) {
        let value = child.props.value ? child.props.value : child.props.children;
        if (child.props.children === defaultValue && child.props.value) {
          setCurrentRealValue(child.props.value);
          handleValueChange && handleValueChange(child.props.value);
        }
        newOptions.push(value);
      }
    });
    setOptions(newOptions);

    // set default value
    if (defaultValue) {
      setCurrentValue(defaultValue);
    }
  }, []);

  // hide options
  useEffect(() => {
    if (!buttonFocus && showOptions && !mouseOnOptions) {
      setShowOptions(false);
    }
  }, [buttonFocus, mouseOnOptions, showOptions]);

  // Accessibility
  useEffect(() => {
    const accessibility = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          setSelectedOptionIndex((prev) =>
            prev < options.length - 1 ? prev + 1 : prev,
          );
          break;
        case "ArrowUp":
          setSelectedOptionIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case "Enter":
          setCurrentValue(() => options[selectedOptionIndex]);
          setSelectedOptionIndex(() => 0);
          break;
      }
    };

    if (showOptions) {
      window.addEventListener("keydown", accessibility);
    }

    return () => {
      window.removeEventListener("keydown", accessibility);
    };
  }, [showOptions, selectedOptionIndex, options]);

  useEffect(() => {
    if (handleValueChange) {
      // console.log(
      //   "CURRENT VALUE",
      //   currentValue,
      //   "CURRENT REAL VALUE",
      //   currentRealValue,
      // );
      if (currentRealValue !== undefined) handleValueChange(currentRealValue);
      else handleValueChange(currentValue);
    }

    if (inputRef.current && currentValue !== undefined) {
      let ev = new Event("input", { bubbles: true });
      inputRef.current.value = currentValue;
      inputRef.current.dispatchEvent(ev);
    }
  }, [currentValue, currentRealValue, handleValueChange]);

  return (
    <div className={classNames("dropdown")}>
      <input
        ref={inputRef}
        type="hidden"
        id={inputId}
        name={inputId}
        // value={currentValue}
        // readOnly={true}
      />
      {currentValue !== "" && (
        <label htmlFor={id} className={classNames({ up: currentValue !== "" })}>
          {label}
        </label>
      )}

      <Button
        className="sb"
        id={id}
        label={label}
        color="gray"
        size={size}
        type="button"
        onFocus={() => setButtonFocus(() => true)}
        onBlur={() => setButtonFocus(() => false)}
        onClick={() => setShowOptions(!showOptions)}
        bounce={false}
        {...props}
      >
        {currentValue != "" ? currentValue : label}
        <ChevronDown
          color="rgb(var(--color-primary-light))"
          style={{
            rotate: `${showOptions ? 180 : 0}deg`,
            transition: "rotate .3s ease",
          }}
        />
      </Button>

      {showOptions && (
        <>
          <div
            ref={optionsRef}
            className={classNames("options-container", {
              show: showOptions,
            })}
            onMouseEnter={() => setMouseOnOptions(() => true)}
            onMouseLeave={() => setMouseOnOptions(() => false)}
          >
            {(children as OptionProps[]).map((option: OptionProps, index: number) => {
              if (React.isValidElement(option)) {
                if (option.type === Option) {
                  let optionProps = option.props as OptionProps;
                  let value: string = optionProps.value
                    ? optionProps.value as string
                    : optionProps.children as string;
                  return React.cloneElement(option, {
                    ...optionProps,
                    active: index === selectedOptionIndex,
                    key: index,
                    onClick: (e) => {
                      e.preventDefault();
                      setCurrentValue(
                        optionProps.value ? optionProps.children as string : value as string,
                      );
                      setCurrentRealValue(value as string);
                      setShowOptions(false);
                    },
                  } as OptionProps);
                }
              } else {
                return null;
              }
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default Dropdown;
