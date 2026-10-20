<script setup>
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  crumbs: { type: Array, default: () => [] }, // [{ label, path }]
  narrow: { type: Boolean, default: false },
});
</script>

<template>
  <section class="page-hero full-bleed">
    <div class="page-hero-inner" :class="{ narrow }">
      <nav v-if="crumbs.length" :aria-label="t('nav.breadcrumb')">
        <ol class="crumbs">
          <li v-for="(c, i) in crumbs" :key="i">
            <RouterLink v-if="c.path && i < crumbs.length - 1" :to="c.path">{{ c.label }}</RouterLink>
            <span v-else aria-current="page">{{ c.label }}</span>
          </li>
        </ol>
      </nav>
      <slot name="before" />
      <h1>{{ title }}</h1>
      <p v-if="subtitle" class="hero-subtitle">{{ subtitle }}</p>
      <slot />
    </div>
  </section>
</template>
