import React, {
  Children,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState
} from 'react';
import './style.scss';
import Button from "../../Buttons/Button.jsx";
import classNames from "classnames";
import Option from "../Option/index.jsx"
import PropTypes from "prop-types";
import {ChevronDown} from "react-feather";
import {deleteDublicates} from "../../../utils.js";


function Dropdown({inputId, label, size="lg", mb, defaultValue= undefined, placeholder="Option", children, ...props}) {
  const [showOptions, setShowOptions] = useState(false)
  const [options, setOptions] = useState([])
  const [currentValue, setCurrentValue] = useState("")
  const [selectedOption, setSelectedOption] = useState(0)
  const [buttonFocus, setButtonFocus] = useState(true)
  const [mouseOnOptions, setMouseOnOptions] = useState(false)
  const optionsRef = useRef(null)
  const id = useId()

  useEffect(() => {
    if (defaultValue) {
      setCurrentValue(defaultValue)
    }

    // get options in array
    const childrens = Children.toArray(children).filter(child => child.type === Option)
    const newOptions = []
    childrens.map(child => {
      let value = child.props.value ? child.props.value : child.props.children;
      newOptions.push(value)
    })
    setOptions(() => newOptions)
  }, []);

  useEffect(() => {
    // hide options
    if (!buttonFocus && showOptions && !mouseOnOptions) {
      setShowOptions(false)
    }
  }, [buttonFocus, showOptions]);

  // Accessibility
  useEffect(() => {
    const accessibility = (e) => {
      switch (e.key) {
        case 'ArrowDown':
          setSelectedOption(prev => prev < options.length - 1 ? prev + 1 : prev); break;
        case 'ArrowUp':
          setSelectedOption(prev => prev > 0 ? prev - 1 : prev); break;
        case 'Enter':
          setCurrentValue(() => options[selectedOption]);
          setSelectedOption(() => 0)
          break;
      }
    }

    if (showOptions) {
      window.addEventListener("keydown", accessibility)
    }

    return () => {
      window.removeEventListener("keydown", accessibility)
    }
  }, [showOptions, selectedOption, options]);


  return (
    <div className={classNames("dropdown")} style={{marginBottom: mb}}>
      <input id={inputId} name={inputId} className="hidden" value={currentValue} readOnly={true} />
      <label htmlFor={id} className={classNames({up: currentValue !== ""})}>{label}</label>
      <Button
        id={id}
        label={currentValue !== "" ? currentValue : <span></span>}
        color="secondary" variant="outlined" size={size}
        onFocus={() => setButtonFocus(() => true)}
        onBlur={() => setButtonFocus(() => false)}
        onClick={() => setShowOptions(!showOptions)}
        icon={<ChevronDown />}
        {...props}
      />
      <div
        ref={optionsRef}
        className={classNames("options-container", {show: showOptions})}
        onMouseEnter={() => setMouseOnOptions(() => true)}
        onMouseLeave={() => setMouseOnOptions(() => false)}
      >
        {Children.map(children, (option, index) => {
          if (option.type === Option) {
            let value = option.props.value ? option.props.value : option.props.children;
            return React.cloneElement(option, {
                ...option.props,
                active: index === selectedOption,
                key: index,
                onClick: (e) => {
                  e.preventDefault()
                  setCurrentValue(option.props.value ? option.props.children : value);
                  setShowOptions(false);
              }});
          } else {
            return null
          }
        })}
      </div>
    </div>
  );
}

Dropdown.propTypes = {
  label: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'big']),
  defaultValue: PropTypes.string || PropTypes.number,
  placeholder: PropTypes.string,
  children: PropTypes.node
}

export default Dropdown;