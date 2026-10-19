<script setup>
import { computed, nextTick, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { Check, X, CircleCheck, CircleX, Route, Building2, Trees, CloudRain, Siren, SquareParking } from 'lucide-vue-next';
import { usePage, useLang } from '../composables/usePage.js';
import { usePool } from '../composables/usePool.js';
import { scenariosFor } from '../content/scenarios.js';
import { signById } from '../content/signs.js';
import { hashString, mulberry32, shuffle } from '../lib/random.js';
import { to, lessonPath, both } from '../lib/paths.js';
import { tx } from '../lib/text.js';
import PageHero from '../components/PageHero.vue';
import SignImage from '../components/SignImage.vue';
import StateBlock from '../components/StateBlock.vue';
import BasisLine from '../components/BasisLine.vue';

const { t } = useI18n();
const lang = useLang();
const { progress, track } = usePool();
const ROUND = 10;

const copy = {
  tr: {
    title: 'Senaryolar',
    subtitle: 'Yolda karşına çıkabilecek durumlar. Bir seçenek seç; neden doğru ya da yanlış olduğunu hemen görürsün.',
    practise: 'Çalış',
    categories: { urban: 'Şehir içi', rural: 'Şehir dışı', weather: 'Hava koşulları', emergency: 'Acil durum', parking: 'Park' },
    difficulty: { easy: 'Kolay', medium: 'Orta', hard: 'Zor' },
    explanation: 'Açıklama',
    nextS: 'Sonraki senaryo',
    results: 'Sonuçları gör',
    doneTitle: 'Senaryolar bitti',
    done: (a, b) => `${b} senaryonun ${a} tanesinde doğru kararı verdin.`,
    msg: { high: 'Yolda karşına çıkacak durumlarda doğru kararı veriyorsun.', mid: 'İyi gidiyor. Yanlış yaptığın senaryoların açıklamalarını tekrar oku.', low: 'Aşağıdaki senaryoların konularını okuyup yeni bir tur dene.' },
    missed: 'Yanlış karar verdiğin senaryolar',
    again: 'Yeni tur',
    toHub: 'Çalış merkezi',
    readLesson: 'Konuyu oku',
    empty: 'Bu araç için senaryo bulunamadı.',
  },
  en: {
    title: 'Scenarios',
    subtitle: 'Situations you may meet on the road. Pick an option and you will see straight away why it is right or wrong.',
    practise: 'Practise',
    categories: { urban: 'Town', rural: 'Out of town', weather: 'Weather', emergency: 'Emergency', parking: 'Parking' },
    difficulty: { easy: 'Easy', medium: 'Medium', hard: 'Hard' },
    explanation: 'Explanation',
    nextS: 'Next scenario',
    results: 'See results',
    doneTitle: 'Scenarios complete',
    done: (a, b) => `You made the right call in ${a} of ${b} scenarios.`,
    msg: { high: 'You make the right decisions in real road situations.', mid: 'Good progress. Re-read the explanations for the scenarios you missed.', low: 'Read the topics for the scenarios below, then try a new round.' },
    missed: 'Scenarios you got wrong',
    again: 'New round',
    toHub: 'Practise hub',
    readLesson: 'Read the topic',
    empty: 'No scenarios for this vehicle.',
  },
};
const c = computed(() => copy[lang.value]);
const catIcons = { urban: Building2, rural: Trees, weather: CloudRain, emergency: Siren, parking: SquareParking };
usePage({ title: computed(() => c.value.title), description: computed(() => c.value.subtitle), alternates: both((l) => to('scenarios', l)) });

const round = ref([]);
const index = ref(0);
const picked = ref(null);
const score = ref(0);
const missed = ref([]);
const ready = ref(false);
const seed = ref(1);
const heading = ref(null);
const nextButton = ref(null);
const current = computed(() => round.value[index.value] || null);
const finished = computed(() => ready.value && round.value.length > 0 && index.value >= round.value.length);
const choices = computed(() => (current.value ? shuffle(current.value.choices, mulberry32(hashString(current.value.id) ^ seed.value)) : []));
const pickedChoice = computed(() => current.value?.choices.find((ch) => ch.id === picked.value) || null);
const ratio = computed(() => (round.value.length ? score.value / round.value.length : 0));

function build() {
  seed.value = Math.floor(Math.random() * 1e9);
  round.value = shuffle(scenariosFor(track.value)).slice(0, ROUND);
  index.value = 0;
  picked.value = null;
  score.value = 0;
  missed.value = [];
  ready.value = true;
}
onMounted(() => {
  progress.load();
  build();
});

function choose(ch) {
  if (picked.value) return;
  picked.value = ch.id;
  if (ch.correct) score.value += 1;
  else missed.value.push(current.value);
  progress.record({ id: current.value.id, rev: current.value.rev }, ch.correct);
  nextTick(() => nextButton.value?.focus());
}
function next() {
  picked.value = null;
  index.value += 1;
  nextTick(() => heading.value?.focus());
}
</script>

<template>
  <div class="quiz-page">
    <PageHero
      :title="c.title"
      :subtitle="c.subtitle"
      :crumbs="[{ label: t('nav.home'), path: to('home', lang) }, { label: c.practise, path: to('practise', lang) }, { label: c.title }]"
      narrow
    />
    <div class="quiz-container">
      <StateBlock v-if="!ready" :title="t('common.loading')" loading />
      <StateBlock v-else-if="!round.length" :title="c.empty">
        <template #icon><Route :size="36" /></template>
        <RouterLink :to="to('practise', lang)" class="btn btn-primary">{{ c.toHub }}</RouterLink>
      </StateBlock>

      <template v-else-if="!finished && current">
        <div class="progress-section">
          <div class="progress-info">
            <span>{{ t('common.of', { a: index + 1, b: round.length }) }}</span>
            <span>{{ t('common.correct') }}: {{ score }} / {{ index + (picked ? 1 : 0) }}</span>
          </div>
          <div class="progress-bar"><div class="progress-fill" :style="{ width: ((index + 1) / round.length) * 100 + '%' }" /></div>
        </div>

        <div class="quiz-card">
          <div class="quiz-meta">
            <span class="chip chip-primary">
              <component :is="catIcons[current.category]" :size="16" aria-hidden="true" /> {{ c.categories[current.category] }}
            </span>
            <span class="chip">{{ c.difficulty[current.difficulty] }}</span>
          </div>
          <h2 ref="heading" class="quiz-title" tabindex="-1">{{ tx(current.title, lang) }}</h2>
          <div v-if="current.signId && signById(current.signId)" class="quiz-sign">
            <SignImage :sign="signById(current.signId)" :lang="lang" :size="140" />
          </div>
          <p class="situation-text">{{ tx(current.situation, lang) }}</p>

          <div class="choices-list" role="group" :aria-label="tx(current.title, lang)">
            <button
              v-for="(ch, i) in choices"
              :key="ch.id"
              type="button"
              class="choice-option"
              :class="{
                correct: picked && ch.correct,
                incorrect: picked === ch.id && !ch.correct,
                disabled: !!picked,
              }"
              :aria-disabled="!!picked"
              @click="choose(ch)"
            >
              <span class="choice-letter" aria-hidden="true">{{ 'ABC'[i] }}</span>
              <span class="choice-text">{{ tx(ch.text, lang) }}</span>
              <span v-if="picked && ch.correct" class="choice-mark ok"><Check :size="18" aria-hidden="true" />{{ t('common.correct') }}</span>
              <span v-else-if="picked === ch.id" class="choice-mark no"><X :size="18" aria-hidden="true" />{{ t('common.wrong') }}</span>
            </button>
          </div>

          <div role="status" aria-live="polite">
            <div v-if="pickedChoice" class="feedback-box" :class="{ 'correct-feedback': pickedChoice.correct }">
              <div class="feedback-header">
                <CircleCheck v-if="pickedChoice.correct" class="icon-ok" :size="28" aria-hidden="true" />
                <CircleX v-else class="icon-no" :size="28" aria-hidden="true" />
                <h3>{{ pickedChoice.correct ? t('common.correct') : t('common.wrong') }}</h3>
              </div>
              <p class="feedback-text">{{ tx(pickedChoice.feedback, lang) }}</p>
              <div class="explanation">
                <strong>{{ c.explanation }}</strong>
                <p>{{ tx(current.explanation, lang) }}</p>
              </div>
              <BasisLine :item="current" :lang="lang" />
            </div>
          </div>
          <div v-if="pickedChoice" class="quiz-actions">
            <button ref="nextButton" type="button" class="btn btn-primary btn-large" @click="next">
              {{ index < round.length - 1 ? c.nextS : c.results }}
            </button>
          </div>
        </div>
      </template>

      <div v-else class="results-screen">
        <div class="results-card">
          <Route :size="56" :stroke-width="1.5" class="results-icon" aria-hidden="true" />
          <h2>{{ c.doneTitle }}</h2>
          <div class="score-number">{{ score }} / {{ round.length }}</div>
          <p class="results-message">
            {{ c.done(score, round.length) }}
            {{ ratio >= 0.8 ? c.msg.high : ratio >= 0.6 ? c.msg.mid : c.msg.low }}
          </p>
          <div v-if="missed.length" class="missed">
            <h3>{{ c.missed }}</h3>
            <ul>
              <li v-for="s in missed" :key="s.id">
                <span>{{ tx(s.title, lang) }}</span>
                <RouterLink :to="lessonPath(s.lesson, lang)">{{ c.readLesson }}</RouterLink>
              </li>
            </ul>
          </div>
          <div class="results-actions">
            <button type="button" class="btn btn-primary" @click="build">{{ c.again }}</button>
            <RouterLink :to="to('practise', lang)" class="btn btn-secondary">{{ c.toHub }}</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.quiz-title:focus {
  outline: none;
}
.quiz-title:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 4px;
}
.choice-option[aria-disabled='true'] {
  cursor: default;
}
.results-icon {
  color: var(--color-primary);
  margin-bottom: 1rem;
}
.missed {
  text-align: left;
  margin-bottom: 2rem;
  padding: 1.25rem 1.5rem;
  background: var(--color-bg);
  border-radius: var(--radius-lg);
}
.missed h3 {
  font-size: 1.0625rem;
  margin-bottom: 0.75rem;
}
.missed ul {
  list-style: none;
  display: grid;
  gap: 0.625rem;
}
.missed li {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  color: var(--color-text);
}
.missed a {
  color: var(--color-primary);
  font-weight: 700;
}
</style>
