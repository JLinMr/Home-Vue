import { createApp } from 'vue';
import App from './App.vue';
import './style.less';
import { MotionPlugin } from '@vueuse/motion';
import { Icon } from '@iconify/vue';
const app = createApp(App);

app.use(MotionPlugin);
app.component('Icon', Icon);

app.mount('#app');