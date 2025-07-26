
<template>
  <div>
    <h1 class="mb-4">Reportes</h1>

    <div class="card mb-4">
      <div class="card-header">
        <h5>Reservas por Espacio y Fecha</h5>
      </div>
      <div class="card-body">
        <form @submit.prevent="getReservationsReport" class="row g-3 align-items-end">
          <div class="col-md-4">
            <label for="start_date" class="form-label">Fecha de Inicio</label>
            <input type="date" class="form-control" v-model="filters.start_date" required>
          </div>
          <div class="col-md-4">
            <label for="end_date" class="form-label">Fecha de Fin</label>
            <input type="date" class="form-control" v-model="filters.end_date" required>
          </div>
          <div class="col-md-4">
            <label for="space_id" class="form-label">Espacio</label>
            <select class="form-select" v-model="filters.space_id">
              <option value="">Todos los Espacios</option>
              <option v-for="space in spaceStore.spaces" :key="space.id" :value="space.id">
                {{ space.attributes.name }}
              </option>
            </select>
          </div>
          <div class="col-12 mt-3">
            <button type="submit" class="btn btn-primary w-100">Generar Reporte</button>
          </div>
        </form>

        <div v-if="reportStore.loading" class="text-center mt-4">
          <div class="spinner-border" role="status"></div>
        </div>
        <div v-else-if="reportStore.reservationsBySpace.length > 0" class="mt-4 table-responsive">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>Espacio</th>
                <th>Fecha</th>
                <th>Cantidad de Reservas</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in reportStore.reservationsBySpace" :key="index">
                <td>{{ item.space_name }}</td>
                <td>{{ item.date }}</td>
                <td>{{ item.reservation_count }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="card mb-5">
       <div class="card-header">
        <h5>Usuarios más Activos</h5>
      </div>
      <div class="card-body">
        <div v-if="reportStore.loading" class="text-center">
          <div class="spinner-border" role="status"></div>
        </div>
         <div v-else-if="reportStore.activeUsers.length > 0" class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Total de Reservas</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user, index) in reportStore.activeUsers" :key="user.id">
                <td>{{ index + 1 }}</td>
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td><span class="badge bg-info">{{ user.reservations_count }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useReportStore } from '@/stores/reports';
import { useSpaceStore } from '@/stores/spaces';
import { onMounted, ref } from 'vue';

const reportStore = useReportStore();
const spaceStore = useSpaceStore();

const filters = ref({
  start_date: new Date().toISOString().split('T')[0],
  end_date: new Date().toISOString().split('T')[0],
  space_id: '',
});

onMounted(() => {
  reportStore.fetchActiveUsers();
  spaceStore.fetchSpaces(); 
});

const getReservationsReport = () => {
  reportStore.fetchReservationsBySpace(filters.value);
};
</script>

