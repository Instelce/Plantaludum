import {useMemo} from "react";

type UseSearchArgs<T> = {
  data: T[] | undefined;
  fieldName: keyof T;
  searchInput: string;
};

function useObjectSearch<T>({
  data,
  fieldName,
  searchInput,
}: UseSearchArgs<T>) {
  const filteredData = useMemo(() => {
    if (searchInput != "") {
      return data?.filter((obj) => {
        const fieldData = obj[fieldName] as string;
        console.log(fieldData);
        return fieldData.toLowerCase().startsWith(searchInput.toLowerCase()) || fieldData.toLowerCase().search(searchInput.toLowerCase()) > -1;
      });
    }
    return data;
  }, [searchInput, data]);

  return filteredData;
}

export default useObjectSearch;
