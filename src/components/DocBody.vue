<script setup>
// Renders a lesson or guide document: sections with sources, then key points.
import { useI18n } from 'vue-i18n';
import { Lightbulb } from 'lucide-vue-next';
import { tx } from '../lib/text.js';
import ProseBlock from './ProseBlock.vue';
import BasisLine from './BasisLine.vue';

defineProps({
  doc: { type: Object, required: true },
  lang: { type: String, required: true },
});
const { locale } = useI18n();
</script>

<template>
  <div class="doc-body">
    <aside v-if="doc.keyPoints?.length" class="key-points" :aria-labelledby="`kp-${doc.id || 'doc'}`">
      <h2 :id="`kp-${doc.id || 'doc'}`"><Lightbulb :size="22" aria-hidden="true" /> {{ lang === 'tr' ? 'Akılda tut' : 'Remember' }}</h2>
      <ul>
        <li v-for="(k, i) in doc.keyPoints" :key="i">
          <span>{{ tx(k.text, lang) }}</span>
          <BasisLine :item="k" :lang="lang" />
        </li>
      </ul>
    </aside>

    <section v-for="(s, i) in doc.sections" :key="i" class="doc-section">
      <h2>{{ tx(s.heading, lang) }}</h2>
      <ProseBlock :text="tx(s.body, lang)" />
      <BasisLine v-if="s.basis" :item="s" :lang="lang" />
    </section>
  </div>
</template>

<style scoped>
.doc-body {
  display: grid;
  gap: 1.25rem;
}
.doc-section {
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: 1.75rem 2rem;
}
.doc-section h2 {
  font-size: clamp(1.25rem, 2.2vw, 1.5rem);
  margin-bottom: 0.875rem;
}
.doc-section .basis-line {
  margin-top: 1rem;
  padding-top: 0.875rem;
  border-top: 1px solid var(--color-border-light);
}
.key-points {
  background: white;
  border: 1px solid var(--color-border);
  border-left: 4px solid var(--color-primary);
  border-radius: var(--radius-xl);
  padding: 1.5rem 1.75rem;
}
.key-points h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  color: var(--color-primary);
  margin-bottom: 1rem;
}
.key-points ul {
  list-style: none;
  display: grid;
  gap: 0.875rem;
}
.key-points li {
  display: grid;
  gap: 0.25rem;
  padding-left: 1.25rem;
  position: relative;
  font-size: 1.0625rem;
  color: var(--color-text);
  line-height: 1.6;
}
.key-points li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.65em;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--color-primary);
}
@media (max-width: 640px) {
  .doc-section,
  .key-points {
    padding: 1.25rem;
  }
}
</style>
