import React, { useState, useEffect } from "react"
import Layout from "../components/Layout/Layout"
// import { useAuth } from "../context/auth"
import { useCategory } from "../context/CategoryContext"
import { AiOutlineHeart } from "react-icons/ai"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useWishList } from "../context/wishlistContext"
import { useAuth } from "../context/auth"
import { message } from "antd"

const Home = () => {
  const { selectedCategoryId, setCategory, selectedCategory } = useCategory()
  const [wishList, setWishList] = useWishList()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [min, setMin] = useState("0")
  const [max, setMax] = useState("1000000000000")
  const [filter, setFilter] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [auth] = useAuth()
  //const [categories, setCategories] = useState([])

  const getAllProducts = async () => {
    try {
      setLoading(true)
      const res = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`
      )
      setLoading(false)

      if (res?.data.success) {
        setProducts(res?.data?.products)
      }
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  // get total products
  const getTotalProducts = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-count`
      )

      if (res?.data?.success) {
        setTotal(res?.data?.total)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getTotalProducts()
  }, [])

  const loadMore = async () => {
    try {
      setLoading(true)
      const res = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`
      )
      setLoading(false)

      if (res?.data?.success) {
        setProducts([...products, ...res?.data?.products])
      }
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  useEffect(() => {
    if (page === 1) return
    loadMore()
    // eslint-disable-next-line
  }, [page])

  const addToWishList = async (productId) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/users/add-wishlist`,
        { productId }
      )

      if (res?.data?.success) {
        const msg = res?.data?.message
        if (msg === "Items Added to WishList") {
          setWishList(wishList + 1)
        }

        message.success(msg)
      } else {
        console.log(res?.data?.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const filterProducts = async () => {
    try {
      setLoading(true)
      const queryParams = {}

      if (min && max) {
        queryParams.min = min
        queryParams.max = max
      }

      if (selectedCategoryId) {
        queryParams.category = selectedCategory
      }

      const params = new URLSearchParams(queryParams)

      const res = await axios.post(
        `${process.env.REACT_APP_API
        }/api/v1/product/filter-products?${params.toString()}`,
        { filter, selectedCategoryId }
      )
      setLoading(false)

      if (res?.data.success) {
        setProducts(res?.data.products)
        setTotal(products.length)
        navigate(`/?${params.toString()}`)
      }
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  useEffect(() => {
    if (!filter && !selectedCategoryId) getAllProducts()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (filter || selectedCategoryId) {
      filterProducts()
    }
    // eslint-disable-next-line
  }, [filter, selectedCategoryId])

  return (
    <Layout>
      <div className='row mt-3'>
        <div className='col-md-2 mt-5'>
          <div className='ms-3'>
            <h3 className='price-heading'>Price</h3>
            <div className='mt-3'>
              <h5 className=''>MIN</h5>
              <div className='input-group mb-3'>
                <input
                  type='text'
                  className='form-control'
                  aria-label="Recipient's username"
                  //placeholder='1'
                  min={1}
                  aria-describedby='basic-addon2'
                  name='min'
                  value={min}
                  onChange={(e) => setMin(e.target.value)}
                />
                <span className='input-group-text' id='basic-addon2'>
                  tk
                </span>
              </div>
            </div>
            <div className='mt-3'>
              <h5 className=''>MAX</h5>
              <div className='input-group mb-3'>
                <input
                  type='text'
                  className='form-control'
                  aria-label="Recipient's username"
                  //placeholder='1000000000000'
                  aria-describedby='basic-addon2'
                  name='max'
                  value={max}
                  onChange={(e) => setMax(e.target.value)}
                />
                <span className='input-group-text' id='basic-addon2'>
                  tk
                </span>
              </div>
            </div>
            <div className='filter-button'>
              <button className='mt-3' onClick={() => setFilter(true)}>
                Filter
              </button>
            </div>
          </div>
        </div>
        <div className='col-md-10'>
          <h1 className='text-center'>All Products</h1>
          <div className='carousel'>
            {products.map((p) => (
              <div className='item' key={p._id}>
                <div className='thumb-wrapper'>
                  <div
                    className='img-box'
                    onClick={() => navigate(`/product/${p.slug}`)}
                  >
                    <img
                      src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}/1`}
                      className='img-fluid'
                      alt='Play Station'
                    />
                  </div>
                  <div className='thumb-content'>
                    {p.name.length <= 25 ? (
                      <h4 onClick={() => navigate(`/product/${p.slug}`)}>
                        {p.name}
                      </h4>
                    ) : (
                      <h4 onClick={() => navigate(`/product/${p.slug}`)}>
                        {p.name.substring(0, 22)}...
                      </h4>
                    )}
                    <h4
                      className='item-price'
                      onClick={() => navigate(`/product/${p.slug}`)}
                    >
                      <span>{p.price} tk</span>
                    </h4>

                    <div
                      className='btn btn-primary'
                      onClick={() => {
                        if (auth.user) {
                          addToWishList(p._id)
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

          <div className='m-2 p-3'>
            {products && products.length < total && (
              <button
                className='btn btn-warning'
                onClick={(e) => {
                  e.preventDefault()
                  setPage(page + 1)
                }}
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Home
