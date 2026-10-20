<script setup>
import { computed, onMounted, ref, watch, nextTick } from 'vue';
import { RouterView, RouterLink, useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { Menu, X, WifiOff, Languages } from 'lucide-vue-next';
import { useProgress } from './stores/progress.js';
import { useLang } from './composables/usePage.js';
import { to } from './lib/paths.js';
import { otherLanguagePath } from './lib/alternates.js';
import { examProfile } from './content/meta.js';
import { fmtDate } from './lib/text.js';

const route = useRoute();
const { t } = useI18n();
const lang = useLang();
const progress = useProgress();

// A page chunk that fails to download (offline, or a stale tab after an update)
// shows an error with a retry instead of a blank page.
const router = useRouter();
const loadError = ref(false);
router.onError((err) => {
  if (/Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module/i.test(String(err?.message || err))) {
    loadError.value = true;
  }
});
watch(() => route.fullPath, () => (loadError.value = false));
function reloadPage() {
  window.location.reload();
}

const other = computed(() => (lang.value === 'tr' ? 'en' : 'tr'));
// Query parameters exist only in the browser; they are added after hydration so the
// prerendered link and the first client render agree.
const hydrated = ref(false);
const otherPath = computed(() => otherLanguagePath(route, { withQuery: hydrated.value }));

const nav = computed(() => [
  { key: 'practise', label: t('nav.practise'), path: to('practise', lang.value), match: ['practise', 'review', 'lessonPractice', 'signExam', 'mistakes', 'scenarios'] },
  { key: 'signs', label: t('nav.signs'), path: to('signs', lang.value), match: ['signs', 'signCategory', 'sign'] },
  { key: 'topics', label: t('nav.topics'), path: to('topics', lang.value), match: ['topics', 'lesson'] },
  { key: 'mock', label: t('nav.mock'), path: to('mock', lang.value), match: ['mock', 'mockExam', 'mockResult'] },
  { key: 'progress', label: t('nav.progress'), path: to('progress', lang.value), match: ['progress'] },
]);
const isActive = (item) => item.match.includes(route.meta.key);

// Mobile menu: a native dialog shown as a bottom sheet.
const menu = ref(null);
const menuButton = ref(null);
function openMenu() {
  menu.value?.showModal();
}
function closeMenu() {
  if (menu.value?.open) menu.value.close();
}
function onMenuClose() {
  nextTick(() => menuButton.value?.focus());
}
watch(() => route.fullPath, closeMenu);

// Client-only states.
const online = ref(true);
const updateReady = ref(false);
let applyUpdate = null;
const showLangHint = ref(false);
const inExam = computed(() => route.meta.key === 'mockExam');

onMounted(async () => {
  hydrated.value = true;
  progress.load();
  online.value = navigator.onLine;
  window.addEventListener('online', () => (online.value = true));
  window.addEventListener('offline', () => (online.value = false));

  const browserTr = (navigator.language || '').toLowerCase().startsWith('tr');
  showLangHint.value = lang.value === 'tr' && !browserTr && !progress.settings.dismissedLangHint;

  if (import.meta.env.PROD && 'serviceWorker' in navigator) {
    const { Workbox } = await import('workbox-window');
    const wb = new Workbox('/sw.js');
    wb.addEventListener('waiting', () => {
      updateReady.value = true;
      applyUpdate = () => {
        wb.addEventListener('controlling', () => window.location.reload());
        wb.messageSkipWaiting();
      };
    });
    wb.register().catch(() => {});
  }
});

function dismissLangHint() {
  showLangHint.value = false;
  progress.setSetting('dismissedLangHint', true);
}

const checked = computed(() => fmtDate(examProfile.checkedAt, lang.value));
const footer = computed(() => [
  {
    title: t('footer.practise'),
    links: [
      { label: t('footer.today'), path: to('review', lang.value) },
      { label: t('footer.signExam'), path: to('signExam', lang.value) },
      { label: t('footer.mistakes'), path: to('mistakes', lang.value) },
      { label: t('footer.scenarios'), path: to('scenarios', lang.value) },
    ],
  },
  {
    title: t('footer.guide'),
    links: [
      { label: t('footer.exam'), path: to('exam', lang.value) },
      { label: t('footer.licence'), path: to('licence', lang.value) },
      { label: t('footer.leftDriving'), path: to('leftDriving', lang.value) },
    ],
  },
  {
    title: t('footer.product'),
    links: [
      { label: t('footer.about'), path: to('about', lang.value) },
      { label: t('footer.sources'), path: to('sources', lang.value) },
      { label: t('footer.privacy'), path: to('privacy', lang.value) },
      { label: t('footer.report'), href: 'https://github.com/Asilturkmen/TRAF101/issues/new' },
    ],
  },
]);
</script>

<template>
  <div class="app-container">
    <a class="skip-link" href="#main">{{ t('nav.skip') }}</a>

    <header class="app-header">
      <nav class="nav-container" :aria-label="t('nav.label')">
        <RouterLink :to="to('home', lang)" class="logo" :aria-label="`Test2Drive, ${t('nav.home')}`">
          <img src="/logo-320.png" alt="" class="logo-icon" width="128" height="32" />
        </RouterLink>

        <ul class="nav-links">
          <li v-for="item in nav" :key="item.key">
            <RouterLink :to="item.path" :class="{ active: isActive(item) }" :aria-current="isActive(item) ? 'page' : undefined">
              {{ item.label }}
            </RouterLink>
          </li>
        </ul>

        <div class="nav-tools">
          <a :href="otherPath" class="lang-switch" :hreflang="other" :lang="other">
            <Languages :size="18" aria-hidden="true" />
            <span>{{ t('nav.switchToShort') }}</span>
            <span class="visually-hidden">, {{ t('nav.switchTo') }}</span>
          </a>
          <RouterLink :to="to('practise', lang)" class="btn btn-primary nav-cta">{{ t('nav.practise') }}</RouterLink>
          <button ref="menuButton" type="button" class="menu-button" aria-haspopup="dialog" @click="openMenu">
            <Menu :size="22" aria-hidden="true" />
            <span class="visually-hidden">{{ t('nav.menu') }}</span>
          </button>
        </div>
      </nav>
    </header>

    <dialog ref="menu" class="menu-sheet" :aria-label="t('nav.label')" @close="onMenuClose" @click.self="closeMenu">
      <div class="menu-sheet-inner">
        <div class="menu-sheet-head">
          <span class="menu-sheet-title">{{ t('nav.menu') }}</span>
          <button type="button" class="menu-close" autofocus @click="closeMenu">
            <X :size="22" aria-hidden="true" />
            <span class="visually-hidden">{{ t('nav.close') }}</span>
          </button>
        </div>
        <ul class="menu-links">
          <li><RouterLink :to="to('home', lang)" :class="{ active: route.meta.key === 'home' }">{{ t('nav.home') }}</RouterLink></li>
          <li v-for="item in nav" :key="item.key">
            <RouterLink :to="item.path" :class="{ active: isActive(item) }" :aria-current="isActive(item) ? 'page' : undefined">
              {{ item.label }}
            </RouterLink>
          </li>
        </ul>
        <a :href="otherPath" class="menu-lang" :hreflang="other" :lang="other">
          <Languages :size="18" aria-hidden="true" /> {{ t('nav.switchTo') }}
        </a>
      </div>
    </dialog>

    <div v-if="!online" class="notice notice-offline" role="status">
      <WifiOff :size="18" aria-hidden="true" /> {{ t('states.offline') }}
    </div>
    <div v-if="progress.loaded && !progress.canSave" class="notice" role="status">{{ t('states.noStorage') }}</div>
    <div v-if="showLangHint" class="notice notice-lang" lang="en">
      <span>{{ t('states.langHint') }}</span>
      <a :href="otherPath" hreflang="en">{{ t('states.langHintAction') }}</a>
      <button type="button" class="notice-dismiss" @click="dismissLangHint">
        <X :size="16" aria-hidden="true" /><span class="visually-hidden">{{ t('states.dismiss') }}</span>
      </button>
    </div>

    <div v-if="loadError" class="notice" role="alert">
      <span>{{ t('states.error') }}</span>
      <button type="button" class="btn btn-primary notice-retry" @click="reloadPage">{{ t('common.retry') }}</button>
    </div>

    <main id="main" class="main-content" tabindex="-1">
      <RouterView v-slot="{ Component, route: r }">
        <component :is="Component" :key="r.fullPath" />
      </RouterView>
    </main>

    <div v-if="updateReady && !inExam" class="update-toast" role="status">
      <span>{{ t('states.update') }}</span>
      <button type="button" class="btn btn-primary" @click="applyUpdate && applyUpdate()">{{ t('states.reload') }}</button>
    </div>

    <footer class="app-footer">
      <div class="footer-content">
        <div class="footer-section footer-brand">
          <img src="/logo-320.png" alt="Test2Drive" class="footer-logo-img" width="160" height="40" loading="lazy" />
          <p class="footer-tagline">{{ t('tagline') }}</p>
        </div>
        <nav v-for="col in footer" :key="col.title" class="footer-section" :aria-label="col.title">
          <h2 class="footer-heading" :lang="col.title === 'Test2Drive' ? 'en' : undefined">{{ col.title }}</h2>
          <ul>
            <li v-for="link in col.links" :key="link.label">
              <a v-if="link.href" :href="link.href" rel="noopener" target="_blank">{{ link.label }}</a>
              <RouterLink v-else :to="link.path">{{ link.label }}</RouterLink>
            </li>
          </ul>
        </nav>
      </div>
      <div class="footer-bottom">
        <p>{{ t('footer.notOfficial') }} {{ t('footer.checked', { date: checked }) }} {{ t('footer.license') }}</p>
        <p>&copy; 2025–2026 Test2Drive</p>
      </div>
    </footer>
  </div>
</template>

<style>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.skip-link {
  position: absolute;
  left: 1rem;
  top: -100px;
  z-index: 2000;
  background: var(--color-primary);
  color: white;
  padding: 0.75rem 1.25rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  text-decoration: none;
}
.skip-link:focus {
  top: 1rem;
}

/* Modern Glassmorphism Header */
.app-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(55, 114, 114, 0.12);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.05);
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0.75rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: transform var(--transition-base);
  flex-shrink: 0;
}
.logo:hover {
  transform: translateY(-1px);
}
.logo-icon {
  height: 32px;
  width: auto;
  display: block;
}

.nav-links {
  display: flex;
  gap: 0.375rem;
  align-items: center;
  list-style: none;
}

.nav-links a {
  position: relative;
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0.5rem 1.125rem;
  color: var(--color-text-secondary);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9375rem;
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
  z-index: 0;
}

.nav-links a::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--gradient-primary);
  border-radius: var(--radius-lg);
  opacity: 0;
  transition: opacity var(--transition-base);
  z-index: -1;
}

.nav-links a:hover {
  color: var(--color-primary);
  background: rgba(55, 114, 114, 0.06);
}

.nav-links a.active {
  color: white;
}

.nav-links a.active::before {
  opacity: 1;
}

.nav-tools {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.lang-switch {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  min-height: 44px;
  padding: 0.5rem 0.875rem;
  border-radius: var(--radius-lg);
  color: var(--color-primary);
  font-weight: 700;
  font-size: 0.875rem;
  text-decoration: none;
  border: 1px solid var(--color-border);
  background: white;
  transition: all var(--transition-base);
}
.lang-switch:hover {
  border-color: var(--color-primary);
}

.nav-tools .nav-cta,
.nav-tools .menu-button {
  display: none;
}

.menu-button {
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  background: white;
  color: var(--color-text);
  cursor: pointer;
}

/* Bottom sheet menu */
.menu-sheet {
  margin: auto auto 0;
  width: 100%;
  max-width: 560px;
  border: none;
  border-radius: var(--radius-2xl) var(--radius-2xl) 0 0;
  padding: 0;
  background: white;
  box-shadow: var(--shadow-2xl);
}
.menu-sheet::backdrop {
  background: rgba(31, 69, 69, 0.45);
}
.menu-sheet[open] {
  animation: sheetIn 220ms cubic-bezier(0.4, 0, 0.2, 1);
}
@keyframes sheetIn {
  from { transform: translateY(24px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.menu-sheet-inner {
  padding: 1rem 1.25rem 1.5rem;
}
.menu-sheet-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}
.menu-sheet-title {
  font-weight: 700;
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
}
.menu-close {
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-full);
  color: var(--color-text);
  cursor: pointer;
}
.menu-links {
  list-style: none;
  display: grid;
  gap: 0.375rem;
}
.menu-links a {
  display: flex;
  align-items: center;
  min-height: 52px;
  padding: 0 1rem;
  border-radius: var(--radius-lg);
  text-decoration: none;
  font-weight: 600;
  font-size: 1.0625rem;
  color: var(--color-text);
}
.menu-links a:hover {
  background: var(--color-bg-secondary);
}
.menu-links a.active {
  background: var(--gradient-primary);
  color: white;
}
.menu-lang {
  margin-top: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 52px;
  padding: 0 1rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  color: var(--color-primary);
  font-weight: 700;
  text-decoration: none;
}

/* Notices */
.notice {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem 0.75rem;
  padding: 0.625rem 1rem;
  background: var(--color-warning-bg);
  color: var(--color-text);
  font-size: 0.9375rem;
  text-align: center;
}
.notice-retry {
  padding: 0.5rem 1rem;
  width: auto;
}
.notice-lang {
  background: var(--color-bg-secondary);
}
.notice a {
  color: var(--color-primary);
  font-weight: 700;
}
.notice-dismiss {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--color-text-secondary);
}

.update-toast {
  position: fixed;
  inset-inline: 1rem;
  bottom: 1rem;
  z-index: 1500;
  max-width: 420px;
  margin-inline: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 0.75rem 0.75rem 1.25rem;
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
}
.update-toast .btn {
  padding: 0.625rem 1.25rem;
  width: auto;
}

.main-content {
  flex: 1;
  width: 100%;
}
.main-content:focus {
  outline: none;
}

/* Footer */
.app-footer {
  padding: 3rem 1.5rem 1.5rem;
  background: linear-gradient(to top, var(--color-bg-secondary), var(--color-bg-light));
  font-size: 0.875rem;
  color: var(--color-text-muted);
  border-top: 1px solid var(--color-border-light);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto 2rem;
  display: grid;
  grid-template-columns: 1.3fr repeat(3, 1fr);
  gap: 2rem;
}

.footer-logo-img {
  height: 40px;
  width: auto;
  display: block;
  margin-bottom: 0.75rem;
}
.footer-tagline {
  font-size: 0.9375rem;
  color: var(--color-text-secondary);
  margin: 0;
}

.footer-heading {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.footer-section ul {
  list-style: none;
  display: grid;
  gap: 0.25rem;
}

.footer-section a {
  display: inline-flex;
  align-items: center;
  min-height: 36px;
  font-size: 0.9375rem;
  color: var(--color-text-secondary);
  text-decoration: none;
}
.footer-section a:hover {
  color: var(--color-primary);
  text-decoration: underline;
}

.footer-bottom {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
  display: grid;
  gap: 0.25rem;
}

.footer-bottom p {
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

@media (max-width: 1080px) {
  .nav-links {
    display: none;
  }
  .nav-tools .nav-cta {
    display: inline-flex;
    padding: 0.625rem 1.25rem;
    font-size: 0.9375rem;
    min-height: 44px;
  }
  .nav-tools .menu-button {
    display: inline-flex;
    flex-shrink: 0;
  }
}

@media (max-width: 900px) {
  .footer-content {
    grid-template-columns: repeat(2, 1fr);
  }
  .footer-brand {
    grid-column: 1 / -1;
  }
}

@media (max-width: 640px) {
  .nav-container {
    padding: 0.625rem 1rem;
  }
  .nav-cta {
    width: auto;
  }
  .lang-switch {
    padding: 0.5rem 0.625rem;
  }
}

@media (max-width: 480px) {
  .nav-tools .nav-cta {
    display: none;
  }
}
</style>
