import React, { useState } from "react"
import Layout from "./../components/Layout/Layout"
import { useSearch } from "../context/SearchContext"
import { useNavigate } from "react-router-dom"
import { useWishList } from "../context/wishlistContext"
import { useAuth } from "../context/auth"
import { message } from "antd"
import axios from "axios"

const Search = () => {
  const [search, setSearch] = useSearch()
  const [min, setMin] = useState("0")
  const [max, setMax] = useState("100000")
  const [filter, setFilter] = useState(false)
  const [wishList, setWishList] = useWishList()
  const [auth] = useAuth()

  const navigate = useNavigate()

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

  return (
    <Layout>
      <div className='row mt-3'>
        {/* <div className='col-md-3 mt-5'>
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
        </div> */}
        <div className='col-md-12'>
          <div className='text-center'>
            <h1>Search Results</h1>
            <h6>
              {search?.results.length < 1
                ? "No Products Found"
                : `Found ${search?.results.length}`}
            </h6>
          </div>
          <div className='carousel'>
            {search?.results?.map((p) => (
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
        </div>
      </div>
    </Layout>
  )
}

export default Search
