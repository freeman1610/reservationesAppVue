<template>
  <div class="container mt-4" style="max-width: 600px;">
    <div class="card">
      <div class="card-body">
        <h1 class="card-title text-center mb-4">Editar mi Perfil</h1>
        <div class="text-center mb-4">
          <img :src="avatarPreview || getFullAvatarUrl(authStore.user.avatar_url)" class="rounded-circle" width="120" height="120" alt="Avatar" style="object-fit: cover;">
        </div>
        <form @submit.prevent="handleUpdateProfile">
          <div class="mb-3">
            <label for="name" class="form-label">Nombre</label>
            <input type="text" class="form-control" id="name" v-model="form.name" required>
            <small v-if="authStore.errors.name" class="text-danger">{{ authStore.errors.name[0] }}</small>
          </div>
          <div class="mb-3">
            <label for="email" class="form-label">Correo Electrónico</label>
            <input type="email" class="form-control" id="email" v-model="form.email" required>
            <small v-if="authStore.errors.email" class="text-danger">{{ authStore.errors.email[0] }}</small>
          </div>
          <div class="mb-3">
            <label for="avatar" class="form-label">Cambiar Avatar</label>
            <input type="file" class="form-control" id="avatar" @change="onFileChange">
            <small v-if="authStore.errors.avatar" class="text-danger">{{ authStore.errors.avatar[0] }}</small>
          </div>
          <hr>
          <p class="text-muted">Cambiar contraseña (opcional)</p>
          <div class="mb-3">
            <label for="password" class="form-label">Nueva Contraseña</label>
            <input type="password" class="form-control" id="password" v-model="form.password">
            <small v-if="authStore.errors.password" class="text-danger">{{ authStore.errors.password[0] }}</small>
          </div>
          <div class="mb-3">
            <label for="password_confirmation" class="form-label">Confirmar Nueva Contraseña</label>
            <input type="password" class="form-control" id="password_confirmation" v-model="form.password_confirmation">
          </div>
          <div class="d-grid">
            <button type="submit" class="btn btn-primary">Guardar Cambios</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  avatar: null,
});

const avatarPreview = ref(null);

onMounted(() => {
  if (authStore.user) {
    form.value.name = authStore.user.name;
    form.value.email = authStore.user.email;
  }
});

const getFullAvatarUrl = (avatarUrl) => {
  if (!avatarUrl) return '';
  const baseUrl = import.meta.env.VITE_API_BASE_URL.replace('/api', '');
  return `${baseUrl}${avatarUrl}`;
};

const onFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    form.value.avatar = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      avatarPreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const handleUpdateProfile = async () => {
  const success = await authStore.updateProfile(form.value);
  if (success) {
    alert('¡Perfil actualizado con éxito!');
    router.push({ name: 'reservation' });
  }
};
</script>

