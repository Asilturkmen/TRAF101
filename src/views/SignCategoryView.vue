<script setup>
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { usePage, useLang } from '../composables/usePage.js';
import { categoryBySlug, signsInCategory, countLabel } from '../content/signs.js';
import { to, categoryPath, signPath } from '../lib/paths.js';
import { tx } from '../lib/text.js';
import PageHero from '../components/PageHero.vue';
import SignImage from '../components/SignImage.vue';
import NotFoundView from './NotFoundView.vue';

const { t } = useI18n();
const lang = useLang();
const route = useRoute();
const category = computed(() => categoryBySlug(lang.value, route.params.category));
const list = computed(() => (category.value ? signsInCategory(category.value.id) : []));
const copy = {
  tr: { signs: 'Levhalar', rehearse: 'Bu levhalarla prova yap', core: 'Sınavda sık sorulanlar', others: 'Diğer levhalar' },
  en: { signs: 'Signs', rehearse: 'Rehearse with these signs', core: 'Most often asked', others: 'Other signs' },
};
const c = computed(() => copy[lang.value]);
const core = computed(() => list.value.filter((s) => s.examPriority === 'core'));
const others = computed(() => list.value.filter((s) => s.examPriority !== 'core'));

usePage({
  title: computed(() => (category.value ? tx(category.value.name, lang.value) : '404')),
  description: computed(() => (category.value ? tx(category.value.description, lang.value) : '')),
  alternates: computed(() => (category.value ? { tr: categoryPath(category.value, 'tr'), en: categoryPath(category.value, 'en') } : null)),
  noindex: computed(() => !category.value),
});
</script>

<template>
  <NotFoundView v-if="!category" embedded />
  <div v-else>
    <PageHero
      :title="tx(category.name, lang)"
      :subtitle="tx(category.description, lang)"
      :crumbs="[
        { label: t('nav.home'), path: to('home', lang) },
        { label: c.signs, path: to('signs', lang) },
        { label: tx(category.name, lang) },
      ]"
    >
      <div class="hero-chips">
        <span class="hero-chip">{{ countLabel(category.id, list.length, lang) }}</span>
      </div>
    </PageHero>

    <section class="section-block alt full-bleed">
      <div class="page-wrap">
        <template v-for="group in [{ title: c.core, items: core }, { title: c.others, items: others }]" :key="group.title">
          <template v-if="group.items.length">
            <h2 class="group-title">{{ group.title }}</h2>
            <ul class="tile-grid">
              <li v-for="s in group.items" :key="s.id">
                <RouterLink :to="signPath(s, lang)" class="sign-tile">
                  <SignImage :sign="s" :lang="lang" decorative />
                  <span class="sign-tile-name">{{ tx(s.name, lang) }}</span>
                  <span v-if="lang === 'en'" class="sign-tile-alt" lang="tr">{{ s.name.tr }}</span>
                </RouterLink>
              </li>
            </ul>
          </template>
        </template>
        <p class="rehearse-link">
          <RouterLink :to="{ path: to('signExam', lang), query: { c: category.id } }" class="btn btn-primary btn-large">{{ c.rehearse }}</RouterLink>
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.group-title {
  font-size: 1.5rem;
  margin: 0 0 1.25rem;
}
.tile-grid + .group-title {
  margin-top: 2.5rem;
}
.tile-grid {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
}
.rehearse-link {
  margin-top: 2.5rem;
  text-align: center;
}
@media (max-width: 640px) {
  .tile-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;
  }
}
</style>
