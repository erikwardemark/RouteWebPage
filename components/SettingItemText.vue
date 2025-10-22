<template>
    <div class="setting-card">
      <slot>
        <h2>{{ title }}</h2>
        <p> {{ description }}</p>
        <input v-model="setting" />
      </slot>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  currentSetting: {
    type: String,
    default: ''
  }
});
const setting = ref(props.currentSetting);
</script>

<style scoped>
.setting-card {
    display: grid;
    grid-template-columns: 1fr 1fr;
    border: 1px solid var(--primary-orange);
    border-radius: 5px;
    padding: 5px;
    margin-top: 5px;
    margin-bottom: 5px;
    background-color: var(--header-green);
    color: var(--text-white);
}
.setting-card input {
    height: fit-content;
    grid-row: 2;
    grid-column: span 2;
    align-self: end;
}
.setting-card h2 {
    grid-row: 1;
    grid-column: 1;
    margin: 5px;
}
.setting-card p {
    grid-row: 2;
    grid-column: 1;
    margin-top: 5px;
}
</style>