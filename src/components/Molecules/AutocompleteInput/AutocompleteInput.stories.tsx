import AutocompleteInput from "./Autocomplete";
import PropTypes from "prop-types";

export default {
  title: "Components/Forms/AutocompleteInput",
  component: AutocompleteInput,
};

export const Default = {
  args: {
    label: "Autocomplete",
    size: "big",
    url: `${import.meta.env.VITE_FLORE_API_URL}/api/plants`,
    fieldName: "scientific_name",
    maxSuggestions: 10,
    // handleValueChange: ,
    // setValidValue:
  },
};
