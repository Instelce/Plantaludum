import './style.scss';
import Input from "../Input/index.jsx";
import {useEffect, useMemo, useState} from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Option from "../Option/index.jsx";
import useDebounce from "../../../hooks/useDebounce.js";
import axios from "axios";
import {deleteDublicates} from "../../../utils.js";

function AutocompleteInput({
  label,
  size,
  url,
  fieldName,
  maxSuggestions=10,
  isValid = null,
}) {
  const [searchValue, setSearchValue] = useState("")
  const [suggestions, setSuggestions] = useState(null)
  const debouncedSearchValue = useDebounce(searchValue, 300)

  useEffect(() => {
    axios.get(url, {params: {search: debouncedSearchValue}})
      .then(response => {
          setSuggestions(prev => response.data.results)
      })
  }, [debouncedSearchValue]);

  const handleOptionClick = (value) => {
    console.log(value)
    setSearchValue(prev => value)
    isValid?.(prev => true)
  }

  return (
    <div className="autocomplete">
      <Input label={label} size={size} value={searchValue} handleValueChange={setSearchValue} />
      <Suggestions searchValue={searchValue} fieldName={fieldName} suggestions={suggestions} maxSuggestions={maxSuggestions} setSelectedValue={handleOptionClick} />
    </div>
  );
}

AutocompleteInput.propTypes = {
  label: PropTypes.string,
  size: PropTypes.oneOf(["sm", "md", "lg", "big"]),
  url: PropTypes.string,
  fieldName: PropTypes.string,
  maxSuggestions: PropTypes.number,
  isValid: PropTypes.func
}


function Suggestions ({searchValue, fieldName, suggestions, maxSuggestions, setSelectedValue}) {
  const filteredSuggestions = useMemo(() => {
    if (searchValue.length === 0) {
      return []
    } else {
      console.log(suggestions?.map(el => el[fieldName]).filter(value => value.toLowerCase().startsWith(searchValue)).slice(0, maxSuggestions))
      return deleteDublicates(suggestions?.map(el => el[fieldName]).filter(value => value.toLowerCase().startsWith(searchValue)).slice(0, maxSuggestions))
    }
  }, [suggestions])

  useEffect(() => {
    console.log(searchValue, filteredSuggestions.length)
  }, [searchValue]);

  return <div className={classNames("options-container", {show: filteredSuggestions?.length !== 0})}>
    {filteredSuggestions?.map((option, index) => (
      <Option key={option} index={index} value={option} onClick={(e) => setSelectedValue(option)}>{option}</Option>
    ))}
  </div>
}

Suggestions.propTypes = {
  searchValue: PropTypes.string,
  fieldName: PropTypes.string,
  suggestions: PropTypes.object,
  maxSuggestions: PropTypes.number,
  setSelectedValue: PropTypes.func
}

export default AutocompleteInput;