<!-- src/views/UserManagementView.vue -->
<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>Usuarios</h1>
      <button class="btn btn-primary" @click="openCreateModal">Crear Usuario</button>
    </div>

    <div v-if="userStore.loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>
    <div v-else class="table-responsive">
      <table class="table table-striped align-middle">
        <thead>
          <tr>
            <th>Avatar</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Limite de reservas</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in userStore.users" :key="user.id">
            <td>
                <img :src="getFullAvatarUrl(user.avatar_url)" :alt="user.name" class="rounded-circle" width="50" height="50" style="object-fit: cover;">
            </td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td><span class="badge" :class="user.role === 'admin' ? 'bg-success' : 'bg-secondary'">{{ user.role }}</span></td>
            <td>{{ user.max_simultaneous_reservations }}</td>
            <td>
              <button class="btn btn-sm btn-warning me-2" @click="openEditModal(user)">Editar</button>
              <button class="btn btn-sm btn-danger" @click="confirmDelete(user.id)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <UserModal :user="selectedUser" @form-submit="handleFormSubmit" ref="userModal" />
  </div>
</template>

<script setup>
import UserModal from '@/components/UserModal.vue';
import { useUserStore } from '@/stores/users';
import { Modal } from 'bootstrap';
import { onMounted, ref } from 'vue';

const userStore = useUserStore();
const selectedUser = ref(null);
const userModal = ref(null);
let modalInstance = null;

const getFullAvatarUrl = (avatarUrl) => {
  if (!avatarUrl) return ''; // O una imagen por defecto
  // Obtener la URL base de la API de Laravel sin el sufijo '/api'
  const baseUrl = import.meta.env.VITE_API_BASE_URL.replace('/api', '');
  return `${baseUrl}${avatarUrl}`;
};

onMounted(() => {
  userStore.fetchUsers();
  const modalElement = document.getElementById('userModal');
  if (modalElement) {
    modalInstance = new Modal(modalElement);
  }
});

const openCreateModal = () => {
  selectedUser.value = { name: '', email: '', role: 'user', password: '' };
  userStore.errors = {}; // Limpiar errores
  modalInstance.show();
};

const openEditModal = (user) => {
  selectedUser.value = { ...user, password: '' }; // Copiar usuario para editar
  userStore.errors = {}; // Limpiar errores
  modalInstance.show();
};

const handleFormSubmit = async (userData) => {
  const success = await userStore.saveUser(userData);
  if (success) {
    modalInstance.hide();
  }
};

const confirmDelete = (id) => {
  if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
    userStore.deleteUser(id);
  }
};
</script>

