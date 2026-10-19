<script setup>
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { Download, Upload, Trash2, Gauge, ClipboardList, BarChart3 } from 'lucide-vue-next';
import { usePage, useLang } from '../composables/usePage.js';
import { usePool } from '../composables/usePool.js';
import { trackById, formatForTrack, lessonMetaById } from '../content/meta.js';
import { lessonById } from '../content/docs.js';
import { readiness } from '../lib/sessions.js';
import { dayNumber } from '../lib/leitner.js';
import { requestPersistence } from '../lib/storage.js';
import { to, lessonPracticePath, mockPath, both } from '../lib/paths.js';
import { tx, fmtDate, fmtDuration, fmtPercent } from '../lib/text.js';
import PageHero from '../components/PageHero.vue';
import StateBlock from '../components/StateBlock.vue';
import TrackPicker from '../components/TrackPicker.vue';

const { t } = useI18n();
const lang = useLang();
const { progress, track, pool } = usePool();

const copy = {
  tr: {
    title: 'İlerleme',
    subtitle: 'Neyi bildiğin, neyin eksik olduğu ve geçmiş denemelerin. Bu bilgiler yalnız bu cihazda saklanır.',
    state: 'Hazırlık durumun',
    stateText: {
      start: 'Soruların yarısından azını gördün. Bugünkü tekrarla her gün biraz ilerle.',
      onTheWay: 'Soruların yarısını gördün. Şimdi tekrar ve deneme sınavlarıyla bilgini pekiştir.',
      close: 'Bilgin sağlamlaşıyor ve iki deneme geçtin. Zayıf konularını kapat.',
      ready: 'Bütün konularda güçlüsün ve son denemelerin geçer notun üstünde.',
    },
    estimate: 'Bu bir tahmindir, gerçek sınavın sonucunu garanti etmez.',
    missing: 'Eksikler',
    seenLabel: 'Görülen soru',
    mastery: 'Genel hakimiyet',
    signs: 'Levha hakimiyeti',
    weak: (n) => `${n} konuda hakimiyetin düşük`,
    mocksNeeded: (n) => `Son iki hafta içinde ${n} deneme geçtin; “Yaklaşıyor” için en az iki deneme geçmen gerekiyor.`,
    practise: 'Çalış',
    history: 'Deneme geçmişi',
    date: 'Tarih',
    vehicle: 'Araç',
    result: 'Sonuç',
    time: 'Süre',
    pass: 'Geçti',
    fail: 'Kaldı',
    shortMock: 'Kısa deneme',
    noHistory: 'Henüz deneme yok',
    noHistoryText: 'Sonuçların yalnızca bu cihazda saklanır.',
    startMock: 'Deneme sınavına gir',
    data: 'Verilerin',
    dataText: 'İlerlemen bu tarayıcıda durur. Başka bir cihaza taşımak ya da yedeklemek için dışa aktar. Tarayıcı verilerini silersen ilerlemen de silinir.',
    iosHint: 'iPhone ve iPad’de Safari, bir süre açılmayan sitelerin verilerini silebilir. Siteyi ana ekrana eklersen ilerlemen daha güvende olur.',
    export: 'Dışa aktar',
    import: 'İçe aktar',
    reset: 'İlerlemeyi sıfırla',
    resetConfirm: 'Bütün ilerlemen, hataların ve deneme geçmişin bu cihazdan silinecek. Emin misin?',
    resetYes: 'Evet, sıfırla',
    cancel: 'Vazgeç',
    imported: 'İlerlemen içe aktarıldı.',
    importError: 'Bu dosya bir Test2Drive yedeği değil.',
    resetDone: 'İlerlemen sıfırlandı.',
    empty: 'Henüz ilerleme yok',
    emptyText: 'Bir tur çözdüğünde ya da bir deneme bitirdiğinde ilerlemen burada görünür.',
    startReview: 'Bugünkü tekrara başla',
  },
  en: {
    title: 'Progress',
    subtitle: 'What you know, what is missing and your past mock exams. This is stored only on this device.',
    state: 'Your readiness',
    stateText: {
      start: 'You have seen fewer than half of the questions. Keep going a little every day with today’s review.',
      onTheWay: 'You have seen half of the questions. Now lock it in with reviews and mock exams.',
      close: 'Your knowledge is solid and you have passed two mocks. Close the gaps in your weak topics.',
      ready: 'You are strong in every topic and your recent mocks are above the pass mark.',
    },
    estimate: 'This is an estimate; it does not guarantee the result of the real exam.',
    missing: 'What is missing',
    seenLabel: 'Questions seen',
    mastery: 'Overall mastery',
    signs: 'Sign mastery',
    weak: (n) => `${n} topics with low mastery`,
    mocksNeeded: (n) => `You passed ${n} mocks in the last two weeks; “Getting close” needs at least two.`,
    practise: 'Practise',
    history: 'Mock exam history',
    date: 'Date',
    vehicle: 'Vehicle',
    result: 'Result',
    time: 'Time',
    pass: 'Passed',
    fail: 'Not passed',
    shortMock: 'Short mock',
    noHistory: 'No mock exams yet',
    noHistoryText: 'Your results are stored only on this device.',
    startMock: 'Take a mock exam',
    data: 'Your data',
    dataText: 'Your progress lives in this browser. Export it to back it up or move it to another device. Clearing browser data also deletes your progress.',
    iosHint: 'On iPhone and iPad, Safari can delete data for sites you have not opened for a while. Adding this site to your home screen keeps your progress safer.',
    export: 'Export',
    import: 'Import',
    reset: 'Reset progress',
    resetConfirm: 'All your progress, mistakes and mock history will be deleted from this device. Are you sure?',
    resetYes: 'Yes, reset',
    cancel: 'Cancel',
    imported: 'Your progress was imported.',
    importError: 'This file is not a Test2Drive backup.',
    resetDone: 'Your progress was reset.',
    empty: 'No progress yet',
    emptyText: 'Once you finish a round or a mock exam, your progress appears here.',
    startReview: 'Start today’s review',
  },
};
const c = computed(() => copy[lang.value]);
usePage({ title: computed(() => c.value.title), description: computed(() => c.value.subtitle), alternates: both((l) => to('progress', l)), noindex: true });

const format = computed(() => formatForTrack(track.value));
const r = computed(() =>
  readiness({
    pool: pool.value,
    items: progress.items,
    attempts: progress.attempts,
    day: dayNumber(),
    passMark: format.value.passMark,
    total: format.value.questions,
  }),
);
const STATES = ['start', 'onTheWay', 'close', 'ready'];
const weakLessons = computed(() => r.value.weakLessons.map((id) => lessonById(id)).filter(Boolean).slice(0, 6));
const history = computed(() => progress.mockAttempts.slice().reverse());

const message = ref('');
const resetDialog = ref(null);
const fileInput = ref(null);
const isIos = computed(() => typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent));

function exportData() {
  const blob = new Blob([progress.exportData()], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `test2drive-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  requestPersistence();
}
async function importData(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  try {
    progress.importData(await file.text());
    message.value = c.value.imported;
  } catch {
    message.value = c.value.importError;
  }
  e.target.value = '';
}
function doReset() {
  progress.reset();
  resetDialog.value?.close();
  message.value = c.value.resetDone;
}
</script>

<template>
  <div>
    <PageHero :title="c.title" :subtitle="c.subtitle" :crumbs="[{ label: t('nav.home'), path: to('home', lang) }, { label: c.title }]" />
    <section class="section-block alt full-bleed">
      <div class="page-wrap progress-wrap">
        <StateBlock v-if="!progress.loaded" :title="t('common.loading')" loading />
        <template v-else>
          <div class="card picker-card">
            <TrackPicker :model-value="track" :lang="lang" @update:model-value="(v) => progress.setSetting('track', v)" />
          </div>

          <StateBlock v-if="!progress.hasProgress" :title="c.empty" :text="c.emptyText">
            <template #icon><BarChart3 :size="36" /></template>
            <RouterLink :to="to('review', lang)" class="btn btn-primary">{{ c.startReview }}</RouterLink>
            <RouterLink :to="to('mock', lang)" class="btn btn-secondary">{{ c.startMock }}</RouterLink>
          </StateBlock>

          <template v-else>
            <section class="card readiness">
              <h2><Gauge :size="24" aria-hidden="true" /> {{ c.state }}</h2>
              <ol class="steps">
                <li v-for="s in STATES" :key="s" :class="{ done: STATES.indexOf(s) <= STATES.indexOf(r.state), current: s === r.state }" :aria-current="s === r.state ? 'step' : undefined">
                  {{ t(`readiness.${s}`) }}
                </li>
              </ol>
              <p class="state-text">{{ c.stateText[r.state] }}</p>
              <p class="estimate">{{ c.estimate }}</p>
              <dl class="stats">
                <div><dt>{{ c.seenLabel }}</dt><dd>{{ r.seen }} / {{ r.total }}</dd></div>
                <div><dt>{{ c.mastery }}</dt><dd>{{ fmtPercent(r.overall * 100, lang) }}</dd></div>
                <div><dt>{{ c.signs }}</dt><dd>{{ fmtPercent(r.signMastery * 100, lang) }}</dd></div>
                <div><dt>{{ t('footer.mistakes') }}</dt><dd>{{ progress.mistakeCount(pool) }}</dd></div>
              </dl>
            </section>

            <section v-if="weakLessons.length || r.passedMocks < 2" class="card missing">
              <h2>{{ c.missing }}</h2>
              <p v-if="weakLessons.length">{{ c.weak(r.weakLessons.length) }}:</p>
              <ul v-if="weakLessons.length" class="weak-list">
                <li v-for="l in weakLessons" :key="l.id">
                  <span>{{ tx(l.doc.title, lang) }}</span>
                  <RouterLink :to="lessonPracticePath(l, lang)">{{ c.practise }}</RouterLink>
                </li>
              </ul>
              <p v-if="r.passedMocks < 2">{{ c.mocksNeeded(r.passedMocks) }}</p>
            </section>
          </template>

          <section class="card history">
            <h2><ClipboardList :size="24" aria-hidden="true" /> {{ c.history }}</h2>
            <div v-if="history.length" class="table-wrap" tabindex="0" :aria-label="c.history">
              <table>
                <thead>
                  <tr>
                    <th scope="col">{{ c.date }}</th>
                    <th scope="col">{{ c.vehicle }}</th>
                    <th scope="col">{{ c.result }}</th>
                    <th scope="col">{{ c.time }}</th>
                    <th scope="col"><span class="visually-hidden">{{ c.result }}</span></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="a in history" :key="a.id">
                    <td>{{ fmtDate(a.finishedAt, lang) }}</td>
                    <td>{{ tx(trackById(a.track)?.name, lang) }}</td>
                    <td>{{ a.correct }} / {{ a.total }}</td>
                    <td>{{ fmtDuration(a.duration, lang) }}</td>
                    <td>
                      <RouterLink :to="{ path: to('mockResult', lang), query: { id: a.id } }" :class="a.passed ? 'ok' : a.fullLength ? 'no' : ''">
                        {{ !a.fullLength ? c.shortMock : a.passed ? c.pass : c.fail }}
                      </RouterLink>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="no-history">
              <p><strong>{{ c.noHistory }}.</strong> {{ c.noHistoryText }}</p>
              <RouterLink :to="mockPath(track, lang)" class="btn btn-secondary">{{ c.startMock }}</RouterLink>
            </div>
          </section>

          <section class="card data">
            <h2>{{ c.data }}</h2>
            <p>{{ c.dataText }}</p>
            <p v-if="isIos" class="ios">{{ c.iosHint }}</p>
            <div class="data-actions">
              <button type="button" class="btn btn-secondary" @click="exportData"><Download :size="18" aria-hidden="true" /> {{ c.export }}</button>
              <button type="button" class="btn btn-secondary" @click="fileInput.click()"><Upload :size="18" aria-hidden="true" /> {{ c.import }}</button>
              <input ref="fileInput" type="file" accept="application/json,.json" class="visually-hidden" tabindex="-1" aria-hidden="true" @change="importData" />
              <button type="button" class="btn btn-ghost danger" @click="resetDialog.showModal()"><Trash2 :size="18" aria-hidden="true" /> {{ c.reset }}</button>
            </div>
            <p v-if="message" class="message" role="status">{{ message }}</p>
          </section>
        </template>
      </div>
    </section>

    <dialog ref="resetDialog" class="confirm-dialog" aria-labelledby="reset-title">
      <h2 id="reset-title">{{ c.reset }}</h2>
      <p>{{ c.resetConfirm }}</p>
      <div class="results-actions">
        <button type="button" class="btn btn-secondary" autofocus @click="resetDialog.close()">{{ c.cancel }}</button>
        <button type="button" class="btn btn-primary danger-fill" @click="doReset">{{ c.resetYes }}</button>
      </div>
    </dialog>
  </div>
</template>

<style scoped>
.progress-wrap {
  max-width: 960px;
  display: grid;
  gap: 1.5rem;
}
.card h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.375rem;
  margin-bottom: 1rem;
}
.card h2 svg {
  color: var(--color-primary);
}
.steps {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.steps li {
  text-align: center;
  padding: 0.75rem 0.5rem;
  border-radius: var(--radius-md);
  background: var(--color-bg-secondary);
  font-weight: 600;
  font-size: 0.9375rem;
  color: var(--color-text-secondary);
}
.steps li.done {
  background: rgba(55, 114, 114, 0.12);
  color: var(--color-primary);
}
.steps li.current {
  background: var(--gradient-primary);
  color: white;
}
.state-text {
  font-size: 1.0625rem;
  color: var(--color-text);
}
.estimate {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin-top: 0.25rem;
}
.stats {
  margin-top: 1.25rem;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
}
.stats div {
  background: var(--color-bg);
  border-radius: var(--radius-md);
  padding: 0.875rem;
  text-align: center;
  display: flex;
  flex-direction: column-reverse;
  gap: 0.25rem;
}
.stats dt {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  font-weight: 600;
}
.stats dd {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-primary);
  font-variant-numeric: tabular-nums;
}
.weak-list {
  list-style: none;
  display: grid;
  gap: 0.5rem;
  margin: 0.75rem 0 1rem;
}
.weak-list li {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.625rem 0.875rem;
  background: var(--color-bg);
  border-radius: var(--radius-md);
}
.weak-list a,
td a {
  color: var(--color-primary);
  font-weight: 700;
}
td a.ok {
  color: var(--color-success-text);
}
td a.no {
  color: var(--color-danger-text);
}
.table-wrap {
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  text-align: left;
  padding: 0.625rem 0.5rem;
  border-bottom: 1px solid var(--color-border-light);
  white-space: nowrap;
  font-size: 0.9375rem;
}
thead th {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}
.no-history {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}
.no-history .btn,
.data-actions .btn {
  width: auto;
}
.data p {
  font-size: 1rem;
}
.ios {
  margin-top: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--color-bg);
  border-radius: var(--radius-md);
}
.data-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1rem;
}
.danger {
  color: var(--color-danger-text);
}
.danger:hover {
  border-color: var(--color-danger-text);
}
.message {
  margin-top: 0.75rem;
  font-weight: 600;
  color: var(--color-primary);
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
.confirm-dialog .results-actions {
  margin-top: 1.5rem;
}
.danger-fill {
  background: var(--color-danger-text);
}
@media (max-width: 760px) {
  .steps,
  .stats {
    grid-template-columns: repeat(2, 1fr);
  }
  .data-actions .btn {
    flex: 1;
  }
}
</style>
