import { useState, useEffect, useContext, createContext } from "react"
import axios from "axios"

const authContext = createContext()

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  })

  //default axios
  axios.defaults.headers.common["Authorization"] = auth?.token

  useEffect(() => {
    const data = localStorage.getItem("auth")
    if (data) {
      const parseData = JSON.parse(data)
      setAuth({
        ...auth,
        user: parseData.user,
        token: parseData.token,
      })
    }
  }, [])

  return (
    <authContext.Provider value={[auth, setAuth]}>
      {children}
    </authContext.Provider>
  )
}

const useAuth = () => useContext(authContext)

export { useAuth, AuthProvider }
