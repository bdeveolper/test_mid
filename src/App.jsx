import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import About from './pages/About'
import Contact from './pages/Contact'
import AdminLogin from './pages/AdminLogin'
import AdminLayout from './components/admin/AdminLayout'
import AdminProducts from './pages/admin/AdminProducts'
import NewProduct from './pages/admin/NewProduct'
import EditProduct from './pages/admin/EditProduct'
import NotFound from './pages/NotFound'

function CustomerLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="login" element={<AdminLogin />} />
          <Route index element={<AdminProducts />} />
          <Route path="products/new" element={<NewProduct />} />
          <Route path="products/:id" element={<EditProduct />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
