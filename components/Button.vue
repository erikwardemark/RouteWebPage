<template>
    <button @click="onClick">
        {{ label }}
    </button>
</template>

<script setup>
const props = defineProps({
    label: {
        type: String,
        default: 'Button'
    },
    onClick: {
        type: Function,
        default: () => { }
    }
})
</script>

<style scoped>
button {
  background-color: var(--primary-orange);
  color: var(--text-white);
  border: none;
  padding: 12px 25px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin: 5px;
  margin-bottom: 20px;
}
button:hover {
  background-color: var(--active-orange);
}
</style>
