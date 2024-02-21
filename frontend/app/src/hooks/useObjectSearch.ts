import { useMemo } from "react";

type UseSearchArgs<T> = {
  data: T[] | undefined;
  fieldName: keyof T;
  subField?: keyof T[keyof T];
  searchInput: string;
};

function useObjectSearch<T>({
  data,
  fieldName,
  subField,
  searchInput,
}: UseSearchArgs<T>) {
  const filteredData = useMemo(() => {
    if (searchInput != "") {
      return data?.filter((obj) => {
        let fieldData = obj[fieldName] as string;
        if (subField) {
          fieldData = obj[fieldName][subField] as string;
        }
        // console.log(fieldData);
        return (
          fieldData.toLowerCase().startsWith(searchInput.toLowerCase()) ||
          fieldData.toLowerCase().includes(searchInput.toLowerCase())
        );
      });
    }
    return data;
  }, [searchInput, data]);

  return filteredData;
}

export default useObjectSearch;
