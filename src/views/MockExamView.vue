<script setup>
// Timed mock exam in the regulation format. No feedback until the end; questions
// can be flagged and revisited; state is saved after every change so a reload or a
// closed tab resumes where the learner left off.
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { RouterLink, useRoute, useRouter, onBeforeRouteLeave } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { Flag, ChevronLeft, ChevronRight, Clock, ListChecks } from 'lucide-vue-next';
import { usePage, useLang } from '../composables/usePage.js';
import { useProgress } from '../stores/progress.js';
import { trackBySlug, formatById } from '../content/meta.js';
import { allQuestions, questionById } from '../content/questions.js';
import { buildMock, scoreAnswers } from '../lib/sessions.js';
import { to, mockPath } from '../lib/paths.js';
import { tx } from '../lib/text.js';
import PageHero from '../components/PageHero.vue';
import QuestionCard from '../components/QuestionCard.vue';
import StateBlock from '../components/StateBlock.vue';
import NotFoundView from './NotFoundView.vue';

const { t } = useI18n();
const lang = useLang();
const route = useRoute();
const router = useRouter();
const progress = useProgress();
const track = computed(() => trackBySlug(lang.value, route.params.track));
const format = computed(() => (track.value ? formatById(track.value.exam) : null));

const copy = {
  tr: {
    title: (n) => `Yazılı sınav provası: ${n}`,
    mock: 'Deneme sınavı',
    prev: 'Önceki',
    next: 'Sonraki',
    flag: 'İşaretle',
    unflag: 'İşareti kaldır',
    overview: 'Soru listesi',
    finish: 'Sınavı bitir',
    confirmTitle: 'Sınavı bitirmek istiyor musun',
    unanswered: (n) => `${n} soru boş.`,
    flagged: (n) => `${n} soru işaretli.`,
    allDone: 'Bütün soruları cevapladın.',
    confirm: 'Evet, bitir',
    cancel: 'Sınava dön',
    remaining: 'Kalan süre',
    untimed: 'Süresiz',
    timeUp: 'Süre doldu. Cevapların değerlendirildi.',
    saved: 'Cevapların bu cihaza kaydediliyor. Sayfayı kapatsan da kaldığın yerden devam edersin.',
    leave: 'Sınavdan çıkıyorsun. Cevapların kaydedildi; daha sonra kaldığın yerden devam edebilirsin.',
    announce: (m) => `${m} dakika kaldı.`,
    shortage: 'Bu araç için soru bankası henüz tam değil; deneme daha az soruyla oluşturuldu.',
    answeredLabel: 'cevaplandı',
    flaggedLabel: 'işaretli',
    emptyLabel: 'boş',
    legend: 'Renkler: dolu kare cevaplanmış, çerçeveli kare boş, bayrak işaretli soru.',
  },
  en: {
    title: (n) => `Written exam rehearsal: ${n}`,
    mock: 'Mock exam',
    prev: 'Previous',
    next: 'Next',
    flag: 'Flag',
    unflag: 'Remove flag',
    overview: 'Question list',
    finish: 'Finish the exam',
    confirmTitle: 'Do you want to finish the exam',
    unanswered: (n) => `${n} questions are blank.`,
    flagged: (n) => `${n} questions are flagged.`,
    allDone: 'You have answered every question.',
    confirm: 'Yes, finish',
    cancel: 'Back to the exam',
    remaining: 'Time left',
    untimed: 'No time limit',
    timeUp: 'Time is up. Your answers have been marked.',
    saved: 'Your answers are saved on this device. If you close the page you can continue where you left off.',
    leave: 'You are leaving the exam. Your answers are saved; you can continue later.',
    announce: (m) => `${m} minutes left.`,
    shortage: 'The question bank for this vehicle is not complete yet; this mock has fewer questions.',
    answeredLabel: 'answered',
    flaggedLabel: 'flagged',
    emptyLabel: 'blank',
    legend: 'Key: filled square answered, outlined square blank, flag means flagged.',
  },
};
const c = computed(() => copy[lang.value]);
usePage({
  title: computed(() => (track.value ? c.value.title(tx(track.value.name, lang.value)) : '404')),
  description: computed(() => c.value.saved),
  alternates: computed(() => (track.value ? { tr: mockPath(track.value, 'tr'), en: mockPath(track.value, 'en') } : null)),
  noindex: true,
});

const state = ref(null); // { track, format, questionIds, answers, flagged, index, startedAt, elapsed, limit }
const questions = computed(() => (state.value ? state.value.questionIds.map(questionById).filter(Boolean) : []));
const current = computed(() => questions.value[state.value?.index ?? 0] || null);
const shortage = ref(false);
const confirmDialog = ref(null);
const announcement = ref('');
const now = ref(Date.now());
let timer = null;
let finishing = false;

const remaining = computed(() => {
  if (!state.value?.limit) return null;
  return Math.max(0, state.value.limit - state.value.elapsed);
});
const clock = computed(() => {
  if (remaining.value == null) return c.value.untimed;
  const m = Math.floor(remaining.value / 60);
  const s = remaining.value % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
});
const answeredN = computed(() => (state.value ? Object.keys(state.value.answers).length : 0));
const unansweredN = computed(() => questions.value.length - answeredN.value);
const flaggedN = computed(() => state.value?.flagged.length || 0);

function save() {
  progress.setMock(state.value);
}

function start() {
  const pool = allQuestions.filter((q) => q.tracks.includes(track.value.id));
  const { questions: qs, missing } = buildMock(format.value, pool);
  shortage.value = Object.keys(missing).length > 0;
  const factor = progress.settings.timeFactor ?? 1;
  state.value = {
    track: track.value.id,
    format: format.value.id,
    questionIds: qs.map((q) => q.id),
    answers: {},
    flagged: [],
    index: 0,
    startedAt: new Date().toISOString(),
    elapsed: 0,
    limit: factor ? Math.round(format.value.minutes * 60 * factor) : 0,
    seed: Math.floor(Math.random() * 1e9),
  };
  save();
}

onMounted(() => {
  progress.load();
  if (!track.value) return;
  const saved = progress.mock;
  if (saved && saved.track === track.value.id && saved.questionIds?.every((id) => questionById(id))) state.value = { ...saved };
  else start();
  timer = setInterval(tick, 1000);
});
onBeforeUnmount(() => clearInterval(timer));

function tick() {
  if (!state.value || document.hidden) return;
  state.value.elapsed += 1;
  if (state.value.elapsed % 10 === 0) save();
  if (remaining.value != null) {
    const left = remaining.value;
    if ([600, 300, 60].includes(left)) announcement.value = c.value.announce(left / 60);
    if (left === 0) finish(true);
  }
}

const answer = computed({
  get: () => (current.value ? state.value.answers[current.value.id] || null : null),
  set: (v) => {
    state.value.answers = { ...state.value.answers, [current.value.id]: v };
    save();
  },
});
function go(i) {
  if (!state.value) return;
  state.value.index = Math.max(0, Math.min(questions.value.length - 1, i));
  save();
}
function toggleFlag() {
  const id = current.value.id;
  const f = state.value.flagged;
  state.value.flagged = f.includes(id) ? f.filter((x) => x !== id) : [...f, id];
  save();
}
const isFlagged = computed(() => current.value && state.value.flagged.includes(current.value.id));

function askFinish() {
  confirmDialog.value?.showModal();
}
function finish(timeUp = false) {
  if (finishing || !state.value) return;
  finishing = true;
  clearInterval(timer);
  confirmDialog.value?.close?.();
  const qs = questions.value;
  const { correct, total, byTopic } = scoreAnswers(qs, state.value.answers);
  for (const q of qs) progress.record(q, state.value.answers[q.id] === q.answer);
  const id = `m${Date.now().toString(36)}`;
  progress.addAttempt({
    id,
    kind: 'mock',
    track: state.value.track,
    format: state.value.format,
    startedAt: state.value.startedAt,
    finishedAt: new Date().toISOString(),
    duration: state.value.elapsed,
    limit: state.value.limit,
    timeUp,
    correct,
    total,
    passMark: format.value.passMark,
    fullLength: total === format.value.questions,
    passed: total === format.value.questions && correct >= format.value.passMark,
    byTopic,
    questionIds: state.value.questionIds,
    answers: state.value.answers,
    seed: state.value.seed,
  });
  progress.setMock(null);
  state.value = null;
  router.push({ path: to('mockResult', lang.value), query: { id } });
}

onBeforeRouteLeave(() => {
  if (!state.value || finishing) return true;
  return window.confirm(c.value.leave);
});

watch(
  () => state.value?.index,
  () => nextTick(() => window.scrollTo({ top: 0, behavior: 'auto' })),
);
</script>

<template>
  <NotFoundView v-if="!track" embedded />
  <div v-else class="quiz-page">
    <PageHero
      :title="c.title(tx(track.name, lang))"
      :crumbs="[{ label: t('nav.home'), path: to('home', lang) }, { label: c.mock, path: to('mock', lang) }, { label: tx(track.name, lang) }]"
      narrow
    />
    <div class="quiz-container">
      <StateBlock v-if="!state" :title="t('common.loading')" loading />
      <template v-else>
        <div class="exam-bar">
          <span class="exam-clock" :class="{ low: remaining != null && remaining <= 300 }">
            <Clock :size="20" aria-hidden="true" />
            <span class="visually-hidden">{{ c.remaining }}:</span>
            <span class="clock-value" aria-hidden="true">{{ clock }}</span>
          </span>
          <span class="exam-count">{{ t('common.question', { n: state.index + 1, total: questions.length }) }}</span>
          <button type="button" class="btn btn-primary finish-btn" @click="askFinish">{{ c.finish }}</button>
        </div>
        <div class="visually-hidden" role="status" aria-live="polite">{{ announcement }}</div>
        <p v-if="shortage" class="shortage">{{ c.shortage }}</p>

        <QuestionCard
          v-if="current"
          v-model="answer"
          :question="current"
          :lang="lang"
          mode="exam"
          :seed="state.seed"
          :number="state.index + 1"
          :total="questions.length"
        />

        <div class="exam-nav">
          <button type="button" class="btn btn-ghost" :disabled="state.index === 0" @click="go(state.index - 1)">
            <ChevronLeft :size="20" aria-hidden="true" /> {{ c.prev }}
          </button>
          <button type="button" class="btn btn-ghost flag-btn" :aria-pressed="isFlagged ? 'true' : 'false'" @click="toggleFlag">
            <Flag :size="18" aria-hidden="true" :fill="isFlagged ? 'currentColor' : 'none'" /> {{ isFlagged ? c.unflag : c.flag }}
          </button>
          <button v-if="state.index < questions.length - 1" type="button" class="btn btn-primary" @click="go(state.index + 1)">
            {{ c.next }} <ChevronRight :size="20" aria-hidden="true" />
          </button>
          <button v-else type="button" class="btn btn-primary" @click="askFinish">{{ c.finish }}</button>
        </div>

        <details class="overview" open>
          <summary><ListChecks :size="20" aria-hidden="true" /> {{ c.overview }}</summary>
          <p class="overview-legend">{{ c.legend }}</p>
          <ol class="palette">
            <li v-for="(q, i) in questions" :key="q.id">
              <button
                type="button"
                class="palette-btn"
                :class="{ answered: state.answers[q.id], current: i === state.index, flagged: state.flagged.includes(q.id) }"
                :aria-current="i === state.index ? 'step' : undefined"
                :aria-label="`${i + 1}, ${state.answers[q.id] ? c.answeredLabel : c.emptyLabel}${state.flagged.includes(q.id) ? ', ' + c.flaggedLabel : ''}`"
                @click="go(i)"
              >
                {{ i + 1 }}
                <Flag v-if="state.flagged.includes(q.id)" :size="10" class="palette-flag" aria-hidden="true" fill="currentColor" />
              </button>
            </li>
          </ol>
        </details>
        <p class="saved-note">{{ c.saved }}</p>
      </template>
    </div>

    <dialog ref="confirmDialog" class="confirm-dialog" aria-labelledby="confirm-title">
      <h2 id="confirm-title">{{ c.confirmTitle }}</h2>
      <p v-if="unansweredN">{{ c.unanswered(unansweredN) }}</p>
      <p v-if="flaggedN">{{ c.flagged(flaggedN) }}</p>
      <p v-if="!unansweredN && !flaggedN">{{ c.allDone }}</p>
      <div class="results-actions">
        <button type="button" class="btn btn-secondary" autofocus @click="confirmDialog.close()">{{ c.cancel }}</button>
        <button type="button" class="btn btn-primary" @click="finish(false)">{{ c.confirm }}</button>
      </div>
    </dialog>
  </div>
</template>

<style scoped>
.exam-bar {
  position: sticky;
  top: 64px;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
  padding: 0.75rem 1rem;
  margin-bottom: 1.25rem;
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}
.exam-clock {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 800;
  font-size: 1.25rem;
  font-variant-numeric: tabular-nums;
  color: var(--color-primary);
}
.exam-clock.low {
  color: var(--color-danger-text);
}
.exam-count {
  font-weight: 600;
  color: var(--color-text-secondary);
}
.finish-btn {
  padding: 0.625rem 1.25rem;
  width: auto;
}
.shortage {
  padding: 0.75rem 1rem;
  background: var(--color-warning-bg);
  border-radius: var(--radius-md);
  margin-bottom: 1rem;
  font-size: 0.9375rem;
}
.exam-nav {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 1.25rem;
  flex-wrap: wrap;
}
.exam-nav .btn {
  width: auto;
}
.flag-btn[aria-pressed='true'] {
  border-color: var(--color-accent-text);
  color: var(--color-accent-text);
}
.overview {
  margin-top: 1.5rem;
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: 1rem 1.25rem 1.25rem;
}
.overview summary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  cursor: pointer;
  min-height: 44px;
}
.overview-legend {
  font-size: 0.875rem;
  margin: 0.25rem 0 0.75rem;
}
.palette {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(44px, 1fr));
  gap: 0.375rem;
}
.palette-btn {
  position: relative;
  width: 100%;
  height: 44px;
  border-radius: var(--radius-md);
  border: 2px solid var(--color-border);
  background: white;
  font: inherit;
  font-weight: 700;
  color: var(--color-text);
  cursor: pointer;
}
.palette-btn.answered {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}
.palette-btn.current {
  outline: 3px solid var(--color-accent);
  outline-offset: 1px;
}
.palette-flag {
  position: absolute;
  top: 2px;
  right: 3px;
  color: var(--color-accent);
}
.palette-btn.answered .palette-flag {
  color: #fff3e0;
}
.saved-note {
  margin-top: 1rem;
  font-size: 0.875rem;
  color: var(--color-text-muted);
  text-align: center;
}
.confirm-dialog {
  margin: auto;
  max-width: 480px;
  width: calc(100% - 2rem);
  border: none;
  border-radius: var(--radius-2xl);
  padding: 2rem;
  box-shadow: var(--shadow-2xl);
}
.confirm-dialog::backdrop {
  background: rgba(31, 69, 69, 0.45);
}
.confirm-dialog h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}
.confirm-dialog p {
  margin-bottom: 0.5rem;
}
.confirm-dialog .results-actions {
  margin-top: 1.5rem;
}
@media (max-width: 640px) {
  .exam-bar {
    top: 60px;
  }
  .exam-nav .btn {
    flex: 1;
  }
  .flag-btn {
    order: 3;
    flex-basis: 100%;
  }
}
</style>
