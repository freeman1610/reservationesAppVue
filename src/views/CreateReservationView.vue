<!-- src/views/CreateReservationView.vue -->
<template>
  <div>
    <h1 class="mb-4">Crear Nueva Reservación <router-link class="btn btn-secondary" :to="{ name: 'reservation' }">Cancelar</router-link></h1>
    <div class="row">
      <div class="col-md-5">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">1. Selecciona una Fecha</h5>
            <VDatePicker v-model="selectedDate" :min-date="new Date()" :disabled-dates="disabledWeekdays" is-required />
          </div>
        </div>
      </div>
      <div class="col-md-7" v-if="selectedDate">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">2. Completa los Detalles</h5>
            <div v-if="availableSpaces.length > 0">
              <form @submit.prevent="handleCreateReservation">
                <div class="mb-3">
                  <label class="form-label">Espacio</label>
                  <select class="form-select" v-model="selectedSpaceId" required>
                    <option disabled value="">Selecciona un espacio</option>
                    <option v-for="space in availableSpaces" :key="space.id" :value="space.id">
                      {{ space.attributes.name }} (Capacidad: {{ space.attributes.capacity }})
                    </option>
                  </select>
                </div>
                
                <div class="row" v-if="selectedSpaceId">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Hora de Inicio</label>
                    <select class="form-select" v-model="startTime" required>
                      <option disabled value="">Selecciona...</option>
                      <option v-for="time in availableStartTimes" :key="time" :value="time">
                        {{ time }}
                      </option>
                    </select>
                    <small v-if="reservationStore.errors.start_time" class="text-danger">
                      {{ reservationStore.errors.start_time[0] }}
                    </small>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Hora de Fin</label>
                    <select class="form-select" v-model="endTime" :disabled="!startTime" required>
                      <option disabled value="">Selecciona...</option>
                      <option v-for="time in availableEndTimes" :key="time" :value="time">
                        {{ time }}
                      </option>
                    </select>
                    <small v-if="reservationStore.errors.end_time" class="text-danger">
                      {{ reservationStore.errors.end_time[0] }}
                    </small>
                  </div>
                   <small v-if="!timeSlotsLoading && availableStartTimes.length === 0" class="text-danger px-3">
                    No hay horarios disponibles para este espacio en la fecha seleccionada.
                  </small>
                </div>
                 <div class="mb-3">
                  <label class="form-label">Propósito</label>
                  <input type="text" class="form-control" v-model="purpose" required>
                </div>

                <div v-if="reservationStore.errors.user_id" class="alert alert-danger">
                  {{ reservationStore.errors.user_id[0] }}
                </div>
                <button type="submit" class="btn btn-primary w-100">Confirmar Reservación</button>
              </form>
            </div>
            <div v-else>
              <div class="alert alert-warning" role="alert">
                No hay espacios disponibles para la fecha seleccionada. Por favor, elige otro día.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useReservationStore } from '@/stores/reservations';
import { useSpaceStore } from '@/stores/spaces';
import { DatePicker as VDatePicker } from 'v-calendar';
import 'v-calendar/style.css';
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const spaceStore = useSpaceStore();
const reservationStore = useReservationStore();
const router = useRouter();

const selectedDate = ref(null);
const selectedSpaceId = ref('');
const startTime = ref('');
const endTime = ref('');
const purpose = ref('');
const timeSlotsLoading = ref(false);

onMounted(() => {
  spaceStore.fetchSpaces();
  reservationStore.fetchReservations();
});

const dayMap = { monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6, sunday: 7 };

const disabledWeekdays = computed(() => {
  const availableDays = new Set();
  spaceStore.spaces.forEach(space => {
    if (space.attributes.availability) {
      Object.keys(space.attributes.availability).forEach(day => {
        availableDays.add(dayMap[day]);
      });
    }
  });
  const allDays = [1, 2, 3, 4, 5, 6, 7];
  return allDays.filter(day => !availableDays.has(day));
});

const availableSpaces = computed(() => {
  if (!selectedDate.value) return [];
  const dayOfWeek = strtolower(selectedDate.value.toLocaleDateString('en-US', { weekday: 'long' }));
  return spaceStore.spaces.filter(space => 
    space.attributes.availability && space.attributes.availability[dayOfWeek]
  );
});

const generateTimeIncrements = (start, end, incrementMinutes) => {
    const times = [];
    let currentTime = new Date(start);
    const endTime = new Date(end);
    while (currentTime < endTime) {
        times.push(new Date(currentTime));
        currentTime.setMinutes(currentTime.getMinutes() + incrementMinutes);
    }
    return times;
};

const allPossibleTimeSlots = computed(() => {
    if (!selectedSpaceId.value || !selectedDate.value) return [];
    const space = spaceStore.spaces.find(s => s.id === selectedSpaceId.value);
    if (!space) return [];
    const dayOfWeek = strtolower(selectedDate.value.toLocaleDateString('en-US', { weekday: 'long' }));
    const availability = space.attributes.availability[dayOfWeek];
    if (!availability) return [];
    const reservationDate = selectedDate.value.toISOString().split('T')[0];
    const allSlots = [];
    availability.forEach(slot => {
        const slotStart = new Date(`${reservationDate}T${slot.start}`);
        const slotEnd = new Date(`${reservationDate}T${slot.end}`);
        allSlots.push(...generateTimeIncrements(slotStart, slotEnd, 30));
    });
    return allSlots;
});

const availableStartTimes = computed(() => {
    const reservationDate = selectedDate.value.toISOString().split('T')[0];
    const existingReservations = reservationStore.reservations.filter(r => 
        r.space.id === selectedSpaceId.value && r.start_time.startsWith(reservationDate)
    );
    return allPossibleTimeSlots.value.filter(slotTime => {
        const slotEndTime = new Date(slotTime.getTime() + 30 * 60 * 1000);
        const isBooked = existingReservations.some(r => {
            const rStart = new Date(r.start_time);
            const rEnd = new Date(r.end_time);
            return (slotTime < rEnd && slotEndTime > rStart);
        });
        return !isBooked;
    }).map(date => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
});

const availableEndTimes = computed(() => {
    if (!startTime.value) return [];
    const reservationDate = selectedDate.value.toISOString().split('T')[0];
    const startDateTime = new Date(`${reservationDate}T${startTime.value}`);
    const space = spaceStore.spaces.find(s => s.id === selectedSpaceId.value);
    const dayOfWeek = strtolower(selectedDate.value.toLocaleDateString('en-US', { weekday: 'long' }));
    const availability = space.attributes.availability[dayOfWeek];
    let slotEndLimit = null;
    for (const slot of availability) {
        const slotStart = new Date(`${reservationDate}T${slot.start}`);
        const slotEnd = new Date(`${reservationDate}T${slot.end}`);
        if (startDateTime >= slotStart && startDateTime < slotEnd) {
            slotEndLimit = slotEnd;
            break;
        }
    }
    if (!slotEndLimit) return [];
    const existingReservations = reservationStore.reservations.filter(r => 
        r.space.id === selectedSpaceId.value && r.start_time.startsWith(reservationDate)
    );
    let nextBookingStart = null;
    existingReservations.forEach(r => {
        const rStart = new Date(r.start_time);
        if (rStart > startDateTime) {
            if (!nextBookingStart || rStart < nextBookingStart) {
                nextBookingStart = rStart;
            }
        }
    });
    const finalLimit = nextBookingStart && nextBookingStart < slotEndLimit ? nextBookingStart : slotEndLimit;
    const endTimes = [];
    let currentTime = new Date(startDateTime.getTime() + 30 * 60 * 1000);
    while (currentTime <= finalLimit) {
        endTimes.push(new Date(currentTime));
        currentTime.setMinutes(currentTime.getMinutes() + 30);
    }
    return endTimes.map(date => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
});

watch(selectedSpaceId, () => {
  startTime.value = '';
});

watch(startTime, () => {
    endTime.value = '';
});

const handleCreateReservation = async () => {
  if (!selectedDate.value || !selectedSpaceId.value || !startTime.value || !endTime.value || !purpose.value) {
    alert('Por favor, completa todos los campos.');
    return;
  }
  const dateStr = selectedDate.value.toISOString().split('T')[0];
  const payload = {
    space_id: selectedSpaceId.value,
    reservation_date: dateStr,
    start_time: `${dateStr} ${startTime.value}`,
    end_time: `${dateStr} ${endTime.value}`,
    purpose: purpose.value,
  };
  const success = await reservationStore.createReservation(payload);
  if (success) {
    router.push({ name: 'reservation' });
  }
};

function strtolower(str) {
  return str.toLowerCase();
}
</script>

