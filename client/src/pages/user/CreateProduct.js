import React, { useState, useEffect } from "react"
import Layout from "../../components/Layout/Layout"
import UserMenu from "../../components/Layout/UserMenu"
import axios from "axios"
import { Select } from "antd"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/auth"
import { message } from "antd"
const { Option } = Select

const CreateProduct = () => {
  const [auth] = useAuth()
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")
  const [address, setAddress] = useState("")
  const [sellerName, setSellerName] = useState("")
  const [sellerId, setSellerId] = useState("")
  //const [available, setAvailable] = useState("")
  const [image1, setImage1] = useState("")
  const [image2, setImage2] = useState("")
  const [image3, setImage3] = useState("")
  const [image4, setImage4] = useState("")

  // fetching categories function

  const getAllCategories = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/category/get-category`
      )
      if (res?.data.success) {
        setCategories(res?.data.category)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getUser = () => {
    let user = localStorage.getItem("auth")
    user = JSON.parse(user)
    console.log(user)
    //console.log(user?.user?.id)
    //console.log(user?.user?.name)
    setSellerId(user?.user?.id)
    setSellerName(user?.user?.name)
  }

  useEffect(() => {
    getAllCategories()
    getUser()
    // getSeller()
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      const productData = new FormData()
      productData.append("name", name)
      productData.append("description", description)
      productData.append("price", price)
      productData.append("category", category)
      productData.append("address", address)
      image1 && productData.append("image1", image1)
      image2 && productData.append("image2", image2)
      image3 && productData.append("image3", image3)
      image4 && productData.append("image4", image4)
      //productData.append("sellerName", sellerName)
      productData.append("seller", sellerId)
      console.log(typeof sellerId)
      console.log(typeof category)
      console.log(productData)

      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/product/create-product`,
        productData
      )

      if (res?.data?.success) {
        //navigate("/dashboard/user/your-products")
        message.success("Item is added to sell")
        navigate("/dashboard/user/your-products")
      }
    } catch (error) {
      message.error("something went wrong")
      console.log(error)
    }
  }

  return (
    <Layout>
      <div className='container-fluid m-3 p-3'>
        <div className='row'>
          <div className='col-md-3'>
            <UserMenu />
          </div>
          <div className='col-md-9'>
            <h1>Add Product to Sell</h1>
            <div className='m-1 w-75'>
              <Select
                bordered={false}
                placeholder='Select a Category'
                size='large'
                showSearch
                className='form-select mb-3'
                onChange={(value) => {
                  setCategory(value)
                }}
                required
              >
                {categories?.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {c.name}
                  </Option>
                ))}
              </Select>
              <div className='mb-3'>
                <input
                  type='text'
                  value={name}
                  placeholder='write a name'
                  className='form-control'
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className='mb-3'>
                <textarea
                  type='text'
                  value={description}
                  placeholder='write a description'
                  className='form-control'
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className='mb-3'>
                <input
                  type='number'
                  min={0}
                  value={price}
                  placeholder='write a Price'
                  className='form-control'
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <div className='mb-3'>
                <input
                  type='text'
                  value={address}
                  placeholder='write product address'
                  className='form-control'
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <div className='row'>
                <div className='col-md-3'>
                  <div className='mb-5'>
                    <label className='btn btn-outline-secondary image-container'>
                      {image1 ? (
                        <img
                          src={URL.createObjectURL(image1)}
                          alt='product_image'
                          className='img img-responsive'
                        />
                      ) : (
                        "Upload Image"
                      )}
                      <input
                        type='file'
                        name='image1'
                        accept='image/*'
                        onChange={(e) => setImage1(e.target.files[0])}
                        hidden
                        required
                      />
                    </label>
                  </div>
                </div>
                <div className='col-md-3'>
                  <div className='mb-5'>
                    <label className='btn btn-outline-secondary image-container'>
                      {image2 ? (
                        <img
                          src={URL.createObjectURL(image2)}
                          alt='product_image'
                          className='img img-responsive'
                        />
                      ) : (
                        "Upload Image"
                      )}
                      <input
                        type='file'
                        name='image2'
                        accept='image/*'
                        onChange={(e) => setImage2(e.target.files[0])}
                        hidden
                        required
                      />
                    </label>
                  </div>
                </div>
                <div className='col-md-3'>
                  <div className='mb-5'>
                    <label className='btn btn-outline-secondary image-container'>
                      {image3 ? (
                        <img
                          src={URL.createObjectURL(image3)}
                          alt='product_image'
                          className='img img-responsive'
                        />
                      ) : (
                        "Upload Image"
                      )}
                      <input
                        type='file'
                        name='image3'
                        accept='image/*'
                        onChange={(e) => setImage3(e.target.files[0])}
                        hidden
                        required
                      />
                    </label>
                  </div>
                </div>
                <div className='col-md-3'>
                  <div className='mb-5'>
                    <label className='btn btn-outline-secondary image-container'>
                      {image4 ? (
                        <img
                          src={URL.createObjectURL(image4)}
                          alt='product_image'
                          className='img img-responsive'
                        />
                      ) : (
                        "Upload Image"
                      )}
                      <input
                        type='file'
                        name='image4'
                        accept='image/*'
                        onChange={(e) => setImage4(e.target.files[0])}
                        hidden
                        required
                      />
                    </label>
                  </div>
                </div>
              </div>
              <div className='mb-3 text-center'>
                <button className='btn btn-primary' onClick={handleCreate}>
                  ADD TO SELL
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default CreateProduct
