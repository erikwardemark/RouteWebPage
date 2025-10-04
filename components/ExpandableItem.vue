<template>
  <div class="expandable-item">
    <div class="item-header" @click="toggle">
      <slot name="header">
        {{ title }}
      </slot>
      <span class="icon">{{ isOpen ? '-' : '+' }}</span>
    </div>
    <transition name="expand">
      <div v-if="isOpen" class="item-content">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: 'Expandable Title'
  }
});

const isOpen = ref(false);

function toggle() {
  isOpen.value = !isOpen.value;
}
</script>

<style scoped>
.expandable-item {
  border: 1px solid var(--primary-orange);
  margin-bottom: 5px;
  border-radius: 4px;
  overflow: hidden; /* Important for smooth transitions */
}
.expandable-item h1 {
    text-align: center;
}
.expandable-item p {
    text-align: left;
    padding-left: 5px;
    padding-bottom: 2px;
    margin-bottom: none;
    border-bottom: none ;
}

.item-header {
  background-color: var(--header-green);
  padding: 10px 15px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text-white);
}

.item-header:hover {
  background-color: var(--active-green);
}

.icon {
  font-weight: bold;
}

.item-content {
  padding: 15px;
  border-top: 1px solid var(--primary-orange);
}

/* Transition styles */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease-out;
  max-height: 500px; /* Adjust as needed, should be larger than any possible content height */
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 500px; /* Same as above */
}
</style>