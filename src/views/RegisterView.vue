<template>
  <div class="container vh-100 d-flex justify-content-center align-items-center">
    <div class="card p-4 shadow" style="width: 100%; max-width: 400px;">
      <div class="card-body">
        <h2 class="card-title text-center mb-4">Crear Cuenta</h2>
        <form @submit.prevent="handleRegister">
          <div class="mb-3">
            <label for="name" class="form-label">Nombre:</label>
            <input type="text" class="form-control" id="name" v-model="name" required placeholder="Tu Nombre" />
             <small v-if="authStore.errors.name" class="text-danger">{{ authStore.errors.name[0] }}</small>
          </div>
          <div class="mb-3">
            <label for="email" class="form-label">Correo Electrónico:</label>
            <input type="email" class="form-control" id="email" v-model="email" required placeholder="tu@email.com" />
            <small v-if="authStore.errors.email" class="text-danger">{{ authStore.errors.email[0] }}</small>
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Contraseña:</label>
            <input type="password" class="form-control" id="password" v-model="password" required placeholder="********" />
            <small v-if="authStore.errors.password" class="text-danger">{{ authStore.errors.password[0] }}</small>
          </div>
          <div class="mb-3">
            <label for="password_confirmation" class="form-label">Confirmar Contraseña:</label>
            <input type="password" class="form-control" id="password_confirmation" v-model="password_confirmation" required placeholder="********" />
          </div>
          <div class="d-grid">
            <button type="submit" class="btn btn-primary">Registrarse</button>
          </div>
        </form>
        <div class="text-center mt-3">
          <p>¿Ya tienes una cuenta? <router-link :to="{ name: 'login' }">Inicia sesión</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const name = ref('');
const email = ref('');
const password = ref('');
const password_confirmation = ref('');

const authStore = useAuthStore();
const router = useRouter();

const handleRegister = async () => {
  const success = await authStore.register({
    name: name.value,
    email: email.value,
    password: password.value,
    password_confirmation: password_confirmation.value,
  });

  if (success) {
    router.push({ name: 'reservation' }); 
  }
};
</script>

