import { STUDY_MODES, createInitialSession, sanitizeSession } from "./session.js";

const LEGACY_STORAGE_KEY = "kanji-deck-session-v1";
const SESSIONS_STORAGE_KEY = "kanji-deck-sessions-v2";
const DECK_SELECTION_KEY = "kanji-deck-selected-decks-v1";
const LEARNING_PROGRESS_KEY = "kanji-deck-learning-progress-v1";
const STUDY_MODE_KEY = "kanji-deck-study-mode-v1";

function normalizeDeckIdsForStorage(deckIds) {
  if (!Array.isArray(deckIds)) {
    return [];
  }

  return [...new Set(deckIds.map((deckId) => String(deckId).trim()).filter(Boolean))].sort();
}

function normalizeCardIds(cardIds) {
  if (!Array.isArray(cardIds)) {
    return [];
  }

  return [...new Set(cardIds.map((cardId) => String(cardId).trim()).filter(Boolean))];
}

function normalizeStudyMode(mode) {
  return mode === STUDY_MODES.REVIEW ? STUDY_MODES.REVIEW : STUDY_MODES.LEARN;
}

function sanitizeLearningProgress(candidate) {
  const source = Array.isArray(candidate?.learnedCardIds)
    ? candidate.learnedCardIds
    : Array.isArray(candidate)
      ? candidate
      : [];

  return {
    learnedCardIds: [...new Set(source.map((cardId) => String(cardId).trim()).filter(Boolean))],
  };
}

function extractLearnedCardIdsFromSession(session) {
  if (!session || typeof session !== "object" || !session.stats || typeof session.stats !== "object") {
    return [];
  }

  return Object.entries(session.stats)
    .filter(([, state]) => state && typeof state === "object" && Number(state.known) > 0)
    .map(([cardId]) => cardId);
}

function getLegacySessionStorageKey(deckIds) {
  const normalizedDeckIds = normalizeDeckIdsForStorage(deckIds);
  return normalizedDeckIds.length > 0 ? normalizedDeckIds.join("__") : "default";
}

export function getSessionStorageKey(mode, deckIds) {
  return `${normalizeStudyMode(mode)}__${getLegacySessionStorageKey(deckIds)}`;
}

function loadSessionStore() {
  if (typeof window === "undefined" || !window.localStorage) {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(SESSIONS_STORAGE_KEY);

    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (error) {
    console.warn("Impossible de charger le registre des sessions locales.", error);
    return {};
  }
}

function saveSessionStore(store) {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }

  try {
    window.localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(store));
  } catch (error) {
    console.warn("Impossible de sauvegarder le registre des sessions locales.", error);
  }
}

export function loadStudyMode() {
  if (typeof window === "undefined" || !window.localStorage) {
    return STUDY_MODES.LEARN;
  }

  try {
    const raw = window.localStorage.getItem(STUDY_MODE_KEY);
    return normalizeStudyMode(raw);
  } catch (error) {
    console.warn("Impossible de charger le mode d'étude.", error);
    return STUDY_MODES.LEARN;
  }
}

export function saveStudyMode(mode) {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }

  try {
    window.localStorage.setItem(STUDY_MODE_KEY, normalizeStudyMode(mode));
  } catch (error) {
    console.warn("Impossible de sauvegarder le mode d'étude.", error);
  }
}

export function loadLearningProgress() {
  if (typeof window === "undefined" || !window.localStorage) {
    return sanitizeLearningProgress({});
  }

  try {
    const raw = window.localStorage.getItem(LEARNING_PROGRESS_KEY);

    if (raw) {
      return sanitizeLearningProgress(JSON.parse(raw));
    }

    const store = loadSessionStore();
    const migratedProgress = sanitizeLearningProgress({
      learnedCardIds: [
        ...Object.values(store).flatMap((session) => extractLearnedCardIdsFromSession(session)),
        ...extractLearnedCardIdsFromSession(
          JSON.parse(window.localStorage.getItem(LEGACY_STORAGE_KEY) || "null")
        ),
      ],
    });

    if (migratedProgress.learnedCardIds.length > 0) {
      saveLearningProgress(migratedProgress);
    }

    return migratedProgress;
  } catch (error) {
    console.warn("Impossible de charger la progression d'apprentissage.", error);
    return sanitizeLearningProgress({});
  }
}

export function saveLearningProgress(progress) {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }

  try {
    window.localStorage.setItem(
      LEARNING_PROGRESS_KEY,
      JSON.stringify(sanitizeLearningProgress(progress))
    );
  } catch (error) {
    console.warn("Impossible de sauvegarder la progression d'apprentissage.", error);
  }
}

export function markCardLearned(progress, cardId) {
  const normalizedProgress = sanitizeLearningProgress(progress);
  const normalizedCardId = String(cardId || "").trim();

  if (!normalizedCardId || normalizedProgress.learnedCardIds.includes(normalizedCardId)) {
    return normalizedProgress;
  }

  return sanitizeLearningProgress({
    learnedCardIds: [...normalizedProgress.learnedCardIds, normalizedCardId],
  });
}

export function unmarkCardsLearned(progress, cardIds) {
  const normalizedProgress = sanitizeLearningProgress(progress);
  const blockedCardIds = new Set(normalizeCardIds(cardIds));

  if (blockedCardIds.size === 0) {
    return normalizedProgress;
  }

  return sanitizeLearningProgress({
    learnedCardIds: normalizedProgress.learnedCardIds.filter(
      (cardId) => !blockedCardIds.has(cardId)
    ),
  });
}

function parseStoredSession(rawSession) {
  if (typeof rawSession === "string") {
    try {
      return JSON.parse(rawSession);
    } catch (error) {
      return null;
    }
  }

  return rawSession && typeof rawSession === "object" ? rawSession : null;
}

function stripCardIdsFromSession(session, blockedCardIds) {
  const parsedSession = parseStoredSession(session);

  if (!parsedSession) {
    return session;
  }

  const nextStats = Object.fromEntries(
    Object.entries(parsedSession.stats || {}).filter(([cardId]) => !blockedCardIds.has(cardId))
  );
  const nextQueue = Array.isArray(parsedSession.queue)
    ? parsedSession.queue.filter((cardId) => !blockedCardIds.has(cardId))
    : [];

  return {
    ...parsedSession,
    queue: nextQueue,
    stats: nextStats,
  };
}

export function purgeStoredSessionsForCardIds(cardIds) {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }

  const blockedCardIds = new Set(normalizeCardIds(cardIds));

  if (blockedCardIds.size === 0) {
    return;
  }

  try {
    const store = loadSessionStore();
    const nextStore = Object.fromEntries(
      Object.entries(store).map(([sessionKey, session]) => [
        sessionKey,
        stripCardIdsFromSession(session, blockedCardIds),
      ])
    );

    saveSessionStore(nextStore);

    const legacyRaw = window.localStorage.getItem(LEGACY_STORAGE_KEY);

    if (legacyRaw) {
      window.localStorage.setItem(
        LEGACY_STORAGE_KEY,
        JSON.stringify(stripCardIdsFromSession(legacyRaw, blockedCardIds))
      );
    }
  } catch (error) {
    console.warn("Impossible de nettoyer les sessions locales pour les cartes supprimées.", error);
  }
}

export function loadSession(mode, deckIds, cards, fallbackSession = null) {
  const defaultSession =
    fallbackSession && typeof fallbackSession === "object"
      ? sanitizeSession(fallbackSession, cards)
      : createInitialSession(cards);

  if (typeof window === "undefined" || !window.localStorage) {
    return defaultSession;
  }

  try {
    const store = loadSessionStore();
    const sessionKey = getSessionStorageKey(mode, deckIds);
    const legacySessionKey = getLegacySessionStorageKey(deckIds);
    const raw =
      store[sessionKey] ??
      (normalizeStudyMode(mode) === STUDY_MODES.REVIEW
        ? store[legacySessionKey] ?? window.localStorage.getItem(LEGACY_STORAGE_KEY)
        : null);

    if (!raw) {
      return defaultSession;
    }

    return sanitizeSession(
      typeof raw === "string" ? JSON.parse(raw) : raw,
      cards
    );
  } catch (error) {
    console.warn("Impossible de charger la session locale.", error);
    return defaultSession;
  }
}

export function saveSession(mode, deckIds, session) {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }

  try {
    const store = loadSessionStore();
    store[getSessionStorageKey(mode, deckIds)] = session;
    saveSessionStore(store);
  } catch (error) {
    console.warn("Impossible de sauvegarder la session locale.", error);
  }
}

export function loadDeckSelection(sanitizeSelectedDeckIds) {
  if (typeof window === "undefined" || !window.localStorage) {
    return sanitizeSelectedDeckIds([]);
  }

  try {
    const raw = window.localStorage.getItem(DECK_SELECTION_KEY);

    if (!raw) {
      return sanitizeSelectedDeckIds([]);
    }

    return sanitizeSelectedDeckIds(JSON.parse(raw));
  } catch (error) {
    console.warn("Impossible de charger la sélection de decks.", error);
    return sanitizeSelectedDeckIds([]);
  }
}

export function saveDeckSelection(deckIds) {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }

  try {
    window.localStorage.setItem(DECK_SELECTION_KEY, JSON.stringify(deckIds));
  } catch (error) {
    console.warn("Impossible de sauvegarder la sélection de decks.", error);
  }
}

export function clearSession(mode, deckIds) {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }

  try {
    const store = loadSessionStore();
    delete store[getSessionStorageKey(mode, deckIds)];
    if (normalizeStudyMode(mode) === STUDY_MODES.REVIEW) {
      delete store[getLegacySessionStorageKey(deckIds)];
      window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    }
    saveSessionStore(store);
  } catch (error) {
    console.warn("Impossible de supprimer la session locale.", error);
  }
}
