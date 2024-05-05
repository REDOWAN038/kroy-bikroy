import React, { useEffect, useState } from "react"
import Layout from "../../components/Layout/Layout"
import AdminMenu from "../../components/Layout/AdminMenu"
import axios from "axios"
import CategoryForm from "../../components/Form/CategoryForm"
import { Modal } from "antd"
import { message } from "antd"

const CreateCategory = () => {
  const [categories, setCategories] = useState([])
  const [name, setName] = useState("")
  const [visible, setVisible] = useState(false)
  const [selected, setSelected] = useState(null)
  const [updatedName, setUpdatedName] = useState("")

  // creating category function
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/category/create-category`,
        { name }
      )

      if (res.data.success) {
        getAllCategories()
        setName("Enter New Category")
        window.location.reload()
        message.success(`${name} category created`)
      }

      if (res.status === 200) {
        message.info("Already Available")
        setName("Enter New Category")
      }
    } catch (error) {
      console.log(error)
    }
  }

  // update function
  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/category/update-category/${selected._id}`,
        { name: updatedName }
      )

      if (res.data.success) {
        message.success("Category Updated")
        setSelected(null)
        setUpdatedName("")
        setVisible(false)
        getAllCategories()
      }
    } catch (error) {
      console.log(error)
    }
  }

  // delete function

  const handleDelete = async (id, name) => {
    try {
      const answer = window.confirm(
        `are you sure you want to delete category ${name}? This action will delete all the products related to category ${name}`
      )
      if (!answer) return

      const res = await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/category/delete-category/${id}`
      )

      if (res.data.success) {
        message.success(`${name} category deleted`)
        getAllCategories()
        window.location.reload()
      }
    } catch (error) {
      console.log(error)
    }
  }

  // fetching categories function

  const getAllCategories = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/category/get-category`
      )
      if (res.data.success) {
        //console.log(data.size)
        setCategories(res.data.category)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getAllCategories()
  }, [])
  return (
    <Layout>
      <div className='container-fluid m-3 p-3'>
        <div className='row'>
          <div className='col-md-3'>
            <AdminMenu />
          </div>
          <div className='col-md-9'>
            <h1>Manage Category</h1>
            <div className='p-3 w-50'>
              <CategoryForm
                handleSubmit={handleSubmit}
                value={name}
                setValue={setName}
              />
            </div>
            <div className='w-75'>
              <table className='table'>
                <thead>
                  <tr>
                    <th scope='col'>Name</th>
                    <th scope='col'>Manage</th>
                  </tr>
                </thead>
                <tbody>
                  {categories?.map((c) => (
                    <>
                      <tr>
                        <td key={c._id}>{c.name}</td>
                        <td>
                          <button
                            className='btn btn-primary ms-2'
                            onClick={() => {
                              setVisible(true)
                              setUpdatedName(c.name)
                              setSelected(c)
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className='btn btn-danger ms-2'
                            onClick={() => handleDelete(c._id, c.name)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Modal
            onCancel={() => setVisible(false)}
            footer={null}
            visible={visible}
          >
            <CategoryForm
              value={updatedName}
              setValue={setUpdatedName}
              handleSubmit={handleUpdate}
            />
          </Modal>
        </div>
      </div>
    </Layout>
  )
}

export default CreateCategory
