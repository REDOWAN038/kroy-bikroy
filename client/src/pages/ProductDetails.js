import React, { useEffect, useState } from "react"
import Layout from "../components/Layout/Layout"
import axios from "axios"
import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"

const ProductDetails = () => {
  const params = useParams()
  const [product, setProduct] = useState({})
  const [relatedProducts, setRelatedProducts] = useState([])
  const navigate = useNavigate()

  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`
      )
      setProduct(data?.product)
      getSimilarProduct(data?.product._id, data?.product.category._id)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (params?.slug) getProduct()
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

  return (
    <Layout>
      <div className='row product-container mt-2'>
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
          <h6>Category : {product?.category?.name}</h6>

          {/* <button class='btn btn-secondary ms-1'>ADD TO CART</button> */}
        </div>
      </div>
      <hr />
      <div style={{ marginTop: "40px" }}>
        <h1 style={{ marginLeft: "50px" }}>Similar Products</h1>
        {relatedProducts.length < 1 && (
          <h3 className='text-center'>No Similar Products Found</h3>
        )}
        <div className='card-container'>
          {relatedProducts.map((p) => (
            <div
              className='card product-card-body m-2'
              style={{ width: "20rem" }}
              key={p._id}
              onClick={() => navigate(`/product/${p.slug}`)}
            >
              <div className='product-card-img'>
                <div className='product-img'>
                  <img
                    src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                    className='card-img-top'
                    alt={p.name}
                    style={{ height: "10rem" }}
                  />
                </div>
              </div>

              <div className='product-card-details'>
                <div className='product-card-details-row'>
                  <h5 className='product-name'>{p.name}</h5>
                  <h5 className='product-price'>{p.price} tk</h5>
                </div>
              </div>
              <p className='product-address'>{p.address}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default ProductDetails
