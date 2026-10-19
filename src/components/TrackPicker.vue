<script setup>
import { useI18n } from 'vue-i18n';
import { Car, Bike, Bus } from 'lucide-vue-next';
import { tracks } from '../content/meta.js';
import { tx } from '../lib/text.js';

defineProps({ modelValue: { type: String, default: 'car' }, lang: { type: String, required: true } });
const emit = defineEmits(['update:modelValue']);
const icons = { car: Car, moto: Bike, heavy: Bus };
const label = { tr: 'Hangi araç için çalışıyorsun', en: 'Which vehicle are you studying for' };
</script>

<template>
  <fieldset class="track-picker">
    <legend>{{ label[lang] }}</legend>
    <div class="track-options">
      <label v-for="tr in tracks" :key="tr.id" class="track-option" :class="{ selected: modelValue === tr.id }">
        <input type="radio" name="track" :value="tr.id" :checked="modelValue === tr.id" @change="emit('update:modelValue', tr.id)" />
        <component :is="icons[tr.id]" :size="22" aria-hidden="true" />
        <span class="track-name">{{ tx(tr.name, lang) }}</span>
        <span class="track-classes">{{ tr.classesNow.join(', ') }}</span>
      </label>
    </div>
  </fieldset>
</template>

<style scoped>
.track-picker {
  border: none;
  padding: 0;
  margin: 0;
}
.track-picker legend {
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: var(--color-text);
}
.track-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}
.track-option {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  min-height: 56px;
  padding: 0.75rem 1rem;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: white;
  cursor: pointer;
  color: var(--color-text);
  transition: border-color var(--transition-base);
}
.track-option input {
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
}
.track-option:has(input:focus-visible) {
  outline: 3px solid var(--color-focus);
  outline-offset: 2px;
}
.track-option:hover {
  border-color: var(--color-primary);
}
.track-option.selected {
  border-color: var(--color-primary);
  background: rgba(55, 114, 114, 0.07);
}
.track-option svg {
  color: var(--color-primary);
  flex-shrink: 0;
}
.track-name {
  font-weight: 700;
}
.track-classes {
  margin-left: auto;
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  font-weight: 600;
}
@media (max-width: 640px) {
  .track-options {
    grid-template-columns: 1fr;
  }
}
</style>
