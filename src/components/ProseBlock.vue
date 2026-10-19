<script setup>
import { computed } from 'vue';
import { proseToHtml } from '../lib/text.js';

const props = defineProps({ text: { type: String, default: '' } });
// Content is escaped before the three allowed markups are applied (see lib/text.js).
const html = computed(() => proseToHtml(props.text));
</script>

<template>
  <div class="prose" v-html="html" />
</template>
