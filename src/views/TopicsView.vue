<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { BookOpen, PencilLine } from 'lucide-vue-next';
import { usePage, useLang } from '../composables/usePage.js';
import { lessons } from '../content/docs.js';
import { topics } from '../content/meta.js';
import { questionCount } from '../content/questions.js';
import { to, lessonPath, lessonPracticePath, both } from '../lib/paths.js';
import { tx } from '../lib/text.js';
import PageHero from '../components/PageHero.vue';

const { t } = useI18n();
const lang = useLang();
const copy = {
  tr: {
    title: 'Konular',
    subtitle: 'Sınavın kapsadığı her konu için kısa bir okuma ve o konunun soruları. Okuması birkaç dakika sürer.',
    read: 'Oku',
    practise: (n) => `${n} soru çöz`,
  },
  en: {
    title: 'Topics',
    subtitle: 'A short read for every topic the exam covers, plus the questions for that topic. Each takes a few minutes.',
    read: 'Read',
    practise: (n) => `Practise ${n} questions`,
  },
};
const c = computed(() => copy[lang.value]);
usePage({ title: computed(() => c.value.title), description: computed(() => c.value.subtitle), alternates: both((l) => to('topics', l)) });

const groups = computed(() =>
  topics.map((tp) => ({ topic: tp, items: lessons.filter((l) => l.topic === tp.id) })).filter((g) => g.items.length),
);
</script>

<template>
  <div>
    <PageHero :title="c.title" :subtitle="c.subtitle" :crumbs="[{ label: t('nav.home'), path: to('home', lang) }, { label: c.title }]" />
    <section class="section-block alt full-bleed">
      <div class="page-wrap">
        <section v-for="g in groups" :key="g.topic.id" class="topic-group">
          <h2>{{ tx(g.topic.name, lang) }}</h2>
          <ul class="lesson-grid">
            <li v-for="l in g.items" :key="l.id" class="card lesson-card">
              <h3>
                <RouterLink :to="lessonPath(l, lang)" class="lesson-link">{{ tx(l.doc.title, lang) }}</RouterLink>
              </h3>
              <p>{{ tx(l.doc.summary, lang) }}</p>
              <div class="lesson-actions">
                <RouterLink :to="lessonPath(l, lang)" class="btn btn-secondary" tabindex="-1" aria-hidden="true">
                  <BookOpen :size="18" aria-hidden="true" /> {{ c.read }}
                </RouterLink>
                <RouterLink v-if="questionCount({ lesson: l.id })" :to="lessonPracticePath(l, lang)" class="btn btn-ghost">
                  <PencilLine :size="18" aria-hidden="true" /> {{ c.practise(questionCount({ lesson: l.id })) }}
                </RouterLink>
              </div>
            </li>
          </ul>
        </section>
      </div>
    </section>
  </div>
</template>

<style scoped>
.topic-group + .topic-group {
  margin-top: 3rem;
}
.topic-group > h2 {
  font-size: 1.625rem;
  margin-bottom: 1.25rem;
}
.lesson-grid {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}
.lesson-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: relative;
}
.lesson-card h3 {
  font-size: 1.25rem;
}
.lesson-link {
  color: var(--color-text);
  text-decoration: none;
}
.lesson-link:hover {
  color: var(--color-primary);
  text-decoration: underline;
}
.lesson-card p {
  font-size: 1rem;
  flex: 1;
}
.lesson-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.lesson-actions .btn {
  padding: 0.625rem 1rem;
  font-size: 0.9375rem;
  width: auto;
}
@media (max-width: 1024px) {
  .lesson-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 640px) {
  .lesson-grid {
    grid-template-columns: 1fr;
  }
  .lesson-actions .btn {
    flex: 1;
  }
}
</style>
