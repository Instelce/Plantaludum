// @ts-nocheck
import "./Autocomplete.scss";
import Input from "../../Atoms/Input/Input";
import { KeyboardEvent, useCallback, useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import Option from "../../Atoms/Option/Option";
import useDebounce from "../../../hooks/useDebounce";
import axios from "axios";
import { deleteDublicates, removeAccent } from "../../../utils/helpers";
import {
  AutocompleteInputProps,
} from "./AutocompleteInputProps";
import { SizeProp } from "../../../types/helpers";

function AutocompleteInput({
  id,
  label,
  size = "large",
  url,
  fieldName,
  maxSuggestions = 10,
  handleValueChange,
  setValidValue,
  setSelectedValueData,
  usageInfoText = null,
  resetFieldOnSubmit = false,
  hasResetButton = false,
  ...props
}: AutocompleteInputProps) {
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const debouncedSearchValue = useDebounce(searchValue, 300);
  const [selectedValue, setSelectedValue] = useState("");
  // indice of the selected suggestion
  const [selectedSuggestion, setSelectedSuggestion] = useState(0);

  // fetch data from url pass in props
  useEffect(() => {
    axios
      .get(url, { params: { search: debouncedSearchValue } })
      .then((response) => {
        setSuggestions(response.data.results);
      });
  }, [debouncedSearchValue, url]);

  // set autocomplete to invalid if search value is different to selected value
  useEffect(() => {
    if (searchValue !== selectedValue) {
      setValidValue?.(false);
    }
  }, [searchValue, selectedValue, setValidValue]);

  const handleOptionClick = (value: string) => {
    if (resetFieldOnSubmit) {
      setSelectedValue("");
    }
    setSelectedValue(value);
    setSearchValue(value);
    setValidValue?.(true);
    handleValueChange?.(value);
    // console.log(suggestions);
    setSelectedValueData?.(
      suggestions &&
      Object.values(suggestions).filter((p: any) => p[fieldName] === value)[0]
    );
  };

  // filter data
  const filteredSuggestions = useMemo(() => {
    setSelectedSuggestion(0)
    if (searchValue.length === 0) {
      return [];
    } else {
      // first get only fieldName key values
      let results = suggestions.map((el: any) => el[fieldName]);
      // then filter by search value
      results = results.filter((value: string) => {
        let fvalue = value ? removeAccent(value.toLowerCase()) : "";
        let fsearch = removeAccent(searchValue.toLowerCase());
        return (
          fvalue.startsWith(fsearch.charAt(1)) ||
          fvalue.indexOf(fsearch) != -1 ||
          fvalue.search(fsearch) > -1
        );
      });
      // and get only 0 to maxSuggestions values
      results = results.slice(0, maxSuggestions);

      // console.log(results);

      return deleteDublicates(results);
    }
  }, [fieldName, maxSuggestions, searchValue, suggestions]);

  // remove enter key submit
  const checkKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleOptionClick(filteredSuggestions[selectedSuggestion]);
      setSelectedSuggestion(0);
    }
    if (e.key === "ArrowUp") {
      setSelectedSuggestion((prev) => (prev > 0 ? prev - 1 : prev));
    }
    if (e.key === "ArrowDown") {
      setSelectedSuggestion((prev) =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      );
    }
  };

  return (
    <div className="autocomplete">
      <Input
        id={id}
        label={label}
        size={size ? (size as SizeProp) : "large"}
        value={searchValue}
        handleValueChange={setSearchValue}
        onKeyDown={checkKeyDown}
        usageInfoText={usageInfoText}
        hasResetButton
        {...props}
      />
      {searchValue !== selectedValue && (
        <div
          className={classNames("options-container", {
            show: filteredSuggestions?.length !== 0,
          })}
        >
          {filteredSuggestions?.map((option: string, index: number) => (
            <Option
              key={option}
              value={option}
              active={selectedSuggestion === index}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </Option>
          ))}
        </div>
      )}
    </div>
  );
}


export default AutocompleteInput;
