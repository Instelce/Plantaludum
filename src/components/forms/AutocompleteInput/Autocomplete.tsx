import "./Autocomplete.scss";
import Input from "../Input/index.jsx";
import React, {
  ReactNode,
  SetStateAction,
  useEffect,
  useMemo,
  useState
} from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Option from "../Option/index.jsx";
import useDebounce from "../../../hooks/useDebounce.js";
import axios from "axios";
import { deleteDublicates } from "../../../utils/helpers";

type AutocompleteInputProps = {
  label: string;
  size: "small" | "medium" | "large"; // Define the available sizes
  url: string;
  fieldName: string;
  maxSuggestions?: number;
  handleValueChange: React.Dispatch<React.SetStateAction<string>> | null;
  setValidValue?: React.Dispatch<SetStateAction<boolean>> | null; // Adjust the type to match expected values
  setSelectedValueData?: (value: any) => void | null; // Adjust the type to match expected values
  usageInfoText?: string | null;
};

function AutocompleteInput({
  label,
  size,
  url,
  fieldName,
  maxSuggestions = 10,
  handleValueChange,
  setValidValue = null,
  setSelectedValueData = null,
  usageInfoText = null,
}: AutocompleteInputProps) {
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState(null);
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

  // set autocomplete to invalid
  useEffect(() => {
    if (searchValue !== selectedValue) {
      setValidValue?.(() => false);
    }
  }, [searchValue]);

  const handleOptionClick = (value) => {
    setSelectedValue(() => value);
    setSearchValue(() => value);
    setValidValue?.(() => value);
    handleValueChange(() => value);
    // console.log(value)
    // console.log("click", Object.values(suggestions).filter(p => {
    //   // console.log(value, searchValue)
    //   return p[fieldName] === value
    // }))
    setSelectedValueData?.(
      () => Object.values(suggestions).filter((p) => p[fieldName] === value)[0],
    );
  };

  // remove enter key submit
  const checkKeyDown = (e) => {
    if (e.key === "Enter") e.preventDefault();
  };

  return (
    <div className="autocomplete" style={{ marginBottom: "1rem" }}>
      <Input
        label={label}
        size={size}
        value={searchValue}
        handleValueChange={setSearchValue}
        onKeyDown={checkKeyDown}
        mb="0"
        usageInfoText={usageInfoText}
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

AutocompleteInput.propTypes = {
  label: PropTypes.string,
  size: PropTypes.oneOf(["sm", "md", "lg", "big"]),
  url: PropTypes.string,
  fieldName: PropTypes.string,
  maxSuggestions: PropTypes.number,
  handleValueChange: PropTypes.func,
  setValidValue: PropTypes.func,
  usageInfoText: PropTypes.string,
};

type SuggestionsProps = {
  searchValue: string;
  fieldName: string;
  suggestions: any;
  maxSuggestions: number;
  setSelectedValue: React.Dispatch<React.SetStateAction<string>>;
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
      let results = suggestions.map((el) => el[fieldName]);
      // then filter by search value
      results = results.filter(
        (value) => value?.toLowerCase().startsWith(searchValue?.toLowerCase()),
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
          index={index}
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
