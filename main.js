import {createApp} from 'vue';
import App from './App.vue';
import router from './router';
import Notifications from '@kyvg/vue3-notification';
import './assets/global.css';

createApp(App)
    .use(router)
    .use(Notifications)
    .mount('#app');