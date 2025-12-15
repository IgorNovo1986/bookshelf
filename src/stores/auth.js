import { defineStore } from "pinia";
import { authService } from "@/services/auth";

export const useAuthStore = defineStore('auth', {
    state:() => ({
        user: null,
        isLoading: false,
        error: null
    }),

    getters: {
        isAuthenticate: (state) => !!state.user || !!JSON.parse(localStorage.getItem('bookstore_current_user')),
        currentUser: (state) => state.user || JSON.parse(localStorage.getItem('bookstore_current_user'))
    },

    actions: {
        init () {
            const user = authService.getCurrentUser()
            if (user) {
                this.user = user
            }
        },

        async register(userData){
            this.isLoading = true
            this.error = null

            try {
                const user = authService.register(userData)
                this.user = user
                return user
            } catch (e) {
                this.error = e.message
                throw e
            } finally {
                this.loading = false
            }
        },

        async login (email, password) {
            this.isLoading = true
            this.error = null

            try {
                const user = authService.login(email, password)
                this.user = user
                return user
            } catch (e) {
                this.error = e.message
                throw e
            } finally {
                this.loading = false
            }
        },

        async logout () {
            try {
                await authService.logout()
            }catch (e){
                console.log(e)
            }
        }
    }
})