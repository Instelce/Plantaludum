/* eslint-disable no-unused-vars */
import React, { SetStateAction } from "react";
import { SizeProp } from "../../../types/helpers";

export type AutocompleteInputProps = {
  id?: string;
  label: string;
  size: SizeProp;
  url: string;
  fieldName: string;
  maxSuggestions?: number;
  handleValueChange?: (value: string) => void | null;
  setValidValue?: (value: boolean) => void | null;
  setSelectedValueData?: (value: any) => void | null;
  usageInfoText?: string | null;
  resetFieldOnSubmit?: boolean;
  hasResetButton?: boolean;
};
