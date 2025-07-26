
import apiClient from '@/api/axios';
import router from '@/router';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('access_token') || null,
        errors: {},
    }),
    getters: {
        isAuthenticated: (state) => !!state.token && !!state.user,
        isAdmin: (state) => state.user?.role === 'admin',
    },
    actions: {
        async login(credentials) {
            try {
                const response = await apiClient.post('/login', credentials);
                const { user, access_token } = response.data;

                this.user = user;
                this.access_token = access_token;
                this.errors = {};

                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('access_token', access_token);

                return true;
            } catch (error) {
                console.error("Error en el login:", error);
                return false;
            }
        },
        async register(credentials) {
            try {
                await apiClient.post('/register', credentials);
                return await this.login({
                    email: credentials.email,
                    password: credentials.password,
                });
            } catch (error) {
                if (error.response && error.response.status === 422) {
                    this.errors = error.response.data.errors;
                } else {
                    console.error("Error en el registro:", error);
                }
                return false;
            }
        },
        async logout() {
            try {
                await apiClient.post('/logout');
            } catch (error) {
                console.error("Error al cerrar sesión en el backend:", error);
            } finally {
                this.user = null;
                this.access_token = null;
                localStorage.removeItem('user');
                localStorage.removeItem('access_token');
                router.push({ name: 'login' });
            }
        },
        async updateProfile(profileData) {
            this.errors = {};
            const { avatar, ...userData } = profileData;

            const formData = new FormData();
            formData.append('_method', 'POST');

            Object.keys(userData).forEach(key => {
                if (userData[key]) {
                    formData.append(key, userData[key]);
                }
            });

            if (avatar) {
                formData.append('avatar', avatar);
            }

            try {
                const response = await apiClient.post('/profile', formData);
                this.user = response.data.user;
                localStorage.setItem('user', JSON.stringify(this.user));
                return true;
            } catch (error) {
                if (error.response && error.response.status === 422) {
                    this.errors = error.response.data.errors;
                } else {
                    console.error("Error al actualizar el perfil:", error);
                }
                return false;
            }
        },
    },
});

