<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { sourceById } from '../content/meta.js';
import { signById } from '../content/signs.js';
import { signPath } from '../lib/paths.js';
import { tx } from '../lib/text.js';

const props = defineProps({
  item: { type: Object, required: true }, // anything with basis, sourceId, sourceRef or signId
  lang: { type: String, required: true },
});
const { t } = useI18n();
const source = computed(() => (props.item.sourceId ? sourceById(props.item.sourceId) : null));
const sign = computed(() => (props.item.basis === 'sign' ? signById(props.item.signId) : null));
</script>

<template>
  <p v-if="item.basis === 'practice'" class="basis-line">
    <span class="basis-tag practice">{{ t('basis.practice') }}:</span>
    <span>{{ t('basis.practiceNote') }}</span>
  </p>
  <p v-else-if="sign" class="basis-line">
    <span class="basis-tag">{{ t('basis.sign') }}:</span>
    <RouterLink :to="signPath(sign, lang)">{{ tx(sign.name, lang) }}</RouterLink>
  </p>
  <p v-else-if="source" class="basis-line">
    <span class="basis-tag">{{ item.basis === 'secondary' ? t('basis.secondary') : t('basis.law') }}:</span>
    <a :href="source.url" target="_blank" rel="noopener">{{ source.title }}</a>
    <span v-if="item.sourceRef">· {{ item.sourceRef }}</span>
  </p>
</template>
