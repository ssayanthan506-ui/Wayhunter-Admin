
import { Routes } from '@angular/router';
import { adminAuthGuard } from './core/guards/admin-auth.guard';

export const routes: Routes = [

  // ==========================================
  // ADMIN AUTHENTICATION
  // ==========================================
  {
    path: 'auth',
    loadComponent: () =>
      import('./features/authentication/auth-layout')
        .then(m => m.AuthLayout),

    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login'
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./features/authentication/login/login')
            .then(m => m.Login)
      },
      {
        path: 'verify-code',
        loadComponent: () =>
          import('./features/authentication/verify-code/verify-code')
            .then(m => m.VerifyCode)
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./features/authentication/forgot-password/forgot-password')
            .then(m => m.ForgotPassword)
      },
      {
        path: 'reset-password',
        loadComponent: () =>
          import('./features/authentication/reset-password/reset-password')
            .then(m => m.ResetPassword)
      }
    ]
  },

  // ==========================================
  // ADMIN DASHBOARD LAYOUT
  // ==========================================
  {
    path: '',
    canActivate: [adminAuthGuard],

    loadComponent: () =>
      import('./layout/admin-layout/admin-layout')
        .then(m => m.AdminLayout),

    children: [

      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },

      // ======================================
      // DASHBOARD
      // ======================================
      {
        path: 'dashboard',
        data: { adminModule: 'dashboard' },
        loadComponent: () =>
          import('./shared/wayhunter-admin-full/admin-full')
            .then(m => m.WayhunterAdminFull)
      },

      // ======================================
      // USER MANAGEMENT
      // ======================================
      {
        path: 'users',
        data: { adminModule: 'users' },
        loadComponent: () =>
          import('./shared/wayhunter-admin-full/admin-full')
            .then(m => m.WayhunterAdminFull)
      },

      // ======================================
      // LIVE LOCATION HUNTER VERIFICATION
      // NEW API CONNECTED PAGE
      // ======================================
      {
        path: 'location-verification',
        data: { adminModule: 'location-verification' },
        loadComponent: () =>
          import(
            './features/live-verification/live-verification-page'
          ).then(m => m.LiveVerificationPage)
      },

      // ======================================
      // ADVERTISEMENT MANAGEMENT
      // ======================================

{
  path: 'advertisements',
  data: { adminModule: 'advertisements' },
  loadComponent: () =>
    import('./features/advertisements/advertisements-page')
      .then(m => m.AdvertisementsPage)
},


      // ======================================
      // PLACES MANAGEMENT
      // ======================================
      {
        path: 'places',
        data: { adminModule: 'places' },
        loadComponent: () =>
          import('./shared/wayhunter-admin-full/admin-full')
            .then(m => m.WayhunterAdminFull)
      },

      // ======================================
      // TRIPS & HISTORICAL ROUTES
      // ======================================
      {
        path: 'trips-historical-routes',
        data: { adminModule: 'trips' },
        loadComponent: () =>
          import('./shared/wayhunter-admin-full/admin-full')
            .then(m => m.WayhunterAdminFull)
      },

      // ======================================
      // HAZARDS
      // ======================================
      {
        path: 'hazards',
        data: { adminModule: 'hazards' },
        loadComponent: () =>
          import('./shared/wayhunter-admin-full/admin-full')
            .then(m => m.WayhunterAdminFull)
      },

      // ======================================
      // GROUP TRIPS
      // ======================================
      {
        path: 'group-trips',
        data: { adminModule: 'group-trips' },
        loadComponent: () =>
          import('./shared/wayhunter-admin-full/admin-full')
            .then(m => m.WayhunterAdminFull)
      },

      // ======================================
      // LIVE GAME VERIFICATION
      // NEW API CONNECTED PAGE
      // ======================================
      {
        path: 'games',
        data: { adminModule: 'games' },
        loadComponent: () =>
          import(
            './features/live-verification/live-verification-page'
          ).then(m => m.LiveVerificationPage)
      },

      // ======================================
      // WALLET & REWARDS
      // ======================================
      {
        path: 'wallet-rewards',
        data: { adminModule: 'wallet-rewards' },
        loadComponent: () =>
          import('./shared/wayhunter-admin-full/admin-full')
            .then(m => m.WayhunterAdminFull)
      },

      // ======================================
      // VOUCHER OPERATIONS
      // ======================================
      {
        path: 'merchants',
        loadComponent: () =>
          import('./features/voucher-operations/voucher-operations')
            .then(m => m.VoucherOperations)
      },

      // ======================================
      // REPORTS & ANALYTICS
      // ======================================
      {
        path: 'reports-analytics',
        data: { adminModule: 'reports' },
        loadComponent: () =>
          import('./shared/wayhunter-admin-full/admin-full')
            .then(m => m.WayhunterAdminFull)
      },

      // ======================================
      // NOTIFICATIONS
      // ======================================
      {
        path: 'notifications',
        data: { adminModule: 'notifications' },
        loadComponent: () =>
          import('./shared/wayhunter-admin-full/admin-full')
            .then(m => m.WayhunterAdminFull)
      },

      // ======================================
      // AUDIT LOGS
      // ======================================
      {
        path: 'audit-logs',
        data: { adminModule: 'audit-logs' },
        loadComponent: () =>
          import('./shared/wayhunter-admin-full/admin-full')
            .then(m => m.WayhunterAdminFull)
      },

      // ======================================
      // GENERAL MANAGEMENT MODULE
      // ======================================
      {
        path: 'manage/:module',
        loadComponent: () =>
          import('./shared/admin-management/admin-management')
            .then(m => m.AdminManagementComponent)
      },

      // ======================================
      // ADMIN SETTINGS
      // ======================================
      {
        path: 'settings',
        data: { adminModule: 'settings' },
        loadComponent: () =>
          import('./shared/wayhunter-admin-full/admin-full')
            .then(m => m.WayhunterAdminFull)
      }

    ]
  },

  // ==========================================
  // FALLBACK ROUTE
  // ==========================================
  {
    path: '**',
    redirectTo: 'auth/login'
  }

];
