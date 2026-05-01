export const REVIEW_RESULTS = Object.freeze({
  KNOWN: "known",
  UNKNOWN: "unknown",
  SKIP: "skip",
});

export const STUDY_MODES = Object.freeze({
  LEARN: "learn",
  REVIEW: "review",
});

const VALID_RESULTS = new Set(Object.values(REVIEW_RESULTS));
const INITIAL_EASE = 2.3;
const MIN_EASE = 1.3;
const MAX_EASE = 3.1;

const DEFAULT_CARD_STATE = Object.freeze({
  shown: 0,
  known: 0,
  unknown: 0,
  skipped: 0,
  streak: 0,
  interval: 0,
  ease: INITIAL_EASE,
  lastSeenReview: 0,
  lastResult: null,
});

function clampInteger(value) {
  return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
}

function clampEase(value) {
  if (!Number.isFinite(value)) {
    return INITIAL_EASE;
  }

  return Math.min(MAX_EASE, Math.max(MIN_EASE, Number(value.toFixed(2))));
}

function randomInteger(min, max, random = Math.random) {
  if (max <= min) {
    return min;
  }

  return min + Math.floor(random() * (max - min + 1));
}

export function shuffleArray(items, random = Math.random) {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
}

export function buildInitialQueue(cards, random = Math.random) {
  return shuffleArray(
    cards.map((card) => card.id),
    random
  );
}

export function scheduleCard(queue, cardId, delay, avoidIds = []) {
  const cleanedQueue = queue.filter((id) => id !== cardId);
  const protectedIds = new Set(avoidIds.filter(Boolean));
  let targetIndex = Math.min(Math.max(delay, 0), cleanedQueue.length);

  while (targetIndex < cleanedQueue.length && protectedIds.has(cleanedQueue[targetIndex])) {
    targetIndex += 1;
  }

  cleanedQueue.splice(targetIndex, 0, cardId);
  return cleanedQueue;
}

export function getCardState(stats, cardId) {
  return stats[cardId] || DEFAULT_CARD_STATE;
}

function getTotalReviewCount(stats) {
  return Object.values(stats).reduce((sum, value) => sum + value.shown, 0);
}

function getKnownIntroductionDelay(cardsLength) {
  return Math.max(6, Math.ceil(cardsLength * 0.18));
}

function buildKnownOutcome(previousState, cardsLength, random) {
  const nextEase = clampEase(previousState.ease + 0.15);
  const introductionDelay = getKnownIntroductionDelay(cardsLength);

  const nextInterval =
    previousState.interval > 0
      ? Math.max(
          introductionDelay,
          Math.round(previousState.interval * nextEase) +
            Math.max(0, previousState.streak - 1) * Math.max(2, Math.ceil(cardsLength * 0.04))
        )
      : introductionDelay;

  const delay = randomInteger(
    nextInterval,
    Math.max(nextInterval, Math.round(nextInterval * 1.25)),
    random
  );

  return {
    interval: nextInterval,
    ease: nextEase,
    delay,
  };
}

function buildUnknownOutcome(previousState, random) {
  const nextEase = clampEase(previousState.ease - 0.2);
  const nextInterval = 1;
  const maxDelay = Math.min(3, 1 + previousState.unknown);
  const delay = randomInteger(1, maxDelay, random);

  return {
    interval: nextInterval,
    ease: nextEase,
    delay,
  };
}

function buildSkipOutcome(previousState, random) {
  const fallbackInterval = previousState.interval > 0 ? previousState.interval : 5;
  const nextInterval = Math.max(3, Math.round(fallbackInterval * 0.6));
  const delay = randomInteger(
    Math.max(2, nextInterval - 1),
    Math.max(3, nextInterval + 1),
    random
  );

  return {
    interval: nextInterval,
    ease: previousState.ease,
    delay,
  };
}

function buildLearningUnknownDelay(queueLength, random) {
  return randomInteger(1, Math.max(1, Math.min(3, queueLength + 1)), random);
}

function buildLearningSkipDelay(queueLength, random) {
  return randomInteger(2, Math.max(2, Math.min(5, queueLength + 2)), random);
}

function sanitizeStats(candidate, cards) {
  if (!candidate || typeof candidate !== "object") {
    return {};
  }

  const validIds = new Set(cards.map((card) => card.id));
  const sanitized = {};

  Object.entries(candidate).forEach(([cardId, state]) => {
    if (!validIds.has(cardId) || !state || typeof state !== "object") {
      return;
    }

    sanitized[cardId] = {
      shown: clampInteger(state.shown),
      known: clampInteger(state.known),
      unknown: clampInteger(state.unknown),
      skipped: clampInteger(state.skipped),
      streak: clampInteger(state.streak),
      interval: clampInteger(state.interval),
      ease: clampEase(state.ease),
      lastSeenReview: clampInteger(state.lastSeenReview),
      lastResult: VALID_RESULTS.has(state.lastResult) ? state.lastResult : null,
    };
  });

  return sanitized;
}

export function sanitizeQueue(queue, cards) {
  const validIds = new Set(cards.map((card) => card.id));
  const seen = new Set();
  const sanitized = [];

  if (Array.isArray(queue)) {
    queue.forEach((cardId) => {
      if (validIds.has(cardId) && !seen.has(cardId)) {
        sanitized.push(cardId);
        seen.add(cardId);
      }
    });
  }

  cards.forEach((card) => {
    if (!seen.has(card.id)) {
      sanitized.push(card.id);
      seen.add(card.id);
    }
  });

  return sanitized.length > 0 ? sanitized : buildInitialQueue(cards);
}

export function createInitialSession(cards, random = Math.random) {
  const timestamp = Date.now();

  return {
    queue: buildInitialQueue(cards, random),
    stats: {},
    flipped: false,
    lastAction: null,
    startedAt: timestamp,
    updatedAt: timestamp,
  };
}

export function sanitizeSession(candidate, cards) {
  const fallback = createInitialSession(cards);

  if (!candidate || typeof candidate !== "object") {
    return fallback;
  }

  return {
    queue: sanitizeQueue(candidate.queue, cards),
    stats: sanitizeStats(candidate.stats, cards),
    flipped: Boolean(candidate.flipped),
    lastAction: VALID_RESULTS.has(candidate.lastAction) ? candidate.lastAction : null,
    startedAt: Number.isFinite(candidate.startedAt) ? candidate.startedAt : fallback.startedAt,
    updatedAt: Number.isFinite(candidate.updatedAt) ? candidate.updatedAt : fallback.updatedAt,
  };
}

export function flipSessionCard(session) {
  return {
    ...session,
    flipped: !session.flipped,
    updatedAt: Date.now(),
  };
}

function enforceFairExposure(queue, stats, cards, totalReviews) {
  if (queue.length <= 1) {
    return queue;
  }

  const maxUnseenGap = Math.max(12, Math.ceil(cards.length * 0.45));
  let stalestId = null;
  let stalestGap = -1;

  queue.forEach((cardId) => {
    const state = getCardState(stats, cardId);
    const gap = totalReviews - state.lastSeenReview;

    if (gap > maxUnseenGap && gap > stalestGap) {
      stalestGap = gap;
      stalestId = cardId;
    }
  });

  if (!stalestId) {
    return queue;
  }

  return [stalestId, ...queue.filter((cardId) => cardId !== stalestId)];
}

export function applyReviewResult(session, cards, result, random = Math.random) {
  if (!VALID_RESULTS.has(result)) {
    return session;
  }

  const currentId = session.queue[0] || cards[0]?.id;

  if (!currentId) {
    return createInitialSession(cards, random);
  }

  const currentState = getCardState(session.stats, currentId);
  const nextReviewCount = getTotalReviewCount(session.stats) + 1;
  const reviewedState = {
    shown: currentState.shown + 1,
    known: currentState.known + (result === REVIEW_RESULTS.KNOWN ? 1 : 0),
    unknown: currentState.unknown + (result === REVIEW_RESULTS.UNKNOWN ? 1 : 0),
    skipped: currentState.skipped + (result === REVIEW_RESULTS.SKIP ? 1 : 0),
    streak: result === REVIEW_RESULTS.KNOWN ? currentState.streak + 1 : 0,
    interval: currentState.interval,
    ease: currentState.ease,
    lastSeenReview: nextReviewCount,
    lastResult: result,
  };

  let scheduling;

  if (result === REVIEW_RESULTS.KNOWN) {
    scheduling = buildKnownOutcome(reviewedState, cards.length, random);
  } else if (result === REVIEW_RESULTS.UNKNOWN) {
    scheduling = buildUnknownOutcome(reviewedState, random);
  } else {
    scheduling = buildSkipOutcome(reviewedState, random);
  }

  const updatedState = {
    ...reviewedState,
    interval: scheduling.interval,
    ease: scheduling.ease,
  };

  const remainingQueue = session.queue.slice(1);
  const nextImmediateId = remainingQueue[0] || null;
  const updatedStats = {
    ...session.stats,
    [currentId]: updatedState,
  };
  const nextQueue = enforceFairExposure(
    scheduleCard(remainingQueue, currentId, scheduling.delay, [nextImmediateId]),
    updatedStats,
    cards,
    nextReviewCount
  );

  return {
    ...session,
    stats: updatedStats,
    queue: nextQueue,
    flipped: false,
    lastAction: result,
    updatedAt: Date.now(),
  };
}

export function applyLearningResult(session, cards, result, random = Math.random) {
  if (!VALID_RESULTS.has(result)) {
    return session;
  }

  const currentId = session.queue[0] || cards[0]?.id;

  if (!currentId) {
    return createInitialSession(cards, random);
  }

  const currentState = getCardState(session.stats, currentId);
  const nextReviewCount = getTotalReviewCount(session.stats) + 1;
  const reviewedState = {
    shown: currentState.shown + 1,
    known: currentState.known + (result === REVIEW_RESULTS.KNOWN ? 1 : 0),
    unknown: currentState.unknown + (result === REVIEW_RESULTS.UNKNOWN ? 1 : 0),
    skipped: currentState.skipped + (result === REVIEW_RESULTS.SKIP ? 1 : 0),
    streak: result === REVIEW_RESULTS.KNOWN ? currentState.streak + 1 : 0,
    interval: currentState.interval,
    ease: currentState.ease,
    lastSeenReview: nextReviewCount,
    lastResult: result,
  };

  const remainingQueue = session.queue.slice(1);
  const nextImmediateId = remainingQueue[0] || null;
  let nextQueue = remainingQueue;

  if (result === REVIEW_RESULTS.UNKNOWN) {
    nextQueue = scheduleCard(
      remainingQueue,
      currentId,
      buildLearningUnknownDelay(remainingQueue.length, random),
      [nextImmediateId]
    );
  } else if (result === REVIEW_RESULTS.SKIP) {
    nextQueue = scheduleCard(
      remainingQueue,
      currentId,
      buildLearningSkipDelay(remainingQueue.length, random),
      [nextImmediateId]
    );
  }

  return {
    ...session,
    stats: {
      ...session.stats,
      [currentId]: reviewedState,
    },
    queue: nextQueue,
    flipped: false,
    lastAction: result,
    updatedAt: Date.now(),
  };
}

export function resetSession(cards, random = Math.random) {
  return createInitialSession(cards, random);
}

export function summarizeSession(session, cards) {
  const values = Object.values(session.stats);
  const reviewedUnique = Object.keys(session.stats).length;
  const totalReviews = values.reduce((sum, value) => sum + value.shown, 0);
  const knownAnswers = values.reduce((sum, value) => sum + value.known, 0);
  const reviewAnswers = values.reduce((sum, value) => sum + value.unknown, 0);
  const skippedAnswers = values.reduce((sum, value) => sum + value.skipped, 0);
  const confidentCards = values.filter(
    (value) => value.known > value.unknown && value.known > 0
  ).length;
  const needsReviewCards = values.filter(
    (value) => value.unknown > 0 && value.unknown >= value.known
  ).length;

  return {
    reviewedUnique,
    totalReviews,
    knownAnswers,
    reviewAnswers,
    skippedAnswers,
    confidentCards,
    needsReviewCards,
    totalCards: cards.length,
    progressPercent: cards.length > 0 ? Math.round((reviewedUnique / cards.length) * 100) : 0,
  };
}

export function summarizeLearningSession(
  session,
  activeCards,
  selectedCards,
  learnedCardIds
) {
  const learnedIdSet =
    learnedCardIds instanceof Set
      ? learnedCardIds
      : new Set(Array.isArray(learnedCardIds) ? learnedCardIds : []);
  const learnedCards = selectedCards.filter((card) => learnedIdSet.has(card.id)).length;
  const totalReviews = Object.values(session.stats).reduce((sum, value) => sum + value.shown, 0);

  return {
    learnedCards,
    remainingCards: activeCards.length,
    totalCards: selectedCards.length,
    totalReviews,
    progressPercent:
      selectedCards.length > 0 ? Math.round((learnedCards / selectedCards.length) * 100) : 0,
  };
}
