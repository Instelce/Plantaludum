import {useEffect, useState} from "react";


export function useFetch({fetchFunc, method, setHelper}) {
  const [launchRequest, setLaunchRequest] = useState(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [errors, setErrors] = useState(null)
  const [route, setRoute] = useState("")
  const [formData, setFormData] = useState({})
  const [headers, setHeaders] = useState({})

  const launchRequestFunction = (route, formData = {}) => {
    setLoading(prev => true)
    setRoute(prev => route)
    setFormData(prev => formData)
    setLaunchRequest(prev => true)
  }

  useEffect(() => {
    if (launchRequest) {
      if (method === 'GET') {
        fetchFunc.get(route)
          .then(response => {
            setData(response.data)
          }).catch((err) => {
            setErrors(err)
            setHelper?.(() => err.response.data)
            console.log(err.response.data)
          }).finally(() => {
            setLoading(false)
          })
      } else if (method === 'POST') {
        fetchFunc.post(route, formData)
          .then(response => {
            setData(response.data)
          }).catch((err) => {
            setErrors(err)
            setHelper?.(() => err.response.data)
            console.log(err.response.data)
          }).finally(() => {
            setLoading(false)
          })
      }
    }
  }, [launchRequest]);

  return {
    launchRequest: launchRequestFunction,
    loading: loading,
    data: data,
    errors: errors
  }
}
