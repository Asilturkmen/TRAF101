<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { ExternalLink } from 'lucide-vue-next';
import { usePage, useLang } from '../composables/usePage.js';
import { pageById } from '../content/docs.js';
import { sources } from '../content/meta.js';
import { to, both } from '../lib/paths.js';
import { tx, fmtDate } from '../lib/text.js';
import PageHero from '../components/PageHero.vue';
import DocBody from '../components/DocBody.vue';

const { t } = useI18n();
const lang = useLang();
const doc = computed(() => pageById('sources'));
const copy = {
  tr: { title: 'Kaynaklar', groups: { official: 'Resmi kaynaklar', secondary: 'İkincil kaynaklar', reference: 'Genel başvuru kaynakları' }, checked: 'kontrol' },
  en: { title: 'Sources', groups: { official: 'Official sources', secondary: 'Secondary sources', reference: 'General references' }, checked: 'checked' },
};
const c = computed(() => copy[lang.value]);
const groups = computed(() =>
  ['official', 'secondary', 'reference'].map((k) => ({ kind: k, items: sources.filter((s) => s.kind === k) })).filter((g) => g.items.length),
);
usePage({
  title: computed(() => (doc.value ? tx(doc.value.title, lang.value) : c.value.title)),
  description: computed(() => (doc.value ? tx(doc.value.summary, lang.value) : '')),
  alternates: both((l) => to('sources', l)),
});
</script>

<template>
  <div>
    <PageHero
      :title="doc ? tx(doc.title, lang) : c.title"
      :subtitle="doc ? tx(doc.summary, lang) : ''"
      :crumbs="[{ label: t('nav.home'), path: to('home', lang) }, { label: c.title }]"
      narrow
    />
    <section class="section-block alt full-bleed">
      <div class="page-wrap sources-wrap">
        <DocBody v-if="doc" :doc="doc" :lang="lang" />
        <section v-for="g in groups" :key="g.kind" class="source-group">
          <h2>{{ c.groups[g.kind] }}</h2>
          <ol>
            <li v-for="s in g.items" :key="s.id" :id="`source-${s.id}`">
              <a :href="s.url" target="_blank" rel="noopener">
                {{ s.title }} <ExternalLink :size="14" aria-hidden="true" />
              </a>
              <span class="source-meta">{{ s.id.toUpperCase() }} · {{ c.checked }} {{ fmtDate(s.checkedAt, lang) }}</span>
            </li>
          </ol>
        </section>
      </div>
    </section>
  </div>
</template>

<style scoped>
.sources-wrap {
  max-width: 900px;
}
.source-group {
  margin-top: 2rem;
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: 1.75rem 2rem;
}
.source-group h2 {
  font-size: 1.375rem;
  margin-bottom: 1rem;
}
.source-group ol {
  padding-left: 1.25rem;
  display: grid;
  gap: 0.875rem;
}
.source-group li {
  color: var(--color-text-secondary);
}
.source-group a {
  color: var(--color-primary);
  font-weight: 600;
  word-break: break-word;
}
.source-meta {
  display: block;
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}
@media (max-width: 640px) {
  .source-group {
    padding: 1.25rem;
  }
}
</style>
