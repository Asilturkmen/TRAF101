<script setup>
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ArrowRight } from 'lucide-vue-next';
import { usePage, useLang } from '../composables/usePage.js';
import { pageById } from '../content/docs.js';
import { to } from '../lib/paths.js';
import { tx, fmtDate } from '../lib/text.js';
import PageHero from '../components/PageHero.vue';
import DocBody from '../components/DocBody.vue';
import StateBlock from '../components/StateBlock.vue';

const { t } = useI18n();
const lang = useLang();
const route = useRoute();
const PAGE_ID = { exam: 'exam', licence: 'licence', leftDriving: 'left-driving', about: 'about', privacy: 'privacy' };
const key = computed(() => route.meta.key);
const doc = computed(() => pageById(PAGE_ID[key.value]));

// Each guide ends with the next useful step.
const NEXT = {
  exam: [{ route: 'signExam', tr: 'Levha sınavı provasına gir', en: 'Start the sign exam rehearsal' }, { route: 'mock', tr: 'Yazılı sınav provasına gir', en: 'Start the written exam rehearsal' }],
  licence: [{ route: 'exam', tr: 'Sınav nasıl yapılır', en: 'How the exam works' }, { route: 'leftDriving', tr: 'Soldan trafik rehberi', en: 'Driving on the left' }],
  leftDriving: [{ route: 'lesson', params: 'junctions', tr: 'Kavşaklar ve çember konusunu oku', en: 'Read about junctions and roundabouts' }, { route: 'scenarios', tr: 'Senaryoları dene', en: 'Try the scenarios' }],
  about: [{ route: 'sources', tr: 'Kaynaklar', en: 'Sources' }, { route: 'privacy', tr: 'Gizlilik', en: 'Privacy' }],
  privacy: [{ route: 'progress', tr: 'İlerlemeni yönet', en: 'Manage your progress' }],
};
import { lessonPath } from '../lib/paths.js';
const nextLinks = computed(() =>
  (NEXT[key.value] || []).map((n) => ({
    label: n[lang.value],
    path: n.route === 'lesson' ? lessonPath(n.params, lang.value) : to(n.route, lang.value),
  })),
);

usePage({
  title: computed(() => (doc.value ? tx(doc.value.title, lang.value) : '')),
  description: computed(() => (doc.value ? tx(doc.value.summary, lang.value) : '')),
  alternates: computed(() => ({ tr: to(key.value, 'tr'), en: to(key.value, 'en') })),
  type: 'article',
});
</script>

<template>
  <div v-if="doc">
    <PageHero
      :title="tx(doc.title, lang)"
      :subtitle="tx(doc.summary, lang)"
      :crumbs="[{ label: t('nav.home'), path: to('home', lang) }, { label: tx(doc.title, lang) }]"
      narrow
    />
    <section class="section-block alt full-bleed">
      <div class="page-wrap guide-wrap">
        <DocBody :doc="doc" :lang="lang" />
        <nav v-if="nextLinks.length" class="next-links" :aria-label="lang === 'tr' ? 'Sonraki adım' : 'Next step'">
          <RouterLink v-for="l in nextLinks" :key="l.path" :to="l.path" class="next-link">
            <span>{{ l.label }}</span>
            <ArrowRight :size="20" aria-hidden="true" />
          </RouterLink>
        </nav>
        <p class="checked">{{ lang === 'tr' ? 'Son kontrol' : 'Last checked' }}: {{ fmtDate(doc.reviewedAt, lang) }}</p>
      </div>
    </section>
  </div>
  <StateBlock v-else :title="t('common.loading')" loading />
</template>

<style scoped>
.guide-wrap {
  max-width: 900px;
}
.next-links {
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}
.next-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 64px;
  padding: 1rem 1.5rem;
  background: white;
  border: 2px solid var(--color-primary);
  border-radius: var(--radius-lg);
  color: var(--color-primary);
  font-weight: 700;
  text-decoration: none;
  transition: all var(--transition-base);
}
.next-link:hover {
  background: var(--color-primary);
  color: white;
}
.checked {
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}
</style>
