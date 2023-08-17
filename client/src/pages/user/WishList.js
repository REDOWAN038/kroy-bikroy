import React, { useEffect, useState } from "react"
import Layout from "../../components/Layout/Layout"
import { useWishList } from "../../context/wishlistContext"
import { useAuth } from "../../context/auth"
import { useNavigate } from "react-router-dom"
import { message } from "antd"
import axios from "axios"

const WishList = () => {
  const [auth, setAuth] = useAuth()
  const [wishList, setWishList] = useWishList()
  const [products, setProducts] = useState([])
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
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getWishListItems()
  }, [])

  return (
    <Layout>
      <div className='container'>
        <div className='row'>
          <div className='col-md-12'>
            {/* <h1 className='text-center bg-light p-2 mb-1'>
              {`Hello ${auth?.token && auth?.user?.name}`}
            </h1> */}
            <h4 className='text-center'>
              {auth?.token
                ? wishList
                  ? `You Have ${wishList} items in your wishlist`
                  : " Your WishList Is Empty"
                : message.error("please login to see wishlist")}
            </h4>
          </div>
        </div>
        <div className='row'>
          <div>
            {products?.map((p) => (
              <div
                className='row mb-2 p-3 card flex-row'
                onClick={() => navigate(`/product/${p.slug}`)}
                style={{ cursor: "pointer" }}
              >
                <div className='col-md-4'>
                  <img
                    src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                    className='card-img-top'
                    alt={p.name}
                    width='100px'
                    height={"150px"}
                  />
                </div>
                <div className='col-md-8'>
                  <p>Name : {p.name}</p>
                  <p>Price : {p.price} tk</p>
                  <p>Address : {p.address}</p>
                  <button
                    className='btn btn-danger'
                    onClick={(e) => {
                      e.stopPropagation() // Prevent event propagation
                      removeFromWishlist(p._id)
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default WishList
