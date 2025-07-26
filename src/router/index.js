// src/router/index.js
import { useAuthStore } from '@/stores/auth';
import { createRouter, createWebHistory } from 'vue-router';

import MainLayout from '../layouts/MainLayout.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', name: 'login', component: LoginView },
    { path: '/register', name: 'register', component: RegisterView },
    {
      path: '/',
      component: MainLayout,
      redirect: '/reservation',
      meta: { requiresAuth: true },
      children: [
        {
          path: 'reservation',
          name: 'reservation',
          component: () => import('../views/reservationView.vue'),
        },
        {
          path: 'reservations/create',
          name: 'reservations-create',
          component: () => import('../views/CreateReservationView.vue'),
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('../views/ProfileView.vue'),
        },
        {
          path: 'users',
          name: 'users',
          component: () => import('../views/UserManagementView.vue'),
          meta: { requiresAdmin: true },
        },
        {
          path: 'spaces',
          name: 'spaces',
          component: () => import('../views/SpaceManagementView.vue'),
          meta: { requiresAdmin: true },
        },
        {
          path: 'reports',
          name: 'reports',
          component: () => import('../views/ReportsView.vue'),
          meta: { requiresAdmin: true },
        },
      ],
    },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);

  if (requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' });
  } else if (requiresAdmin && !authStore.isAdmin) {
    next({ name: 'reservation' });
  } else {
    next();
  }
});

export default router;

