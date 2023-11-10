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


function Dropdown({inputId, label, size="lg", mb, defaultValue= undefined, placeholder="Option", children, ...props}) {
  const [showOptions, setShowOptions] = useState(false)
  const [currentValue, setCurrentValue] = useState("")
  const [buttonFocus, setButtonFocus] = useState(true)
  const [mouseOnOptions, setMouseOnOptions] = useState(false)
  const optionsRef = useRef(null)
  const id = useId()

  useEffect(() => {
    if (defaultValue) {
      setCurrentValue(defaultValue)
    }
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
          setSelectedSuggestion(prev => prev < filteredSuggestions.length - 1 ? prev + 1 : prev); break;
        case 'ArrowUp':
          setSelectedSuggestion(prev => prev > 0 ? prev - 1 : prev); break;
        case 'Enter':
          setSelectedValue(filteredSuggestions[selectedSuggestion]);
          setSelectedSuggestion(prev => 0)
          break;
      }
    }

    window.addEventListener("keydown", accessibility)

    return () => {
      window.removeEventListener("keydown", accessibility)
    }
  }, [showOptions]);


  return (
    <div className={classNames("dropdown")} style={{marginBottom: mb}}>
      <input id={inputId} name={inputId} className="hidden" value={currentValue} readOnly={true} />
      <label htmlFor={id} className={classNames({up: currentValue !== ""})}>{label}</label>
      <Button
        id={id}
        label={currentValue !== "" ? currentValue : <span></span>}
        color="secondary" variant="outlined" size={size}
        onFocus={() => setButtonFocus(true)}
        onBlur={() => setButtonFocus(false)}
        onClick={() => setShowOptions(!showOptions)}
        icon={<ChevronDown />}
        {...props}
      />
      <div
        ref={optionsRef}
        className={classNames("options-container", {show: showOptions})}
        onMouseEnter={() => setMouseOnOptions(prev => true)}
        onMouseLeave={() => setMouseOnOptions(prev => false)}
      >
        {Children.map(children, (option, index) => {
          if (option.type === Option) {
            let value = option.props.value ? option.props.value : option.props.children;
            return React.cloneElement(option, {
                ...option.props,
                active: value === currentValue,
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