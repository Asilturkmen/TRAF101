import { ViteSSG } from 'vite-ssg';
import { createPinia } from 'pinia';
import { createI18n } from 'vue-i18n';
import './styles/fonts.css';
import App from './App.vue';
import routes from './router/routes.js';
import tr from './locales/tr.json';
import en from './locales/en.json';
import './style.css';
import './styles/components.css';

export const createApp = ViteSSG(
  App,
  {
    routes,
    base: import.meta.env.BASE_URL,
    scrollBehavior(to, from, saved) {
      if (saved) return saved;
      if (to.hash) return { el: to.hash, top: 80 };
      if (to.path === from.path) return false;
      return { top: 0 };
    },
  },
  ({ app, router, initialState, isClient }) => {
    const pinia = createPinia();
    app.use(pinia);
    if (isClient && initialState.pinia) pinia.state.value = initialState.pinia;
    else initialState.pinia = pinia.state.value;

    const i18n = createI18n({ legacy: false, locale: 'tr', fallbackLocale: 'tr', messages: { tr, en } });
    app.use(i18n);

    router.beforeEach((to) => {
      const lang = to.meta.lang || (to.path.startsWith('/en/') || to.path === '/en' ? 'en' : 'tr');
      i18n.global.locale.value = lang;
    });
  },
);
