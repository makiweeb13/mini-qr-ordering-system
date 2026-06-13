import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './components/AdminLayout'
import CustomerLayout from './components/CustomerLayout'
import MenuPage from './pages/MenuPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/admin/DashboardPage'
import OrdersPage from './pages/admin/OrdersPage'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route element={<CustomerLayout />}>
            <Route path="/" element={<MenuPage />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<DashboardPage />} />
              <Route path="/admin/orders" element={<OrdersPage />} />
            </Route>
          </Route>
        </Routes>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
