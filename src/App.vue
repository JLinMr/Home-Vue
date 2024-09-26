<template>
  <div class="background"></div>
  <div class="content">
    <Home />
  </div>
  <div class="footer">
      <span>© 2024 Made in <a href="/" target="_blank">{{ userName }}</a></span>
      <a v-if="icpNumber" href="https://beian.miit.gov.cn/" target="_blank">{{ icpNumber }}</a>
      <a v-if="policenumber" href="https://beian.mps.gov.cn/#/query/webSearch" target="_blank" class="police_link"> <span class="police_img"></span> {{ policenumber }}</a>
  </div>
</template>

<script>
import { ref } from 'vue';
import Home from './components/Home.vue';

export default {
  components: {
    Home,
  },
  setup() {
    const currentComponent = ref('Home');
    const userName = ref(import.meta.env.VITE_APP_USER_NAME);
    const icpNumber = ref(import.meta.env.VITE_APP_ICP_NUMBER);
    const policenumber = ref(import.meta.env.VITE_APP_POLICE_NUMBER);

    return {
      currentComponent,
      userName,
      icpNumber,
      policenumber,
    };
  }
};
</script>

<style scoped>

</style>