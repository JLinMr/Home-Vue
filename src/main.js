import { createApp } from 'vue';
import App from './App.vue';
import './style.less';
import Vue3TypedJs from 'vue3-typed-js';
import { MotionPlugin } from '@vueuse/motion';
const app = createApp(App);

app.use(Vue3TypedJs);
app.use(MotionPlugin);

app.mount('#app');