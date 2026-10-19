<script setup>
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { PencilLine } from 'lucide-vue-next';
import { usePage, useLang, absolute } from '../composables/usePage.js';
import { lessonBySlug } from '../content/docs.js';
import { topicById } from '../content/meta.js';
import { signById } from '../content/signs.js';
import { questionCount } from '../content/questions.js';
import { to, lessonPath, lessonPracticePath, signPath } from '../lib/paths.js';
import { tx, fmtDate } from '../lib/text.js';
import PageHero from '../components/PageHero.vue';
import DocBody from '../components/DocBody.vue';
import SignImage from '../components/SignImage.vue';
import NotFoundView from './NotFoundView.vue';

const { t } = useI18n();
const lang = useLang();
const route = useRoute();
const lesson = computed(() => lessonBySlug(lang.value, route.params.lesson));
const doc = computed(() => lesson.value?.doc);
const signs = computed(() => (doc.value?.relatedSigns || []).map(signById).filter(Boolean));
const count = computed(() => (lesson.value ? questionCount({ lesson: lesson.value.id }) : 0));
const copy = {
  tr: { topics: 'Konular', signs: 'Bu konunun levhaları', practise: (n) => `Bu konudan ${n} soru çöz`, practiseLead: 'Okuduğunu hemen soruyla pekiştir. Yanlışların Hatalarım’a eklenir.', checked: (d) => `Son kontrol: ${d}` },
  en: { topics: 'Topics', signs: 'Signs in this topic', practise: (n) => `Practise ${n} questions on this topic`, practiseLead: 'Lock in what you read with questions. Wrong answers go to My mistakes.', checked: (d) => `Last checked: ${d}` },
};
const c = computed(() => copy[lang.value]);

usePage({
  title: computed(() => (doc.value ? tx(doc.value.title, lang.value) : '404')),
  description: computed(() => (doc.value ? tx(doc.value.summary, lang.value) : '')),
  alternates: computed(() => (lesson.value ? { tr: lessonPath(lesson.value, 'tr'), en: lessonPath(lesson.value, 'en') } : null)),
  noindex: computed(() => !lesson.value),
  type: 'article',
  jsonLd: computed(() =>
    doc.value
      ? {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Test2Drive', item: absolute(to('home', lang.value)) },
            { '@type': 'ListItem', position: 2, name: c.value.topics, item: absolute(to('topics', lang.value)) },
            { '@type': 'ListItem', position: 3, name: tx(doc.value.title, lang.value) },
          ],
        }
      : null,
  ),
});
</script>

<template>
  <NotFoundView v-if="!lesson" embedded />
  <article v-else>
    <PageHero
      :title="tx(doc.title, lang)"
      :subtitle="tx(doc.summary, lang)"
      :crumbs="[{ label: t('nav.home'), path: to('home', lang) }, { label: c.topics, path: to('topics', lang) }, { label: tx(doc.title, lang) }]"
      narrow
    >
      <div class="hero-chips">
        <span class="hero-chip">{{ tx(topicById(lesson.topic)?.name, lang) }}</span>
      </div>
    </PageHero>
    <section class="section-block alt full-bleed">
      <div class="page-wrap lesson-wrap">
        <DocBody :doc="doc" :lang="lang" />

        <section v-if="signs.length" class="lesson-signs">
          <h2>{{ c.signs }}</h2>
          <ul>
            <li v-for="s in signs" :key="s.id">
              <RouterLink :to="signPath(s, lang)" class="sign-tile">
                <SignImage :sign="s" :lang="lang" :size="72" decorative />
                <span class="sign-tile-name">{{ tx(s.name, lang) }}</span>
              </RouterLink>
            </li>
          </ul>
        </section>

        <aside v-if="count" class="practise-card">
          <div>
            <h2>{{ c.practise(count) }}</h2>
            <p>{{ c.practiseLead }}</p>
          </div>
          <RouterLink :to="lessonPracticePath(lesson, lang)" class="btn btn-primary btn-large">
            <PencilLine :size="20" aria-hidden="true" /> {{ t('common.start') }}
          </RouterLink>
        </aside>
        <p class="checked">{{ c.checked(fmtDate(doc.reviewedAt, lang)) }}</p>
      </div>
    </section>
  </article>
</template>

<style scoped>
.lesson-wrap {
  max-width: 900px;
}
.lesson-signs {
  margin-top: 2rem;
}
.lesson-signs h2 {
  font-size: 1.375rem;
  margin-bottom: 1rem;
}
.lesson-signs ul {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.75rem;
}
.lesson-signs .sign-tile img {
  width: 72px;
  height: 72px;
}
.lesson-signs .sign-tile-name {
  font-size: 0.9375rem;
}
.practise-card {
  margin-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 1.75rem 2rem;
  background: white;
  border: 2px solid var(--color-primary);
  border-radius: var(--radius-xl);
}
.practise-card h2 {
  font-size: 1.375rem;
  margin-bottom: 0.375rem;
}
.practise-card p {
  font-size: 1rem;
}
.checked {
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}
@media (max-width: 640px) {
  .practise-card {
    flex-direction: column;
    align-items: stretch;
    padding: 1.5rem 1.25rem;
  }
  .lesson-signs ul {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
