import React, { useEffect, useState } from "react"
import Layout from "../components/Layout/Layout"
import axios from "axios"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCommentDots } from "@fortawesome/free-regular-svg-icons"
import {
  faPhone,
  faBangladeshiTakaSign,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons"
import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useWishList } from "../context/wishlistContext"
import { message } from "antd"
import { useAuth } from "../context/auth"
import { useChat } from "../context/chatContext"

const ProductDetails = () => {
  const params = useParams()
  const [wishList, setWishList] = useWishList()
  const [auth] = useAuth()

  const [product, setProduct] = useState({})
  const [relatedProducts, setRelatedProducts] = useState([])
  const [sellerName, setSellerName] = useState("")
  const [sellerPhone, setSellerPhone] = useState("")
  const [imageId, setImageId] = useState("")

  const navigate = useNavigate()

  const [loadingChat, setLoadingChat] = useState(false)
  const { setSelectedChat, notification, setNotification, chats, setChats } =
    useChat()

  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`
      )
      setImageId("1")
      setProduct(data?.product)
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
            setSellerPhone(user.phone)
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

  const copyToClipboard = () => {
    const textarea = document.createElement("textarea")
    textarea.value = sellerPhone
    textarea.setAttribute("readonly", "") // Make it read-only to prevent keyboard popup on mobile devices
    textarea.style.position = "absolute"
    textarea.style.left = "-9999px" // Move it off-screen

    // Append the textarea to the document
    document.body.appendChild(textarea)

    // Select the text in the textarea
    textarea.select()

    try {
      // Execute the copy command
      document.execCommand("copy")
      message.success("phone number copied to clipboard")
    } catch (error) {
      console.error("Copy to clipboard failed: ", error)
    } finally {
      // Clean up by removing the textarea from the document
      document.body.removeChild(textarea)
    }
  }

  return (
    <Layout>
      <div className='product-details-container'>
        <div className='product-details-row'>
          <div className='product-details-col'>
            <div className='product-selected-img'>
              <img
                src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}/${imageId}`}
                alt='product_image'
              />
            </div>

            <div className='product-small-img-row'>
              <div className='product-small-img-col'>
                <img
                  src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}/1`}
                  alt='product_image_1'
                  className='img-fluid'
                  onClick={() => setImageId("1")}
                />
              </div>
              <div className='product-small-img-col'>
                <img
                  src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}/2`}
                  alt='product_image_2'
                  className='img-fluid'
                  onClick={() => setImageId("2")}
                />
              </div>
              <div className='product-small-img-col'>
                <img
                  src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}/3`}
                  alt='product_image_3'
                  className='img-fluid'
                  onClick={() => setImageId("3")}
                />
              </div>
              <div className='product-small-img-col'>
                <img
                  src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}/4`}
                  alt='product_image_4'
                  className='img-fluid'
                  onClick={() => setImageId("4")}
                />
              </div>
            </div>
          </div>
          <div className='product-details-col' style={{ marginTop: "-50px" }}>
            <h5>Posted by : {sellerName}</h5>
            {/* <p>by {seller.name}</p> */}
            <h1>{product.name}</h1>
            <h4>
              <FontAwesomeIcon
                icon={faLocationDot}
                size='sm'
                style={{ marginRight: "10px" }}
              />
              {product.address}
            </h4>
            <h1>
              <FontAwesomeIcon
                icon={faBangladeshiTakaSign}
                size='sm'
                style={{ marginRight: "10px" }}
              />
              {product.price}
            </h1>
            <button
              className='btn btn-primary'
              onClick={() => {
                auth?.user
                  ? accessChat(product.seller, product.name)
                  : message.error("Sign In First")
              }}
            >
              <FontAwesomeIcon
                icon={faCommentDots}
                size='lg'
                style={{ marginRight: "10px" }}
              />
              Chat with Seller
            </button>
            <button
              className='btn btn-primary'
              style={{ marginLeft: "10px" }}
              onClick={() => {
                auth?.user ? copyToClipboard() : message.error("Sign In First")
              }}
            >
              <FontAwesomeIcon
                icon={faPhone}
                size='lg'
                style={{ marginRight: "10px" }}
              />
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
