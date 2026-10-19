<script setup>
import { computed } from 'vue';
import { tx } from '../lib/text.js';

const props = defineProps({
  sign: { type: Object, default: null },
  lang: { type: String, required: true },
  size: { type: Number, default: 96 },
  // In a quiz the alt text must not give the answer away.
  quiz: { type: Boolean, default: false },
  decorative: { type: Boolean, default: false },
  eager: { type: Boolean, default: false },
});

const alt = computed(() => {
  if (props.decorative || !props.sign) return '';
  if (props.quiz) return props.lang === 'tr' ? 'Soru levhası' : 'Question sign';
  return tx(props.sign.image?.alt, props.lang) || tx(props.sign.name, props.lang);
});
</script>

<template>
  <img
    v-if="sign"
    :src="sign.image.src"
    :alt="alt"
    :width="size"
    :height="size"
    :loading="eager ? 'eager' : 'lazy'"
    decoding="async"
  />
</template>
