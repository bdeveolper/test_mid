import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import About from './pages/About'
import Contact from './pages/Contact'
import AdminLogin from './pages/AdminLogin'
import AdminLayout from './components/admin/AdminLayout'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'
import NewProduct from './pages/admin/NewProduct'
import EditProduct from './pages/admin/EditProduct'
import NotFound from './pages/NotFound'
import RequireAuth from './components/admin/RequireAuth'

function CustomerLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

function AppRoutes() {
  const { adminBasePath } = useAuth()

  return (
    <Routes>
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      {adminBasePath ? (
        <>
          <Route path={`/${adminBasePath}/login`} element={<AdminLogin />} />
          <Route
            path={`/${adminBasePath}`}
            element={
              <RequireAuth>
                <AdminLayout />
              </RequireAuth>
            }
          >
            <Route index element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="products/new" element={<NewProduct />} />
            <Route path="products/:id" element={<EditProduct />} />
          </Route>
        </>
      ) : null}
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
