<script setup>
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import {
  ArrowRight, BookOpen, RefreshCcw, ClipboardCheck, ShieldCheck, Lock, Languages, Scale,
  Car, Bike, Bus, Check, X, Flag, MessageSquareWarning,
} from 'lucide-vue-next';
import { usePage, useLang } from '../composables/usePage.js';
import { useProgress } from '../stores/progress.js';
import { categories, signs, signsInCategory, categoryIcon } from '../content/signs.js';
import { scenarios } from '../content/scenarios.js';
import { isDue, inMistakes, dayNumber } from '../lib/leitner.js';
import { tracks, formatById, examProfile } from '../content/meta.js';
import { to, categoryPath, mockPath, both } from '../lib/paths.js';
import { tx, fmtDate } from '../lib/text.js';
import SignImage from '../components/SignImage.vue';

const { t } = useI18n();
const lang = useLang();

const copy = {
  tr: {
    badge: 'Ücretsiz · Kayıt yok · Türkçe ve İngilizce',
    title: 'KKTC ehliyet sınavına hazırlan',
    heroDesc: 'Levhalar, kurallar ve deneme sınavları. Ücretsiz, kayıt yok; ilerlemen bu cihazda kalır.',
    start: 'Çalışmaya başla',
    mock: 'Deneme sınavına gir',
    allSigns: 'Tüm levhalar',
    resumeTitle: 'Kaldığın yerden devam',
    due: (n) => `${n} soru tekrar bekliyor`,
    mistakes: (n) => `Hatalarım: ${n}`,
    resume: 'Devam et',
    examTitle: 'Sınav kısaca',
    examLead: 'Bugünkü sınav ile yönetmelikte yazan sınav aynı değil. İkisine de hazırlanabilirsin.',
    examMore: 'Sınav nasıl yapılır',
    facts: [
      { icon: 'flag', title: 'Bugün sözlü', text: 'Teori aşamasında müfettiş sana levhaları sorar. Soru sayısı sabit değildir.' },
      { icon: 'clip', title: 'Yönetmelikte yazılı', text: '2017 yönetmeliği 50 soruluk bir bilgisayar sınavı tanımlıyor: 40 doğru geçer, süre 60 dakika. Henüz uygulanmıyor.' },
      { icon: 'scale', title: 'Soldan trafik', text: 'KKTC’de soldan gidilir, sağdan sollanır. Kavşakta sağdan gelene yol verilir.' },
      { icon: 'car', title: 'Otomobil ehliyeti D', text: 'KKTC bugün eski sınıf harflerini kullanıyor: otomobil D, motosiklet H, otobüs A.' },
    ],
    howTitle: 'Test2Drive nasıl çalışır',
    howLead: 'Öğren, tekrarla, dene. Her adım bir öncekinin eksiğini kapatır.',
    learnTitle: 'Öğren',
    learnText: 'Kısa konu sayfaları ve her levhanın kendi sayfası: ne anlama gelir, ne yapmalısın, neyle karıştırılır.',
    learnList: ['Kaynağı belli kurallar', 'Levhaların Türkçe ve İngilizce adları', 'Uluslararası öğrenciler için soldan trafik rehberi'],
    reviewTitle: 'Tekrarla',
    reviewText: 'Bugünkü tekrar, unutmaya başladığın soruları zamanında geri getirir. Yanlışların Hatalarım’da toplanır.',
    tryTitle: 'Dene',
    tryText: 'Levha sınavı provası bugünkü sözlü sınavı, yazılı sınav provası yönetmelikteki biçimi taklit eder.',
    freeTitle: 'Ücretsiz ve kayıtsız',
    freeText: 'Hesap açmazsın. Cevapların hiçbir sunucuya gitmez, ilerlemen yalnız bu tarayıcıda durur.',
    freeList: ['İndirme gerekmez', 'Telefonda ve bilgisayarda çalışır', 'İnternet kesilince de çalışmaya devam eder'],
    scenarioTitle: 'Gerçek bir durumu dene',
    scenarioLead: 'Senaryolar, levha ve kuralı yolda karşına çıktığı gibi sorar.',
    sample: 'Örnek senaryo',
    scenarioCta: 'Senaryolara başla',
    statSigns: 'Levha',
    statQuestions: 'Soru',
    statScenarios: 'Senaryo',
    intlTitle: 'Uluslararası öğrenciler için',
    intlLead: 'Sağdan trafiğe alışkınsan önce bunları oku.',
    intl: [
      'KKTC’de soldan gidilir. Dönel kavşaklarda saat yönünde dönülür ve içerideki araç önceliklidir.',
      'Oturum izni olan öğrenciler yabancı ehliyetle süresiz araç kullanamaz; ehliyetlerini KKTC ehliyetine çevirmeleri gerekir.',
      'İngilizce sayfalarda her levhanın Türkçe adını da görürsün, çünkü yolda ve sınavda Türkçe kullanılır.',
    ],
    intlCta: 'Soldan trafik rehberi',
    intlCta2: 'Ehliyet nasıl alınır',
    tracksTitle: 'Hangi araç için hazırlanıyorsun',
    tracksLead: 'Kartta bugünkü KKTC sınıf harfi ve yeni sistemdeki karşılığı yazar.',
    classNow: 'Bugün',
    classNew: 'Yeni sistemde',
    startMock: 'Denemeye başla',
    trustTitle: 'Neden güvenebilirsin',
    trust: [
      { title: 'Kaynaklı içerik', text: 'Her kuralın altında yasa maddesi ya da açık bir “genel uygulama” etiketi yazar.' },
      { title: 'Tarihli', text: '' },
      { title: 'Resmi değil, açık', text: 'Test2Drive resmi bir kurum değildir. Bir hata görürsen bildirmen bir dakika sürer.' },
      { title: 'Verin sende', text: 'Kayıt yok, çerez yok. İlerlemeni istediğin an dışa aktarır ya da silersin.' },
    ],
    checked: (d) => `İçerik en son ${d} tarihinde kontrol edildi.`,
    sourcesCta: 'Kaynakları gör',
    ctaTitle: 'Bugünkü tekrar: 20 soru, yaklaşık 8 dakika',
    ctaText: 'Her gün biraz çalışmak, sınavdan önceki gece hepsini okumaktan daha iyi sonuç verir.',
    ctaBtn: 'Bugünkü tekrara başla',
  },
  en: {
    badge: 'Free · No sign-up · Turkish and English',
    title: 'Get ready for the North Cyprus driving theory test',
    heroDesc: 'Signs, rules and mock exams. Free, no sign-up; your progress stays on this device.',
    start: 'Start practising',
    mock: 'Take a mock exam',
    allSigns: 'All signs',
    resumeTitle: 'Pick up where you left off',
    due: (n) => `${n} questions due for review`,
    mistakes: (n) => `My mistakes: ${n}`,
    resume: 'Continue',
    examTitle: 'The exam in short',
    examLead: 'Today’s exam and the exam written into the regulation are not the same. You can prepare for both.',
    examMore: 'How the exam works',
    facts: [
      { icon: 'flag', title: 'Oral today', text: 'At the theory stage an inspector asks you about road signs. The number of questions is not fixed.' },
      { icon: 'clip', title: 'Written in the regulation', text: 'A 2017 regulation sets out a 50-question computer exam: 40 correct to pass, 60 minutes. It is not in use yet.' },
      { icon: 'scale', title: 'Left-hand traffic', text: 'In North Cyprus you keep left and overtake on the right. At junctions you give way to traffic from the right.' },
      { icon: 'car', title: 'The car licence is class D', text: 'KKTC still uses the old class letters: D for cars, H for motorcycles, A for buses.' },
    ],
    howTitle: 'How Test2Drive works',
    howLead: 'Learn, review, rehearse. Each step closes the gaps left by the one before.',
    learnTitle: 'Learn',
    learnText: 'Short topic pages and a page for every sign: what it means, what to do, what it is confused with.',
    learnList: ['Rules with named sources', 'Turkish and English names for every sign', 'A driving-on-the-left guide for international students'],
    reviewTitle: 'Review',
    reviewText: 'Today’s review brings back the questions you are starting to forget, right on time. Your mistakes collect in My mistakes.',
    tryTitle: 'Rehearse',
    tryText: 'The sign exam rehearsal mirrors today’s oral exam; the written exam rehearsal follows the format in the regulation.',
    freeTitle: 'Free, no account',
    freeText: 'You never sign up. Your answers are not sent anywhere; your progress lives only in this browser.',
    freeList: ['Nothing to install', 'Works on phone and computer', 'Keeps working when you go offline'],
    scenarioTitle: 'Try a real situation',
    scenarioLead: 'Scenarios ask about signs and rules the way you meet them on the road.',
    sample: 'Sample scenario',
    scenarioCta: 'Start scenarios',
    statSigns: 'Signs',
    statQuestions: 'Questions',
    statScenarios: 'Scenarios',
    intlTitle: 'For international students',
    intlLead: 'If you learnt to drive on the right, read these first.',
    intl: [
      'Traffic keeps left. Roundabouts run clockwise and traffic already on the roundabout has priority.',
      'Students with a residence permit cannot keep driving on a foreign licence; they need to convert it to a KKTC licence.',
      'English pages also show the Turkish name of every sign, because Turkish is what you will see on the road and in the exam.',
    ],
    intlCta: 'Driving on the left',
    intlCta2: 'Getting a licence',
    tracksTitle: 'Which vehicle are you preparing for',
    tracksLead: 'Each card shows today’s KKTC class letter and its equivalent in the new system.',
    classNow: 'Today',
    classNew: 'New system',
    startMock: 'Start a mock exam',
    trustTitle: 'Why you can trust it',
    trust: [
      { title: 'Sourced', text: 'Every rule shows the law it comes from, or a clear “common practice” label.' },
      { title: 'Dated', text: '' },
      { title: 'Not official, and open about it', text: 'Test2Drive is not an official service. If you spot a mistake, reporting it takes a minute.' },
      { title: 'Your data stays with you', text: 'No account, no cookies. Export or delete your progress whenever you like.' },
    ],
    checked: (d) => `Content was last checked on ${d}.`,
    sourcesCta: 'See the sources',
    ctaTitle: 'Today’s review: 20 questions, about 8 minutes',
    ctaText: 'A little practice every day works better than reading everything the night before.',
    ctaBtn: 'Start today’s review',
  },
};
const c = computed(() => copy[lang.value]);
usePage({
  title: computed(() => (lang.value === 'tr' ? 'KKTC ehliyet sınavına hazırlan' : 'North Cyprus driving theory test practice')),
  description: computed(() => c.value.heroDesc),
  alternates: both((l) => to('home', l)),
  jsonLd: computed(() => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Test2Drive',
    inLanguage: lang.value,
    description: c.value.heroDesc,
  })),
});
const factIcons = { flag: Flag, clip: ClipboardCheck, scale: Scale, car: Car };
const trackIcons = { car: Car, moto: Bike, heavy: Bus };

const heroCats = computed(() => categories.slice(0, 5));
// eslint-disable-next-line no-undef
const counts = __CONTENT_STATS__;
const checkedDate = computed(() => fmtDate(examProfile.checkedAt, lang.value));

// Returning-user strip (client only; progress loads after mount).
const progress = useProgress();
// Counts use the same pool as Today's review and My mistakes. The question bank is
// loaded only for returning learners, after the page is interactive.
const pool = ref([]);
onMounted(async () => {
  progress.load();
  if (!progress.hasProgress) return;
  const { loadQuestions } = await import('../content/questions.js');
  const { allQuestions } = await loadQuestions(lang.value);
  const track = progress.settings.track || 'car';
  pool.value = allQuestions.filter((q) => q.tracks.includes(track));
});
const dueN = computed(() => {
  const d = dayNumber();
  return pool.value.filter((q) => isDue(progress.items[q.id], d)).length;
});
const mistakeN = computed(() => pool.value.filter((q) => inMistakes(progress.items[q.id])).length);

// Live sample scenario: the first scenario in the bank.
const sample = computed(() => scenarios.find((s) => s.lesson === 'vulnerable') || scenarios[0] || null);
const picked = ref(null);
const sampleCorrect = computed(() => picked.value && sample.value?.choices.find((ch) => ch.id === picked.value)?.correct);
</script>

<template>
  <div class="home">
    <section class="hero-split full-bleed">
      <div class="hero-pattern" aria-hidden="true" />
      <div class="hero-grid section-padding">
        <div class="hero-content">
          <p class="hero-badge">{{ c.badge }}</p>
          <h1 class="hero-title">{{ c.title }}</h1>
          <p class="hero-desc">{{ c.heroDesc }}</p>
          <div class="hero-actions">
            <RouterLink :to="to('practise', lang)" class="btn btn-primary btn-large btn-glow">
              <span>{{ c.start }}</span>
              <ArrowRight :size="20" aria-hidden="true" />
            </RouterLink>
            <RouterLink :to="to('mock', lang)" class="btn btn-secondary btn-large">{{ c.mock }}</RouterLink>
          </div>
        </div>
        <div class="hero-visual">
          <ul class="modern-card-grid">
            <li v-for="cat in heroCats" :key="cat.id">
              <RouterLink :to="categoryPath(cat, lang)" class="modern-card">
                <span class="card-glow" aria-hidden="true" />
                <SignImage class="card-icon" :sign="categoryIcon(cat.id)" :lang="lang" :size="64" decorative eager />
                <span class="card-title">{{ tx(cat.name, lang) }}</span>
                <span class="card-count">{{ t('common.signsCount', { n: signsInCategory(cat.id).length }) }}</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink :to="to('signs', lang)" class="modern-card modern-card-all">
                <span class="card-glow" aria-hidden="true" />
                <span class="card-all-count">{{ counts.signs }}</span>
                <span class="card-title">{{ c.allSigns }}</span>
                <span class="card-count"><ArrowRight :size="18" aria-hidden="true" /></span>
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <ClientOnly>
      <section v-if="progress.loaded && progress.hasProgress" class="resume-strip full-bleed" :aria-label="c.resumeTitle">
        <div class="resume-inner">
          <strong>{{ c.resumeTitle }}</strong>
          <span>{{ c.due(dueN) }}</span>
          <span aria-hidden="true">·</span>
          <span>{{ c.mistakes(mistakeN) }}</span>
          <RouterLink :to="to('review', lang)" class="btn btn-primary">{{ c.resume }}</RouterLink>
        </div>
      </section>
    </ClientOnly>

    <section class="objectives-section full-bleed">
      <div class="section-padding">
        <div class="section-header">
          <h2>{{ c.examTitle }}</h2>
          <p>{{ c.examLead }}</p>
        </div>
        <ul class="grid grid-4 objectives-grid">
          <li v-for="f in c.facts" :key="f.title" class="card objective-card">
            <component :is="factIcons[f.icon]" class="objective-icon" :size="40" :stroke-width="1.75" aria-hidden="true" />
            <h3>{{ f.title }}</h3>
            <p>{{ f.text }}</p>
          </li>
        </ul>
        <p class="section-more">
          <RouterLink :to="to('exam', lang)" class="link-arrow">{{ c.examMore }} <ArrowRight :size="18" aria-hidden="true" /></RouterLink>
        </p>
      </div>
    </section>

    <section class="solutions-section full-bleed">
      <div class="section-padding">
        <div class="section-header">
          <h2>{{ c.howTitle }}</h2>
          <p>{{ c.howLead }}</p>
        </div>
        <div class="bento-grid solutions-grid">
          <RouterLink :to="to('topics', lang)" class="card solution-card bento-item-2 is-link">
            <div class="solution-content">
              <BookOpen class="solution-icon-large" :size="48" :stroke-width="1.75" aria-hidden="true" />
              <h3>{{ c.learnTitle }}</h3>
              <p>{{ c.learnText }}</p>
              <ul class="feature-list">
                <li v-for="item in c.learnList" :key="item">{{ item }}</li>
              </ul>
            </div>
          </RouterLink>
          <RouterLink :to="to('review', lang)" class="card solution-card bento-item-1 is-link">
            <RefreshCcw class="solution-icon" :size="40" :stroke-width="1.75" aria-hidden="true" />
            <h3>{{ c.reviewTitle }}</h3>
            <p>{{ c.reviewText }}</p>
          </RouterLink>
          <RouterLink :to="to('mock', lang)" class="card solution-card bento-item-1 is-link">
            <ClipboardCheck class="solution-icon" :size="40" :stroke-width="1.75" aria-hidden="true" />
            <h3>{{ c.tryTitle }}</h3>
            <p>{{ c.tryText }}</p>
          </RouterLink>
          <RouterLink :to="to('privacy', lang)" class="card solution-card bento-item-2 is-link">
            <div class="solution-content">
              <ShieldCheck class="solution-icon-large" :size="48" :stroke-width="1.75" aria-hidden="true" />
              <h3>{{ c.freeTitle }}</h3>
              <p>{{ c.freeText }}</p>
              <ul class="feature-list">
                <li v-for="item in c.freeList" :key="item">{{ item }}</li>
              </ul>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>

    <section v-if="sample" class="scenario-preview full-bleed">
      <div class="section-padding">
        <div class="section-header">
          <h2>{{ c.scenarioTitle }}</h2>
          <p>{{ c.scenarioLead }}</p>
        </div>
        <div class="scenario-container">
          <div class="scenario-card">
            <div class="scenario-badge">{{ c.sample }}</div>
            <h3>{{ tx(sample.title, lang) }}</h3>
            <p class="scenario-text">{{ tx(sample.situation, lang) }}</p>
            <div class="scenario-choices" role="group" :aria-label="tx(sample.title, lang)">
              <button
                v-for="(ch, i) in sample.choices"
                :key="ch.id"
                type="button"
                class="choice-btn"
                :class="{
                  'choice-correct': picked && ch.correct,
                  'choice-wrong': picked === ch.id && !ch.correct,
                }"
                :disabled="!!picked"
                @click="picked = ch.id"
              >
                <span class="choice-letter" aria-hidden="true">{{ 'ABC'[i] }}</span>
                <span class="choice-text">{{ tx(ch.text, lang) }}</span>
                <Check v-if="picked && ch.correct" :size="20" class="mark-ok" aria-hidden="true" />
                <X v-else-if="picked === ch.id" :size="20" class="mark-no" aria-hidden="true" />
              </button>
            </div>
            <div role="status" aria-live="polite">
              <p v-if="picked" class="sample-feedback" :class="sampleCorrect ? 'ok' : 'no'">
                <strong>{{ sampleCorrect ? t('common.correct') : t('common.wrong') }}.</strong>
                {{ tx(sample.choices.find((ch) => ch.id === picked).feedback, lang) }}
              </p>
            </div>
            <RouterLink :to="to('scenarios', lang)" class="btn btn-primary btn-large scenario-cta">
              <span>{{ c.scenarioCta }}</span>
              <ArrowRight :size="20" aria-hidden="true" />
            </RouterLink>
          </div>
          <dl class="scenario-stats">
            <div class="stat-item">
              <dt class="stat-text">{{ c.statSigns }}</dt>
              <dd class="stat-value">{{ counts.signs }}</dd>
            </div>
            <div class="stat-item">
              <dt class="stat-text">{{ c.statQuestions }}</dt>
              <dd class="stat-value">{{ counts.questions }}</dd>
            </div>
            <div class="stat-item">
              <dt class="stat-text">{{ c.statScenarios }}</dt>
              <dd class="stat-value">{{ counts.scenarios }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>

    <section class="intl-section full-bleed">
      <div class="section-padding intl-inner">
        <div class="intl-head">
          <Languages :size="40" :stroke-width="1.75" class="intl-icon" aria-hidden="true" />
          <h2>{{ c.intlTitle }}</h2>
          <p>{{ c.intlLead }}</p>
        </div>
        <ul class="intl-list">
          <li v-for="item in c.intl" :key="item">{{ item }}</li>
        </ul>
        <div class="intl-actions">
          <RouterLink :to="to('leftDriving', lang)" class="btn btn-primary">{{ c.intlCta }}</RouterLink>
          <RouterLink :to="to('licence', lang)" class="btn btn-secondary">{{ c.intlCta2 }}</RouterLink>
        </div>
      </div>
    </section>

    <section class="license-section full-bleed">
      <div class="section-padding">
        <div class="section-header">
          <h2>{{ c.tracksTitle }}</h2>
          <p>{{ c.tracksLead }}</p>
        </div>
        <ul class="grid grid-3 license-grid">
          <li v-for="tr in tracks" :key="tr.id">
            <RouterLink :to="mockPath(tr, lang)" class="card license-card is-link">
              <component :is="trackIcons[tr.id]" class="license-icon" :size="48" :stroke-width="1.75" aria-hidden="true" />
              <h3>{{ tx(tr.name, lang) }}</h3>
              <p class="license-desc">{{ tx(tr.description, lang) }}</p>
              <dl class="license-classes">
                <div><dt>{{ c.classNow }}</dt><dd>{{ tr.classesNow.join(', ') }}</dd></div>
                <div><dt>{{ c.classNew }}</dt><dd>{{ tr.classesNew.join(', ') }}</dd></div>
              </dl>
              <p class="license-meta">
                <span>{{ t('common.questions', { n: formatById(tr.exam).questions }) }}</span>
                <span aria-hidden="true">•</span>
                <span>{{ t('common.minutes', { n: formatById(tr.exam).minutes }) }}</span>
              </p>
              <span class="btn btn-secondary">{{ c.startMock }}</span>
            </RouterLink>
          </li>
        </ul>
      </div>
    </section>

    <section class="trust-section full-bleed">
      <div class="section-padding">
        <div class="section-header">
          <h2>{{ c.trustTitle }}</h2>
        </div>
        <ul class="grid grid-4 trust-grid">
          <li v-for="(item, i) in c.trust" :key="item.title" class="trust-item">
            <component :is="[ShieldCheck, ClipboardCheck, MessageSquareWarning, Lock][i]" :size="28" :stroke-width="1.75" class="trust-icon" aria-hidden="true" />
            <h3>{{ item.title }}</h3>
            <p>{{ item.text || c.checked(checkedDate) }}</p>
          </li>
        </ul>
        <p class="section-more">
          <RouterLink :to="to('sources', lang)" class="link-arrow">{{ c.sourcesCta }} <ArrowRight :size="18" aria-hidden="true" /></RouterLink>
        </p>
      </div>
    </section>

    <section class="cta-section full-bleed bg-gradient-hero">
      <div class="section-padding">
        <div class="cta-content">
          <h2 class="text-white">{{ c.ctaTitle }}</h2>
          <p class="text-white">{{ c.ctaText }}</p>
          <RouterLink :to="to('review', lang)" class="btn btn-large cta-btn">{{ c.ctaBtn }}</RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Hero Split - Simplified */
.hero-split {
  position: relative;
  background: var(--gradient-hero);
  color: white;
  padding: 5rem 1.5rem 4rem;
  min-height: 75vh;
  display: flex;
  align-items: center;
  overflow: hidden;
}

/* Simple Background Pattern */
.hero-pattern {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(30deg, rgba(255, 255, 255, 0.03) 12%, transparent 12.5%, transparent 87%, rgba(255, 255, 255, 0.03) 87.5%, rgba(255, 255, 255, 0.03)),
    linear-gradient(150deg, rgba(255, 255, 255, 0.03) 12%, transparent 12.5%, transparent 87%, rgba(255, 255, 255, 0.03) 87.5%, rgba(255, 255, 255, 0.03)),
    linear-gradient(30deg, rgba(255, 255, 255, 0.03) 12%, transparent 12.5%, transparent 87%, rgba(255, 255, 255, 0.03) 87.5%, rgba(255, 255, 255, 0.03)),
    linear-gradient(150deg, rgba(255, 255, 255, 0.03) 12%, transparent 12.5%, transparent 87%, rgba(255, 255, 255, 0.03) 87.5%, rgba(255, 255, 255, 0.03));
  background-size: 80px 140px;
  background-position: 0 0, 0 0, 40px 70px, 40px 70px;
  opacity: 0.4;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 3rem;
  align-items: center;
  max-width: 1300px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50px;
  font-size: 0.9375rem;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}


.hero-title {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  margin-bottom: 1.5rem;
  line-height: 1.1;
  font-weight: 900;
  color: white;
}





.hero-desc {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2.5rem;
  line-height: 1.7;
  max-width: 600px;
}

/* Hero Stats */






.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-glow {
  position: relative;
  overflow: hidden;
}

.btn-glow::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.btn-glow:hover::before {
  width: 300px;
  height: 300px;
}

.btn-glow span,
.btn-glow svg {
  position: relative;
  z-index: 1;
}

/* Modern Card Grid */
.modern-card-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

.modern-card {
  position: relative;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-2xl);
  padding: 2rem 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all var(--transition-base);
  overflow: hidden;
}

.modern-card:hover {
  transform: translateY(-8px) scale(1.03);
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.card-glow {
  position: absolute;
  inset: -50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity var(--transition-base);
}

.modern-card:hover .card-glow {
  opacity: 1;
}

.modern-card .card-icon {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.card-title {
  display: block;
  font-weight: 700;
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
  color: white;
}

.card-count {
  display: block;
  font-size: 0.875rem;
  opacity: 0.8;
  color: rgba(255, 255, 255, 0.8);
}

/* Objectives Section */
.objectives-section {
  padding: 4rem 1.5rem;
  background: white;
}

.objectives-grid {
  max-width: 1200px;
  margin: 0 auto;
}

.objective-card {
  padding: 2.5rem 2rem;
  text-align: center;
  border: 2px solid var(--color-border);
  transition: all var(--transition-base);
}

.objective-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
}

.objective-icon {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  display: block;
}

.objective-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--color-primary);
}

.objective-card p {
  color: var(--color-text-secondary);
  line-height: 1.7;
}

/* Solutions Section */
.solutions-section {
  padding: 4rem 1.5rem;
  background: var(--color-bg);
}

.solutions-grid {
  max-width: 1200px;
  margin: 0 auto;
}

.solution-card {
  padding: 2.5rem 2rem;
  background: white;
  border: 1px solid var(--color-border);
  transition: all var(--transition-base);
}

.solution-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-2xl);
  border-color: var(--color-primary-light);
}

.solution-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.solution-icon-large {
  font-size: 4rem;
  margin-bottom: 1.5rem;
}

.solution-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
  display: block;
}

.solution-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--color-text);
}

.solution-card p {
  color: var(--color-text-secondary);
  margin-bottom: 1.5rem;
  line-height: 1.7;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin-top: auto;
}

.feature-list li {
  padding: 0.5rem 0;
  color: var(--color-text-secondary);
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.feature-list li::before {
  content: '';
  width: 6px;
  height: 6px;
  background: var(--color-primary);
  border-radius: 50%;
  flex-shrink: 0;
}

/* License Section */

.section-header {
  text-align: center;
  margin-bottom: 2.5rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.section-header h2 {
  margin-bottom: 1rem;
}

.section-header p {
  font-size: 1.25rem;
  color: var(--color-text-secondary);
}


/* License Section */
.license-section {
  padding: 3rem 1.5rem;
  background: white;
}

.license-card {
  padding: 2rem 1.5rem;
  text-align: center;
  cursor: pointer;
  position: relative;
}

.license-card.featured {
  border-width: 2px;
  border-color: var(--color-primary);
}



.license-icon {
  font-size: 3.5rem;
  margin-bottom: 1.25rem;
}

.license-card h3 {
  font-size: 1.75rem;
  margin-bottom: 0.75rem;
}

.license-desc {
  color: var(--color-text-secondary);
  margin-bottom: 1.5rem;
  font-size: 1.0625rem;
}

.license-meta {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  color: var(--color-text-muted);
  font-size: 0.9375rem;
  margin-bottom: 2rem;
}

.license-card .btn {
  width: 100%;
}

/* CTA Section */
.cta-section {
  padding: 3rem 1.5rem;
}

.cta-content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.cta-content h2 {
  margin-bottom: 1.25rem;
}

.cta-content p {
  font-size: 1.3125rem;
  margin-bottom: 2.5rem;
  opacity: 0.95;
}

/* Responsive */
@media (max-width: 1024px) {
  .hero-grid {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
  
  .hero-visual {
    order: -1;
  }
  
  .modern-card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .hero-split {
    padding: 4rem 0 3rem;
  }
  
  .hero-actions {
    flex-direction: column;
  }
  
    
  .modern-card-grid {
    grid-template-columns: 1fr;
  }
}

/* Scroll Indicator */






/* Scenario Preview Section */
.scenario-preview {
  padding: 4rem 1.5rem;
  background: linear-gradient(135deg, var(--color-bg) 0%, var(--color-bg-secondary) 100%);
}

.scenario-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2.5rem;
  align-items: start;
}

.scenario-card {
  background: white;
  border-radius: var(--radius-2xl);
  padding: 2.5rem;
  box-shadow: var(--shadow-xl);
  position: relative;
}

.scenario-badge {
  position: absolute;
  top: -12px;
  left: 2.5rem;
  background: var(--gradient-primary);
  color: white;
  padding: 0.5rem 1.25rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 700;
  box-shadow: var(--shadow-md);
}



.scenario-card h3 {
  font-size: 1.75rem;
  margin-bottom: 1rem;
  color: var(--color-text);
}

.scenario-text {
  font-size: 1.125rem;
  line-height: 1.7;
  color: var(--color-text-secondary);
  margin-bottom: 2rem;
}

.scenario-choices {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.choice-btn {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: var(--color-bg);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-base);
  text-align: left;
}

.choice-btn:hover {
  border-color: var(--color-primary);
  background: var(--color-bg-light);
  transform: translateX(4px);
}

.choice-btn.choice-correct {
  border-color: #10B981;
  background: rgba(16, 185, 129, 0.05);
}

.choice-btn.choice-correct .choice-letter {
  background: var(--color-success-text);
}

.choice-letter {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  background: var(--color-primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.125rem;
}

.choice-text {
  flex: 1;
  font-size: 1rem;
  color: var(--color-text);
}

.scenario-cta {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.scenario-stats {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.stat-item {
  background: white;
  padding: 2rem 1.5rem;
  border-radius: var(--radius-xl);
  text-align: center;
  box-shadow: var(--shadow-lg);
  transition: all var(--transition-base);
}

.stat-item:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-2xl);
}

.stat-value {
  font-size: 3rem;
  font-weight: 900;
  color: var(--color-primary);
  line-height: 1;
  margin-bottom: 0.5rem;
}

.stat-text {
  font-size: 1rem;
  color: var(--color-text-secondary);
  font-weight: 600;
}


/* Responsive */
@media (max-width: 1024px) {
  .scenario-container {
    grid-template-columns: 1fr;
  }
  
  .scenario-stats {
    flex-direction: row;
  }
}

@media (max-width: 640px) {
  .scenario-stats {
    flex-direction: column;
  }
  
  .choice-btn {
    padding: 1rem 1.25rem;
  }
}


/* Production additions (same visual language) */
.hero-badge {
  font-weight: 600;
  color: white;
}
.modern-card-grid {
  list-style: none;
}
.modern-card {
  display: block;
  height: 100%;
  color: white;
  text-decoration: none;
}
.modern-card .card-icon {
  display: block;
  width: 64px;
  height: 64px;
  margin: 0 auto 1rem;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.25));
}
.modern-card-all {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.card-all-count {
  font-size: 3rem;
  font-weight: 900;
  line-height: 1;
  margin-bottom: 0.75rem;
}
.modern-card-all .card-count {
  display: inline-flex;
}
.resume-strip {
  background: white;
  border-bottom: 1px solid var(--color-border);
  padding: 1rem 1.5rem;
}
.resume-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 1rem;
  color: var(--color-text-secondary);
}
.resume-inner strong {
  color: var(--color-text);
}
.resume-inner .btn {
  margin-left: auto;
  padding: 0.75rem 1.5rem;
}
.objectives-grid,
.license-grid,
.trust-grid {
  list-style: none;
}
.objective-icon {
  color: var(--color-primary);
  margin: 0 auto 1.25rem;
}
.solution-card {
  text-decoration: none;
  color: inherit;
  display: block;
}
.solution-icon-large,
.solution-icon {
  color: var(--color-primary);
}
.section-more {
  text-align: center;
  margin-top: 2rem;
}
.link-arrow {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 44px;
  font-weight: 700;
  color: var(--color-primary);
  text-decoration: none;
}
.link-arrow:hover {
  text-decoration: underline;
}
.choice-btn {
  font: inherit;
  color: inherit;
  width: 100%;
}
.choice-btn:disabled {
  cursor: default;
}
.choice-btn:disabled:hover {
  transform: none;
}
.choice-btn.choice-wrong {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.06);
}
.choice-btn.choice-wrong .choice-letter {
  background: var(--color-danger-text);
}
.mark-ok {
  color: var(--color-success-text);
  flex-shrink: 0;
}
.mark-no {
  color: var(--color-danger-text);
  flex-shrink: 0;
}
.sample-feedback {
  margin: -0.5rem 0 1.5rem;
  padding: 1rem 1.25rem;
  border-radius: var(--radius-lg);
  font-size: 1rem;
}
.sample-feedback.ok {
  background: rgba(16, 185, 129, 0.08);
}
.sample-feedback.no {
  background: rgba(239, 68, 68, 0.06);
}
.scenario-stats {
  margin: 0;
}
.stat-item dd {
  margin: 0;
}
.stat-item {
  display: flex;
  flex-direction: column-reverse;
}
.intl-section {
  padding: 4rem 1.5rem;
  background: white;
}
.intl-inner {
  max-width: 900px;
  margin: 0 auto;
}
.intl-head {
  text-align: center;
  margin-bottom: 2rem;
}
.intl-icon {
  color: var(--color-primary);
  margin-bottom: 1rem;
}
.intl-head h2 {
  margin-bottom: 0.75rem;
}
.intl-list {
  list-style: none;
  display: grid;
  gap: 1rem;
  margin-bottom: 2rem;
}
.intl-list li {
  position: relative;
  padding: 1.25rem 1.5rem 1.25rem 3rem;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  font-size: 1.0625rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
}
.intl-list li::before {
  content: '';
  position: absolute;
  left: 1.25rem;
  top: 1.75rem;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-primary);
}
.intl-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}
.license-grid {
  max-width: 1100px;
  margin: 0 auto;
}
.license-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  text-decoration: none;
  color: inherit;
}
.license-card .license-desc {
  flex: 1;
}
.license-icon {
  color: var(--color-primary);
  margin: 0 auto 1.25rem;
  display: block;
}
.license-classes {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
}
.license-classes dt {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  font-weight: 600;
}
.license-classes dd {
  margin: 0;
  font-weight: 800;
  font-size: 1.125rem;
  color: var(--color-text);
}
.license-meta {
  font-size: 0.9375rem;
}
.license-card .btn {
  width: 100%;
}
.trust-section {
  padding: 4rem 1.5rem;
  background: var(--color-bg);
}
.trust-grid {
  max-width: 1200px;
  margin: 0 auto;
}
.trust-item h3 {
  font-size: 1.1875rem;
  margin: 0.75rem 0 0.5rem;
}
.trust-item p {
  font-size: 1rem;
}
.trust-icon {
  color: var(--color-primary);
}
.cta-btn {
  background: white;
  color: var(--color-primary);
  box-shadow: var(--shadow-md);
}
.cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

@media (max-width: 1024px) {
  .modern-card-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 640px) {
  .hero-split {
    padding: 2.5rem 1rem 3rem;
    min-height: 0;
  }
  .hero-visual {
    order: 1;
  }
  .modern-card-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
  .modern-card {
    padding: 1.25rem 0.75rem;
  }
  .modern-card .card-icon {
    width: 48px;
    height: 48px;
    margin-bottom: 0.625rem;
  }
  .card-title {
    font-size: 1rem;
  }
  .objectives-section,
  .solutions-section,
  .scenario-preview,
  .intl-section,
  .license-section,
  .trust-section,
  .cta-section {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  .scenario-card {
    padding: 2rem 1.25rem 1.5rem;
  }
  .resume-inner .btn {
    margin-left: 0;
    width: 100%;
  }
}
</style>
