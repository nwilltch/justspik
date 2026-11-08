// scripts/inject-chunks.js
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'src', 'data', 'phrases.json');

const p1 = require('./chunks-data/part1.js');
const p2 = require('./chunks-data/part2.js');
const p3 = require('./chunks-data/part3.js');
const p4 = require('./chunks-data/part4.js');
const p5 = require('./chunks-data/part5.js');

const allChunks = [...p1, ...p2, ...p3, ...p4, ...p5];
console.log(`Assembling ${allChunks.length} chunks...`);

if (allChunks.length !== 499) {
  console.error(`Expected 499 chunks, got ${allChunks.length}!`);
  process.exit(1);
}

// Read current phrases.json
const rawData = fs.readFileSync(DB_PATH, 'utf-8');
const existing = JSON.parse(rawData);
console.log(`Current existing phrases count: ${existing.length}`);

// Filter out any previous chunk- entries if rerun
const basePhrases = existing.filter((p) => !p.id.startsWith('chunk-'));
console.log(`Base phrases kept: ${basePhrases.length}`);

// Convert each chunk to a full MultilingualEntry
const newEntries = allChunks.map((c, idx) => {
  const words = c.en.split(' ').length;
  const targetTime = Math.min(4.0, Math.max(2.5, +(words * 0.3 + 1.2).toFixed(1)));

  return {
    id: `chunk-${idx + 1}`,
    category: 'essential',
    translations: {
      fr: c.fr,
      en: c.en,
      es: c.es,
      de: c.de,
      it: c.it,
    },
    explanations: {
      fr: c.tip,
      en: c.tip,
      es: c.tip,
      de: c.tip,
      it: c.tip,
    },
    targetTimeSec: targetTime,
    nativeAlternative: c.en,
    vocabularyChunks: [
      {
        chunk: c.en,
        translation: c.fr,
        tip: c.tip,
      },
    ],
  };
});

const finalPhrases = [...basePhrases, ...newEntries];

fs.writeFileSync(DB_PATH, JSON.stringify(finalPhrases, null, 2), 'utf-8');

console.log(`Successfully wrote ${finalPhrases.length} total phrases to ${DB_PATH}!`);

// Count categories
const counts = {};
finalPhrases.forEach((p) => {
  counts[p.category] = (counts[p.category] || 0) + 1;
});
console.log('Category breakdown:', counts);
