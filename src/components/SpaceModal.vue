<!-- src/components/SpaceModal.vue -->
<template>
  <div class="modal fade" :id="modalId" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ formTitle }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <form @submit.prevent="submitForm">
          <div class="modal-body">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Nombre</label>
                <input type="text" class="form-control" v-model="editableSpace.name" required>
                <small v-if="spaceStore.errors.name" class="text-danger">{{ spaceStore.errors.name[0] }}</small>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Tipo</label>
                <select class="form-select" v-model="editableSpace.type" required>
                  <option value="room">Sala (Room)</option>
                  <option value="desk">Escritorio (Desk)</option>
                  <option value="hall">Salón (Hall)</option>
                </select>
                 <small v-if="spaceStore.errors.type" class="text-danger">{{ spaceStore.errors.type[0] }}</small>
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Descripción</label>
              <textarea class="form-control" v-model="editableSpace.description" required></textarea>
              <small v-if="spaceStore.errors.description" class="text-danger">{{ spaceStore.errors.description[0] }}</small>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Capacidad</label>
                <input type="number" class="form-control" v-model="editableSpace.capacity" required>
                <small v-if="spaceStore.errors.capacity" class="text-danger">{{ spaceStore.errors.capacity[0] }}</small>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Ubicación</label>
                <input type="text" class="form-control" v-model="editableSpace.location" required>
                <small v-if="spaceStore.errors.location" class="text-danger">{{ spaceStore.errors.location[0] }}</small>
              </div>
            </div>

            <hr>
            <h5>Disponibilidad Semanal</h5>
            <small v-if="spaceStore.errors.availability" class="d-block text-danger mb-2">{{ spaceStore.errors.availability[0] }}</small>
            <div v-for="day in daysOfWeek" :key="day" class="mb-3">
              <div class="form-check mb-2">
                <input class="form-check-input" type="checkbox" :id="day" @change="toggleDay(day, $event.target.checked)">
                <label class="form-check-label text-capitalize" :for="day">{{ day }}</label>
              </div>
              <div v-if="editableSpace.availability && editableSpace.availability[day]" class="ms-4">
                <div v-for="(slot, index) in editableSpace.availability[day]" :key="index" class="d-flex align-items-center mb-2">
                  <input type="time" class="form-control me-2" v-model="slot.start" required>
                  <span>-</span>
                  <input type="time" class="form-control mx-2" v-model="slot.end" required>
                  <!-- <button type="button" class="btn btn-sm btn-danger" @click="removeSlot(day, index)">X</button> -->
                </div>
                <!-- <button type="button" class="btn btn-sm btn-outline-primary" @click="addSlot(day)">Añadir Horario</button> -->
              </div>
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
import { useSpaceStore } from '@/stores/spaces';
import { computed, nextTick, ref, watch } from 'vue';

const props = defineProps({
  space: Object,
  modalId: { type: String, default: 'spaceModal' }
});

const emit = defineEmits(['form-submit']);

const spaceStore = useSpaceStore();
const editableSpace = ref({ availability: {} });
const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const formTitle = computed(() => editableSpace.value.id ? 'Editar Espacio' : 'Crear Espacio');

const updateCheckboxes = async () => {
  await nextTick();
  daysOfWeek.forEach(day => {
    const checkbox = document.getElementById(day);
    if (checkbox) {
      checkbox.checked = !!(editableSpace.value.availability && editableSpace.value.availability[day]);
    }
  });
};

watch(() => props.space, (newSpace) => {
    if (newSpace && typeof newSpace.availability === 'string') {
        try {
            newSpace.availability = JSON.parse(newSpace.availability);
        } catch (e) {
            console.error("Error al parsear availability:", e);
            newSpace.availability = {};
        }
    }
    editableSpace.value = JSON.parse(JSON.stringify(newSpace || { availability: {} }));
    updateCheckboxes();
}, { immediate: true, deep: true });

const toggleDay = (day, isChecked) => {
  if (!editableSpace.value.availability) {
      editableSpace.value.availability = {};
  }
  if (isChecked) {
    if (!editableSpace.value.availability[day]) {
      editableSpace.value.availability[day] = [{ start: '09:00', end: '17:00' }];
    }
  } else {
    delete editableSpace.value.availability[day];
  }
};

// const addSlot = (day) => {
//   editableSpace.value.availability[day].push({ start: '09:00', end: '17:00' });
// };

// const removeSlot = (day, index) => {
//   editableSpace.value.availability[day].splice(index, 1);
//   if (editableSpace.value.availability[day].length === 0) {
//     delete editableSpace.value.availability[day];
//     updateCheckboxes();
//   }
// };

const submitForm = () => {
  const payload = JSON.parse(JSON.stringify(editableSpace.value));
  
  if (payload.availability) {
    payload.availability = JSON.stringify(payload.availability);
  }
  emit('form-submit', payload);
};
</script>

