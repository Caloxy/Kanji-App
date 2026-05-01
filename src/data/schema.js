import { kanaToRomaji } from "../lib/romaji.js";

function splitTrimmed(value, separatorPattern) {
  if (!value || typeof value !== "string") {
    return [];
  }

  return value
    .split(separatorPattern)
    .map((item) => item.trim())
    .filter(Boolean);
}

function createReadingExample(jp, reading, fr) {
  if (!jp || !reading || !fr) {
    return null;
  }

  return Object.freeze({
    jp: String(jp).trim(),
    reading: String(reading).trim(),
    romaji: kanaToRomaji(String(reading).trim()),
    fr: String(fr).trim(),
  });
}

function normalizeReadingExampleSpecs(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const example = createReadingExample(item.jp, item.reading, item.fr);

      if (!example) {
        return null;
      }

      return Object.freeze({
        kana: item.kana ? String(item.kana).trim() : "",
        example,
      });
    })
    .filter(Boolean);
}

function normalizeReadingEntries(value, exampleSpecs, fallbackExample) {
  const values = Array.isArray(value)
    ? value.map((item) => String(item).trim()).filter(Boolean)
    : splitTrimmed(value, /\s*\/\s*/);

  return Object.freeze(
    values.map((kana, index) => {
      const matchedExample =
        exampleSpecs.find((item) => item.kana === kana)?.example ||
        (values.length === 1 ? exampleSpecs.find((item) => !item.kana)?.example : null) ||
        (index === 0 ? fallbackExample : null) ||
        null;

      return Object.freeze({
        kana,
        romaji: kanaToRomaji(kana),
        example: matchedExample,
      });
    })
  );
}

export function createKanjiCard({
  id,
  kanji,
  jlptLevel,
  meaning,
  meaningsFr,
  onyomi,
  kunyomi,
  onyomiExamples = [],
  kunyomiExamples = [],
  onyomiExampleJp = "",
  onyomiExampleReading = "",
  onyomiExampleFr = "",
  kunyomiExampleJp = "",
  kunyomiExampleReading = "",
  kunyomiExampleFr = "",
  tags = [],
}) {
  const normalizedMeanings = Array.isArray(meaningsFr)
    ? meaningsFr.map((item) => String(item).trim()).filter(Boolean)
    : splitTrimmed(meaning, /\s*,\s*/);

  const normalizedTags = Array.isArray(tags)
    ? tags.map((item) => String(item).trim()).filter(Boolean)
    : [];

  const onyomiEntries = normalizeReadingEntries(
    onyomi,
    normalizeReadingExampleSpecs(onyomiExamples),
    createReadingExample(onyomiExampleJp, onyomiExampleReading, onyomiExampleFr)
  );
  const kunyomiEntries = normalizeReadingEntries(
    kunyomi,
    normalizeReadingExampleSpecs(kunyomiExamples),
    createReadingExample(kunyomiExampleJp, kunyomiExampleReading, kunyomiExampleFr)
  );

  const readingExamples = Object.freeze({
    onyomi: onyomiEntries.find((entry) => entry.example)?.example || null,
    kunyomi: kunyomiEntries.find((entry) => entry.example)?.example || null,
  });

  return Object.freeze({
    id,
    kanji,
    jlptLevel,
    meaningsFr: Object.freeze(normalizedMeanings),
    readings: Object.freeze({
      onyomi: onyomiEntries,
      kunyomi: kunyomiEntries,
    }),
    readingExamples,
    examples: Object.freeze(
      [...onyomiEntries, ...kunyomiEntries]
        .map((entry) => entry.example)
        .filter(Boolean)
        .filter(
        (example, index, array) =>
          array.findIndex(
            (candidate) =>
              candidate.jp === example.jp &&
              candidate.reading === example.reading &&
              candidate.fr === example.fr
          ) === index
        )
    ),
    tags: Object.freeze(normalizedTags),
  });
}

export function createDeck({
  id,
  level,
  label,
  description,
  cards,
  available = true,
  note = "",
}) {
  const cardsById = Object.freeze(
    Object.fromEntries(cards.map((card) => [card.id, card]))
  );

  return Object.freeze({
    id,
    level,
    label,
    description,
    cards: Object.freeze(cards),
    cardsById,
    available,
    note,
  });
}

export function createPlaceholderDeck({ id, level, label }) {
  return createDeck({
    id,
    level,
    label,
    description: `Deck ${label} à venir.`,
    cards: [],
    available: false,
    note: "Bientôt",
  });
}

export function getPrimaryMeaning(card) {
  return card.meaningsFr[0] || "";
}

export function formatMeaningList(card) {
  return card.meaningsFr.join(", ");
}

export function formatReadingKanaList(card, kind) {
  return card.readings[kind].map((entry) => entry.kana).join(" / ");
}

export function formatReadingRomajiList(card, kind) {
  return card.readings[kind].map((entry) => entry.romaji).join(" / ");
}
