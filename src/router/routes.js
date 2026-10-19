import { TABLE, LEGACY } from './table.js';

const views = {
  home: () => import('../views/HomeView.vue'),
  practise: () => import('../views/PractiseView.vue'),
  review: () => import('../views/SessionView.vue'),
  lessonPractice: () => import('../views/SessionView.vue'),
  mistakes: () => import('../views/SessionView.vue'),
  signExam: () => import('../views/SignExamView.vue'),
  scenarios: () => import('../views/ScenarioQuizView.vue'),
  signs: () => import('../views/SignsView.vue'),
  signCategory: () => import('../views/SignCategoryView.vue'),
  sign: () => import('../views/SignView.vue'),
  topics: () => import('../views/TopicsView.vue'),
  lesson: () => import('../views/LessonView.vue'),
  mock: () => import('../views/MockSelectView.vue'),
  mockResult: () => import('../views/MockResultView.vue'),
  mockExam: () => import('../views/MockExamView.vue'),
  progress: () => import('../views/ProgressView.vue'),
  exam: () => import('../views/GuideView.vue'),
  licence: () => import('../views/GuideView.vue'),
  leftDriving: () => import('../views/GuideView.vue'),
  sources: () => import('../views/SourcesView.vue'),
  about: () => import('../views/GuideView.vue'),
  privacy: () => import('../views/GuideView.vue'),
  notFound: () => import('../views/NotFoundView.vue'),
};

const routes = [];
for (const [key, paths] of Object.entries(TABLE)) {
  for (const lang of ['tr', 'en']) {
    routes.push({ path: paths[lang], name: `${key}.${lang}`, component: views[key], meta: { key, lang } });
  }
}

for (const [from, target] of Object.entries(LEGACY)) {
  routes.push({ path: from, redirect: target });
  routes.push({ path: `${from}/:rest(.*)`, redirect: target });
}
// Old category pages used the category id (e.g. /study/warning).
routes.push({ path: '/study/:id', redirect: '/levhalar/' });

routes.push({ path: '/en/:pathMatch(.*)*', name: 'catchAll.en', component: views.notFound, meta: { key: 'notFound', lang: 'en' } });
routes.push({ path: '/:pathMatch(.*)*', name: 'catchAll.tr', component: views.notFound, meta: { key: 'notFound', lang: 'tr' } });

export default routes;
