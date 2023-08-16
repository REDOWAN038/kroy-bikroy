import React, { useEffect, useRef, useState } from "react"
import {
  AiOutlineMessage,
  AiOutlineHeart,
  AiOutlineShoppingCart,
  AiOutlineSearch,
  AiOutlinePlusCircle,
  AiOutlineUser,
} from "react-icons/ai"
import { NavLink, Link } from "react-router-dom"
import logo from "../../images/logo1.png"
import Category from "./Category"
import { useAuth } from "../../context/auth"
import SearchInput from "../Form/SearchInput"
import { ChatState } from "../../context/chatProvider"

const Header = () => {
  const [auth, setAuth] = useAuth()
  const [showOptions, setShowOptions] = useState(false)
  const {
    setSelectedChat,
    setUser,
    setChats,
  } = ChatState();

  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    })
    localStorage.removeItem("auth")
    setSelectedChat('');
    setUser(null);
    setChats([]);
  }

  // Example counts
  const cartCount = 3
  const messageCount = 15
  const wishlistCount = 2

  return (
    <>
      <header className='header'>
        <Link to='/' className='logo'>
          <img src={logo} alt='Kroy-Bikroy Logo' className='logo-img' />
        </Link>
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
            <NavLink to='/inbox/user' className='icon-navlink'>
              <AiOutlineMessage />
            </NavLink>
            {messageCount > 0 && (
              <span className='count-badge'>{messageCount}</span>
            )}
          </div>
          <div className='icon'>
            <NavLink to='/wishlist' className='icon-navlink'>
              <AiOutlineHeart />
            </NavLink>
            {wishlistCount > 0 && (
              <span className='count-badge'>{wishlistCount}</span>
            )}
          </div>
          <div className='icon'>
            <NavLink to='/cart' className='icon-navlink'>
              <AiOutlineShoppingCart />
            </NavLink>
            {cartCount > 0 && <span className='count-badge'>{cartCount}</span>}
          </div>
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
                          auth?.user?.role === 1 ? "admin" : "user"
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
