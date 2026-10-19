<script setup>
import { computed, ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { CircleAlert, Eye, MapPin, ArrowLeftRight } from 'lucide-vue-next';
import { usePage, useLang, absolute } from '../composables/usePage.js';
import { useProgress } from '../stores/progress.js';
import { signBySlug, signById, categoryById, signQuestion } from '../content/signs.js';
import { to, categoryPath, signPath } from '../lib/paths.js';
import { tx, fmtDate } from '../lib/text.js';
import PageHero from '../components/PageHero.vue';
import SignImage from '../components/SignImage.vue';
import QuestionCard from '../components/QuestionCard.vue';
import NotFoundView from './NotFoundView.vue';

const { t } = useI18n();
const lang = useLang();
const route = useRoute();
const progress = useProgress();

const sign = computed(() => signBySlug(lang.value, route.params.category, route.params.sign));
const category = computed(() => (sign.value ? categoryById(sign.value.category) : null));
const confusions = computed(() =>
  (sign.value?.confusions || []).map((c) => ({ ...c, sign: signById(c.with) })).filter((c) => c.sign),
);
const related = computed(() => (sign.value?.related || []).map(signById).filter(Boolean));
const question = computed(() => (sign.value ? signQuestion(sign.value) : null));

const copy = {
  tr: {
    signs: 'Levhalar',
    meaning: 'Anlamı',
    action: 'Ne yapmalısın',
    confused: 'Sık karıştırılan',
    related: 'İlgili levhalar',
    test: 'Bu levhayla bir soru çöz',
    kktc: { seen: 'Kuzey Kıbrıs’ta yolda görüldüğü belgelenmiş bir levha.', likely: 'KKTC’de kullanıldığı düşünülen bir levha; yolda görüldüğüne dair belge bulamadık.', unverified: 'KKTC’de kullanımı doğrulanmadı.' },
    checked: (d) => `Son kontrol: ${d}`,
    trName: 'Türkçe adı',
  },
  en: {
    signs: 'Signs',
    meaning: 'What it means',
    action: 'What to do',
    confused: 'Often confused with',
    related: 'Related signs',
    test: 'Try a question on this sign',
    kktc: { seen: 'A sign documented on roads in North Cyprus.', likely: 'Believed to be in use in North Cyprus; we found no photo of it on the road.', unverified: 'Use in North Cyprus not verified.' },
    checked: (d) => `Last checked: ${d}`,
    trName: 'Turkish name',
  },
};
const c = computed(() => copy[lang.value]);
const answer = ref(null);
watch(() => sign.value?.id, () => (answer.value = null));

usePage({
  title: computed(() => (sign.value ? (lang.value === 'tr' ? `${sign.value.name.tr} levhası` : `${sign.value.name.en} sign (${sign.value.name.tr})`) : '404')),
  description: computed(() => (sign.value ? `${tx(sign.value.meaning, lang.value)} ${tx(sign.value.driverAction, lang.value)}` : '')),
  alternates: computed(() => (sign.value ? { tr: signPath(sign.value, 'tr'), en: signPath(sign.value, 'en') } : null)),
  noindex: computed(() => !sign.value),
  jsonLd: computed(() => {
    if (!sign.value) return null;
    const l = lang.value;
    return [
      {
        '@context': 'https://schema.org',
        '@type': 'DefinedTerm',
        name: tx(sign.value.name, l),
        alternateName: l === 'en' ? sign.value.name.tr : sign.value.name.en,
        description: tx(sign.value.meaning, l),
        image: absolute(sign.value.image.src),
        inDefinedTermSet: absolute(categoryPath(category.value, l)),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Test2Drive', item: absolute(to('home', l)) },
          { '@type': 'ListItem', position: 2, name: c.value.signs, item: absolute(to('signs', l)) },
          { '@type': 'ListItem', position: 3, name: tx(category.value.name, l), item: absolute(categoryPath(category.value, l)) },
          { '@type': 'ListItem', position: 4, name: tx(sign.value.name, l) },
        ],
      },
    ];
  }),
});

function onAnswered(correct) {
  progress.record(question.value, correct);
}
</script>

<template>
  <NotFoundView v-if="!sign" embedded />
  <article v-else>
    <PageHero
      :title="tx(sign.name, lang)"
      :crumbs="[
        { label: t('nav.home'), path: to('home', lang) },
        { label: c.signs, path: to('signs', lang) },
        { label: tx(category.name, lang), path: categoryPath(category, lang) },
        { label: tx(sign.name, lang) },
      ]"
    >
      <p v-if="lang === 'en'" class="hero-subtitle tr-name">{{ c.trName }}: <strong lang="tr">{{ sign.name.tr }}</strong></p>
    </PageHero>

    <section class="section-block alt full-bleed">
      <div class="page-wrap sign-layout">
        <div class="sign-figure">
          <SignImage :sign="sign" :lang="lang" :size="260" eager />
          <p class="kktc-note"><MapPin :size="16" aria-hidden="true" /> {{ c.kktc[sign.kktc.status] }}</p>
        </div>

        <div class="sign-body">
          <section class="sign-section">
            <h2><Eye :size="22" aria-hidden="true" /> {{ c.meaning }}</h2>
            <p>{{ tx(sign.meaning, lang) }}</p>
          </section>
          <section class="sign-section action">
            <h2><CircleAlert :size="22" aria-hidden="true" /> {{ c.action }}</h2>
            <p>{{ tx(sign.driverAction, lang) }}</p>
          </section>
          <section v-if="confusions.length" class="sign-section">
            <h2><ArrowLeftRight :size="22" aria-hidden="true" /> {{ c.confused }}</h2>
            <ul class="confusions">
              <li v-for="cf in confusions" :key="cf.with">
                <RouterLink :to="signPath(cf.sign, lang)" class="confusion-sign">
                  <SignImage :sign="cf.sign" :lang="lang" :size="56" decorative />
                  <span>{{ tx(cf.sign.name, lang) }}</span>
                </RouterLink>
                <p>{{ tx(cf.tip, lang) }}</p>
              </li>
            </ul>
          </section>
          <p class="checked">{{ c.checked(fmtDate(sign.reviewedAt, lang)) }}</p>
        </div>
      </div>
    </section>

    <section class="section-block white full-bleed">
      <div class="page-wrap narrow-wrap">
        <h2 class="block-title">{{ c.test }}</h2>
        <QuestionCard
          v-model="answer"
          :question="question"
          :lang="lang"
          mode="practice"
          :show-topic="false"
          :autofocus="false"
          @answered="onAnswered"
          @next="answer = null"
        >
          <template #next-label>{{ t('common.retry') }}</template>
        </QuestionCard>
      </div>
    </section>

    <section v-if="related.length" class="section-block alt full-bleed">
      <div class="page-wrap">
        <h2 class="block-title">{{ c.related }}</h2>
        <ul class="tile-grid">
          <li v-for="s in related" :key="s.id">
            <RouterLink :to="signPath(s, lang)" class="sign-tile">
              <SignImage :sign="s" :lang="lang" decorative />
              <span class="sign-tile-name">{{ tx(s.name, lang) }}</span>
            </RouterLink>
          </li>
        </ul>
      </div>
    </section>
  </article>
</template>

<style scoped>
.tr-name {
  margin-top: -0.25rem;
}
.sign-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 2.5rem;
  align-items: start;
}
.sign-figure {
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl);
  padding: 2rem 1.5rem 1.5rem;
  text-align: center;
  box-shadow: var(--shadow-lg);
  position: sticky;
  top: 96px;
}
.sign-figure img {
  width: 100%;
  max-width: 260px;
  height: auto;
  aspect-ratio: 1;
  object-fit: contain;
}
.kktc-note {
  display: flex;
  gap: 0.375rem;
  align-items: flex-start;
  justify-content: center;
  margin-top: 1.25rem;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  text-align: left;
}
.kktc-note svg {
  flex-shrink: 0;
  margin-top: 0.2rem;
  color: var(--color-primary);
}
.sign-section {
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: 1.5rem 1.75rem;
  margin-bottom: 1.25rem;
}
.sign-section.action {
  border-left: 4px solid var(--color-primary);
}
.sign-section h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  margin-bottom: 0.625rem;
  color: var(--color-primary);
}
.sign-section p {
  font-size: 1.0625rem;
}
.confusions {
  list-style: none;
  display: grid;
  gap: 1rem;
}
.confusions li {
  display: grid;
  gap: 0.375rem;
}
.confusion-sign {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 700;
  color: var(--color-text);
  text-decoration: none;
}
.confusion-sign:hover span {
  text-decoration: underline;
  color: var(--color-primary);
}
.confusions p {
  font-size: 1rem;
  padding-left: calc(56px + 0.75rem);
}
.checked {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}
.narrow-wrap {
  max-width: 900px;
}
.block-title {
  font-size: 1.625rem;
  margin-bottom: 1.25rem;
}
.tile-grid {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 1rem;
}
@media (max-width: 860px) {
  .sign-layout {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  .sign-figure {
    position: static;
  }
  .sign-figure img {
    max-width: 200px;
  }
}
@media (max-width: 640px) {
  .sign-section {
    padding: 1.25rem;
  }
  .confusions p {
    padding-left: 0;
  }
  .tile-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
