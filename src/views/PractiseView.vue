<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { RefreshCcw, Signpost, CircleAlert, Route, BookOpen, ClipboardCheck } from 'lucide-vue-next';
import { usePage, useLang } from '../composables/usePage.js';
import { usePool } from '../composables/usePool.js';
import { scenarios } from '../content/scenarios.js';
import { signs } from '../content/signs.js';
import { to, both } from '../lib/paths.js';
import PageHero from '../components/PageHero.vue';
import TrackPicker from '../components/TrackPicker.vue';

const { t } = useI18n();
const lang = useLang();
const { progress, track, pool } = usePool();

const copy = {
  tr: {
    title: 'Çalış',
    subtitle: 'Her gün biraz tekrar et, levhaları sesli söyle, yanlışlarını kapat. İlerlemen yalnız bu cihazda saklanır.',
    today: 'Bugünkü tekrar',
    todayText: 'Zamanı gelen sorular, yanlışların ve en zayıf konundan yeni sorular. Yaklaşık 20 soru.',
    due: (n) => `${n} soru tekrar bekliyor`,
    signExam: 'Levha sınavı provası',
    signExamText: 'Bugünkü sözlü sınav gibi: levhayı görürsün, anlamını söylersin, sonra cevabı açarsın.',
    signsN: (n) => `${n} levha`,
    mistakes: 'Hatalarım',
    mistakesText: 'Yanlış cevapladığın sorular burada toplanır. Farklı günlerde iki kez doğru cevaplayınca listeden çıkar.',
    mistakesN: (n) => (n ? `${n} soru` : 'Şu an boş'),
    scenarios: 'Senaryolar',
    scenariosText: 'Yolda karşına çıkabilecek durumlar. Her seçeneğin neden doğru ya da yanlış olduğunu görürsün.',
    scenariosN: (n) => `${n} senaryo`,
    topics: 'Konu çalış',
    topicsText: 'Tek bir konuyu oku, sonra o konunun sorularını çöz.',
    mock: 'Deneme sınavı',
    mockText: 'Yönetmelikteki yazılı sınav biçiminde, süreli. Sonuçlar sonda.',
    open: 'Aç',
  },
  en: {
    title: 'Practise',
    subtitle: 'Review a little every day, name the signs out loud and clear your mistakes. Your progress is stored only on this device.',
    today: 'Today’s review',
    todayText: 'Questions that are due, your mistakes and new questions from your weakest topic. About 20 questions.',
    due: (n) => `${n} questions due`,
    signExam: 'Sign exam rehearsal',
    signExamText: 'Like today’s oral exam: you see a sign, say what it means, then reveal the answer.',
    signsN: (n) => `${n} signs`,
    mistakes: 'My mistakes',
    mistakesText: 'Questions you got wrong collect here. Answer one correctly on two different days and it leaves the list.',
    mistakesN: (n) => (n ? `${n} questions` : 'Empty for now'),
    scenarios: 'Scenarios',
    scenariosText: 'Situations you may meet on the road. You see why each option is right or wrong.',
    scenariosN: (n) => `${n} scenarios`,
    topics: 'Practise a topic',
    topicsText: 'Read one topic, then answer the questions on it.',
    mock: 'Mock exam',
    mockText: 'In the written-exam format from the regulation, timed. Results at the end.',
    open: 'Open',
  },
};
const c = computed(() => copy[lang.value]);
usePage({ title: computed(() => c.value.title), description: computed(() => c.value.subtitle), alternates: both((l) => to('practise', l)) });

const dueN = computed(() => (progress.loaded ? progress.dueCount(pool.value) : null));
const mistakeN = computed(() => (progress.loaded ? progress.mistakeCount(pool.value) : null));
const setTrack = (v) => progress.setSetting('track', v);

const modes = computed(() => [
  { key: 'review', icon: RefreshCcw, title: c.value.today, text: c.value.todayText, meta: dueN.value != null ? c.value.due(dueN.value) : '', primary: true },
  { key: 'signExam', icon: Signpost, title: c.value.signExam, text: c.value.signExamText, meta: c.value.signsN(signs.length) },
  { key: 'mistakes', icon: CircleAlert, title: c.value.mistakes, text: c.value.mistakesText, meta: mistakeN.value != null ? c.value.mistakesN(mistakeN.value) : '' },
  { key: 'scenarios', icon: Route, title: c.value.scenarios, text: c.value.scenariosText, meta: c.value.scenariosN(scenarios.length) },
  { key: 'topics', icon: BookOpen, title: c.value.topics, text: c.value.topicsText, meta: '' },
  { key: 'mock', icon: ClipboardCheck, title: c.value.mock, text: c.value.mockText, meta: '' },
]);
</script>

<template>
  <div>
    <PageHero :title="c.title" :subtitle="c.subtitle" :crumbs="[{ label: t('nav.home'), path: to('home', lang) }, { label: c.title }]" />
    <section class="section-block alt full-bleed">
      <div class="page-wrap">
        
          <div class="picker-wrap card">
            <TrackPicker :model-value="track" :lang="lang" @update:model-value="setTrack" />
          </div>
        
        <ul class="mode-grid">
          <li v-for="m in modes" :key="m.key">
            <RouterLink :to="to(m.key, lang)" class="card mode-card is-link" :class="{ primary: m.primary }">
              <component :is="m.icon" :size="36" :stroke-width="1.75" class="mode-icon" aria-hidden="true" />
              <h2>{{ m.title }}</h2>
              <p>{{ m.text }}</p>
              <span class="mode-meta">
                <ClientOnly>{{ m.meta }}</ClientOnly>
              </span>
            </RouterLink>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<style scoped>
.picker-wrap {
  margin-bottom: 2rem;
}
.mode-grid {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}
.mode-card {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  height: 100%;
  padding: 1.75rem;
  text-decoration: none;
  color: inherit;
}
.mode-card.primary {
  border: 2px solid var(--color-primary);
}
.mode-icon {
  color: var(--color-primary);
}
.mode-card h2 {
  font-size: 1.375rem;
}
.mode-card p {
  font-size: 1rem;
  flex: 1;
}
.mode-meta {
  font-weight: 700;
  color: var(--color-primary);
  min-height: 1.5em;
}
@media (max-width: 1024px) {
  .mode-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 640px) {
  .mode-grid {
    grid-template-columns: 1fr;
  }
  .mode-card {
    padding: 1.25rem;
  }
}
</style>
