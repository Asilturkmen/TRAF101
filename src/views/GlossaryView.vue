<script setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Search } from 'lucide-vue-next';
import { usePage, useLang } from '../composables/usePage.js';
import { glossary } from '../content/docs.js';
import { to, both } from '../lib/paths.js';
import { tx } from '../lib/text.js';
import PageHero from '../components/PageHero.vue';

const { t } = useI18n();
const lang = useLang();
const copy = {
  tr: {
    title: 'Terim sözlüğü',
    subtitle: 'Sitede, yolda ve sınavda geçen trafik terimlerinin Türkçe ve İngilizce karşılıkları. Aynı kavram sitenin her yerinde aynı adla geçer.',
    search: 'Terim ara',
    placeholder: 'Örneğin: yol vermek, çember',
    tr: 'Türkçe',
    en: 'İngilizce',
    note: 'Not',
    count: (n) => `${n} terim`,
    none: 'Bu kelimeyle bir terim bulamadık.',
  },
  en: {
    title: 'Glossary',
    subtitle: 'Turkish and English for the traffic terms you meet on this site, on the road and in the exam. Each concept uses the same name everywhere on the site.',
    search: 'Search terms',
    placeholder: 'For example: give way, roundabout',
    tr: 'Turkish',
    en: 'English',
    note: 'Note',
    count: (n) => `${n} terms`,
    none: 'No term matches that word.',
  },
};
const c = computed(() => copy[lang.value]);
usePage({ title: computed(() => c.value.title), description: computed(() => c.value.subtitle), alternates: both((l) => to('glossary', l)) });

const query = ref('');
const norm = (s) => String(s || '').toLocaleLowerCase('tr').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ı/g, 'i');
const sorted = computed(() => [...glossary].sort((a, b) => a[lang.value].localeCompare(b[lang.value], lang.value === 'tr' ? 'tr' : 'en')));
const rows = computed(() => {
  const q = norm(query.value.trim());
  if (!q) return sorted.value;
  return sorted.value.filter((g) => norm(`${g.tr} ${g.en}`).includes(q));
});
const first = computed(() => (lang.value === 'tr' ? 'tr' : 'en'));
const second = computed(() => (lang.value === 'tr' ? 'en' : 'tr'));
</script>

<template>
  <div>
    <PageHero :title="c.title" :subtitle="c.subtitle" :crumbs="[{ label: t('nav.home'), path: to('home', lang) }, { label: c.title }]" narrow>
      <form class="term-search" role="search" @submit.prevent>
        <label for="term-search" class="visually-hidden">{{ c.search }}</label>
        <Search :size="20" class="search-icon" aria-hidden="true" />
        <input id="term-search" v-model="query" type="search" :placeholder="c.placeholder" autocomplete="off" />
      </form>
    </PageHero>
    <section class="section-block alt full-bleed">
      <div class="page-wrap glossary-wrap">
        <p class="count" role="status">{{ rows.length ? c.count(rows.length) : c.none }}</p>
        <div class="card table-card">
          <table>
            <caption class="visually-hidden">{{ c.title }}</caption>
            <thead>
              <tr>
                <th scope="col">{{ c[first] }}</th>
                <th scope="col">{{ c[second] }}</th>
                <th scope="col">{{ c.note }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="g in rows" :key="g.id" :id="`term-${g.id}`">
                <th scope="row" :lang="first">{{ g[first] }}</th>
                <td :lang="second">{{ g[second] }}</td>
                <td class="note">{{ tx(g.note, lang) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.term-search {
  position: relative;
  max-width: 520px;
  margin-top: 1.5rem;
}
.term-search input {
  width: 100%;
  min-height: 52px;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border-radius: var(--radius-lg);
  border: 2px solid transparent;
  font: inherit;
  font-size: 1.0625rem;
  color: var(--color-text);
  background: white;
}
.term-search input:focus-visible {
  outline: 3px solid white;
  outline-offset: 2px;
}
.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-muted);
}
.glossary-wrap {
  max-width: 960px;
}
.count {
  font-weight: 600;
  margin-bottom: 1rem;
}
.table-card {
  padding: 0.5rem 1rem;
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  text-align: left;
  padding: 0.75rem 0.5rem;
  border-bottom: 1px solid var(--color-border-light);
  font-size: 1rem;
  vertical-align: top;
}
thead th {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}
tbody th {
  font-weight: 700;
  color: var(--color-text);
}
.note {
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
}
@media (max-width: 640px) {
  .table-card {
    padding: 0.25rem 0.5rem;
  }
  th,
  td {
    padding: 0.625rem 0.375rem;
    font-size: 0.9375rem;
  }
}
</style>
