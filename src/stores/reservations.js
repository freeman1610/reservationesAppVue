// src/stores/reservations.js
import apiClient from '@/api/axios';
import { defineStore } from 'pinia';

export const useReservationStore = defineStore('reservations', {
    state: () => ({
        reservations: [],
        loading: false,
        errors: {},
    }),
    actions: {
        async fetchReservations() {
            this.loading = true;
            try {
                const response = await apiClient.get('/reservations');
                this.reservations = response.data.data;
            } catch (error) {
                console.error("Error fetching reservations:", error);
            } finally {
                this.loading = false;
            }
        },
        async createReservation(reservationData) {
            this.errors = {};
            try {
                await apiClient.post('/reservations', reservationData);
                return true;
            } catch (error) {
                if (error.response && error.response.status === 422) {
                    this.errors = error.response.data.errors;
                } else {
                    console.error("Error creating reservation:", error);
                }
                return false;
            }
        },
        async updateReservation(id, data) {
            try {
                await apiClient.put(`/reservations/${id}`, data);
                await this.fetchReservations();
            } catch (error) {
                console.error("Error updating reservation:", error);
            }
        },
        async cancelReservation(id) {
            try {
                await apiClient.delete(`/reservations/${id}`);
                await this.fetchReservations();
            } catch (error) {
                console.error("Error cancelling reservation:", error);
            }
        },
    },
});

