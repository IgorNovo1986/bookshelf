<template>
  <div class="header">
    <div class="header-container">
      <h1>{{ title }}</h1>

      <div class="header-container__action">

        <div
            class="avatar-wrapper"
            v-if="isAuthenticate"
        >
          <p
              class="avatar"
              @click="handleAccountMenu">{{ getUser?.name?.slice(0, 2) }}
          </p>
          <div
              class="account-menu"
              v-if="accountMenuIsOpen"
              @click="logout">
            Вийти
          </div>
        </div>
        <RouterLink to="/login" v-else>Логін</RouterLink>

        <div class="cart-wrapper">
          <RouterLink to="/cart">
            <img
              src="/images/icon-cart-1.png"
              alt="icon-cart"
              class="cart"
            />
          </RouterLink>
          <span v-if="getUser?.books?.length">{{ getUser?.books?.length }}</span>
        </div>
      </div>
    </div>
  </div>
  <div class="layout-container">
    <slot></slot>
  </div>
</template>

<script>

import {useRoute, useRouter} from "vue-router";
import {computed, onMounted, ref} from "vue";
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'CustomLayout',
  setup() {

    const route = useRoute()
    const router = useRouter()
    const authStore = useAuthStore()

    const accountMenuIsOpen = ref(false)


    const title = computed(() => {
      return route.meta.header
    });

    const getUser = computed(() => {
      return authStore.currentUser
    })

    const isAuthenticate = computed(() => {
      return authStore.isAuthenticate
    })


    const logout = async () => {
      await authStore.logout()
      await router.push('/login')
    }

    const handleAccountMenu = () => {
      if (accountMenuIsOpen.value === false) {
        accountMenuIsOpen.value = true
      } else { accountMenuIsOpen.value = false }
    }

    onMounted(async  ()=>{
      await authStore.init()
    })

    return {
      title,
      getUser,
      logout,
      handleAccountMenu,
      accountMenuIsOpen,
      isAuthenticate
    };
  }
};
</script>

<style scoped>
  .header{
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 0 20px;
    background-color: rgba(211, 211, 211, 0.2);
  }

  .header-container{
    max-width: 1920px;
    justify-content: space-between;
    align-items: center;
    display: flex;
    margin: 10px auto;
  }

  .header-container__action{
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .avatar-wrapper{
    position: relative;
  }

  .account-menu{
    position: absolute;
    right: 0;
    border: 1px solid lightgray;
    padding: 30px;
    background-color: white;
    font-size: 24px;
    cursor: pointer;
  }

  .header-container__action .avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: 2px solid black;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px;
    font-weight: bold;
    cursor: pointer;
    text-transform: uppercase;
  }

  .cart-wrapper{
    position: relative;
  }

  .cart-wrapper span{
    position: absolute;
    font-size: 24px;
    background-color: black;
    color: white;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    top: -10px;
    right: -10px;
  }

  .cart{
    width: 50px;
    height: 50px;
    cursor: pointer;
  }

  .layout-container {
    max-width: 1920px;
    margin: 20px auto;
  }
</style>
