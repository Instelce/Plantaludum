import React, {Children, useEffect, useMemo, useRef, useState} from 'react';
import './style.scss';
import Input from "../Input/index.jsx";
import Button from "../../Buttons/Button.jsx";
import classNames from "classnames";
import PropTypes from "prop-types";
import {ChevronDown} from "react-feather";


function Dropdown({label, size="lg", setValue, defaultValue= undefined, placeholder="Option", children}) {
  const [showOptions, setShowOptions] = useState(false)
  const [currentValue, setCurrentValue] = useState(undefined)
  const [buttonFocus, setButtonFocus] = useState(true)
  const [mouseOnOptions, setMouseOnOptions] = useState(false)
  const optionsRef = useRef(null)

  useEffect(() => {
    if (defaultValue) {
      setCurrentValue(defaultValue)
    }
  }, []);

  useEffect(() => {
    console.log(children)

    if (!buttonFocus && showOptions && !mouseOnOptions) {
      setShowOptions(false)
    }
  }, [buttonFocus, showOptions]);

  return (
    <div className={classNames("dropdown", {'show-options': showOptions})}>
      <label htmlFor="">{label}</label>
      <Button
        label={currentValue ? currentValue : placeholder}
        color="secondary" variant="outlined" size={size}
        onFocus={() => setButtonFocus(true)}
        onBlur={() => setButtonFocus(false)}
        onClick={() => setShowOptions(!showOptions)}
        icon={<ChevronDown />}
      />
      <div
        ref={optionsRef}
        className="dropdown-options"
        onMouseEnter={() => setMouseOnOptions(() => true)}
        onMouseLeave={() => setMouseOnOptions(() => false)}
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
                  setShowOptions(false)
                  setValue(value)
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
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'big'])
}


export function Option({value=null, active, children, onClick}) {
  return <button type="button" className={classNames("option", {active: active})} onClick={onClick}>
    {children}
  </button>
}

export default Dropdown;