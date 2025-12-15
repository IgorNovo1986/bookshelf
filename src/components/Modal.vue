<template>
  <div
      :style="{ display: isVisible ? 'block' : 'none' }"
      :class="{ 'fade-in': isVisible }"
      class="modal"
  >
    <div class="modal-content">
      <div class="modal-content__header">
        <h1>{{ title }}</h1>
        <span class="close" @click="closeModal">X</span>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>

import { ref, onMounted  } from 'vue';
export default {
  name: 'ModalApp',
  props: {
    title: {
      type: String,
      required: true
    },
    delay: {
      type: Number,
      default: 5000
    },
    isVisibleProps: {
      type: Boolean,
      default: true
    }
  },

  emits: ['closeModal'],
  setup(props, { emit }) {

    const isVisible = ref(props.isVisibleProps)

    const closeModal = () => {
      emit('closeModal', false);
    }

    onMounted(() => {
      setTimeout(() => {
        isVisible.value = true
      }, props.delay)
    })

    return {
      props,
      isVisible,
      closeModal
    }
  }
}

</script>

<style scoped>

.modal{
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.modal-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-width: 500px;
}

.modal-content__header{
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-content__header .close {
  cursor: pointer;
}

.fade-in {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
