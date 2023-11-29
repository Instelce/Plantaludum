import {useEffect, useMemo, useState} from "react";

type UseSearchArgs<T> = {
  data: T[];
  fieldName: keyof T;
  searchInput: string;
}

function useObjectSearch<T>({data, fieldName, searchInput}: UseSearchArgs<T>) {
  const filteredData = useMemo(() => {
    if (searchInput != "") {
      return data.filter(obj => obj[fieldName].toLowerCase().startsWith(searchInput.toLowerCase()))
    } else {
      return data
    }
  }, [searchInput])

  return filteredData;
}

export default useObjectSearch;