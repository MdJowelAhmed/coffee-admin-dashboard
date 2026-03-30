import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import DashboardLayout from '@/components/layout/DashboardLayout'
import AuthLayout from '@/components/layout/AuthLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { RoleBasedRoute } from '@/components/auth/RoleBasedRoute'
import { UserRole } from '@/types/roles'
import { useAppDispatch } from '@/redux/hooks'
import { hydrateSessionFromToken } from '@/redux/slices/authSlice'

// Auth Pages
import { Login, ForgotPassword, VerifyEmail, ResetPassword } from '@/pages/Auth'

// Dashboard Pages
import Dashboard from '@/pages/Dashboard'
import UserList from '@/pages/Users/UserList'
import ProductList from '@/pages/Products/ProductList'
import CategoryList from '@/pages/Categories/CategoryList'
import ProfileSettings from '@/pages/Settings/Profile/ProfileSettings'
import ChangePassword from '@/pages/Settings/ChangePassword/ChangePassword'
import TermsSettings from '@/pages/Settings/Terms/TermsSettings'
import PrivacySettings from '@/pages/Settings/Privacy/PrivacySettings'
import BookingManagement from './pages/Booking/BookingManagement'
import OrderList from './pages/Orders/OrderList'
// import AddCar from './pages/carlist/AddCar'
import ClientManagement from './pages/ClientManagement/ClientManagement'
import AgencyManagement from './pages/agency-management/AgencyManagement'
import Calender from './pages/calender/Calender'
import TransactionsHistory from './pages/transictions-history/TransactionsHistory'
import FAQ from './pages/FAQ/FAQ'
import NotFound from './pages/NotFound/NotFound'
import Customise from './pages/ShopManagement/Customise/Customise'
import ShopCategory from './pages/ShopManagement/Category/ShopCategory'
import ShopList from './pages/ShopManagement/Shop/ShopList'
import ShopProducts from './pages/ShopManagement/Products/ShopProducts'
import SubscriberList from './pages/Subscribers/SubscriberList'
import AdManagement from './pages/AdManagement/AdManagement'
import PushNotificationList from './pages/PushNotification/PushNotificationList'
import ControllerList from './pages/Controllers/ControllerList'
import PrivateRoleEntry from '@/pages/Private/PrivateRoleEntry'

function App() {
  const dispatch = useAppDispatch()

  // Restore session from token in localStorage (user is derived from JWT, not stored as JSON)
  useEffect(() => {
    dispatch(hydrateSessionFromToken())
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
          <Route index element={<PrivateRoleEntry />} />

          {/* Dashboard - All roles */}
          <Route
            path="dashboard"
            element={
              <RoleBasedRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MARKETER]}>
                <Dashboard />
              </RoleBasedRoute>
            }
          />

          {/* User Management - Super Admin only */}
          <Route
            path="users"
            element={
              <RoleBasedRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
                <UserList />
              </RoleBasedRoute>
            }
          />

          {/* Subscribers - Super Admin, Admin, Marketing */}
          <Route
            path="subscribers"
            element={
              <RoleBasedRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MARKETER]}>
                <SubscriberList />
              </RoleBasedRoute>
            }
          />

          {/* Ad Management - Super Admin, Marketing */}
          <Route
            path="ad-management"
            element={
              <RoleBasedRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.MARKETER]}>
                <AdManagement />
              </RoleBasedRoute>
            }
          />

          {/* Push Notification - Super Admin, Admin, Marketing */}
          <Route
            path="push-notification"
            element={
              <RoleBasedRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MARKETER]}>
                <PushNotificationList />
              </RoleBasedRoute>
            }
          />

          {/* Controllers - Super Admin only */}
          <Route
            path="controllers"
            element={
              <RoleBasedRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
                <ControllerList />
              </RoleBasedRoute>
            }
          />

          {/* Agency Management - Super Admin only */}
          <Route
            path="agency-management"
            element={
              <RoleBasedRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
                <AgencyManagement />
              </RoleBasedRoute>
            }
          />

          {/* Revenue - Super Admin, Admin */}
          <Route
            path="transactions-history"
            element={
              <RoleBasedRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
                <TransactionsHistory />
              </RoleBasedRoute>
            }
          />

          {/* Orders - Super Admin, Admin */}
          <Route
            path="orders"
            element={
              <RoleBasedRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
                <OrderList />
              </RoleBasedRoute>
            }
          />

          {/* Super Admin only */}
          <Route path="booking-management" element={<BookingManagement />} />
          <Route path="calender" element={<Calender />} />
          <Route path="clients" element={<ClientManagement />} />
          <Route path="products" element={<ProductList />} />
          <Route path="categories" element={<CategoryList />} />

          {/* Shop Management - Super Admin, Admin (Shop page is super-admin only, handled in Sidebar) */}
          <Route path="shop-management">
            <Route index element={<Navigate to="/shop-management/customise" replace />} />
            <Route
              path="customise"
              element={
                <RoleBasedRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
                  <Customise />
                </RoleBasedRoute>
              }
            />
            <Route
              path="category"
              element={
                <RoleBasedRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
                  <ShopCategory />
                </RoleBasedRoute>
              }
            />
            <Route
              path="shop"
              element={
                <RoleBasedRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
                  <ShopList />
                </RoleBasedRoute>
              }
            />
            <Route
              path="products"
              element={
                <RoleBasedRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
                  <ShopProducts />
                </RoleBasedRoute>
              }
            />
          </Route>

          {/* Settings - Super Admin, Admin (Profile) */}
          <Route path="settings">
            <Route
              path="profile"
              element={
                <RoleBasedRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
                  <ProfileSettings />
                </RoleBasedRoute>
              }
            />
            <Route
              path="password"
              element={
                <RoleBasedRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
                  <ChangePassword />
                </RoleBasedRoute>
              }
            />
            <Route
              path="terms"
              element={
                <RoleBasedRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
                  <TermsSettings />
                </RoleBasedRoute>
              }
            />
            <Route
              path="privacy"
              element={
                <RoleBasedRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
                  <PrivacySettings />
                </RoleBasedRoute>
              }
            />
            <Route path="faq" element={<FAQ />} />
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
