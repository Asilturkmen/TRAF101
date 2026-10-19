<script setup>
import { computed, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { Car, Bike, Bus, Signpost, Clock, Info } from 'lucide-vue-next';
import { usePage, useLang } from '../composables/usePage.js';
import { useProgress } from '../stores/progress.js';
import { tracks, formatById, trackById, examProfile } from '../content/meta.js';
import { to, mockPath, both } from '../lib/paths.js';
import { tx, fmtDate } from '../lib/text.js';
import PageHero from '../components/PageHero.vue';

const { t } = useI18n();
const lang = useLang();
const progress = useProgress();
onMounted(() => progress.load());

const copy = {
  tr: {
    title: 'Deneme sınavı',
    subtitle: 'Yönetmelikte tanımlanan yazılı sınav biçiminde, süreli bir prova. Cevapların doğru mu yanlış mı, sınavı bitirince görürsün.',
    status: 'Bu biçim 2017 yönetmeliğinde tanımlı ama henüz uygulanmıyor. Bugünkü teori sınavı sözlüdür; ona hazırlanmak için levha sınavı provasını kullan.',
    moreExam: 'Sınav nasıl yapılır',
    pass: (p, q) => `Geçer not: ${q} soruda ${p} doğru`,
    classNow: 'Bugün',
    classNew: 'Yeni sistemde',
    start: 'Denemeye başla',
    resume: 'Yarım kalan denemen var',
    resumeText: (name, n, total) => `${name}: ${total} sorunun ${n} tanesini cevapladın.`,
    resumeBtn: 'Kaldığın yerden devam et',
    timeTitle: 'Süre',
    timeLabel: 'Süre seçeneği',
    times: { 1: 'Normal süre', 1.5: '1,5 kat süre', 2: '2 kat süre', 0: 'Süresiz' },
    timeNote: 'Daha fazla süreye ihtiyacın varsa ya da süre baskısı olmadan çalışmak istiyorsan buradan değiştir.',
    oralTitle: 'Levha sınavı provası',
    oralText: 'Bugünkü sözlü sınava en yakın prova: levhayı görürsün, anlamını söylersin.',
    oralBtn: 'Levha provasına gir',
    splitNote: 'Ağır vasıta denemesinde konu dağılımı, yönetmelikteki otomobil dağılımının iki katı olarak Test2Drive tarafından belirlendi.',
    checked: (d) => `Son kontrol: ${d}`,
  },
  en: {
    title: 'Mock exam',
    subtitle: 'A timed rehearsal in the written exam format set out in the regulation. You see which answers were right once you finish.',
    status: 'This format is defined in a 2017 regulation but is not in use yet. Today’s theory exam is oral; use the sign exam rehearsal to prepare for it.',
    moreExam: 'How the exam works',
    pass: (p, q) => `Pass mark: ${p} correct out of ${q}`,
    classNow: 'Today',
    classNew: 'New system',
    start: 'Start a mock exam',
    resume: 'You have an unfinished mock exam',
    resumeText: (name, n, total) => `${name}: you have answered ${n} of ${total} questions.`,
    resumeBtn: 'Continue where you left off',
    timeTitle: 'Time',
    timeLabel: 'Time option',
    times: { 1: 'Standard time', 1.5: '1.5 × time', 2: '2 × time', 0: 'No time limit' },
    timeNote: 'Change this if you need more time or want to practise without time pressure.',
    oralTitle: 'Sign exam rehearsal',
    oralText: 'The closest rehearsal to today’s oral exam: you see a sign and say what it means.',
    oralBtn: 'Start the sign rehearsal',
    splitNote: 'The topic split for the heavy-vehicle mock is set by Test2Drive as twice the car split in the regulation.',
    checked: (d) => `Last checked: ${d}`,
  },
};
const c = computed(() => copy[lang.value]);
const icons = { car: Car, moto: Bike, heavy: Bus };
usePage({ title: computed(() => c.value.title), description: computed(() => c.value.subtitle), alternates: both((l) => to('mock', l)) });

const resumable = computed(() => (progress.loaded && progress.mock ? progress.mock : null));
const resumeTrack = computed(() => (resumable.value ? trackById(resumable.value.track) : null));
const timeFactor = computed({
  get: () => progress.settings.timeFactor ?? 1,
  set: (v) => progress.setSetting('timeFactor', Number(v)),
});
</script>

<template>
  <div>
    <PageHero :title="c.title" :subtitle="c.subtitle" :crumbs="[{ label: t('nav.home'), path: to('home', lang) }, { label: c.title }]" />
    <section class="section-block alt full-bleed">
      <div class="page-wrap">
        <p class="status-note">
          <Info :size="20" aria-hidden="true" />
          <span>{{ c.status }} <RouterLink :to="to('exam', lang)">{{ c.moreExam }}</RouterLink></span>
        </p>

        <ClientOnly>
          <div v-if="resumable && resumeTrack" class="resume-card card">
            <div>
              <h2>{{ c.resume }}</h2>
              <p>{{ c.resumeText(tx(resumeTrack.name, lang), Object.keys(resumable.answers).length, resumable.questionIds.length) }}</p>
            </div>
            <RouterLink :to="mockPath(resumeTrack, lang)" class="btn btn-primary">{{ c.resumeBtn }}</RouterLink>
          </div>
        </ClientOnly>

        <ul class="grid grid-3 track-grid">
          <li v-for="tr in tracks" :key="tr.id" class="card track-card">
            <component :is="icons[tr.id]" class="track-icon" :size="44" :stroke-width="1.75" aria-hidden="true" />
            <h2>{{ tx(tr.name, lang) }}</h2>
            <p class="track-desc">{{ tx(tr.description, lang) }}</p>
            <dl class="classes">
              <div><dt>{{ c.classNow }}</dt><dd>{{ tr.classesNow.join(', ') }}</dd></div>
              <div><dt>{{ c.classNew }}</dt><dd>{{ tr.classesNew.join(', ') }}</dd></div>
            </dl>
            <ul class="facts">
              <li>{{ t('common.questions', { n: formatById(tr.exam).questions }) }}</li>
              <li>{{ t('common.minutes', { n: formatById(tr.exam).minutes }) }}</li>
              <li>{{ c.pass(formatById(tr.exam).passMark, formatById(tr.exam).questions) }}</li>
            </ul>
            <RouterLink :to="mockPath(tr, lang)" class="btn btn-primary">{{ c.start }}</RouterLink>
          </li>
        </ul>
        <p class="split-note">{{ c.splitNote }} {{ c.checked(fmtDate(examProfile.checkedAt, lang)) }}</p>

        <div class="lower-grid">
          <ClientOnly>
            <fieldset class="card time-card">
              <legend><Clock :size="20" aria-hidden="true" /> {{ c.timeTitle }}</legend>
              <div class="time-options">
                <label v-for="f in [1, 1.5, 2, 0]" :key="f" class="time-option" :class="{ selected: timeFactor === f }">
                  <input v-model="timeFactor" type="radio" name="time" :value="f" />
                  {{ c.times[f] }}
                </label>
              </div>
              <p>{{ c.timeNote }}</p>
            </fieldset>
          </ClientOnly>
          <div class="card oral-card">
            <Signpost :size="36" :stroke-width="1.75" class="track-icon" aria-hidden="true" />
            <h2>{{ c.oralTitle }}</h2>
            <p>{{ c.oralText }}</p>
            <RouterLink :to="to('signExam', lang)" class="btn btn-secondary">{{ c.oralBtn }}</RouterLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.status-note {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  padding: 1rem 1.25rem;
  background: var(--color-warning-bg);
  border: 1px solid var(--color-warning-border);
  border-radius: var(--radius-lg);
  font-size: 1rem;
  color: var(--color-text);
  margin-bottom: 2rem;
}
.status-note svg {
  flex-shrink: 0;
  margin-top: 0.2rem;
  color: var(--color-accent-text);
}
.status-note a {
  color: var(--color-primary);
  font-weight: 700;
}
.resume-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border: 2px solid var(--color-primary);
  margin-bottom: 2rem;
}
.resume-card h2 {
  font-size: 1.25rem;
  margin-bottom: 0.25rem;
}
.resume-card p {
  font-size: 1rem;
}
.track-grid {
  list-style: none;
}
.track-card {
  display: flex;
  flex-direction: column;
  text-align: center;
  gap: 0.5rem;
}
.track-icon {
  color: var(--color-primary);
  margin: 0 auto 0.5rem;
}
.track-card h2 {
  font-size: 1.625rem;
}
.track-desc {
  font-size: 1rem;
}
.classes {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin: 0.5rem 0;
}
.classes dt {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  font-weight: 600;
}
.classes dd {
  margin: 0;
  font-weight: 800;
}
.facts {
  list-style: none;
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
  display: grid;
  gap: 0.25rem;
  margin-bottom: 1rem;
  flex: 1;
}
.split-note {
  margin-top: 1rem;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}
.lower-grid {
  margin-top: 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}
.time-card {
  border: 1px solid var(--color-border);
}
.time-card legend {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 1.125rem;
  padding: 0 0.25rem;
}
.time-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin: 0.5rem 0 0.75rem;
}
.time-option {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 48px;
  padding: 0.5rem 0.875rem;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: 600;
}
.time-option input {
  position: absolute;
  opacity: 0;
}
.time-option:has(input:focus-visible) {
  outline: 3px solid var(--color-focus);
  outline-offset: 2px;
}
.time-option.selected {
  border-color: var(--color-primary);
  background: rgba(55, 114, 114, 0.07);
}
.time-card p,
.oral-card p {
  font-size: 0.9375rem;
}
.oral-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-start;
}
.oral-card .track-icon {
  margin: 0;
}
.oral-card h2 {
  font-size: 1.375rem;
}
.oral-card .btn {
  margin-top: auto;
}
@media (max-width: 1024px) {
  .track-grid {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 760px) {
  .lower-grid {
    grid-template-columns: 1fr;
  }
  .resume-card {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
