<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { SearchX } from 'lucide-vue-next';
import { useHead } from '@unhead/vue';
import { useLang } from '../composables/usePage.js';
import { to } from '../lib/paths.js';
import StateBlock from '../components/StateBlock.vue';

const props = defineProps({ embedded: { type: Boolean, default: false } });
const lang = useLang();
const copy = {
  tr: { title: 'Bu sayfa yok', text: 'Adres değişmiş ya da yanlış yazılmış olabilir. Aradığın levha listede olabilir.', signs: 'Levhalar', home: 'Ana sayfa' },
  en: { title: 'This page does not exist', text: 'The address may have changed or been mistyped. The sign you are looking for may be in the list.', signs: 'Signs', home: 'Home' },
};
const c = computed(() => copy[lang.value]);
if (!props.embedded) {
  useHead(() => ({
    title: `${c.value.title} | Test2Drive`,
    htmlAttrs: { lang: lang.value },
    meta: [{ name: 'robots', content: 'noindex' }],
  }));
}
</script>

<template>
  <section class="section-block alt full-bleed notfound">
    <StateBlock :title="c.title" :text="c.text">
      <template #icon><SearchX :size="36" /></template>
      <RouterLink :to="to('signs', lang)" class="btn btn-primary">{{ c.signs }}</RouterLink>
      <RouterLink :to="to('home', lang)" class="btn btn-secondary">{{ c.home }}</RouterLink>
    </StateBlock>
  </section>
</template>

<style scoped>
.notfound {
  min-height: 55vh;
  display: flex;
  align-items: center;
}
</style>
