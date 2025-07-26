import apiClient from '@/api/axios';
import { defineStore } from 'pinia';

export const useReportStore = defineStore('reports', {
    state: () => ({
        reservationsBySpace: [],
        activeUsers: [],
        loading: false,
    }),
    actions: {
        async fetchReservationsBySpace(params) {
            this.loading = true;
            try {
                const response = await apiClient.get('/reports/reservations-by-space', { params });
                this.reservationsBySpace = response.data.data;
            } catch (error) {
                console.error("Error fetching reservations by space report:", error);
            } finally {
                this.loading = false;
            }
        },
        async fetchActiveUsers() {
            this.loading = true;
            try {
                const response = await apiClient.get('/reports/active-users');
                this.activeUsers = response.data.data;
            } catch (error) {
                console.error("Error fetching active users report:", error);
            } finally {
                this.loading = false;
            }
        },
    },
});

