import { computed, onMounted } from 'vue';
import { useProgress } from '../stores/progress.js';
import { allQuestions } from '../content/questions.js';

// The question pool for the learner's chosen vehicle track. Progress is loaded
// here as well because child components mount before App's onMounted runs.
export function usePool() {
  const progress = useProgress();
  onMounted(() => progress.load());
  const track = computed(() => progress.settings.track || 'car');
  const pool = computed(() => allQuestions.filter((q) => q.tracks.includes(track.value)));
  return { progress, track, pool };
}
