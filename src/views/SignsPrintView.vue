<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Printer } from 'lucide-vue-next';
import { usePage, useLang } from '../composables/usePage.js';
import { categories, signsInCategory } from '../content/signs.js';
import { examProfile } from '../content/meta.js';
import { to, both } from '../lib/paths.js';
import { tx, fmtDate } from '../lib/text.js';
import PageHero from '../components/PageHero.vue';
import SignImage from '../components/SignImage.vue';

const { t } = useI18n();
const lang = useLang();
const other = computed(() => (lang.value === 'tr' ? 'en' : 'tr'));
const copy = {
  tr: {
    title: 'Yazdırılabilir levha listesi',
    subtitle: 'Bütün levhalar tek sayfada, Türkçe ve İngilizce adlarıyla. Yazdırıp yanında taşıyabilir ya da PDF olarak kaydedebilirsin.',
    print: 'Yazdır ya da PDF olarak kaydet',
    signs: 'Levhalar',
    footer: (d) => `Test2Drive · Levha çizimleri CC0 · İçerik son kontrol: ${d}`,
  },
  en: {
    title: 'Printable sign list',
    subtitle: 'Every sign on one page, with its Turkish and English names. Print it to carry with you or save it as a PDF.',
    print: 'Print or save as PDF',
    signs: 'Signs',
    footer: (d) => `Test2Drive · Sign artwork CC0 · Content last checked: ${d}`,
  },
};
const c = computed(() => copy[lang.value]);
usePage({ title: computed(() => c.value.title), description: computed(() => c.value.subtitle), alternates: both((l) => to('signsPrint', l)) });
const groups = computed(() => categories.map((cat) => ({ cat, items: signsInCategory(cat.id) })).filter((g) => g.items.length));
function printPage() {
  window.print();
}
</script>

<template>
  <div class="print-page">
    <PageHero
      :title="c.title"
      :subtitle="c.subtitle"
      :crumbs="[{ label: t('nav.home'), path: to('home', lang) }, { label: c.signs, path: to('signs', lang) }, { label: c.title }]"
    >
      <button type="button" class="btn btn-secondary print-btn" @click="printPage">
        <Printer :size="20" aria-hidden="true" /> {{ c.print }}
      </button>
    </PageHero>
    <section class="section-block white full-bleed">
      <div class="page-wrap">
        <h1 class="print-title">{{ c.title }}</h1>
        <section v-for="g in groups" :key="g.cat.id" class="print-group">
          <h2>{{ tx(g.cat.name, lang) }} <span :lang="other">· {{ g.cat.name[other] }}</span></h2>
          <ul class="print-grid">
            <li v-for="s in g.items" :key="s.id" class="print-item">
              <SignImage :sign="s" :lang="lang" :size="64" decorative eager />
              <span class="name">{{ tx(s.name, lang) }}</span>
              <span class="name-other" :lang="other">{{ s.name[other] }}</span>
            </li>
          </ul>
        </section>
        <p class="print-footer">{{ c.footer(fmtDate(examProfile.checkedAt, lang)) }}</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.print-btn {
  margin-top: 1.25rem;
  width: auto;
}
.print-title {
  display: none;
}
.print-group + .print-group {
  margin-top: 2rem;
}
.print-group h2 {
  font-size: 1.375rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--color-primary);
}
.print-group h2 span {
  font-weight: 600;
  color: var(--color-text-secondary);
  font-size: 1rem;
}
.print-grid {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.75rem;
}
.print-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.375rem;
  padding: 0.75rem 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  break-inside: avoid;
}
.print-item img {
  width: 64px;
  height: 64px;
  object-fit: contain;
}
.name {
  font-weight: 700;
  font-size: 0.9375rem;
  line-height: 1.3;
  color: var(--color-text);
}
.name-other {
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  line-height: 1.3;
}
.print-footer {
  margin-top: 2rem;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}
@media (max-width: 640px) {
  .print-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media print {
  .print-page :deep(.page-hero) {
    display: none;
  }
  .print-title {
    display: block;
    font-size: 18pt;
    margin-bottom: 12pt;
  }
  .section-block {
    padding: 0;
  }
  .print-grid {
    grid-template-columns: repeat(6, 1fr);
    gap: 6pt;
  }
  .print-item {
    padding: 6pt 4pt;
  }
  .print-item img {
    width: 48px;
    height: 48px;
  }
  .name {
    font-size: 8pt;
  }
  .name-other {
    font-size: 7pt;
  }
  .print-group {
    break-inside: auto;
  }
  .print-group h2 {
    font-size: 12pt;
    break-after: avoid;
  }
}
</style>
