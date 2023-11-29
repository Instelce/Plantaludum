import React, {
  ButtonHTMLAttributes,
  Children,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import "./Dropdown.scss";
import Button from "../../ui/Buttons/Button.jsx";
import classNames from "classnames";
import Option, { OptionProps } from "../Option/Option";
import PropTypes from "prop-types";
import { ChevronDown } from "react-feather";
import { deleteDublicates } from "../../../utils/helpers";
import { SizeProp } from "../../../types/helpers";

type DropdownProps = {
  inputId?: string;
  label: string;
  size?: SizeProp;
  defaultValue?: string | undefined;
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
  const [options, setOptions] = useState([]);
  const [currentValue, setCurrentValue] = useState("");
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const [buttonFocus, setButtonFocus] = useState(true);
  const [mouseOnOptions, setMouseOnOptions] = useState(false);
  const optionsRef = useRef(null);
  const id = useId();

  useEffect(() => {
    if (defaultValue) {
      setCurrentValue(defaultValue);
    }

    // get options in array
    const childrens = Children.toArray(children).filter(
      (child) => child.type === Option,
    );
    const newOptions: string[] = [];
    childrens.map((child) => {
      let value = child.props.value ? child.props.value : child.props.children;
      newOptions.push(value);
    });
    setOptions(newOptions);
  }, []);

  // hide options
  useEffect(() => {
    if (!buttonFocus && showOptions && !mouseOnOptions) {
      setShowOptions(false);
    }
  }, [buttonFocus, showOptions]);

  // Accessibility
  useEffect(() => {
    const accessibility = (e) => {
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
    handleValueChange && handleValueChange(currentValue);
  }, [currentValue]);

  return (
    <div className={classNames("dropdown")}>
      <input
        id={inputId}
        name={inputId}
        className="hidden"
        value={currentValue}
        // onChange={(e) => handleValueChange(e.target.value)}
        readOnly={true}
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
        onFocus={() => setButtonFocus(() => true)}
        onBlur={() => setButtonFocus(() => false)}
        onClick={() => setShowOptions(!showOptions)}
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
      <div
        ref={optionsRef}
        className={classNames("options-container", {
          show: showOptions,
        })}
        onMouseEnter={() => setMouseOnOptions(() => true)}
        onMouseLeave={() => setMouseOnOptions(() => false)}
      >
        {Children.map(children, (option: OptionProps, index: number) => {
          if (option.type === Option) {
            let value = option.props.value
              ? option.props.value
              : option.props.children;
            return React.cloneElement(option, {
              ...option.props,
              active: index === selectedOptionIndex,
              key: index,
              onClick: (e) => {
                e.preventDefault();
                setCurrentValue(
                  option.props.value ? option.props.children : value,
                );
                setShowOptions(false);
              },
            });
          } else {
            return null;
          }
        })}
      </div>
    </div>
  );
}

export default Dropdown;
