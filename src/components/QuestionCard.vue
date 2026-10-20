<script setup>
// Accessible multiple-choice question: fieldset + native radios styled as the
// original scenario choice cards, a polite live region for feedback, and focus
// moved to the question when it changes.
import { computed, nextTick, ref, watch, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { Check, X, CircleCheck, CircleX } from 'lucide-vue-next';
import SignImage from './SignImage.vue';
import BasisLine from './BasisLine.vue';
import { signById } from '../content/signs.js';
import { topicById } from '../content/meta.js';
import { lessonPath } from '../lib/paths.js';

// A prefilled GitHub issue for reporting a mistake in this question (K16).
const REPO_ISSUES = 'https://github.com/Asilturkmen/TRAF101/issues/new';
const reportUrl = computed(() => {
  const q = props.question;
  const title = `${props.lang === 'tr' ? 'Soru hatası' : 'Question error'}: ${q.id}`;
  const body = [
    `Soru / Question: ${q.id} (rev ${q.rev || 1}, ${props.lang})`,
    '',
    tx(q.prompt, props.lang),
    '',
    props.lang === 'tr' ? 'Ne yanlış? Mümkünse kaynak ekle:' : 'What is wrong? Add a source if you can:',
    '',
  ].join('\n');
  return `${REPO_ISSUES}?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
});
import { hashString, mulberry32, shuffle } from '../lib/random.js';
import { tx } from '../lib/text.js';

const props = defineProps({
  question: { type: Object, required: true },
  lang: { type: String, required: true },
  mode: { type: String, default: 'practice' }, // practice | exam | review
  modelValue: { type: String, default: null },
  seed: { type: Number, default: 1 },
  number: { type: Number, default: 1 },
  total: { type: Number, default: 1 },
  autofocus: { type: Boolean, default: true }, // move focus to each new question
  focusOnMount: { type: Boolean, default: false },
  showTopic: { type: Boolean, default: true },
});
const emit = defineEmits(['update:modelValue', 'answered', 'next']);
const { t } = useI18n();

const LETTERS = ['A', 'B', 'C', 'D'];
const options = computed(() =>
  shuffle(props.question.options, mulberry32(hashString(props.question.id) ^ props.seed)),
);
const letterOf = (id) => LETTERS[options.value.findIndex((o) => o.id === id)];
const optionText = (id) => tx(props.question.options.find((o) => o.id === id)?.text, props.lang);

const sign = computed(() => (props.question.signId ? signById(props.question.signId) : null));
const topic = computed(() => topicById(props.question.topic));

const checked = ref(false);
const unsure = ref(false); // "I guessed": a correct guess does not promote the item
const selected = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});
const revealed = computed(() => props.mode === 'review' || (props.mode === 'practice' && checked.value));
const isCorrect = computed(() => selected.value === props.question.answer);
const announcement = ref('');
const heading = ref(null);
const nextButton = ref(null);
const groupName = computed(() => `q-${props.question.id.replace(/[^a-z0-9]/gi, '-')}`);

function check() {
  if (!selected.value || checked.value) return;
  checked.value = true;
  const answer = `${letterOf(props.question.answer)}, ${optionText(props.question.answer)}`;
  announcement.value = isCorrect.value
    ? `${t('common.correct')}.`
    : `${t('common.wrong')}. ${t('common.correctAnswer', { answer })}.`;
  emit('answered', isCorrect.value, { unsure: unsure.value });
  nextTick(() => nextButton.value?.focus());
}

function focusHeading() {
  if (props.autofocus) nextTick(() => heading.value?.focus({ preventScroll: false }));
}

watch(
  () => props.question.id,
  () => {
    checked.value = false;
    unsure.value = false;
    announcement.value = '';
    focusHeading();
  },
);
onMounted(() => {
  if (props.focusOnMount) focusHeading();
});

function stateClass(o) {
  if (!revealed.value) return { selected: selected.value === o.id };
  return {
    correct: o.id === props.question.answer,
    incorrect: o.id === selected.value && o.id !== props.question.answer,
    disabled: true,
  };
}
</script>

<template>
  <div class="quiz-card">
    <div v-if="showTopic && topic" class="quiz-meta">
      <span class="chip chip-primary">{{ tx(topic.name, lang) }}</span>
      <span class="chip">{{ t('common.question', { n: number, total }) }}</span>
    </div>

    <form @submit.prevent="check">
      <fieldset :disabled="revealed && mode !== 'exam'">
        <legend>
          <span ref="heading" tabindex="-1" class="q-heading">{{ tx(question.prompt, lang) }}</span>
        </legend>

        <div v-if="sign" class="quiz-sign">
          <SignImage :sign="sign" :lang="lang" :size="168" :quiz="!revealed" eager />
        </div>

        <div class="choices-list">
          <label v-for="(o, i) in options" :key="o.id" class="choice-option" :class="stateClass(o)">
            <input v-model="selected" type="radio" :name="groupName" :value="o.id" :disabled="revealed" />
            <span class="choice-letter" aria-hidden="true">{{ LETTERS[i] }}</span>
            <span class="choice-text">{{ tx(o.text, lang) }}</span>
            <span v-if="revealed && o.id === question.answer" class="choice-mark ok">
              <Check :size="18" aria-hidden="true" />{{ t('common.correct') }}
            </span>
            <span v-else-if="revealed && o.id === selected" class="choice-mark no">
              <X :size="18" aria-hidden="true" />{{ t('common.wrong') }}
            </span>
          </label>
        </div>
      </fieldset>

      <label v-if="mode === 'practice' && !checked" class="unsure">
        <input v-model="unsure" type="checkbox" />
        <span>{{ lang === 'tr' ? 'Emin değilim, tahmin ediyorum' : "I'm not sure, I'm guessing" }}</span>
      </label>
      <div v-if="mode === 'practice' && !checked" class="quiz-actions">
        <button type="submit" class="btn btn-primary btn-large" :disabled="!selected">{{ t('common.check') }}</button>
      </div>
    </form>

    <div role="status" aria-live="polite" class="visually-hidden">{{ announcement }}</div>

    <div v-if="revealed" class="feedback-box" :class="{ 'correct-feedback': isCorrect }">
      <div class="feedback-header">
        <CircleCheck v-if="isCorrect" class="icon-ok" :size="28" aria-hidden="true" />
        <CircleX v-else class="icon-no" :size="28" aria-hidden="true" />
        <h3>{{ isCorrect ? t('common.correct') : selected ? t('common.wrong') : t('common.noAnswer') }}</h3>
      </div>
      <p v-if="!isCorrect" class="feedback-text">
        {{ t('common.correctAnswer', { answer: `${letterOf(question.answer)}, ${optionText(question.answer)}` }) }}
      </p>
      <div class="explanation">
        <strong>{{ t('common.why') }}</strong>
        <p>{{ tx(question.why, lang) }}</p>
      </div>
      <BasisLine :item="question" :lang="lang" />
      <p class="basis-line feedback-links">
        <RouterLink v-if="question.lesson && !question.generated" :to="lessonPath(question.lesson, lang)">{{ t('common.seeLesson') }}</RouterLink>
        <a :href="reportUrl" target="_blank" rel="noopener" class="report-link">{{ lang === 'tr' ? 'Bu soruda hata var' : 'Report a mistake in this question' }}</a>
      </p>
      <p v-if="mode === 'practice' && unsure && isCorrect" class="basis-line">
        {{ lang === 'tr' ? 'Tahminle doğru bildin; bu soru yakında yeniden sorulacak.' : 'You guessed right; this question will come back soon.' }}
      </p>
      <div v-if="mode === 'practice'" class="quiz-actions">
        <button ref="nextButton" type="button" class="btn btn-primary btn-large" @click="emit('next')">
          <slot name="next-label">{{ t('common.next') }}</slot>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.q-heading:focus {
  outline: none;
}
.q-heading:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 4px;
}
.quiz-card legend {
  width: 100%;
}
.unsure {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  min-height: 44px;
  margin: -0.5rem 0 0.25rem;
  font-size: 0.9375rem;
  color: var(--color-text-secondary);
  cursor: pointer;
}
.unsure input {
  width: 20px;
  height: 20px;
  accent-color: var(--color-primary);
}
.feedback-links {
  justify-content: space-between;
}
.report-link {
  color: var(--color-text-secondary) !important;
}
</style>
