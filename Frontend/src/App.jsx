import React, { useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Header from './Components/Header'
import Home from './Pages/Home'
import ProductDetails from './Pages/ProductDetails'
import Loginpage from './Pages/Loginpage'
import ProtectRoutes from './Components/ProtectRoutes.jsx'
import MyCart from './Pages/MyCart'
import CheckoutPage from './Pages/CheckoutPage'
import PaymentPage from './Pages/PaymentPage'
import OrderSuccess from './Pages/OrderSuccess'
import AddProduct from './Pages/AddProduct'
import AdminLayout from './Pages/AdminLayout'
import AdminDashboard from './Pages/AdminDashboard'
import AdminProducts from './Pages/AdminProducts'
import AdminOrders from './Pages/AdminOrders'
import AdminUsers from './Pages/AdminUsers'
import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(localStorage.getItem('blinkit_customer')));
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
    <ToastContainer position="top-right" autoClose={2000} />
     {!isAdminRoute && <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
     <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={<Loginpage setIsLoggedIn={setIsLoggedIn}/>}/>
      <Route
        path="/products/:id"
        element={
          <ProtectRoutes isLoggedIn={isLoggedIn}>
            <ProductDetails/>
          </ProtectRoutes>
        }
      />
      <Route
        path="/cart"
        element={
          <ProtectRoutes isLoggedIn={isLoggedIn}>
            <MyCart/>
          </ProtectRoutes>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectRoutes isLoggedIn={isLoggedIn}>
            <CheckoutPage/>
          </ProtectRoutes>
        }
      />
      <Route
        path="/payment"
        element={
          <ProtectRoutes isLoggedIn={isLoggedIn}>
            <PaymentPage/>
          </ProtectRoutes>
        }
      />
      <Route path="/order-success" element={<OrderSuccess/>}/>
      <Route
        path="/admin"
        element={
          <ProtectRoutes isLoggedIn={isLoggedIn}>
            <AdminLayout setIsLoggedIn={setIsLoggedIn}/>
          </ProtectRoutes>
        }
      >
        <Route index element={<AdminDashboard/>}/>
        <Route path="products" element={<AdminProducts/>}/>
        <Route path="add-product" element={<AddProduct/>}/>
        <Route path="orders" element={<AdminOrders/>}/>
        <Route path="users" element={<AdminUsers/>}/>

      </Route>
     </Routes>

    </>   
  )
}
