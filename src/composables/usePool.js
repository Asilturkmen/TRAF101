import { computed, onMounted, shallowRef } from 'vue';
import { useProgress } from '../stores/progress.js';
import { loadQuestions } from '../content/questions.js';
import { useLang } from './usePage.js';

// The question pool for the learner's chosen vehicle track, loaded on the client.
// Progress is loaded here too, because child components mount before App's
// onMounted runs; saved entries are reconciled with the current content revisions.
// `ready` resolves once the bank and progress are both available.
export function usePool() {
  const progress = useProgress();
  const lang = useLang();
  const bank = shallowRef(null);
  let resolveReady;
  const ready = new Promise((r) => (resolveReady = r));
  onMounted(async () => {
    progress.load();
    bank.value = await loadQuestions(lang.value);
    progress.reconcile(bank.value.allQuestions);
    resolveReady(bank.value);
  });
  const track = computed(() => progress.settings.track || 'car');
  const pool = computed(() => (bank.value ? bank.value.allQuestions.filter((q) => q.tracks.includes(track.value)) : []));
  return { progress, track, pool, bank, ready };
}
