<script setup>
// One view for Today's review, topic practice and My mistakes: immediate feedback,
// every answer feeds the Leitner schedule, wrong answers come back once at the end.
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { PartyPopper, CircleAlert, Inbox } from 'lucide-vue-next';
import { usePage, useLang } from '../composables/usePage.js';
import { usePool } from '../composables/usePool.js';
import { lessonMetaBySlug } from '../content/meta.js';
import { buildDailyReview, buildLessonPractice, buildMistakes } from '../lib/sessions.js';
import { dayNumber, inMistakes } from '../lib/leitner.js';
import { to, lessonPath, lessonPracticePath, lessonTitle, both } from '../lib/paths.js';
import { tx } from '../lib/text.js';
import PageHero from '../components/PageHero.vue';
import QuestionCard from '../components/QuestionCard.vue';
import StateBlock from '../components/StateBlock.vue';
import NotFoundView from './NotFoundView.vue';

const { t } = useI18n();
const lang = useLang();
const route = useRoute();
const { progress, pool, bank, ready: poolReady } = usePool();
const mode = computed(() => route.meta.key); // review | lessonPractice | mistakes

const lessonMeta = computed(() => (mode.value === 'lessonPractice' ? lessonMetaBySlug(lang.value, route.params.lesson) : null));
const lesson = computed(() =>
  lessonMeta.value && lessonTitle(lessonMeta.value.id) ? { ...lessonMeta.value, doc: { title: lessonTitle(lessonMeta.value.id) } } : null,
);

const copy = {
  tr: {
    review: { title: 'Bugünkü tekrar', subtitle: 'Zamanı gelen sorular, yanlışların ve yeni sorular. Her cevaptan sonra nedenini görürsün.' },
    mistakes: { title: 'Hatalarım', subtitle: 'Yanlış cevapladığın sorular. Farklı günlerde iki kez doğru cevaplayınca listeden çıkar.' },
    lessonPractice: { title: (n) => `Konu çalışması: ${n}`, subtitle: 'Bu konunun soruları, en az bildiklerinden başlayarak.' },
    practise: 'Çalış',
    doneTitle: 'Tur bitti',
    done: (a, b) => `${b} sorunun ${a} tanesini ilk denemede doğru cevapladın.`,
    wrongList: 'Bu turda yanlış yaptıkların',
    again: 'Yeni tur',
    toMistakes: 'Hatalarım',
    toHub: 'Çalış merkezi',
    emptyMistakes: 'Hatalarım boş',
    emptyMistakesText: 'Yanlış cevapladığın sorular burada toplanır. Şu an tekrar etmen gereken bir yanlışın yok.',
    startReview: 'Bugünkü tekrara başla',
    requeue: 'Bu soruyu turun sonunda tekrar soracağız.',
    readLesson: 'Konuyu oku',
  },
  en: {
    review: { title: 'Today’s review', subtitle: 'Questions that are due, your mistakes and new ones. After each answer you see why.' },
    mistakes: { title: 'My mistakes', subtitle: 'Questions you answered wrongly. Get one right on two different days and it leaves the list.' },
    lessonPractice: { title: (n) => `Topic practice: ${n}`, subtitle: 'The questions for this topic, starting with the ones you know least.' },
    practise: 'Practise',
    doneTitle: 'Round complete',
    done: (a, b) => `You got ${a} of ${b} right on the first try.`,
    wrongList: 'Wrong in this round',
    again: 'New round',
    toMistakes: 'My mistakes',
    toHub: 'Practise hub',
    emptyMistakes: 'My mistakes is empty',
    emptyMistakesText: 'Questions you get wrong collect here. Right now there is nothing to review.',
    startReview: 'Start today’s review',
    requeue: 'This question will come back at the end of the round.',
    readLesson: 'Read the topic',
  },
};
const c = computed(() => copy[lang.value]);
const heading = computed(() => {
  if (mode.value === 'lessonPractice') return c.value.lessonPractice.title(lesson.value ? tx(lesson.value.doc.title, lang.value) : '');
  return c.value[mode.value].title;
});
const subtitle = computed(() => c.value[mode.value].subtitle);

usePage({
  title: heading,
  description: subtitle,
  alternates: computed(() => {
    if (mode.value === 'lessonPractice') return lessonMeta.value ? both((l) => lessonPracticePath(lessonMeta.value, l)) : null;
    return both((l) => to(mode.value, l));
  }),
  noindex: true,
});

const queue = ref([]);
const index = ref(0);
const answer = ref(null);
const ready = ref(false);
const firstTry = ref({}); // id -> correct on first attempt
const requeued = ref(new Set());
const seed = ref(1);
const justRequeued = ref(false);
const finished = computed(() => ready.value && index.value >= queue.value.length);
// When a round ends, move focus to the result so keyboard and screen-reader
// users land on it instead of on a button that no longer exists.
const resultHeading = ref(null);
watch(finished, async (done) => {
  if (!done) return;
  await nextTick();
  resultHeading.value?.focus();
});
const current = computed(() => queue.value[index.value] || null);
const firstCount = computed(() => Object.keys(firstTry.value).length);
const firstCorrect = computed(() => Object.values(firstTry.value).filter(Boolean).length);
const wrongItems = computed(() => queue.value.filter((q, i, arr) => firstTry.value[q.id] === false && arr.indexOf(q) === i));

function build() {
  const day = dayNumber();
  seed.value = Math.floor(Math.random() * 1e9);
  let list = [];
  if (mode.value === 'review') list = buildDailyReview(pool.value, progress.items, day);
  else if (mode.value === 'mistakes') list = buildMistakes(pool.value, progress.items);
  else if (lessonMeta.value) list = buildLessonPractice(bank.value.questionsFor({ lesson: lessonMeta.value.id }), progress.items, day);
  queue.value = list;
  index.value = 0;
  answer.value = null;
  firstTry.value = {};
  requeued.value = new Set();
  ready.value = true;
}

onMounted(async () => {
  // My mistakes with no saved mistakes: show the empty state at once instead of
  // waiting for the question bank.
  progress.load();
  if (mode.value === 'mistakes' && !Object.values(progress.items).some(inMistakes)) {
    queue.value = [];
    ready.value = true;
    return;
  }
  await poolReady;
  build();
});

function onAnswered(correct, opts = {}) {
  const q = current.value;
  progress.record(q, correct, opts);
  if (!(q.id in firstTry.value)) firstTry.value = { ...firstTry.value, [q.id]: correct };
  // A wrong answer returns once, after at least a few other questions.
  if (!correct && !requeued.value.has(q.id) && mode.value !== 'mistakes') {
    requeued.value.add(q.id);
    const pos = Math.min(queue.value.length, index.value + 6);
    queue.value.splice(pos, 0, q);
    justRequeued.value = true;
  }
}

function next() {
  answer.value = null;
  justRequeued.value = false;
  index.value += 1;
}
const progressPct = computed(() => (queue.value.length ? (index.value / queue.value.length) * 100 : 0));
</script>

<template>
  <NotFoundView v-if="mode === 'lessonPractice' && !lessonMeta" embedded />
  <div v-else class="quiz-page">
    <PageHero
      :title="heading"
      :subtitle="subtitle"
      :crumbs="[{ label: t('nav.home'), path: to('home', lang) }, { label: c.practise, path: to('practise', lang) }, { label: heading }]"
      narrow
    />

    <div class="quiz-container">
      <StateBlock v-if="!ready" :title="t('common.loading')" loading />

      <StateBlock v-else-if="!queue.length && mode === 'mistakes'" :title="c.emptyMistakes" :text="c.emptyMistakesText">
        <template #icon><Inbox :size="36" /></template>
        <RouterLink :to="to('review', lang)" class="btn btn-primary">{{ c.startReview }}</RouterLink>
        <RouterLink :to="to('practise', lang)" class="btn btn-secondary">{{ c.toHub }}</RouterLink>
      </StateBlock>

      <template v-else-if="!finished && current">
        <div class="progress-section">
          <div class="progress-info">
            <span>{{ t('common.question', { n: index + 1, total: queue.length }) }}</span>
            <span>{{ t('common.correct') }}: {{ firstCorrect }} / {{ firstCount }}</span>
          </div>
          <div class="progress-bar" role="progressbar" :aria-label="heading" :aria-valuenow="Math.round(progressPct)" aria-valuemin="0" aria-valuemax="100">
            <div class="progress-fill" :style="{ width: progressPct + '%' }" />
          </div>
        </div>
        <QuestionCard
          :key="`${index}-${current.id}`"
          :focus-on-mount="index > 0"
          v-model="answer"
          :question="current"
          :lang="lang"
          :seed="seed"
          :number="index + 1"
          :total="queue.length"
          @answered="onAnswered"
          @next="next"
        />
        <p v-if="justRequeued" class="requeue-note">
          {{ c.requeue }}
        </p>
      </template>

      <div v-else class="results-screen">
        <div class="results-card">
          <PartyPopper :size="56" :stroke-width="1.5" class="results-icon" aria-hidden="true" />
          <h2 ref="resultHeading" tabindex="-1" class="result-heading">{{ c.doneTitle }}</h2>
          <div class="score-number">{{ firstCorrect }} / {{ firstCount }}</div>
          <p class="results-message">{{ c.done(firstCorrect, firstCount) }}</p>
          <div v-if="wrongItems.length" class="wrong-list">
            <h3><CircleAlert :size="20" aria-hidden="true" /> {{ c.wrongList }}</h3>
            <ul>
              <li v-for="q in wrongItems" :key="q.id">{{ tx(q.prompt, lang) }}<span v-if="q.generated"> · {{ tx(q.options.find((o) => o.id === q.answer).text, lang) }}</span></li>
            </ul>
          </div>
          <div class="results-actions">
            <button type="button" class="btn btn-primary" @click="build">{{ c.again }}</button>
            <RouterLink v-if="lesson" :to="lessonPath(lesson, lang)" class="btn btn-secondary">{{ c.readLesson }}</RouterLink>
            <RouterLink v-else :to="to('mistakes', lang)" class="btn btn-secondary">{{ c.toMistakes }}</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.result-heading:focus {
  outline: none;
}
.result-heading:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 4px;
}
.results-icon {
  color: var(--color-primary);
  margin-bottom: 1rem;
}
.wrong-list {
  text-align: left;
  margin-bottom: 2rem;
  padding: 1.25rem 1.5rem;
  background: var(--color-bg);
  border-radius: var(--radius-lg);
}
.wrong-list h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.0625rem;
  margin-bottom: 0.75rem;
  color: var(--color-danger-text);
}
.wrong-list ul {
  padding-left: 1.25rem;
  display: grid;
  gap: 0.5rem;
  color: var(--color-text-secondary);
}
.requeue-note {
  margin-top: 1rem;
  font-size: 0.9375rem;
  text-align: center;
  color: var(--color-text-muted);
}
</style>
