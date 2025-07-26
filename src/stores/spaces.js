import apiClient from '@/api/axios';
import { defineStore } from 'pinia';

export const useSpaceStore = defineStore('spaces', {
    state: () => ({
        spaces: [],
        loading: false,
        errors: {},
    }),
    actions: {
         async fetchSpaces(filters = {}) {
            this.loading = true;
            try {
                // Clean up empty filter values before sending
                const cleanFilters = Object.fromEntries(
                    Object.entries(filters).filter(([, v]) => v !== null && v !== '')
                );
                const response = await apiClient.get('/spaces', { params: cleanFilters });
                this.spaces = response.data.data;
            } catch (error) {
                console.error("Error fetching spaces:", error);
            } finally {
                this.loading = false;
            }
        },
        async saveSpace(space) {
            this.errors = {};
            try {
                if (space.id) {
                    await apiClient.put(`/spaces/${space.id}`, space);
                } else {
                    await apiClient.post('/spaces', space);
                }
                await this.fetchSpaces();
                return true;
            } catch (error) {
                if (error.response && error.response.status === 422) {
                    this.errors = error.response.data.errors;
                } else {
                    console.error("Error al guardar el espacio:", error);
                }
                return false;
            }
        },
        async deleteSpace(id) {
            try {
                await apiClient.delete(`/spaces/${id}`);
                await this.fetchSpaces();
            } catch (error) {
                console.error("Error al eliminar el espacio:", error);
            }
        },
    },
});

