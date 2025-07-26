// src/stores/users.js
import apiClient from '@/api/axios';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('users', {
    state: () => ({
        users: [],
        loading: false,
        errors: {},
    }),
    actions: {
        async fetchUsers() {
            this.loading = true;
            try {
                const response = await apiClient.get('/users');
                this.users = response.data.data;
            } catch (error) {
                console.error("Error al obtener los usuarios:", error);
            } finally {
                this.loading = false;
            }
        },
        async saveUser(userData) {
            this.errors = {};
            const { avatar, ...user } = userData;

            const formData = new FormData();
            
            Object.keys(user).forEach(key => {
                if (user[key] !== null && user[key] !== undefined) {
                    formData.append(key, user[key]);
                }
            });

            if (avatar) {
                formData.append('avatar', avatar);
            }

            try {
                if (user.id) {
                    formData.append('_method', 'PUT');
                    await apiClient.post(`/users/${user.id}`, formData);
                } else {
                    await apiClient.post('/users', formData);
                }
                await this.fetchUsers();
                return true;
            } catch (error) {
                if (error.response && error.response.status === 422) {
                    this.errors = error.response.data.errors;
                } else {
                    console.error("Error al guardar el usuario:", error);
                }
                return false;
            }
        },
        async deleteUser(id) {
            try {
                await apiClient.delete(`/users/${id}`);
                await this.fetchUsers();
            } catch (error) {
                console.error("Error al eliminar el usuario:", error);
            }
        },
    },
});

