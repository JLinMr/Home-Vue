import { createApp } from 'vue';
import App from './App.vue';
import './style.less';
import { MotionPlugin } from '@vueuse/motion';
const app = createApp(App);

app.use(MotionPlugin);

app.mount('#app');