import React, {Children, useEffect, useMemo, useRef, useState} from 'react';
import './style.scss';
import Input from "../Input/index.jsx";
import Button from "../../Buttons/Button.jsx";
import classNames from "classnames";


function Dropdown({setValue, defaultValue= undefined, placeholder="Option", children}) {
  const [showOptions, setShowOptions] = useState(false)
  const [currentValue, setCurrentValue] = useState(undefined)
  const [buttonFocus, setButtonFocus] = useState(true)

  useEffect(() => {
    if (defaultValue) {
      setCurrentValue(defaultValue)
    }
  }, []);

  useEffect(() => {
    console.log(children)
    if (!buttonFocus && showOptions) {
      setTimeout(() => {
        setShowOptions(false)
      }, 200)
    }
  }, [buttonFocus, showOptions]);

  return (
    <div className={classNames("dropdown", {'show-options': showOptions})}>
      <Button
        label={currentValue ? currentValue : placeholder}
        color="secondary" variant="outlined" size="big"
        onFocus={() => setButtonFocus(true)}
        onBlur={() => setButtonFocus(false)}
        onClick={() => setShowOptions(!showOptions)}
      />
      <div className="dropdown-options">
        {Children.map(children, (option, index) => {
          if (option.type === Option) {
            let value = option.props.children;
            return React.cloneElement(option, {
                ...option.props,
                active: value === currentValue,
                key: index,
                onClick: (e) => {
                  e.preventDefault()
                  setCurrentValue(value);
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


export function Option({active, children, onClick}) {
  return <button type="button" className={classNames("option", {active: active})} onClick={onClick}>
    {children}
  </button>
}

export default Dropdown;