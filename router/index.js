import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Start.vue';
import Map from '../views/Map.vue';
import Settings from '../views/Settings.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/map/:id/', name: 'Map', component: Map },
  { path: '/settings', name: 'Settings', component: Settings }
];

export default createRouter({
  history: createWebHistory(),
  routes
});