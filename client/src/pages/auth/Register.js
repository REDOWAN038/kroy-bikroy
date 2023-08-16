import React, { useEffect, useRef, useState } from "react"
import Layout from "../../components/Layout/Layout"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"

const Register = () => {
  const emailInputRef = useRef(null)
  const passwordInputRef = useRef(null)
  const regNoInputRef = useRef(null)
  const nameInputRef = useRef(null)
  const phoneInputRef = useRef(null)
  // const [email, setEmail] = useState("")
  // const [password, setPassword] = useState("")
  // const [reg_no, setRegNo] = useState("")
  // const [name, setName] = useState("")
  // const [phone, setPhone] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    regNoInputRef.current.focus()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const email = emailInputRef.current.value
      const password = passwordInputRef.current.value
      const name = nameInputRef.current.value
      const phone = phoneInputRef.current.value
      const reg_no = regNoInputRef.current.value
      //console.log(regNo, email, name, phone, password)
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/auth/register`,
        {
          reg_no,
          email,
          name,
          phone,
          password,
        }
      )
      if (res.data.success) {
        //toast.success(res.data.message)
        console.log("success")
        navigate("/login")
      } else {
        console.log("error")
        //toast.error(res.data.message)
      }
    } catch (error) {
      console.log(error)
      // toast.error("something went wrong")
    }
  }
  return (
    <Layout>
      <div className='container' id='container'>
        <div className='form-container sign-in-container'>
          <form onSubmit={handleSubmit}>
            <h1>Sign Up</h1>
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
              type='text'
              name='text'
              placeholder='Registration No.'
              ref={regNoInputRef}
              // value={reg_no}
              // onChange={(e) => setRegNo(e.target.value)}
              required
            />
            <input
              type='email'
              name='email'
              placeholder='Email'
              ref={emailInputRef}
              // value={email}
              // onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type='text'
              name='text'
              placeholder='Full Name'
              ref={nameInputRef}
              // value={name}
              // onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type='text'
              name='text'
              placeholder='Phone No.'
              ref={phoneInputRef}
              // value={phone}
              // onChange={(e) => setPhone(e.target.value)}
              required
            />
            <input
              type='password'
              name='password'
              placeholder='Password'
              ref={passwordInputRef}
              // value={password}
              // onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type='submit' style={{ marginBottom: "10px" }}>
              Sign Up
            </button>
            <span>
              Already have an account?
              <Link to='/login' className='signup-link'>
                Sign In
              </Link>
            </span>
          </form>
        </div>
        <div className='overlay-container'>
          <div className='overlay'>
            <div className='overlay-panel overlay-right'>
              <h1>Hello There!</h1>
              <p>If you want to buy or sell any items, sign up here</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Register
