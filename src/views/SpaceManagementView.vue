<!-- src/views/SpaceManagementView.vue -->
<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>Gestionar Espacios</h1>
      <button class="btn btn-primary" @click="openCreateModal">Crear Espacio</button>
    </div>

    <!-- Filtros Avanzados -->
    <div class="card mb-4">
      <div class="card-header">
        <h5 class="mb-0">
          <button class="btn btn-link text-decoration-none" type="button" data-bs-toggle="collapse" data-bs-target="#filtersCollapse">
            Filtros de Búsqueda
          </button>
        </h5>
      </div>
      <div id="filtersCollapse" class="collapse">
        <div class="card-body">
          <form @submit.prevent="handleSearch" class="row g-3">
            <div class="col-md-4">
              <label class="form-label">Tipo</label>
              <select class="form-select" v-model="filters.type">
                <option value="">Cualquiera</option>
                <option value="room">Sala (Room)</option>
                <option value="desk">Escritorio (Desk)</option>
                <option value="hall">Salón (Hall)</option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">Capacidad Mínima</label>
              <input type="number" class="form-control" v-model.number="filters.capacity" min="1">
            </div>
            <div class="col-md-4">
              <label class="form-label">Fecha - Disponibilidad Semanal</label>
              <input type="date" class="form-control" v-model="filters.date">
            </div>
            <div class="col-md-4">
              <label class="form-label">Desde - Disponibilidad Semanal</label>
              <input type="time" class="form-control" v-model="filters.start_time">
            </div>
            <div class="col-md-4">
              <label class="form-label">Hasta - Disponibilidad Semanal</label>
              <input type="time" class="form-control" v-model="filters.end_time">
            </div>
            <div class="col-12 d-flex justify-content-end gap-2">
              <button type="button" class="btn btn-secondary" @click="clearFilters">Limpiar</button>
              <button type="submit" class="btn btn-success">Buscar</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div v-if="spaceStore.loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>
    <div v-else>
      <div v-if="spaceStore.spaces.length > 0" class="table-responsive">
        <table class="table table-striped align-middle">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Capacidad</th>
              <th>Ubicación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="space in spaceStore.spaces" :key="space.id">
              <td>{{ space.attributes.name }}</td>
              <td>{{ space.attributes.type }}</td>
              <td>{{ space.attributes.capacity }}</td>
              <td>{{ space.attributes.location }}</td>
              <td>
                <button class="btn btn-sm btn-warning me-2" @click="openEditModal(space)">Editar</button>
                <button class="btn btn-sm btn-danger" @click="confirmDelete(space.id)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="alert alert-info">
        No se encontraron espacios que coincidan con los filtros de búsqueda.
      </div>
    </div>

    <SpaceModal :space="selectedSpace" @form-submit="handleFormSubmit" ref="spaceModal" />
  </div>
</template>

<script setup>
import SpaceModal from '@/components/SpaceModal.vue';
import { useSpaceStore } from '@/stores/spaces';
import { Modal } from 'bootstrap';
import { onMounted, ref } from 'vue';

const spaceStore = useSpaceStore();
const selectedSpace = ref(null);
let modalInstance = null;

const filters = ref({
  type: '',
  capacity: '',
  date: '',
  start_time: '',
  end_time: ''
});

onMounted(() => {
  spaceStore.fetchSpaces();
  const modalElement = document.getElementById('spaceModal');
  if (modalElement) {
    modalInstance = new Modal(modalElement);
  }
});

const handleSearch = () => {
  spaceStore.fetchSpaces(filters.value);
};

const clearFilters = () => {
  filters.value = { type: '', capacity: '', date: '', start_time: '', end_time: '' };
  handleSearch();
};

const openCreateModal = () => {
  selectedSpace.value = { 
    name: '', type: 'room', description: '', capacity: 1, location: '', availability: {} 
  };
  spaceStore.errors = {};
  modalInstance.show();
};

const openEditModal = (space) => {
  selectedSpace.value = { id: space.id, ...space.attributes };
  spaceStore.errors = {};
  modalInstance.show();
};

const handleFormSubmit = async (spaceData) => {
  const success = await spaceStore.saveSpace(spaceData);
  if (success) {
    modalInstance.hide();
  }
};

const confirmDelete = (id) => {
  if (window.confirm('¿Estás seguro de que quieres eliminar este espacio?')) {
    spaceStore.deleteSpace(id);
  }
};
</script>

