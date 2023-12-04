import AutocompleteInput from "./Autocomplete";

export default {
  title: "Molecules/AutocompleteInput",
  component: AutocompleteInput,
};

export const Default = {
  args: {
    label: "Autocomplete",
    size: "large",
    url: `${import.meta.env.VITE_FLORE_API_URL}/api/plants`,
    fieldName: "scientific_name",
    maxSuggestions: 10,
  },
};
