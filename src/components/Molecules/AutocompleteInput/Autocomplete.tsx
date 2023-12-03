import "./Autocomplete.scss";
import Input from "../../Atoms/Input/Input";
import React, {KeyboardEvent, useEffect, useMemo, useState} from "react";
import classNames from "classnames";
import Option from "../../Atoms/Option/Option";
import useDebounce from "../../../hooks/useDebounce";
import axios from "axios";
import {deleteDublicates} from "../../../utils/helpers";
import {
  AutocompleteInputProps,
  SuggestionsProps,
} from "./AutocompleteInputProps";

function AutocompleteInput({
  id,
  label,
  size = "large",
  url,
  fieldName,
  maxSuggestions = 10,
  handleValueChange,
  setValidValue = null,
  setSelectedValueData = null,
  usageInfoText = null,
  ...props
}: AutocompleteInputProps) {
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState<object | null>(null);
  const debouncedSearchValue = useDebounce(searchValue, 300);
  const [selectedValue, setSelectedValue] = useState("");

  // fetch data from url pass in props
  useEffect(() => {
    axios
      .get(url, { params: { search: debouncedSearchValue } })
      .then((response) => {
        setSuggestions(() => response.data.results);
      });
  }, [debouncedSearchValue]);

  // set autocomplete to invalid if search value is different to selected value
  useEffect(() => {
    if (searchValue !== selectedValue) {
      setValidValue?.(() => false);
    }
  }, [searchValue]);

  const handleOptionClick = (value: string) => {
    setSelectedValue(() => value);
    setSearchValue(() => value);
    setValidValue?.(() => true);
    handleValueChange?.(() => value);
    // console.log(value)
    // console.log("click", Object.values(suggestions).filter(p => {
    //   // console.log(value, searchValue)
    //   return p[fieldName] === value
    // }))
    console.log(suggestions);
    setSelectedValueData?.(
      () => Object.values(suggestions).filter((p) => p[fieldName] === value)[0],
    );
  };

  // remove enter key submit
  const checkKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") e.preventDefault();
  };

  return (
    <div className="autocomplete" style={{ marginBottom: "1rem" }}>
      <Input
        id={id}
        label={label}
        size={size}
        value={searchValue}
        handleValueChange={setSearchValue}
        onKeyDown={checkKeyDown}
        usageInfoText={usageInfoText}
        {...props}
      />
      {searchValue !== selectedValue && (
        <Suggestions
          searchValue={searchValue}
          fieldName={fieldName}
          suggestions={suggestions}
          maxSuggestions={maxSuggestions}
          setSelectedValue={handleOptionClick}
        />
      )}
    </div>
  );
}

function Suggestions({
  searchValue,
  fieldName,
  suggestions,
  maxSuggestions,
  setSelectedValue,
}: SuggestionsProps) {
  const [selectedSuggestion, setSelectedSuggestion] = useState(0);
  const filteredSuggestions = useMemo(() => {
    if (searchValue.length === 0) {
      return [];
    } else {
      // first get only fieldName key values
      let results = suggestions.map((el: any[]) => el[fieldName]);
      // then filter by search value
      results = results.filter(
        (value: string) =>
          value?.toLowerCase().startsWith(searchValue?.toLowerCase()),
      );
      // and get only keep 0 to maxSuggestions values
      results = results.slice(0, maxSuggestions);

      console.log(results);

      return deleteDublicates(results);
    }
  }, [suggestions]);

  // Accessibility
  useEffect(() => {
    const accessibility = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          setSelectedSuggestion((prev) =>
            prev < filteredSuggestions.length - 1 ? prev + 1 : prev,
          );
          break;
        case "ArrowUp":
          setSelectedSuggestion((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case "Enter":
          setSelectedValue(filteredSuggestions[selectedSuggestion]);
          setSelectedSuggestion(() => 0);
          break;
      }
    };

    window.addEventListener("keydown", accessibility);

    return () => {
      window.removeEventListener("keydown", accessibility);
    };
  }, [selectedSuggestion, filteredSuggestions]);

  return (
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
          onClick={() => setSelectedValue(option)}
        >
          {option}
        </Option>
      ))}
    </div>
  );
}

export default AutocompleteInput;
