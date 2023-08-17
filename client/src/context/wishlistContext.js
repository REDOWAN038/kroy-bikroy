import { useState, useContext, createContext, useEffect } from "react"
import axios from "axios"
import { useAuth } from "./auth"

const WishListContext = createContext()
const WishListProvider = ({ children }) => {
  const [wishList, setWishList] = useState()
  const auth = useAuth()

  const getWishLists = async () => {
    try {
      //let auth = localStorage.getItem("auth")
      const pp = localStorage.getItem("auth")
      const pauth = JSON.parse(pp)
      //console.log("wish " + pauth)
      const userId = pauth?.user?.id
      //console.log(typeof userId)
      const res = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/users/get-wishlists`,
        { params: { userId } }
      )

      if (res?.data?.success) {
        console.log(res?.data?.wishlists?.length)
        setWishList(res?.data?.wishlists?.length)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getWishLists()
  }, [auth?.user])

  return (
    <WishListContext.Provider value={[wishList, setWishList]}>
      {children}
    </WishListContext.Provider>
  )
}

// custom hook
const useWishList = () => useContext(WishListContext)

export { useWishList, WishListProvider }
