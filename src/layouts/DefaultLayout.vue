<template>
  <div class="header">
    <div class="header-container">
      <h1>{{ title }}</h1>
      <RouterLink to="/book-shelf">Увійти як гість ?</RouterLink>
    </div>
  </div>
  <div class="layout-container">
    <slot></slot>
  </div>
</template>


<script>

import { useRoute } from "vue-router";
import { computed } from "vue";

export default {
  name: 'DefaultLayout',
  setup() {

    const route = useRoute()

    const title = computed(() => {
    return route.meta.header
  });

  return {
    title,
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

.layout-container {
  max-width: 992px;
  margin: 75px auto;
}
</style>
