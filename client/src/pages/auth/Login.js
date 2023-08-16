import React, { useEffect, useRef, useState } from "react"
import Layout from "../../components/Layout/Layout"
import { Link, useNavigate, useLocation } from "react-router-dom"
import axios from "axios"
import { useAuth } from "../../context/auth"

const Login = () => {
  const emailInputRef = useRef(null)
  const passwordInputRef = useRef(null)
  // const [email, setEmail] = useState("")
  // const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const location = useLocation()
  const [auth, setAuth] = useAuth()

  useEffect(() => {
    emailInputRef.current.focus()
  }, [])

  useEffect(() => {
    
    if(auth?.user?.id) navigate(-1);
  }, [auth, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const email = emailInputRef.current.value
      const password = passwordInputRef.current.value
      // console.log(email, password)
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/auth/login`,
        {
          email,
          password,
        }
      )
      console.log(res.data);
      if (res.data.success) {
        //toast.success(res.data.message)
        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        })
        localStorage.setItem("auth", JSON.stringify(res.data))
        navigate(location.state || "/")
      } else {
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
            <h1>Sign In</h1>
            <div className='social-container'>
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
            <span>or use your account</span>
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
              type='password'
              name='password'
              placeholder='Password'
              ref={passwordInputRef}
              // value={password}
              // onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Link to='#' className='forgot-password'>
              Forgot Your Password
            </Link>
            <button type='submit' style={{ marginBottom: "10px" }}>
              Sign In
            </button>
            <span>
              Don't have an account?
              <Link to='/register' className='signup-link'>
                Sign Up
              </Link>
            </span>
          </form>
        </div>
        <div className='overlay-container'>
          <div className='overlay'>
            <div className='overlay-panel overlay-right'>
              <h1>Welcome Back!</h1>
              <p>
                To keep connected with us please login with your personal info
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Login
