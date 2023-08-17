import React from "react"
import { useNavigate } from "react-router-dom"
import { ImCross } from "react-icons/im"

const WishlistDropdown = ({ wishlistItems, removeFromWishlist }) => {
  const navigate = useNavigate()
  return (
    <div className='wishlist-dropdown'>
      {wishlistItems.map((p) => (
        <div
          key={p._id}
          className='wishlist-item'
          onClick={() => navigate(`/product/${p.slug}`)}
        >
          <img
            src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
            alt={p.name}
          />
          <div className='wishlist-name'>
            {p.name.length <= 10 ? (
              <p>{p.name}</p>
            ) : (
              <p>{p.name.substring(0, 10)}...</p>
            )}
          </div>
          <div className='wishlist-price'>
            <p>{p.price} tk</p>
          </div>

          <div className='wishlist-btn'>
            <button
              onClick={(e) => {
                e.stopPropagation() // Prevent event propagation
                removeFromWishlist(p._id)
              }}
            >
              <ImCross />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default WishlistDropdown
