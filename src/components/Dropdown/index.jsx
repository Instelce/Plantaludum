import React, {Children, useEffect, useMemo, useState} from 'react';
import './style.scss';
import Input from "../forms/Input/index.jsx";
import Button from "../Buttons/Button.jsx";
import classNames from "classnames";


function Dropdown({children, placeholder="Option"}) {
  const [showOptions, setShowOptions] = useState(false)
  const [currentOption, setCurrentOption] = useState("")
  const optionElements = Children.toArray(children)

  useEffect(() => {
    console.log(children)
  }, []);

  useEffect(() => {
    console.log(currentOption)
  }, [currentOption]);

  return (
    <div className={classNames("dropdown", {'show-options': showOptions})}>
      <Button label={placeholder} color="secondary" variant="outlined" size="big" onClick={() => setShowOptions(!showOptions)} />
      <div className="dropdown-options">
        {Children.map(children, (option, index) => {
          if (option.type === React.createElement(Option).type) {
            console.log(option.props.children, option.props)
            return React.cloneElement(option, {...option.props, key: index, onClick: (e) => {
                e.preventDefault()
                console.log("click")
                setCurrentOption(option.props.children);
                setShowOptions(false)
              }});
          } else {
            return null
          }
        })}
      </div>
    </div>
  );
}


export function Option({children}) {
  return <button className="option">
    {children}
  </button>
}

export default Dropdown;