<script setup>
defineProps({
  title: { type: String, required: true },
  text: { type: String, default: '' },
  loading: { type: Boolean, default: false },
});
</script>

<template>
  <div v-if="loading" class="loading-state" role="status">
    <div class="spinner" aria-hidden="true" />
    <p>{{ title }}</p>
  </div>
  <div v-else class="state-block">
    <div class="state-icon" aria-hidden="true"><slot name="icon" /></div>
    <h2>{{ title }}</h2>
    <p v-if="text">{{ text }}</p>
    <div class="state-actions"><slot /></div>
  </div>
</template>
