<script setup>
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ArrowRight, Search } from 'lucide-vue-next';
import { usePage, useLang } from '../composables/usePage.js';
import { categories, signs, signsInCategory } from '../content/signs.js';
import { to, categoryPath, signPath, both } from '../lib/paths.js';
import { tx } from '../lib/text.js';
import PageHero from '../components/PageHero.vue';
import SignImage from '../components/SignImage.vue';

const { t } = useI18n();
const lang = useLang();
const copy = {
  tr: {
    title: 'Trafik levhaları',
    subtitle: 'KKTC’de karşına çıkacak levhalar, biçimlerine ve renklerine göre. Her levhanın anlamı, ne yapman gerektiği ve neyle karıştırıldığı kendi sayfasında.',
    search: 'Levha ara',
    placeholder: 'Örneğin: dur, viraj, park',
    results: (n) => `${n} levha bulundu`,
    none: 'Bu adla bir levha bulamadık. Başka bir kelime dene.',
    explore: 'Tüm levhaları gör',
    more: (n) => `+${n}`,
    rehearse: 'Levha sınavı provasına gir',
    rehearseText: 'Bugünkü sözlü sınavda müfettiş levha sorar. Provada levhayı görür, anlamını söyler, sonra cevabı açarsın.',
  },
  en: {
    title: 'Road signs',
    subtitle: 'The signs you will meet in North Cyprus, grouped by shape and colour. Each sign has its own page: what it means, what to do and what it is confused with.',
    search: 'Search signs',
    placeholder: 'For example: stop, bend, parking',
    results: (n) => `${n} signs found`,
    none: 'No sign matches that word. Try another one.',
    explore: 'See all signs',
    more: (n) => `+${n}`,
    rehearse: 'Start the sign exam rehearsal',
    rehearseText: 'In today’s oral exam the inspector asks about signs. In the rehearsal you see a sign, say what it means, then reveal the answer.',
  },
};
const c = computed(() => copy[lang.value]);
usePage({
  title: computed(() => c.value.title),
  description: computed(() => c.value.subtitle),
  alternates: both((l) => to('signs', l)),
});

const query = ref('');
const norm = (s) => s.toLocaleLowerCase('tr').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ı/g, 'i');
const results = computed(() => {
  const q = norm(query.value.trim());
  if (q.length < 2) return null;
  return signs.filter((s) => norm(`${s.name.tr} ${s.name.en} ${(s.aka?.tr || []).join(' ')} ${(s.aka?.en || []).join(' ')}`).includes(q));
});
</script>

<template>
  <div class="signs-hub">
    <PageHero :title="c.title" :subtitle="c.subtitle" :crumbs="[{ label: t('nav.home'), path: to('home', lang) }, { label: c.title }]">
      <form class="sign-search" role="search" @submit.prevent>
        <label for="sign-search" class="visually-hidden">{{ c.search }}</label>
        <Search :size="20" class="search-icon" aria-hidden="true" />
        <input id="sign-search" v-model="query" type="search" :placeholder="c.placeholder" autocomplete="off" />
      </form>
    </PageHero>

    <section class="categories-section full-bleed">
      <div class="section-padding">
        <div v-if="results" class="search-results">
          <p class="results-count" role="status">{{ results.length ? c.results(results.length) : c.none }}</p>
          <ul class="tile-grid">
            <li v-for="s in results" :key="s.id">
              <RouterLink :to="signPath(s, lang)" class="sign-tile">
                <SignImage :sign="s" :lang="lang" decorative />
                <span class="sign-tile-name">{{ tx(s.name, lang) }}</span>
                <span v-if="lang === 'en'" class="sign-tile-alt" lang="tr">{{ s.name.tr }}</span>
              </RouterLink>
            </li>
          </ul>
        </div>

        <ul v-else class="categories-grid">
          <li v-for="cat in categories" :key="cat.id">
            <RouterLink :to="categoryPath(cat, lang)" class="category-card card">
              <div class="category-header">
                <h2>{{ tx(cat.name, lang) }}</h2>
                <span class="category-count">{{ t('common.signsCount', { n: signsInCategory(cat.id).length }) }}</span>
              </div>
              <div class="category-body">
                <p>{{ tx(cat.description, lang) }}</p>
                <div class="signs-preview-grid" aria-hidden="true">
                  <div v-for="s in signsInCategory(cat.id).slice(0, 7)" :key="s.id" class="preview-item">
                    <SignImage :sign="s" :lang="lang" :size="56" decorative />
                  </div>
                  <div v-if="signsInCategory(cat.id).length > 7" class="preview-more">
                    {{ c.more(signsInCategory(cat.id).length - 7) }}
                  </div>
                </div>
              </div>
              <div class="category-footer">
                <span class="explore-text">{{ c.explore }}</span>
                <ArrowRight :size="22" class="arrow-icon" aria-hidden="true" />
              </div>
            </RouterLink>
          </li>
        </ul>

        <aside class="rehearse-card">
          <div>
            <h2>{{ c.rehearse }}</h2>
            <p>{{ c.rehearseText }}</p>
          </div>
          <RouterLink :to="to('signExam', lang)" class="btn btn-primary">{{ c.rehearse }}</RouterLink>
        </aside>
      </div>
    </section>
  </div>
</template>

<style scoped>
.sign-search {
  position: relative;
  max-width: 520px;
  margin-top: 1.5rem;
}
.sign-search input {
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
.sign-search input:focus-visible {
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
.categories-section {
  padding: 2.5rem 1.5rem 3.5rem;
  background: var(--color-bg-light);
}
.categories-grid {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
}
.category-card {
  overflow: hidden;
  padding: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  text-decoration: none;
  color: inherit;
}
.category-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-2xl);
}
.category-header {
  padding: 1.25rem 1.5rem;
  background: var(--gradient-primary);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
.category-header h2 {
  font-size: 1.375rem;
  color: white;
}
.category-count {
  background: rgba(255, 255, 255, 0.25);
  padding: 0.375rem 0.875rem;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.875rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  white-space: nowrap;
}
.category-body {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.category-body p {
  color: var(--color-text-secondary);
  margin-bottom: 1.25rem;
  line-height: 1.6;
  font-size: 0.9375rem;
}
.signs-preview-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  margin-top: auto;
}
.preview-item {
  aspect-ratio: 1;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.preview-item img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.preview-more {
  aspect-ratio: 1;
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}
.category-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.explore-text {
  font-weight: 700;
  color: var(--color-primary);
  font-size: 1.0625rem;
}
.arrow-icon {
  color: var(--color-primary);
  transition: transform var(--transition-base);
}
.category-card:hover .arrow-icon {
  transform: translateX(6px);
}
.search-results {
  max-width: 1400px;
  margin: 0 auto;
}
.results-count {
  margin-bottom: 1.25rem;
  font-weight: 600;
}
.tile-grid {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 1rem;
}
.rehearse-card {
  max-width: 1400px;
  margin: 2.5rem auto 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 1.75rem 2rem;
  background: white;
  border: 2px solid var(--color-primary);
  border-radius: var(--radius-xl);
}
.rehearse-card h2 {
  font-size: 1.375rem;
  margin-bottom: 0.375rem;
}
.rehearse-card p {
  font-size: 1rem;
}
@media (max-width: 1024px) {
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 640px) {
  .categories-section {
    padding: 1.5rem 1rem 2.5rem;
  }
  .categories-grid {
    grid-template-columns: 1fr;
  }
  .tile-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .rehearse-card {
    flex-direction: column;
    align-items: stretch;
    padding: 1.5rem 1.25rem;
  }
}
</style>
