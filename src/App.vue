<template>
  <component :is="layout">
    <router-view></router-view>

    <template v-if="isModal">
      <modal-app
          v-if="modal.modal"
          :title="modal.modalTitle"
          :delay="modal.delay"
          :isVisibleProps="modal.isVisible"
          @closeModal="handleCloseModal"
      >
        <component :is="modal.modal"/>
      </modal-app>
    </template>
  </component>
</template>

<script>

import DefaultLayout from "@/layouts/DefaultLayout.vue"
import ModalApp from "@/components/Modal.vue";
import Register from "@/components/Register.vue";

import { computed, ref } from "vue";
import { useRoute } from "vue-router"
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'MainApp',
  components: {
    ModalApp,
    Register
  },
  setup() {

    const route = useRoute()
    const authStore = useAuthStore()

    const isModal = (ref(true))

    const modal = computed(()=> {
      if (route.name === "cart" && !authStore.isAuthenticate){
        return {
          modal: Register,
          delay: 2000,
          modalTitle: '',
          isVisible: false
        }
      }
      return {
        Modal: null
      }
    })

    const handleCloseModal = (e) => {
      isModal.value = e
    }

    const layout = computed(() => {
      return route.meta.layout || DefaultLayout;
    });
    return {
      layout,
      modal,
      handleCloseModal,
      isModal
    };
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 30px;
}
</style>
