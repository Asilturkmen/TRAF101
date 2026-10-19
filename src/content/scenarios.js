const file = import.meta.glob('../../content/scenarios.json', { eager: true, import: 'default' });

export const scenarios = Object.values(file)[0] || [];
export const scenarioById = (id) => scenarios.find((s) => s.id === id) || null;
export const scenariosFor = (track) => scenarios.filter((s) => !track || s.tracks.includes(track));
