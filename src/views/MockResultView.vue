<script setup>
import { computed, onMounted, ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { Trophy, RotateCcw, ClipboardList } from 'lucide-vue-next';
import { usePage, useLang } from '../composables/usePage.js';
import { useProgress } from '../stores/progress.js';
import { trackById, topicById } from '../content/meta.js';
import { questionById } from '../content/questions.js';
import { to, mockPath, both } from '../lib/paths.js';
import { tx, fmtDuration, fmtPercent } from '../lib/text.js';
import PageHero from '../components/PageHero.vue';
import QuestionCard from '../components/QuestionCard.vue';
import StateBlock from '../components/StateBlock.vue';

const { t } = useI18n();
const lang = useLang();
const route = useRoute();
const progress = useProgress();
const ready = ref(false);
onMounted(() => {
  progress.load();
  ready.value = true;
});

const attempt = computed(() => {
  const list = progress.mockAttempts;
  return list.find((a) => a.id === route.query.id) || list[list.length - 1] || null;
});
const track = computed(() => (attempt.value ? trackById(attempt.value.track) : null));
// Review uses the answer key frozen when the exam was taken.
const questions = computed(() =>
  attempt.value
    ? attempt.value.questionIds
        .map(questionById)
        .filter(Boolean)
        .map((q) => ({
          ...q,
          answer: attempt.value.key?.[q.id] ?? q.answer,
          updated: (attempt.value.revs?.[q.id] ?? q.rev ?? 1) !== (q.rev || 1),
        }))
    : [],
);
const wrong = computed(() => questions.value.filter((q) => attempt.value.answers[q.id] !== q.answer));
const showAll = ref(false);
const reviewList = computed(() => (showAll.value ? questions.value : wrong.value));

const copy = {
  tr: {
    title: 'Deneme sonucu',
    mock: 'Deneme sınavı',
    passed: (a, b) => `Bu denemeyi geçtin: ${b} soruda ${a} doğru`,
    failed: (a, b) => `Bu sefer olmadı: ${b} soruda ${a} doğru`,
    short: (a, b) => `${b} soruda ${a} doğru`,
    shortNote: 'Soru bankası bu araç için henüz tam olmadığından bu deneme tam uzunlukta değildi; geçti ya da kaldı sayılmadı.',
    passMark: (p) => `Geçer not ${p} doğru`,
    time: 'Süre',
    timeUp: 'Süre doldu',
    wrongNote: (n) => (n ? `${n} yanlışın Hatalarım’a eklendi.` : 'Hiç yanlışın yok.'),
    byTopic: 'Konulara göre',
    topic: 'Konu',
    score: 'Doğru',
    review: 'Yanlışların',
    reviewAll: 'Bütün sorular',
    showAll: 'Bütün soruları göster',
    showWrong: 'Yalnız yanlışları göster',
    again: 'Yeni deneme',
    mistakes: 'Hatalarım',
    progress: 'İlerleme',
    none: 'Henüz bir deneme sonucu yok',
    noneText: 'Bir deneme sınavını bitirdiğinde sonucu burada görürsün.',
    start: 'Deneme sınavına gir',
    note: 'Bu bir provadır; gerçek sınavın sonucunu göstermez.',
    updated: 'Bu soru sınavından sonra güncellendi. Puanın, sınav anındaki cevap anahtarına göre hesaplandı.',
  },
  en: {
    title: 'Mock exam result',
    mock: 'Mock exam',
    passed: (a, b) => `You passed this mock: ${a} of ${b} correct`,
    failed: (a, b) => `Not this time: ${a} of ${b} correct`,
    short: (a, b) => `${a} of ${b} correct`,
    shortNote: 'The question bank for this vehicle is not complete yet, so this mock was shorter than the real format and is not counted as a pass or fail.',
    passMark: (p) => `Pass mark ${p} correct`,
    time: 'Time',
    timeUp: 'Time ran out',
    wrongNote: (n) => (n ? `${n} wrong answers were added to My mistakes.` : 'No wrong answers.'),
    byTopic: 'By topic',
    topic: 'Topic',
    score: 'Correct',
    review: 'Your wrong answers',
    reviewAll: 'All questions',
    showAll: 'Show all questions',
    showWrong: 'Show wrong answers only',
    again: 'New mock exam',
    mistakes: 'My mistakes',
    progress: 'Progress',
    none: 'No mock exam result yet',
    noneText: 'When you finish a mock exam, the result appears here.',
    start: 'Take a mock exam',
    note: 'This is a rehearsal; it does not predict the result of the real exam.',
    updated: 'This question was updated after your exam. Your score used the answer key from the time of the exam.',
  },
};
const c = computed(() => copy[lang.value]);
usePage({ title: computed(() => c.value.title), description: computed(() => c.value.note), alternates: both((l) => to('mockResult', l)), noindex: true });

const headline = computed(() => {
  const a = attempt.value;
  if (!a) return '';
  if (!a.fullLength) return c.value.short(a.correct, a.total);
  return a.passed ? c.value.passed(a.correct, a.total) : c.value.failed(a.correct, a.total);
});
</script>

<template>
  <div class="quiz-page">
    <PageHero
      :title="c.title"
      :crumbs="[{ label: t('nav.home'), path: to('home', lang) }, { label: c.mock, path: to('mock', lang) }, { label: c.title }]"
      narrow
    />
    <div class="quiz-container">
      <StateBlock v-if="!ready" :title="t('common.loading')" loading />
      <StateBlock v-else-if="!attempt" :title="c.none" :text="c.noneText">
        <template #icon><ClipboardList :size="36" /></template>
        <RouterLink :to="to('mock', lang)" class="btn btn-primary">{{ c.start }}</RouterLink>
      </StateBlock>
      <template v-else>
        <div class="results-card result-summary" :class="{ passed: attempt.passed }">
          <Trophy v-if="attempt.passed" :size="52" :stroke-width="1.5" class="results-icon" aria-hidden="true" />
          <ClipboardList v-else :size="52" :stroke-width="1.5" class="results-icon" aria-hidden="true" />
          <h2>{{ headline }}</h2>
          <div class="score-number">{{ attempt.correct }} / {{ attempt.total }}</div>
          <div class="score-percentage">{{ fmtPercent((attempt.correct / attempt.total) * 100, lang) }}</div>
          <ul class="result-facts">
            <li v-if="attempt.fullLength">{{ c.passMark(attempt.passMark) }}</li>
            <li>{{ c.time }}: {{ fmtDuration(attempt.duration, lang) }}<span v-if="attempt.timeUp"> · {{ c.timeUp }}</span></li>
            <li>{{ track ? tx(track.name, lang) : '' }}</li>
          </ul>
          <p v-if="!attempt.fullLength" class="short-note">{{ c.shortNote }}</p>
          <p class="results-message">{{ c.wrongNote(wrong.length) }} {{ c.note }}</p>
          <div class="results-actions">
            <RouterLink v-if="track" :to="mockPath(track, lang)" class="btn btn-primary"><RotateCcw :size="18" aria-hidden="true" /> {{ c.again }}</RouterLink>
            <RouterLink :to="to('mistakes', lang)" class="btn btn-secondary">{{ c.mistakes }}</RouterLink>
          </div>
        </div>

        <section class="topic-table card">
          <h2>{{ c.byTopic }}</h2>
          <table>
            <caption class="visually-hidden">{{ c.byTopic }}</caption>
            <thead>
              <tr><th scope="col">{{ c.topic }}</th><th scope="col">{{ c.score }}</th><th scope="col"><span class="visually-hidden">%</span></th></tr>
            </thead>
            <tbody>
              <tr v-for="(v, k) in attempt.byTopic" :key="k">
                <th scope="row">{{ tx(topicById(k)?.name, lang) }}</th>
                <td>{{ v[0] }} / {{ v[1] }}</td>
                <td class="bar-cell">
                  <span class="bar" aria-hidden="true"><span :style="{ width: (v[0] / v[1]) * 100 + '%' }" /></span>
                  <span class="pct">{{ fmtPercent((v[0] / v[1]) * 100, lang) }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <section class="review">
          <div class="review-head">
            <h2>{{ showAll ? c.reviewAll : c.review }}</h2>
            <button type="button" class="btn btn-ghost" @click="showAll = !showAll">{{ showAll ? c.showWrong : c.showAll }}</button>
          </div>
          <div class="review-list">
            <div v-for="q in reviewList" :key="q.id" class="review-item">
            <p v-if="q.updated" class="updated-note">{{ c.updated }}</p>
            <QuestionCard
              :question="q"
              :lang="lang"
              mode="review"
              :model-value="attempt.answers[q.id] || null"
              :seed="attempt.seed"
              :number="attempt.questionIds.indexOf(q.id) + 1"
              :total="attempt.total"
              :autofocus="false"
            />
            </div>
          </div>
        </section>
      </template>
    </div>
  </div>
</template>

<style scoped>
.result-summary {
  margin: 0 auto 2rem;
}
.results-icon {
  color: var(--color-primary);
  margin-bottom: 0.75rem;
}
.result-summary.passed .results-icon {
  color: var(--color-success-text);
}
.result-facts {
  list-style: none;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem 1.25rem;
  margin-top: 1rem;
  color: var(--color-text-secondary);
  font-weight: 600;
}
.short-note {
  margin-top: 1rem;
  font-size: 0.9375rem;
  background: var(--color-warning-bg);
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
}
.topic-table h2 {
  font-size: 1.375rem;
  margin-bottom: 1rem;
}
.topic-table table {
  width: 100%;
  border-collapse: collapse;
}
.topic-table th,
.topic-table td {
  text-align: left;
  padding: 0.75rem 0.5rem;
  border-bottom: 1px solid var(--color-border-light);
  font-size: 1rem;
}
.topic-table thead th {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}
.topic-table td {
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
.bar-cell {
  width: 40%;
}
.bar {
  display: inline-block;
  vertical-align: middle;
  width: calc(100% - 3.5rem);
  height: 8px;
  background: var(--color-bg-tertiary);
  border-radius: 50px;
  overflow: hidden;
  margin-right: 0.5rem;
}
.bar span {
  display: block;
  height: 100%;
  background: var(--gradient-primary);
}
.pct {
  font-weight: 700;
}
.review {
  margin-top: 2rem;
}
.review-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}
.review-head h2 {
  font-size: 1.5rem;
}
.review-head .btn {
  width: auto;
}
.review-list {
  display: grid;
  gap: 1.25rem;
}
.updated-note {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin-bottom: 0.5rem;
}
@media (max-width: 640px) {
  .bar-cell {
    width: auto;
  }
  .bar {
    display: none;
  }
}
</style>
