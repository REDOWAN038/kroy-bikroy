import React from "react"
import Layout from "../../components/Layout/Layout"
import { useWishList } from "../../context/wishlistContext"
import { useAuth } from "../../context/auth"
import { useNavigate } from "react-router-dom"
import { message } from "antd"
const WishList = () => {
  const [auth, setAuth] = useAuth()
  const [wishList, setWishList] = useWishList()
  const navigate = useNavigate()

  //detele item
  const removeCartItem = (pid) => {
    try {
      let myWishList = [...wishList]
      let index = myWishList.findIndex((item) => item._id === pid)
      myWishList.splice(index, 1)
      setWishList(myWishList)
      localStorage.setItem("wishlist", JSON.stringify(myWishList))
    } catch (error) {
      console.log(error)
    }
  }

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
                ? wishList?.length
                  ? `You Have ${wishList.length} items in your wishlist`
                  : " Your WishList Is Empty"
                : message.error("please login to see wishlist")}
            </h4>
          </div>
        </div>
        <div className='row'>
          <div>
            {wishList?.map((p) => (
              <div className='row mb-2 p-3 card flex-row'>
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
                    onClick={() => removeCartItem(p._id)}
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
