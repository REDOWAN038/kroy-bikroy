import React, { useRef, useEffect } from "react"
import Layout from "../../components/Layout/Layout"
import UserMenu from "../../components/Layout/UserMenu"
import { useAuth } from "../../context/auth"
import axios from "axios"
import { message } from "antd"
import { useNavigate } from "react-router-dom"

const Profile = () => {
  const navigate = useNavigate()
  const [auth, setAuth] = useAuth()
  const emailInputRef = useRef(null)
  const passwordInputRef = useRef(null)
  const nameInputRef = useRef(null)
  const phoneInputRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const email = emailInputRef.current.value
      const password = passwordInputRef.current.value
      const name = nameInputRef.current.value
      const phone = phoneInputRef.current.value

      const res = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/auth/update-profile`,
        {
          email,
          name,
          phone,
          password,
        }
      )
      if (res?.data.success) {
        setAuth({ ...auth, user: res?.data?.updatedUser })
        let ls = localStorage.getItem("auth")
        ls = JSON.parse(ls)
        ls.user = res?.data?.updatedUser
        localStorage.setItem("auth", JSON.stringify(ls))
        message.success("Profile Updated Successfully")
      } else {
        message.error(res.data.message)
      }
    } catch (error) {
      console.log(error)
      message.error("something went wrong")
    }
  }

  useEffect(() => {
    const { email, name, phone, password } = auth?.user
    emailInputRef.current.value = email
    nameInputRef.current.value = name
    phoneInputRef.current.value = phone
    //passwordInputRef.current.value = password
  }, [auth?.user])

  return (
    <Layout>
      <div className='container-fluid m-3 p-3'>
        <div className='row'>
          <div className='col-md-3'>
            <UserMenu />
          </div>
          <div className='col-md-9'>
            <div
              className='container mt-5'
              id='container'
              style={{ marginLeft: "80px" }}
            >
              <div className='form-container user-info-container'>
                <form onSubmit={handleSubmit}>
                  <h1>User Information</h1>

                  <input
                    type='email'
                    name='email'
                    placeholder='Email'
                    ref={emailInputRef}
                    disabled
                  />
                  <input
                    type='text'
                    name='text'
                    placeholder='Full Name'
                    ref={nameInputRef}
                  />
                  <input
                    type='text'
                    name='text'
                    placeholder='Phone No.'
                    ref={phoneInputRef}
                  />
                  <input
                    type='password'
                    name='password'
                    placeholder='Password'
                    ref={passwordInputRef}
                  />

                  <button
                    className='mt-3'
                    type='submit'
                    style={{ marginBottom: "10px" }}
                  >
                    Update
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Profile
