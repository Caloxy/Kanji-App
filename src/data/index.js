import { n1Deck, n1Cards, n1CardsById } from "./n1.js";
import { n2Deck, n2Cards, n2CardsById } from "./n2.js";
import { n3Deck, n3Cards, n3CardsById } from "./n3.js";
import { n4Deck, n4Cards, n4CardsById } from "./n4.js";
import { n5Deck, n5Cards, n5CardsById } from "./n5.js";
import {
  formatMeaningList,
  formatReadingKanaList,
  formatReadingRomajiList,
  getPrimaryMeaning,
} from "./schema.js";

export const deckCatalog = Object.freeze([
  n1Deck,
  n2Deck,
  n3Deck,
  n4Deck,
  n5Deck,
]);

const deckById = Object.freeze(
  Object.fromEntries(deckCatalog.map((deck) => [deck.id, deck]))
);

export const DEFAULT_SELECTED_DECK_IDS = Object.freeze([n5Deck.id]);

function sortDeckIds(deckIds) {
  return [...deckIds].sort((leftId, rightId) => {
    const leftLevel = deckById[leftId]?.level ?? Number.POSITIVE_INFINITY;
    const rightLevel = deckById[rightId]?.level ?? Number.POSITIVE_INFINITY;
    return leftLevel - rightLevel;
  });
}

export function sanitizeSelectedDeckIds(candidate) {
  const availableIds = new Set(
    deckCatalog.filter((deck) => deck.available).map((deck) => deck.id)
  );

  const selectedIds = Array.isArray(candidate) ? candidate : [];
  const uniqueIds = [];
  const seen = new Set();

  selectedIds.forEach((deckId) => {
    if (availableIds.has(deckId) && !seen.has(deckId)) {
      uniqueIds.push(deckId);
      seen.add(deckId);
    }
  });

  if (uniqueIds.length === 0) {
    return [...DEFAULT_SELECTED_DECK_IDS];
  }

  return sortDeckIds(uniqueIds);
}

export function toggleDeckSelection(selectedDeckIds, deckId) {
  const deck = deckById[deckId];
  const currentIds = sanitizeSelectedDeckIds(selectedDeckIds);

  if (!deck || !deck.available) {
    return currentIds;
  }

  if (currentIds.includes(deckId)) {
    return currentIds.length === 1
      ? currentIds
      : currentIds.filter((currentDeckId) => currentDeckId !== deckId);
  }

  return sanitizeSelectedDeckIds([...currentIds, deckId]);
}

export function getSelectedDecks(selectedDeckIds) {
  return sanitizeSelectedDeckIds(selectedDeckIds)
    .map((deckId) => deckById[deckId])
    .filter(Boolean);
}

export function getCardsForDeckSelection(selectedDeckIds) {
  const cards = [];
  const seenCardIds = new Set();

  getSelectedDecks(selectedDeckIds).forEach((deck) => {
    deck.cards.forEach((card) => {
      if (!seenCardIds.has(card.id)) {
        cards.push(card);
        seenCardIds.add(card.id);
      }
    });
  });

  return cards;
}

export function getCardsByIdForDeckSelection(selectedDeckIds) {
  return Object.fromEntries(
    getCardsForDeckSelection(selectedDeckIds).map((card) => [card.id, card])
  );
}

export function getDeckSelectionLabel(selectedDeckIds) {
  const selectedDecks = getSelectedDecks(selectedDeckIds);

  if (selectedDecks.length === 0) {
    return n5Deck.label;
  }

  if (selectedDecks.length === 1) {
    return selectedDecks[0].label;
  }

  const isContiguous = selectedDecks.every((deck, index) => {
    if (index === 0) {
      return true;
    }

    return deck.level === selectedDecks[index - 1].level + 1;
  });

  if (isContiguous) {
    if (selectedDecks.length === 2) {
      return `${selectedDecks[0].label} + ${selectedDecks[1].label}`;
    }

    return `${selectedDecks[0].label} a ${selectedDecks[selectedDecks.length - 1].label}`;
  }

  return selectedDecks.map((deck) => deck.label).join(" + ");
}

export {
  formatMeaningList,
  formatReadingKanaList,
  formatReadingRomajiList,
  getPrimaryMeaning,
};
export {
  n1Deck,
  n1Cards,
  n1CardsById,
  n2Deck,
  n2Cards,
  n2CardsById,
  n3Deck,
  n3Cards,
  n3CardsById,
  n4Deck,
  n4Cards,
  n4CardsById,
  n5Deck,
  n5Cards,
  n5CardsById,
};
