import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../pages/LandingPage.vue'
import LoginPage from '../pages/LoginPage.vue'
import SignupPage from '../pages/SignupPage.vue'
import VerifyPage from '../pages/VerifyPage.vue'
import DashboardLayout from '../pages/dashboard/DashboardLayout.vue'
import DashboardGateway from '../pages/dashboard/DashboardGateway.vue'

// Tenant pages
import TenantDashboardPage from '../pages/dashboard/tenant/DashboardPage.vue'
import CoverageTimelinePage from '../pages/dashboard/tenant/CoverageTimelinePage.vue'
import PaymentRecordsPage from '../pages/dashboard/tenant/PaymentRecordsPage.vue'

// Landlord pages
import LandlordDashboardPage from '../pages/dashboard/landlord/DashboardPage.vue'
import PropertiesPage from '../pages/dashboard/landlord/PropertiesPage.vue'

// Shared pages
import SettingsPage from '../pages/dashboard/shared/SettingsPage.vue'
import NotificationsPage from '../pages/dashboard/shared/NotificationsPage.vue'
import RemindersPage from '../pages/dashboard/shared/RemindersPage.vue'
import IdVerificationsPage from '../pages/dashboard/shared/IdVerificationsPage.vue'
import AccountPage from '../pages/dashboard/shared/AccountPage.vue'

import { useAuthStore, type ActiveRole } from '../stores/auth.store'

const tenantChildren = [
  { path: '', component: TenantDashboardPage },
  { path: 'coverage', component: CoverageTimelinePage },
  { path: 'payments', component: PaymentRecordsPage },
  { path: 'verification', component: IdVerificationsPage },
  { path: 'notifications', component: NotificationsPage },
  { path: 'reminders', component: RemindersPage },
  { path: 'settings', component: SettingsPage },
  { path: 'account', component: AccountPage },
  { path: ':pathMatch(.*)*', redirect: '/dashboard/tenant' },
]

const landlordChildren = [
  { path: '', component: LandlordDashboardPage },
  { path: 'properties', component: PropertiesPage },
  { path: 'verification', component: IdVerificationsPage },
  { path: 'notifications', component: NotificationsPage },
  { path: 'reminders', component: RemindersPage },
  { path: 'settings', component: SettingsPage },
  { path: 'account', component: AccountPage },
  { path: ':pathMatch(.*)*', redirect: '/dashboard/landlord' },
]

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: (to) => {
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
  routes: [
    { path: '/', component: LandingPage, meta: { guestOnly: true } },
    { path: '/login', component: LoginPage, meta: { guestOnly: true } },
    { path: '/signup', component: SignupPage, meta: { guestOnly: true } },
    { path: '/verify', component: VerifyPage, meta: { requiresPendingVerification: true } },
    {
      // Gateway: redirects authenticated users into their role subtree, or
      // shows the role picker when the user holds both roles and hasn't chosen.
      path: '/dashboard',
      component: DashboardGateway,
      meta: { requiresAuth: true },
    },
    {
      path: '/dashboard/landlord',
      component: DashboardLayout,
      meta: { requiresAuth: true, role: 'landlord' as ActiveRole },
      children: landlordChildren,
    },
    {
      path: '/dashboard/tenant',
      component: DashboardLayout,
      meta: { requiresAuth: true, role: 'tenant' as ActiveRole },
      children: tenantChildren,
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { path: '/login', query: { next: to.fullPath } }
  }

  if (to.meta.requiresPendingVerification && !to.query.email && !to.query.phone_number) {
    return { path: '/signup' }
  }

  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { path: '/dashboard' }
  }

  if (auth.isAuthenticated && to.path.startsWith('/dashboard')) {
    const u = auth.user!

    if (!u.is_tenant && !u.is_landlord) {
      auth.logout()
      return { path: '/login', query: { error: 'invalid_role' } }
    }

    if (auth.activeRole === 'landlord' && !u.is_landlord) {
      auth.setActiveRole(u.is_tenant ? 'tenant' : null)
    } else if (auth.activeRole === 'tenant' && !u.is_tenant) {
      auth.setActiveRole(u.is_landlord ? 'landlord' : null)
    }

    if (!auth.activeRole) {
      if (u.is_landlord && !u.is_tenant) auth.setActiveRole('landlord')
      else if (u.is_tenant && !u.is_landlord) auth.setActiveRole('tenant')
    }

    if (to.path === '/dashboard') {
      if (auth.activeRole) return { path: `/dashboard/${auth.activeRole}` }
      return true
    }

    // Cross-role URL → silently redirect to the user's own role home.
    const targetRole = to.meta.role as ActiveRole | undefined
    if (targetRole && auth.activeRole !== targetRole) {
      if (auth.activeRole) {
        return { path: `/dashboard/${auth.activeRole}` }
      }
      return { path: '/dashboard' }
    }
  }

  return true
})

export default router
