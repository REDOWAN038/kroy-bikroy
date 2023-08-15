import { useState, useContext, createContext, useEffect } from "react"

const WishListContext = createContext()
const WishListProvider = ({ children }) => {
  const [wishList, setWishList] = useState([])

  useEffect(() => {
    let existingWishListItem = localStorage.getItem("wishlist")
    if (existingWishListItem) setWishList(JSON.parse(existingWishListItem))
  }, [])

  return (
    <WishListContext.Provider value={[wishList, setWishList]}>
      {children}
    </WishListContext.Provider>
  )
}

// custom hook
const useWishList = () => useContext(WishListContext)

export { useWishList, WishListProvider }
