<template>
  <div class="form-wrapper">
    <h2>Реєстрація</h2>
    <form
        class="form"
        @submit.prevent="submitForm"
    >

      <div class="form-group" :class="{ 'error': errors.name }" >
        <label for="name">Ім'я</label>
        <input
          id="name"
          type="text"
          v-model="form.name"
          @blur="validateUserName"
        >
        <span class="error-message" v-if="errors.name">{{ errors.name }}</span>
      </div>

      <div class="form-group" :class="{ 'error': errors.email }">
        <label for="email">Email</label>
        <input
            id="email"
            type="email"
            v-model="form.email"
            @blur="validateUserEmail"
        >
        <span class="error-message" v-if="errors.email">{{ errors.email }}</span>
      </div>

      <div class="form-group">
        <label for="password">Пароль</label>
        <input
            id="password"
            type="password"
            v-model="form.password"
        >
      </div>
      <div class="form-group" :class="{ 'error': errors.checkPassword }">
        <label for="password_confirm">Підтверження пароля</label>
        <input
            id="password_confirm"
            type="password"
            v-model="form.checkPassword"
            @blur="validateUserConfirmPassword"
        >
        <span class="error-message" v-if="errors.checkPassword">{{ errors.checkPassword }}</span>
      </div>

      <button type="submit" :class="{ 'shake': showShake }">Зареєеструватися</button>

      <router-link to="/login">Вже маєте реєстрацію?</router-link>
    </form>
  </div>
</template>

<script>

import {reactive, computed, ref } from "vue";
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'BookShelfRegister',
  setup(){

    const authStore = useAuthStore()
    const router = useRouter()

    const form = reactive({
      name: '',
      email: '',
      password: '',
      checkPassword: ''
    })

    const errors = reactive({})
    const showShake = ref(false)

    const validationRules = {
      name: (value) => {
        if (!value) return 'Логин обязателен'
        if (value.length < 3) return 'Логин должен содержать минимум 3 символа'
        if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Логин может содержать только буквы, цифры и подчеркивания'
        return ''
      },
      email: (value) => {
        if (!value) return 'Email обязательный'
        const phoneRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!phoneRegex.test(value)) return 'email должен сожержать ххххх@xxxx.xxx'
        return ''
      },
      checkPassword: (value) => {
        if (value !== form.password) return 'Пароли не совпадают'
        return ''
      }
    }

    const validateField = (fieldName, value) => {
      const rule = validationRules[fieldName]
      if (rule) {
        errors[fieldName] = rule(value)
      }
    }

    const validateUserName = () => validateField('name', form.name)
    const validateUserEmail = () => validateField('email', form.email)
    const validateUserConfirmPassword = () => validateField('checkPassword', form.checkPassword)


    const isFormValid = computed(() => {
      return Object.values(errors).every(error => !error) &&
          form.name && form.email && form.password && form.checkPassword
    })
    const submitForm = async ()=>{

      Object.keys(form).forEach(field => {
        if(validationRules[field]) {
          validateField(field, form[field])
        }
      })

      if (isFormValid.value) {
        try {
          await authStore.register(form)
          await router.push('/book-shelf')
        } catch (error) {
          alert(error)
        }console.log('Форма отправлена:', form)
      } else {
        showShake.value = true
        setTimeout(() => showShake.value = false, 500)
      }
    }

    return{
      submitForm,
      form,
      errors,
      validateUserName,
      validateUserEmail,
      validateUserConfirmPassword,
      showShake
    }
  }
};
</script>

<style scoped>
@import "@/assets/style/auth.css";
</style>
