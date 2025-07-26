<!-- src/views/reservationView.vue -->
<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>Reservaciones</h1>
      <router-link :to="{ name: 'reservations-create' }" class="btn btn-primary">Crear Nueva Reservación</router-link>
    </div>
    
    <div v-if="reservationStore.loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>
    <div v-else-if="reservationStore.reservations.length === 0">
      <p>No tienes ninguna reservación creada.</p>
    </div>
    <div v-else class="table-responsive">
      <table class="table table-striped align-middle">
        <thead>
          <tr>
            <th>Espacio</th>
            <th>Fecha</th>
            <th>Hora de Inicio</th>
            <th>Hora de Fin</th>
            <th>Propósito</th>
            <th v-if="authStore.isAdmin">Usuario</th>
            <!-- <th>Estado</th> -->
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="reservation in reservationStore.reservations" :key="reservation.id">
            <td>{{ reservation.space?.attributes?.name }}</td>
            <td>{{ new Date(reservation.start_time).toLocaleDateString() }}</td>
            <td>{{ new Date(reservation.start_time).toLocaleTimeString() }}</td>
            <td>{{ new Date(reservation.end_time).toLocaleTimeString() }}</td>
            <td>{{ reservation.purpose }}</td>
            <td v-if="authStore.isAdmin">{{ reservation.user?.name }}</td>
            <!-- <td>
              <span class="badge" :class="getStatusClass(reservation.status)">
                {{ reservation.status }}
              </span>
            </td> -->
            <td>
              <!-- <div v-if="reservation.status === 'pending'"> -->
                <!-- <button class="btn btn-sm btn-success me-2" @click="handleComplete(reservation.id)">Completar</button> -->
                <button class="btn btn-sm btn-danger" @click="handleCancel(reservation.id)">Eliminar</button>
              <!-- </div> -->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useReservationStore } from '@/stores/reservations';
import { onMounted } from 'vue';

const reservationStore = useReservationStore();
const authStore = useAuthStore();

onMounted(() => {
  reservationStore.fetchReservations();
});

// const getStatusClass = (status) => {
//   switch (status) {
//     case 'pending':
//       return 'bg-primary';
//     case 'confirmed':
//       return 'bg-success';
//     case 'cancelled':
//       return 'bg-danger';
//     default:
//       return 'bg-secondary';
//   }
// };

// const handleComplete = (id) => {
//   if (confirm('¿Estás seguro de que quieres marcar esta reservación como completada?')) {
//     reservationStore.updateReservation(id, { status: 'completed' });
//   }
// };

const handleCancel = (id) => {
  if (confirm('¿Estás seguro de que quieres eliminar esta reservación?')) {
    reservationStore.cancelReservation(id);
  }
};
</script>

