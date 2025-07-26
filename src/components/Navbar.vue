
<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <router-link class="navbar-brand" :to="{ name: 'reservation' }">ReservasApp</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'reservation' }">Reservaciones</router-link>
          </li>
          <!-- links for admin -->
          <template v-if="authStore.isAdmin">
            <li class="nav-item">
              <router-link class="nav-link" :to="{ name: 'users' }">Usuarios</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :to="{ name: 'spaces' }">Espacios</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :to="{ name: 'reports' }">Reportes</router-link>
            </li>
          </template>
        </ul>
        <div class="d-flex">
          <ul class="navbar-nav">
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" id="navbarDropdown" role="button" @click.prevent="toggleDropdown" :aria-expanded="isDropdownOpen">
                <img v-if="authStore.user?.avatar_url" :src="getFullAvatarUrl(authStore.user.avatar_url)" class="rounded-circle me-2" width="30" height="30" alt="Avatar" style="object-fit: cover;">
                {{ authStore.user?.name }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end" :class="{ show: isDropdownOpen }" aria-labelledby="navbarDropdown">
                <li><router-link class="dropdown-item" :to="{ name: 'profile' }" @click="closeDropdown">Editar Perfil</router-link></li>
                <li><hr class="dropdown-divider"></li>
                <li><button class="dropdown-item" @click="handleLogout">Cerrar Sesión</button></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';

const authStore = useAuthStore();
const isDropdownOpen = ref(false);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const closeDropdown = () => {
  isDropdownOpen.value = false;
};

const getFullAvatarUrl = (avatarUrl) => {
  if (!avatarUrl) return '';
  const baseUrl = import.meta.env.VITE_API_BASE_URL.replace('/api', '');
  return `${baseUrl}${avatarUrl}`;
};

const handleLogout = () => {
  closeDropdown();
  authStore.logout();
};
</script>

