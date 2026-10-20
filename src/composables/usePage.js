import { computed, unref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useHead } from '@unhead/vue';
import { defineStore } from 'pinia';
import { truncate } from '../lib/text.js';

export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://test2drive.example').replace(/\/$/, '');
export const absolute = (path) => SITE_URL + path;
export const ogImagePath = (path) => `/og${path}card.png`;

// Holds the current page's language alternates so the header can link to the
// same page in the other language.
export const usePageStore = defineStore('page', {
  state: () => ({ alternates: { tr: '/', en: '/en/' } }),
});

export function useLang() {
  const route = useRoute();
  return computed(() => route.meta.lang || 'tr');
}

/**
 * Sets title, description, canonical, hreflang, Open Graph and JSON-LD for a page.
 * @param {object} opts values may be refs or computed
 *   title, description, alternates {tr, en}, noindex, jsonLd, type
 */
export function usePage(opts) {
  const lang = useLang();
  const store = usePageStore();
  const alternates = computed(() => unref(opts.alternates));
  const title = computed(() => {
    const t = unref(opts.title);
    return t ? `${t} | Test2Drive` : 'Test2Drive';
  });
  const description = computed(() => truncate(unref(opts.description) || ''));
  const self = computed(() => alternates.value?.[lang.value]);

  // Keep the switcher in sync: set now (SSR and first client render), then follow changes.
  store.alternates = alternates.value;
  watch(alternates, (v) => {
    store.alternates = v;
  });

  useHead(() => {
    const alt = alternates.value || {};
    const noindex = unref(opts.noindex);
    const link = [];
    const meta = [
      { name: 'description', content: description.value },
      { property: 'og:title', content: title.value },
      { property: 'og:description', content: description.value },
      { property: 'og:type', content: unref(opts.type) || 'website' },
      { property: 'og:site_name', content: 'Test2Drive' },
      { property: 'og:locale', content: lang.value === 'tr' ? 'tr_TR' : 'en_GB' },
      { property: 'og:locale:alternate', content: lang.value === 'tr' ? 'en_GB' : 'tr_TR' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ];
    if (self.value && !noindex) {
      meta.push({ property: 'og:url', content: absolute(self.value) });
      meta.push({ property: 'og:image', content: absolute(ogImagePath(self.value)) });
      meta.push({ property: 'og:image:width', content: '1200' });
      meta.push({ property: 'og:image:height', content: '630' });
    }
    if (noindex) {
      meta.push({ name: 'robots', content: 'noindex' });
    } else if (alt.tr && alt.en) {
      link.push({ rel: 'canonical', href: absolute(self.value) });
      link.push({ rel: 'alternate', hreflang: 'tr', href: absolute(alt.tr) });
      link.push({ rel: 'alternate', hreflang: 'en', href: absolute(alt.en) });
      link.push({ rel: 'alternate', hreflang: 'x-default', href: absolute(alt.tr) });
    }
    const script = [];
    const ld = unref(opts.jsonLd);
    if (ld) script.push({ type: 'application/ld+json', innerHTML: JSON.stringify(ld).replace(/</g, '\\u003c') });
    return { title: title.value, htmlAttrs: { lang: lang.value }, meta, link, script };
  });

  return { lang };
}
