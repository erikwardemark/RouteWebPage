import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Start.vue';
import Map from '../views/Map.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/map/:id/', name: 'Map', component: Map },
];

export default createRouter({
  history: createWebHistory(),
  routes
});