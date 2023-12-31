import React, { useState, useEffect } from "react"
import Layout from "../../components/Layout/Layout"
import UserMenu from "../../components/Layout/UserMenu"
import axios from "axios"
import { useAuth } from "../../context/auth"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"

const YourProducts = () => {
  const [auth] = useAuth()
  const [products, setProducts] = useState([])
  const navigate = useNavigate()
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  const getAllProducts = async () => {
    try {
      setLoading(true)
      const res = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/get-products`
      )
      setLoading(false)
      if (res?.data.success) {
        let yourProducts = []
        const getProducts = res?.data.products

        getProducts.map((p) => {
          if (p.seller === auth.user.id) {
            yourProducts.push(p)
          }
        })
        setProducts(yourProducts)
      }
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  useEffect(() => {
    getAllProducts()
    // eslint-disable-next-line
  }, [])

  const handleClick = async (slug) => {
    navigate(`/dashboard/user/product/${slug}`)
  }

  return (
    <Layout>
      <div className='container-fluid m-3 p-3'>
        <div className='row'>
          <div className='col-md-3'>
            <UserMenu />
          </div>
          <div className='col-md-9'>
            <div className='carousel'>
              {products.map((p) => (
                <div
                  className='item'
                  key={p._id}
                  onClick={() => handleClick(p.slug)}
                >
                  <div className='thumb-wrapper'>
                    <div className='img-box'>
                      <img
                        src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}/1`}
                        className='img-fluid'
                        alt={p.name}
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
                      <h4 className='item-price'>
                        <span>{p.price} tk</span>
                      </h4>

                      <h4>{p.address}</h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default YourProducts
