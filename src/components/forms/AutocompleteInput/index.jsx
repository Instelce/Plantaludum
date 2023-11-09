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
  maxSuggestions = 10,
  handleValueChange,
  setValidValue = null,
}) {
  const [searchValue, setSearchValue] = useState("")
  const [suggestions, setSuggestions] = useState(null)
  const debouncedSearchValue = useDebounce(searchValue, 300)
  const [selectedValue, setSelectedValue] = useState("")

  useEffect(() => {
    axios.get(url, {params: {search: debouncedSearchValue}})
      .then(response => {
        console.log("res", response.data)
        setSuggestions(prev => response.data.results)
      })
  }, [debouncedSearchValue]);

  useEffect(() => {
    if (searchValue !== selectedValue) {
      setValidValue?.(prev => false)
    }
  }, [searchValue]);

  const handleOptionClick = (value) => {
    setSelectedValue(prev => value)
    setSearchValue(prev => value)
    setValidValue?.(prev => value)
    handleValueChange(prev => value)
  }

  return (
    <div className="autocomplete" style={{marginBottom: "1rem"}}>
      <Input label={label} size={size} value={searchValue} handleValueChange={setSearchValue} mb="0" />
      {searchValue !== selectedValue && <Suggestions searchValue={searchValue} fieldName={fieldName} suggestions={suggestions} maxSuggestions={maxSuggestions} setSelectedValue={handleOptionClick} />}
    </div>
  );
}

AutocompleteInput.propTypes = {
  label: PropTypes.string,
  size: PropTypes.oneOf(["sm", "md", "lg", "big"]),
  url: PropTypes.string,
  fieldName: PropTypes.string,
  maxSuggestions: PropTypes.number,
  handleValueChange: PropTypes.func,
  setValidValue: PropTypes.func
}


function Suggestions ({searchValue, fieldName, suggestions, maxSuggestions, setSelectedValue}) {
  const [selectedSuggestion, setSelectedSuggestion] = useState(0)
  const filteredSuggestions = useMemo(() => {
    if (searchValue.length === 0) {
      return []
    } else {
      console.log("sug", suggestions?.map(el => el[fieldName]).filter(value => value.toLowerCase().startsWith(searchValue)).slice(0, maxSuggestions))
      return deleteDublicates(suggestions?.map(el => el[fieldName]).filter(value => value).slice(0, maxSuggestions))
      // return deleteDublicates(suggestions?.map(el => el[fieldName]).filter(value => value.toLowerCase().startsWith(searchValue)).slice(0, maxSuggestions))
    }
  }, [suggestions])

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
  }, [selectedSuggestion]);

  return <div className={classNames("options-container", {show: filteredSuggestions?.length !== 0})}>
    {filteredSuggestions?.map((option, index) => (
      <Option key={option} index={index} value={option} active={selectedSuggestion === index} onClick={(e) => setSelectedValue(option)}>{option}</Option>
    ))}
  </div>
}

Suggestions.propTypes = {
  searchValue: PropTypes.string,
  fieldName: PropTypes.string,
  suggestions: PropTypes.array,
  maxSuggestions: PropTypes.number,
  setSelectedValue: PropTypes.func
}

export default AutocompleteInput;