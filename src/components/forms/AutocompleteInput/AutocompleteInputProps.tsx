import React, {SetStateAction} from "react";

export type AutocompleteInputProps = {
  id: string,
  label: string;
  size: "small" | "medium" | "large"; // Define the available sizes
  url: string;
  fieldName: string;
  maxSuggestions?: number;
  handleValueChange: React.Dispatch<React.SetStateAction<string>> | null;
  setValidValue?: React.Dispatch<SetStateAction<boolean>> | null;
  setSelectedValueData?: React.Dispatch<SetStateAction<any>> | null;
  usageInfoText?: string | null;
};

export type SuggestionsProps = {
  searchValue: string;
  fieldName: string;
  suggestions: any;
  maxSuggestions: number;
  setSelectedValue: React.Dispatch<React.SetStateAction<string>>;
}
