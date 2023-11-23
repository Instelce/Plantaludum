import "./style.scss";
import PropTypes from "prop-types";
import {useEffect, useId, useState} from "react";
import classNames from "classnames";

function Textarea({
  id=undefined,
  label,
  maxLenght=null,
  showActionBar= false,
  disabled = false,
  value,
  handleValueChange = null,
  helperText = "",
  mb
}) {
  const defaultId = useId()
  const [valueLenght, setValueLenght] = useState(0)

  const handleChange = (value) => {
    setValueLenght(prev => value.toString().length)

    handleValueChange ? handleValueChange(value) : null
  }

  return <div className="textarea-container" style={{marginBottom: mb}}>
    {showActionBar && <div className="action-bar">

    </div>}
    <div className="textarea-wrapper">
      <textarea
        id={id ? id : defaultId}
        name={id ? id : defaultId}
        disabled={disabled}
        placeholder=" "
        value={value ? value : undefined}
        onChange={(e) => handleChange(e.target.value)}
      ></textarea>
      <label htmlFor={id ? id : defaultId}>{label}</label>
      {maxLenght && <span className={classNames("world-counter", {'text-overflow': valueLenght > maxLenght})}>{maxLenght-valueLenght}</span>}
    </div>
    <p className="helper-text">{helperText}</p>
  </div>
}

Textarea.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  maxLenght: PropTypes.number,
  showActionBar: PropTypes.bool,
  disabled: PropTypes.bool,
  value: PropTypes.string,
  handleValueChange: PropTypes.func,
  helperText: PropTypes.string
};


export default Textarea;