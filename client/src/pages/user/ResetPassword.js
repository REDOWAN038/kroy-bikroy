import React, { useEffect, useRef, useState } from "react"
import Layout from "../../components/Layout/Layout"
import { Link, useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import { message } from "antd"

const ResetPassword = () => {
  //const emailInputRef = useRef(null)
  const passwordInputRef = useRef(null)
  //const nameInputRef = useRef(null)
  //const phoneInputRef = useRef(null)
  // const [email, setEmail] = useState("")
  // const [password, setPassword] = useState("")
  // const [reg_no, setRegNo] = useState("")
  // const [name, setName] = useState("")
  // const [phone, setPhone] = useState("")
  const navigate = useNavigate()
  const { id, token } = useParams()

  useEffect(() => {
    passwordInputRef.current.focus()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      //const email = emailInputRef.current.value
      const password = passwordInputRef.current.value
      // const name = nameInputRef.current.value
      //const phone = phoneInputRef.current.value

      //console.log(regNo, email, name, phone, password)
      const res = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/auth/reset-password/${id}/${token}`,
        {
          password,
        }
      )
      if (res.data.success) {
        message.success("password updated")
        //console.log("success")
        navigate("/login")
      } else {
        message.error(res.data.message)

        //toast.error(res.data.message)
      }
    } catch (error) {
      console.log(error)
      message.error("something went wrong")
    }
  }
  return (
    <Layout>
      <div className='container' id='container'>
        <div className='form-container sign-in-container'>
          <form onSubmit={handleSubmit}>
            <h1>Reset Password</h1>
            {/* <div className='social-container'>
              <Link to='#' className='social'>
                <i className='fa fa-facebook' />
              </Link>
              <Link to='#' className='social'>
                <i className='fa fa-google' />
              </Link>
              <Link to='#' className='social'>
                <i className='fa fa-linkedin' />
              </Link>
            </div>
            <span>or use your account</span> */}

            <input
              type='password'
              name='password'
              placeholder='New Password'
              ref={passwordInputRef}
              // value={password}
              // onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type='submit' style={{ marginBottom: "10px" }}>
              Update
            </button>
          </form>
        </div>
        <div className='overlay-container'>
          <div className='overlay'>
            <div className='overlay-panel overlay-right'>
              <h1>Hello There!</h1>
              <p>
                If you want to login again with your account, please give
                password
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ResetPassword
