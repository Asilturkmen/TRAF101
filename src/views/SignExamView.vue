<script setup>
// Rehearsal of today's oral learner exam: see a sign, say what it means, reveal,
// then grade yourself. Self-grades feed the same schedule as the sign questions.
import { computed, nextTick, onMounted, ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { Eye, ThumbsUp, ThumbsDown, Signpost } from 'lucide-vue-next';
import { usePage, useLang } from '../composables/usePage.js';
import { usePool } from '../composables/usePool.js';
import { signs, signsInCategory, categoryById, signQuestion } from '../content/signs.js';
import { examProfile } from '../content/meta.js';
import { mastery, dayNumber } from '../lib/leitner.js';
import { shuffle } from '../lib/random.js';
import { to, signPath, both } from '../lib/paths.js';
import { tx } from '../lib/text.js';
import PageHero from '../components/PageHero.vue';
import SignImage from '../components/SignImage.vue';
import StateBlock from '../components/StateBlock.vue';
import BasisLine from '../components/BasisLine.vue';

const { t } = useI18n();
const lang = useLang();
const route = useRoute();
const { progress } = usePool();
const category = computed(() => (route.query.c ? categoryById(String(route.query.c)) : null));

const copy = {
  tr: {
    title: 'Levha sınavı provası',
    subtitle: 'Bugünkü sözlü sınavda müfettiş sana levhaları sorar ve soru sayısı sabit değildir. Burada her turda 10 levha var.',
    practise: 'Çalış',
    prompt: 'Bu levha ne anlama gelir?',
    hint: 'Önce cevabını yüksek sesle söyle ya da aşağıya yaz. Sonra cevabı aç.',
    typeLabel: 'Cevabın (isteğe bağlı)',
    reveal: 'Cevabı göster',
    knew: 'Bildim',
    didnt: 'Bilemedim',
    action: 'Ne yapmalısın',
    yours: 'Senin cevabın',
    doneTitle: 'Prova bitti',
    done: (a, b) => `${b} levhanın ${a} tanesini bildin.`,
    review: 'Tekrar bakman gerekenler',
    again: 'Yeni tur',
    allSigns: 'Levhalar',
    only: (n) => `Yalnız ${n}`,
    note: 'Sınavda müfettiş farklı levhalar ve farklı sayıda soru sorabilir. Bu prova o sınavın biçimini değil, levha bilgini ölçer.',
  },
  en: {
    title: 'Sign exam rehearsal',
    subtitle: 'In today’s oral exam an inspector asks you about road signs, and the number of questions is not fixed. Each round here has 10 signs.',
    practise: 'Practise',
    prompt: 'What does this sign mean?',
    hint: 'Say your answer out loud or type it below first. Then reveal the answer.',
    typeLabel: 'Your answer (optional)',
    reveal: 'Reveal the answer',
    knew: 'I knew it',
    didnt: 'I didn’t',
    action: 'What to do',
    yours: 'Your answer',
    doneTitle: 'Rehearsal complete',
    done: (a, b) => `You knew ${a} of ${b} signs.`,
    review: 'Signs to look at again',
    again: 'New round',
    allSigns: 'Signs',
    only: (n) => `Only ${n}`,
    note: 'In the exam the inspector may ask about other signs and a different number of them. This rehearsal checks your sign knowledge, not the exam format.',
  },
};
const c = computed(() => copy[lang.value]);
usePage({ title: computed(() => c.value.title), description: computed(() => c.value.subtitle), alternates: both((l) => to('signExam', l)), noindex: true });

const round = ref([]);
const index = ref(0);
const revealed = ref(false);
const typed = ref('');
const results = ref([]); // { sign, knew, typed }
const ready = ref(false);
const revealButton = ref(null);
const gradeButton = ref(null);
const current = computed(() => round.value[index.value] || null);
const finished = computed(() => ready.value && index.value >= round.value.length);
const knownCount = computed(() => results.value.filter((r) => r.knew).length);

function build() {
  const day = dayNumber();
  const source = category.value ? signsInCategory(category.value.id) : signs;
  // Weakest first, core signs before rare ones, then a shuffle inside each band.
  const scored = shuffle(source).map((s) => ({ s, m: mastery(progress.items[`sign:${s.id}`], day), core: s.examPriority === 'core' ? 0 : 1 }));
  scored.sort((a, b) => a.m - b.m || a.core - b.core);
  round.value = shuffle(scored.slice(0, Math.min(examProfile.oral.sampleSize, scored.length)).map((x) => x.s));
  index.value = 0;
  results.value = [];
  revealed.value = false;
  typed.value = '';
  ready.value = true;
}
onMounted(() => {
  progress.load();
  build();
});

function reveal() {
  revealed.value = true;
  nextTick(() => gradeButton.value?.focus());
}
function grade(knew) {
  const s = current.value;
  progress.record(signQuestion(s), knew);
  results.value.push({ sign: s, knew, typed: typed.value.trim() });
  revealed.value = false;
  typed.value = '';
  index.value += 1;
  nextTick(() => revealButton.value?.focus());
}
</script>

<template>
  <div class="quiz-page">
    <PageHero
      :title="c.title"
      :subtitle="c.subtitle"
      :crumbs="[{ label: t('nav.home'), path: to('home', lang) }, { label: c.practise, path: to('practise', lang) }, { label: c.title }]"
      narrow
    >
      <div v-if="category" class="hero-chips"><span class="hero-chip">{{ c.only(tx(category.name, lang)) }}</span></div>
    </PageHero>

    <div class="quiz-container">
      <StateBlock v-if="!ready" :title="t('common.loading')" loading />

      <template v-else-if="!finished && current">
        <div class="progress-section">
          <div class="progress-info">
            <span>{{ t('common.of', { a: index + 1, b: round.length }) }}</span>
            <span>{{ c.knew }}: {{ knownCount }}</span>
          </div>
          <div class="progress-bar"><div class="progress-fill" :style="{ width: (index / round.length) * 100 + '%' }" /></div>
        </div>

        <div class="quiz-card sign-card">
          <h2 class="quiz-title">{{ c.prompt }}</h2>
          <div class="quiz-sign big">
            <SignImage :sign="current" :lang="lang" :size="220" :quiz="!revealed" eager />
          </div>

          <template v-if="!revealed">
            <p class="hint">{{ c.hint }}</p>
            <label class="type-label" for="typed">{{ c.typeLabel }}</label>
            <input id="typed" v-model="typed" class="type-input" type="text" autocomplete="off" @keydown.enter.prevent="reveal" />
            <div class="quiz-actions">
              <button ref="revealButton" type="button" class="btn btn-primary btn-large" @click="reveal">
                <Eye :size="20" aria-hidden="true" /> {{ c.reveal }}
              </button>
            </div>
          </template>

          <div v-else class="reveal-box" role="status">
            <p v-if="typed" class="yours"><strong>{{ c.yours }}:</strong> {{ typed }}</p>
            <h3>{{ tx(current.name, lang) }}<span v-if="lang === 'en'" class="tr" lang="tr"> · {{ current.name.tr }}</span></h3>
            <p>{{ tx(current.meaning, lang) }}</p>
            <p><strong>{{ c.action }}:</strong> {{ tx(current.driverAction, lang) }}</p>
            <div class="grade-actions">
              <button ref="gradeButton" type="button" class="btn btn-primary btn-large" @click="grade(true)">
                <ThumbsUp :size="20" aria-hidden="true" /> {{ c.knew }}
              </button>
              <button type="button" class="btn btn-secondary btn-large" @click="grade(false)">
                <ThumbsDown :size="20" aria-hidden="true" /> {{ c.didnt }}
              </button>
            </div>
          </div>
        </div>
        <p class="exam-note">{{ c.note }}</p>
      </template>

      <div v-else class="results-screen">
        <div class="results-card">
          <Signpost :size="56" :stroke-width="1.5" class="results-icon" aria-hidden="true" />
          <h2>{{ c.doneTitle }}</h2>
          <div class="score-number">{{ knownCount }} / {{ results.length }}</div>
          <p class="results-message">{{ c.done(knownCount, results.length) }}</p>
          <div v-if="results.some((r) => !r.knew)" class="missed">
            <h3>{{ c.review }}</h3>
            <ul>
              <li v-for="r in results.filter((r) => !r.knew)" :key="r.sign.id">
                <RouterLink :to="signPath(r.sign, lang)" class="missed-link">
                  <SignImage :sign="r.sign" :lang="lang" :size="48" decorative />
                  <span>{{ tx(r.sign.name, lang) }}</span>
                </RouterLink>
              </li>
            </ul>
          </div>
          <div class="results-actions">
            <button type="button" class="btn btn-primary" @click="build">{{ c.again }}</button>
            <RouterLink :to="to('signs', lang)" class="btn btn-secondary">{{ c.allSigns }}</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sign-card {
  text-align: center;
}
.quiz-sign.big img {
  width: 220px;
  height: 220px;
}
.hint {
  font-size: 1rem;
  margin-bottom: 1rem;
}
.type-label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.375rem;
  text-align: left;
}
.type-input {
  width: 100%;
  min-height: 52px;
  padding: 0.75rem 1rem;
  border: 2px solid var(--color-primary);
  border-radius: var(--radius-lg);
  font: inherit;
  font-size: 1.0625rem;
}
.reveal-box {
  text-align: left;
  background: var(--color-bg);
  border-radius: var(--radius-xl);
  padding: 1.5rem;
}
.reveal-box h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}
.reveal-box .tr {
  color: var(--color-text-secondary);
  font-weight: 600;
}
.reveal-box p {
  font-size: 1.0625rem;
  margin-bottom: 0.5rem;
}
.yours {
  padding-bottom: 0.75rem;
  margin-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border);
}
.grade-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.25rem;
  flex-wrap: wrap;
}
.grade-actions .btn {
  flex: 1;
  min-width: 160px;
}
.exam-note {
  margin-top: 1.25rem;
  font-size: 0.9375rem;
  color: var(--color-text-muted);
  text-align: center;
}
.results-icon {
  color: var(--color-primary);
  margin-bottom: 1rem;
}
.missed {
  text-align: left;
  margin-bottom: 2rem;
}
.missed h3 {
  font-size: 1.125rem;
  margin-bottom: 0.75rem;
}
.missed ul {
  list-style: none;
  display: grid;
  gap: 0.5rem;
}
.missed-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-md);
  background: var(--color-bg);
  color: var(--color-text);
  font-weight: 600;
  text-decoration: none;
}
.missed-link:hover {
  color: var(--color-primary);
}
@media (max-width: 640px) {
  .quiz-sign.big img {
    width: 170px;
    height: 170px;
  }
  .grade-actions {
    flex-direction: column;
  }
}
</style>
