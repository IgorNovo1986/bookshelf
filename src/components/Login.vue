<template>
  <div class="form-wrapper">
    <h2>Логін</h2>
    <form
        class="form"
        @submit.prevent="submitForm"
    >
      <div class="form-group" :class="{ 'error': !isEmailValid && emailTouched }">
        <label for="email">Email</label>
        <input
            id="email"
            type="email"
            v-model="form.email"
            @blur="emailTouched = true"
            required
        >
        <span class="error-message" v-if="!isEmailValid && emailTouched">Введіть корректний email</span>
      </div>
      <div class="form-group" :class="{ 'error': !isPasswordValid && passwordTouched }">
        <label for="password">Пароль</label>
        <input
            id="password"
            type="password"
            v-model="form.password"
            required
            @blur="passwordTouched = true"
        >
        <span class="error-message" v-if="!isPasswordValid && passwordTouched">Введіть корректний password</span>
      </div>

      <button type="submit" :disabled="!isFormValid">Логін</button>

      <router-link to="/register">Ще не зареєстровані?</router-link>
    </form>
  </div>
</template>

<script>

import {computed, reactive, ref} from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

export default {
  name: 'BookShelfLogin',
  setup() {

    const authStore = useAuthStore()
    const router = useRouter()

    const form = reactive({
      email: '',
      password: '',
    })

    const emailTouched = ref(false)
    const passwordTouched = ref(false)

    const isEmailValid = computed(()=>{
      const emailRegex =/^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(form.email)
    })
    const isPasswordValid =computed(()=> form.password.length >= 6)

    const isFormValid = computed(()=> isEmailValid.value && isPasswordValid.value)
    const submitForm = async ()=>{

      emailTouched.value = true
      passwordTouched.value = true

      if (isFormValid.value) {
        try {
          await authStore.login(form.email, form.password)
          await router.push('/book-shelf')
        } catch (error) {
          alert(error)
        }
      }
    }

    return {
      form,
      submitForm,
      emailTouched,
      passwordTouched,
      isPasswordValid,
      isEmailValid,
      isFormValid
    }
  }
};
</script>

<style scoped>
@import "@/assets/style/auth.css";
</style>
