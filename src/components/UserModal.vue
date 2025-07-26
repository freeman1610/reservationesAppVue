<!-- src/components/UserModal.vue -->
<template>
  <div class="modal fade" :id="modalId" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ formTitle }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <form @submit.prevent="submitForm">
          <div class="modal-body">
            <div class="mb-3">
              <label for="name" class="form-label">Nombre</label>
              <input type="text" class="form-control" v-model="editableUser.name" required>
              <small v-if="userStore.errors.name" class="text-danger">{{ userStore.errors.name[0] }}</small>
            </div>
            <div class="mb-3">
              <label for="email" class="form-label">Correo Electrónico</label>
              <input type="email" class="form-control" v-model="editableUser.email" required>
              <small v-if="userStore.errors.email" class="text-danger">{{ userStore.errors.email[0] }}</small>
            </div>
            <div class="mb-3">
              <label for="role" class="form-label">Rol</label>
              <select class="form-select" v-model="editableUser.role" required>
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="email" class="form-label">Límite de reservas</label>
              <input type="number" class="form-control" v-model="editableUser.max_simultaneous_reservations" required>
              <small v-if="userStore.errors.max_simultaneous_reservations" class="text-danger">{{ userStore.errors.max_simultaneous_reservations[0] }}</small>
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Contraseña</label>
              <input type="password" class="form-control" v-model="editableUser.password" :required="!editableUser.id">
              <small class="form-text text-muted" v-if="editableUser.id">Dejar en blanco para no cambiar</small>
              <small v-if="userStore.errors.password" class="text-danger">{{ userStore.errors.password[0] }}</small>
            </div>
            <div class="mb-3">
              <label for="avatar" class="form-label">Avatar</label>
              <input type="file" class="form-control" @change="onFileChange">
              <small class="form-text text-muted" v-if="editableUser.id">Seleccionar un nuevo archivo para cambiar el avatar actual.</small>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            <button type="submit" class="btn btn-primary">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/users';
import { computed, ref, watch } from 'vue';

const props = defineProps({
  user: Object,
  modalId: {
    type: String,
    default: 'userModal'
  }
});

const emit = defineEmits(['form-submit']);

const userStore = useUserStore();
const editableUser = ref({});
const avatarFile = ref(null);

const formTitle = computed(() => editableUser.value.id ? 'Editar Usuario' : 'Crear Usuario');

watch(() => props.user, (newUser) => {
  editableUser.value = { ...newUser } || { role: 'user' };
  avatarFile.value = null;
}, { immediate: true });

const onFileChange = (event) => {
  avatarFile.value = event.target.files[0];
};

const submitForm = () => {
  const formData = { ...editableUser.value };
  if (avatarFile.value) {
    formData.avatar = avatarFile.value;
  }
  emit('form-submit', formData);
};
</script>

