// One table for every URL in both languages. Plain JS so build scripts can import it.
export const TABLE = {
  home: { tr: '/', en: '/en/' },
  practise: { tr: '/calis/', en: '/en/practise/' },
  review: { tr: '/calis/bugun/', en: '/en/practise/today/' },
  lessonPractice: { tr: '/calis/konu/:lesson/', en: '/en/practise/topic/:lesson/' },
  signExam: { tr: '/calis/levha-sinavi/', en: '/en/practise/sign-exam/' },
  mistakes: { tr: '/hatalarim/', en: '/en/mistakes/' },
  scenarios: { tr: '/senaryolar/', en: '/en/scenarios/' },
  signs: { tr: '/levhalar/', en: '/en/signs/' },
  signCategory: { tr: '/levhalar/:category/', en: '/en/signs/:category/' },
  sign: { tr: '/levhalar/:category/:sign/', en: '/en/signs/:category/:sign/' },
  topics: { tr: '/konular/', en: '/en/topics/' },
  lesson: { tr: '/konular/:lesson/', en: '/en/topics/:lesson/' },
  mock: { tr: '/deneme-sinavi/', en: '/en/mock-exam/' },
  mockResult: { tr: '/deneme-sinavi/sonuc/', en: '/en/mock-exam/result/' },
  mockExam: { tr: '/deneme-sinavi/:track/', en: '/en/mock-exam/:track/' },
  progress: { tr: '/ilerleme/', en: '/en/progress/' },
  exam: { tr: '/sinav-nasil-yapilir/', en: '/en/how-the-exam-works/' },
  licence: { tr: '/ehliyet-nasil-alinir/', en: '/en/getting-a-licence/' },
  leftDriving: { tr: '/soldan-trafik/', en: '/en/driving-on-the-left/' },
  sources: { tr: '/kaynaklar/', en: '/en/sources/' },
  about: { tr: '/hakkinda/', en: '/en/about/' },
  privacy: { tr: '/gizlilik/', en: '/en/privacy/' },
  notFound: { tr: '/404/', en: '/en/404/' },
};

// Pages that are never indexed or prerendered with user-specific content.
export const NOINDEX = new Set(['review', 'mistakes', 'mockResult', 'progress', 'notFound', 'mockExam', 'signExam', 'lessonPractice']);

export function fill(pattern, params = {}) {
  return pattern.replace(/:([a-zA-Z]+)/g, (_, key) => {
    const v = params[key];
    if (v == null) throw new Error(`missing route param ${key} for ${pattern}`);
    return encodeURIComponent(v);
  });
}

export function pathFor(name, lang, params) {
  const entry = TABLE[name];
  if (!entry) throw new Error(`unknown route ${name}`);
  return fill(entry[lang], params);
}

// Old English-only URLs from the course version keep working.
export const LEGACY = {
  '/study': '/levhalar/',
  '/quiz': '/deneme-sinavi/',
  '/results': '/deneme-sinavi/',
  '/scenarios': '/senaryolar/',
  '/history': '/ilerleme/',
};
