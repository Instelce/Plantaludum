import useAuth from "./useAuth.js";
import usePrivateFetch from "./usePrivateFetch.js";


function useUser() {
  const {setUser} = useAuth()
  const privateFetch = usePrivateFetch()

  const getUser = async () => {
    try {
      const {data} = await privateFetch.get('auth/user')
      setUser(data)
    } catch (error) {
      console.log("user", error)
    }
  }

  return getUser
}

export default useUser;