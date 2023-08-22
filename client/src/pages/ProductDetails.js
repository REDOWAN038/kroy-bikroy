import React, { useEffect, useState } from "react"
import Layout from "../components/Layout/Layout"
import axios from "axios"
import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useWishList } from "../context/wishlistContext"
import { message } from "antd"
import { useAuth } from "../context/auth"
import { useChat } from "../context/chatContext"

import { CiLocationOn } from "react-icons/ci"
import { TbCurrencyTaka } from "react-icons/tb"
import { BiPhoneCall } from "react-icons/bi"
import { AiOutlineMessage } from "react-icons/ai"

const ProductDetails = () => {
  const params = useParams()
  const [wishList, setWishList] = useWishList()
  const [auth] = useAuth()

  const [product, setProduct] = useState({})
  const [relatedProducts, setRelatedProducts] = useState([])
  const [sellerName, setSellerName] = useState("")
  const navigate = useNavigate()

  const [loadingChat, setLoadingChat] = useState(false)
  const { setSelectedChat, notification, setNotification, chats, setChats } =
    useChat()

  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`
      )
      setProduct(data?.product)
      //console.log(product?.seller)
      //console.log(data?.product?.category?._id)
      //getSeller(JSON.parse(product?.seller))
      getSeller(data?.product?.seller)
      getSimilarProduct(data?.product._id, data?.product.category._id)
    } catch (error) {
      console.log(error)
    }
  }

  const getSeller = async (sId) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/users/get-users`
      )

      const users = res?.data?.users
      console.log(sId)

      if (res?.data?.success) {
        users.map((user) => {
          console.log(user)
          if (user._id === sId) {
            //console.log("hurray")
            setSellerName(user.name)
          }
        })
      }

      //console.log(seller)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (params?.slug) {
      getProduct()
    }
  }, [params?.slug])

  //get similar product
  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/related-product/${pid}/${cid}`
      )
      setRelatedProducts(data?.products)
    } catch (error) {
      console.log(error)
    }
  }

  const addToWishList = async (p) => {
    let existingWishListItem = localStorage.getItem("wishlist")
    existingWishListItem = JSON.parse(existingWishListItem)

    if (wishList.length === 0) {
      setWishList([...wishList, p])
      localStorage.setItem("wishlist", JSON.stringify([...wishList, p]))
      message.success("Item Added to Wishlist")
      return
    }

    if (wishList.includes(p)) {
      message.warning("already in the wishlist")
    } else {
      setWishList([...wishList, p])
      localStorage.setItem("wishlist", JSON.stringify([...wishList, p]))
      message.success("Item Added to Wishlist")
      //console.log(wishList)
    }
  }

  const accessChat = async (userId, productName) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/chat`,
        { userId, productName }
      )

      if (data?.status === 200) {
        message.success("chat created")
      }

      if (!chats.find((c) => c._id === data?.chat?._id))
        setChats([data?.chat, ...chats])
      setSelectedChat(data?.chat)
      navigate("/inbox")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Layout>
      <div className='product-details-container'>
        <div className='product-details-row'>
          <div className='product-details-col'>
            <img
              src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`}
              alt='product_image'
              width={"100%"}
            />
          </div>
          <div className='product-details-col'>
            <h5>Posted by : {sellerName}</h5>
            {/* <p>by {seller.name}</p> */}
            <h1>{product.name}</h1>
            <h4>
              <CiLocationOn style={{ marginTop: "-2px" }} />
              {product.address}
            </h4>
            <h1>
              <TbCurrencyTaka style={{ marginTop: "-7px" }} />
              {product.price}
            </h1>
            <button
              className='btn btn-primary'
              onClick={() => accessChat(product.seller, product.name)}
            >
              <AiOutlineMessage style={{ marginRight: "8px" }} />
              Chat with Seller
            </button>
            <button className='btn btn-primary' style={{ marginLeft: "10px" }}>
              <BiPhoneCall style={{ marginRight: "8px" }} />
              Call Seller
            </button>
            <h3 style={{ marginTop: "10px" }}>Product Details</h3>
            <p>{product.description}</p>
          </div>
        </div>
      </div>
      {/* <div className='row product-container mt-2'>
        <div className='col-md-6 text-center mt-5'>
          <img
            src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`}
            alt='product_image'
            className='img img-responsive'
            height={"300"}
            width={"350px"}
          />
        </div>
        <div className='col-md-6 mt-5'>
          <h1>Product Details</h1>
          <h6>Name : {product.name}</h6>
          <h6>Description : {product.description}</h6>
          <h6>Price : {product.price}</h6>
          <h6>Category : {product?.category?.name}</h6>
          <h6>Address : {product.address}</h6>
          <h6>Seller : {seller.name}</h6>

          <button class='btn btn-secondary ms-1'>ADD TO CART</button>
        </div>
      </div> */}
      <hr />
      <div style={{ marginTop: "40px" }}>
        <h1 style={{ marginLeft: "50px" }}>Similar Products</h1>
        {relatedProducts.length < 1 && (
          <h3 className='text-center'>No Similar Products Found</h3>
        )}
        <div className='carousel'>
          {relatedProducts.map((p) => (
            <div className='item' key={p._id}>
              <div className='thumb-wrapper'>
                <div
                  className='img-box'
                  onClick={() => navigate(`/product/${p.slug}`)}
                >
                  <img
                    src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                    className='img-fluid'
                    alt='Play Station'
                  />
                </div>
                <div className='thumb-content'>
                  <h4 onClick={() => navigate(`/product/${p.slug}`)}>
                    {p.name}
                  </h4>
                  <p
                    className='item-price'
                    onClick={() => navigate(`/product/${p.slug}`)}
                  >
                    <span>{p.price} tk</span>
                  </p>

                  <div
                    className='btn btn-primary'
                    onClick={() => {
                      if (auth.user) {
                        addToWishList(p)
                      } else {
                        message.error("Please Login First")
                      }
                    }}
                  >
                    Add to Wishlist
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default ProductDetails
