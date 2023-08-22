import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
// import Contact from "./pages/Contact"
// import Policy from "./pages/Policy"
import PageNotFound from "./pages/PageNotFound"
import Register from "./pages/auth/Register"
import Login from "./pages/auth/Login"
import Dashboard from "./pages/user/Dashboard"
import PrivateRoute from "./components/Routes/Private"
import AdminRoute from "./components/Routes/AdminRoute"
import AdminDashboard from "./pages/admin/AdminDashboard"
import CreateCategory from "./pages/admin/CreateCategory"
import Users from "./pages/admin/Users"
import Profile from "./pages/user/Profile"
import YourProducts from "./pages/user/YourProducts"
import CreateProduct from "./pages/user/CreateProduct"
import Products from "./pages/admin/Products"
import UpdateProduct from "./pages/user/UpdateProduct"
import Search from "./pages/Search"
import ProductDetails from "./pages/ProductDetails"
import Chat from "./pages/Chat"
import WishList from "./pages/user/WishList"

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/inbox' element={<Chat />} />
        <Route path='/wishlist' element={<WishList />} />
        <Route path='/product/:slug' element={<ProductDetails />} />
        <Route path='/about' element={<About />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/search' element={<Search />} />
        <Route path='/dashboard' element={<PrivateRoute />}>
          <Route path='user' element={<Dashboard />} />
          <Route path='user/profile' element={<Profile />} />
          <Route path='user/your-products' element={<YourProducts />} />
          <Route path='user/create-product' element={<CreateProduct />} />
          <Route path='user/product/:slug' element={<UpdateProduct />} />
        </Route>
        <Route path='/dashboard' element={<AdminRoute />}>
          <Route path='admin' element={<AdminDashboard />} />
          <Route path='admin/users' element={<Users />} />
          <Route path='admin/create-category' element={<CreateCategory />} />
          <Route path='admin/products' element={<Products />} />
        </Route>

        {/* <Route path='/contact' element={<Contact />} /> 
        <Route path='/policy' element={<Policy />} /> */}
        <Route path='*' element={<PageNotFound />} />
      </Routes>
    </>
  )
}

export default App
