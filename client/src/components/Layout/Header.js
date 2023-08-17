import React, { useEffect, useRef, useState } from "react"
import {
  AiOutlineMessage,
  AiOutlineHeart,
  AiOutlineSearch,
  AiOutlinePlusCircle,
  AiOutlineUser,
} from "react-icons/ai"
import { NavLink, Link } from "react-router-dom"
import logo from "../../images/logo1.png"
import Category from "./Category"
import { useWishList } from "../../context/wishlistContext"
import { useAuth } from "../../context/auth"
import SearchInput from "../Form/SearchInput"
import { message } from "antd"
import { useNavigate } from "react-router-dom"
import WishList from "../../pages/user/WishList"
import WishlistDropdown from "../../pages/user/WishlistDropdown"
import axios from "axios"

const Header = () => {
  const [auth, setAuth] = useAuth()
  const [wishList, setWishList] = useWishList()
  const [products, setProducts] = useState([])
  const [showOptions, setShowOptions] = useState(false)
  const [isDropdownVisible, setIsDropdownVisible] = useState(false)

  const navigate = useNavigate()

  //detele item
  const removeFromWishlist = async (productId) => {
    try {
      const pp = localStorage.getItem("auth")
      const pauth = JSON.parse(pp)
      const userId = pauth?.user?.id
      const res = await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/users/remove-from-wishlist`,
        {
          data: { userId: userId, productId: productId },
        }
      )

      if (res?.data?.success) {
        setWishList(res?.data?.updatedWishlist?.length)
        getWishListItems()
        message.success(res?.data?.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getWishListItems = async () => {
    try {
      const pp = localStorage.getItem("auth")
      const pauth = JSON.parse(pp)
      const userId = pauth?.user?.id
      const res = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/users/get-wishlists`,
        { params: { userId } }
      )

      if (res?.data?.success) {
        setProducts(res?.data?.wishlists)
        setIsDropdownVisible(true) // Show the dropdown when fetching items
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    })

    localStorage.removeItem("auth")
    setWishList(0)
    message.success("Logout Successfully")
  }

  // Example counts
  //const cartCount = 3
  const messageCount = 15

  const handleClick = () => {
    navigate("/")
    window.location.reload()
  }

  return (
    <>
      <header className='header'>
        <div
          className='logo'
          onClick={() => handleClick()}
          style={{ cursor: "pointer" }}
        >
          <img src={logo} alt='Kroy-Bikroy Logo' className='logo-img' />
        </div>
        {/* <div className='search-box'> */}
        <SearchInput />
        {/* <input
            type='text'
            placeholder='Enter the product name...'
            ref={searchInputRef}
            className='search-input'
          />
          <div className='search-icon'>
            <AiOutlineSearch />
          </div> */}
        {/* </div> */}
        <div className='icons'>
          <div className='icon'>
            <NavLink
              to='/dashboard/user/create-product'
              className='icon-navlink'
            >
              <AiOutlinePlusCircle />
            </NavLink>
          </div>
          <div className='icon'>
            <NavLink to='/inbox' className='icon-navlink'>
              <AiOutlineMessage />
            </NavLink>
            {messageCount > 0 && (
              <span className='count-badge'>{messageCount}</span>
            )}
          </div>
          <div className='icon'>
            <div
              className='icon-navlink'
              onMouseEnter={getWishListItems}
              onMouseLeave={() => setIsDropdownVisible(false)} // Hide the dropdown when mouse leaves
            >
              <AiOutlineHeart />
              {isDropdownVisible && products.length > 0 && (
                <WishlistDropdown
                  wishlistItems={products}
                  removeFromWishlist={removeFromWishlist}
                />
              )}
            </div>
            {wishList > 0 && <span className='count-badge'>{wishList}</span>}
          </div>

          {/* <div className='icon'>
            <div className='icon-navlink'>
              <AiOutlineHeart
                onClick={() => {
                  if (!auth.user) {
                    message.error("please login to see wishlist")
                  } else {
                    if (wishList) {
                      navigate("/wishlist")
                    } else {
                      message.error("your wishlist is empty")
                    }
                  }
                }}
              />
            </div>
            {wishList > 0 && <span className='count-badge'>{wishList}</span>}
          </div> */}

          <div
            className='icon'
            onMouseEnter={() => setShowOptions(true)}
            onMouseLeave={() => setShowOptions(false)}
          >
            <NavLink to='' className='icon-navlink'>
              <AiOutlineUser />
            </NavLink>
            {showOptions && (
              <ul className='options-list'>
                {!auth.user ? (
                  <>
                    <li>
                      <Link to='/login' className='option-link'>
                        Sign In
                      </Link>
                    </li>

                    <li>
                      <Link to='/register' className='option-link'>
                        Sign Up
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link
                        to={`/dashboard/${
                          auth?.user?.role === 1
                            ? "admin/profile"
                            : "user/profile"
                        }`}
                        className='option-link'
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        to='/login'
                        className='option-link'
                        onClick={handleLogout}
                      >
                        Logout
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            )}
          </div>
        </div>
      </header>
      <Category />
    </>
  )
}

export default Header
