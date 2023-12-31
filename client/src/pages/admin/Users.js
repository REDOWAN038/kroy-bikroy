import React, { useEffect, useState } from "react"
import Layout from "../../components/Layout/Layout"
import AdminMenu from "../../components/Layout/AdminMenu"
import axios from "axios"
import { message } from "antd"

const Users = () => {
  const [users, setUsers] = useState([])

  const getUsers = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/users/get-users`
      )

      //console.log(res?.data?.users)

      if (res?.data?.success) {
        setUsers(res?.data?.users)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleDelete = async (sellerId) => {
    try {
      let answer = window.prompt("are you sure?")
      if (!answer) return
      const res = await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/users/remove-user/${sellerId}`
      )

      if (res?.data?.success) {
        message.success(res?.data?.message)
        window.location.reload()
      } else {
        message.error(res?.data?.message)
      }
    } catch (error) {
      message.error("something went wrong")
    }
  }

  useEffect(() => {
    getUsers()
  }, [])
  return (
    <Layout>
      <div className='container-fluid m-3 p-3'>
        <div className='row'>
          <div className='col-md-3'>
            <AdminMenu />
          </div>
          <div className='col-md-9'>
            <h1 className='text-center'>All Users</h1>
            <table class='table mt-5'>
              <thead>
                <tr>
                  <th scope='col'>Email</th>
                  <th scope='col'>Name</th>
                  <th scope='col'>Phone</th>
                  <th scope='col'>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map(
                  (user) =>
                    user.role == 0 && (
                      <tr key={user._id}>
                        <th scope='row'>{user.email}</th>
                        <td>{user.name}</td>
                        <td>{user.phone}</td>
                        <td>
                          <button
                            className='btn btn-danger ms-2'
                            onClick={() => handleDelete(user._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Users
