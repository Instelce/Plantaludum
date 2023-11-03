import {useEffect, useState} from "react";


export function useFetch({fetchFunc}) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [errors, setErrors] = useState(null)

  useEffect(() => {
     fetchFunc.then(response => {
      console.log("data", response.data)
      setData(response.data)
    }).catch((err) => {
      setErrors(err)
    }).finally(() => {
      setLoading(false)
    })
  }, []);

  return {
    loading: loading,
    data: data,
    errors: errors
  }
}
