import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import DashboardLayout from '@/components/layout/DashboardLayout'
import AuthLayout from '@/components/layout/AuthLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { loadUserFromStorage } from '@/redux/slices/authSlice'

// Auth Pages
import { Login, ForgotPassword, VerifyEmail, ResetPassword } from '@/pages/Auth'

// Dashboard Pages
import Dashboard from '@/pages/Dashboard'
import UserList from '@/pages/Users/UserList'
import UserDetails from '@/pages/Users/UserDetails'
import ProductList from '@/pages/Products/ProductList'
import CategoryList from '@/pages/Categories/CategoryList'
import ProfileSettings from '@/pages/Settings/Profile/ProfileSettings'
import ChangePassword from '@/pages/Settings/ChangePassword/ChangePassword'
import TermsSettings from '@/pages/Settings/Terms/TermsSettings'
import PrivacySettings from '@/pages/Settings/Privacy/PrivacySettings'
import BookingManagement from './pages/Booking/BookingManagement'
import CarList from './pages/carlist/CarList'
// import AddCar from './pages/carlist/AddCar'
import ClientManagement from './pages/ClientManagement/ClientManagement'
import AgencyManagement from './pages/agency-management/AgencyManagement'
import Calender from './pages/calender/Calender'
import TransactionsHistory from './pages/transictions-history/TransactionsHistory'
import FAQ from './pages/FAQ/FAQ'
import NotFound from './pages/NotFound/NotFound'

function AppEntryRedirect() {
  const { user } = useAppSelector((state) => state.auth)

  if (!user) {
    return <Navigate to="/auth/login" replace />
  }

  return <Navigate to="/dashboard" replace />
}

function App() {
  const dispatch = useAppDispatch()

  // Load user from storage on app mount
  useEffect(() => {
    dispatch(loadUserFromStorage())
  }, [dispatch])

  return (
    <TooltipProvider>
      <Routes>
        {/* Auth Routes - No sidebar/header */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<Navigate to="/auth/login" replace />} />
          <Route path="login" element={<Login />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="verify-email" element={<VerifyEmail />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>

        {/* Protected Dashboard Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AppEntryRedirect />} />
          
          {/* Super Admin Only Routes */}
          <Route 
            path="dashboard" 
            element={<Dashboard />}
          />
          
          {/* User Management - Super Admin Only */}
          <Route 
            path="users" 
            element={<UserList />}
          />
          <Route 
            path="users/:id" 
            element={<UserDetails />}
          />
          
          {/* Agency Management - Super Admin Only */}
          <Route 
            path="agency-management" 
            element={<AgencyManagement />}
          />
          
          {/* Transactions History - Super Admin Only */}
          <Route 
            path="transactions-history" 
            element={<TransactionsHistory />}
          />
          
          {/* Shared Routes - All roles can access */}
          <Route 
            path="booking-management" 
            element={<BookingManagement />}
          />
          
          {/* Car Management - All roles can access */}
          <Route 
            path="cars" 
            element={<CarList />}
          />
          
          {/* Calendar - All roles can access */}
          <Route 
            path="calender" 
            element={<Calender />}
          />
          
          {/* Client Management */}
          <Route path="clients" element={<ClientManagement />} />
          
          {/* Product Management */}
          <Route path="products" element={<ProductList />} />
          
          {/* Category Management */}
          <Route path="categories" element={<CategoryList />} />
          
          {/* Settings */}
          <Route path="settings">
            <Route path="profile" element={<ProfileSettings />} />
            <Route path="password" element={<ChangePassword />} />
            <Route path="terms" element={<TermsSettings />} />
            <Route path="privacy" element={<PrivacySettings />} />
            <Route 
              path="faq" 
              element={<FAQ />} 
            />
          </Route>
        </Route>

        {/* Catch all - 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster position="top-right" richColors closeButton />
    </TooltipProvider>
  )
}

export default App
