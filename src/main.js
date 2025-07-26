// src/main.js
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { createPinia } from 'pinia';
import VCalendar from 'v-calendar'; // Importar v-calendar
import { createApp } from 'vue';

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(VCalendar, {}); // Usar el plugin

app.mount('#app');
