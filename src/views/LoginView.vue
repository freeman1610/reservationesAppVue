<template>
  <div class="container vh-100 d-flex justify-content-center align-items-center">
    <div class="card p-4 shadow" style="width: 100%; max-width: 400px;">
      <div class="card-body">
        <h2 class="card-title text-center mb-4">Iniciar Sesión</h2>
        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label for="email" class="form-label">Correo Electrónico:</label>
            <input type="email" class="form-control" id="email" v-model="email" required placeholder="tu@email.com" />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Contraseña:</label>
            <input type="password" class="form-control" id="password" v-model="password" required placeholder="********" />
          </div>
          <div class="d-grid">
            <button type="submit" class="btn btn-primary">Entrar</button>
          </div>
          <div v-if="errorMessage" class="alert alert-danger mt-3" role="alert">
            {{ errorMessage }}
          </div>
        </form>
        <div class="text-center mt-3 border-top pt-3">
          <p class="mb-2">¿No tienes una cuenta?</p>
          <router-link :to="{ name: 'register' }" class="btn btn-outline-secondary w-100">Crear Cuenta Nueva</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const errorMessage = ref('');

const authStore = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  errorMessage.value = '';
  const success = await authStore.login({
    email: email.value,
    password: password.value,
  });

  if (success) {
    router.push({ name: 'reservation' }); 
  } else {
    errorMessage.value = 'Credenciales incorrectas. Por favor, inténtalo de nuevo.';
  }
};
</script>

