import {
  deckCatalog,
  formatMeaningList,
  formatReadingKanaList,
  formatReadingRomajiList,
  getCardsForDeckSelection,
  getDeckSelectionLabel,
  sanitizeSelectedDeckIds,
  toggleDeckSelection,
} from "../data/index.js";
import {
  REVIEW_RESULTS,
  STUDY_MODES,
  applyLearningResult,
  applyReviewResult,
  flipSessionCard,
  resetSession,
  sanitizeSession,
  summarizeLearningSession,
  summarizeSession,
} from "../lib/session.js";
import {
  clearSession,
  loadDeckSelection,
  loadLearningProgress,
  loadSession,
  loadStudyMode,
  markCardLearned,
  purgeStoredSessionsForCardIds,
  saveDeckSelection,
  saveLearningProgress,
  saveSession,
  saveStudyMode,
  unmarkCardsLearned,
} from "../lib/storage.js";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getCardsById(cards) {
  return Object.fromEntries(cards.map((card) => [card.id, card]));
}

function getLearnedCardIdSet(progress) {
  return new Set(
    Array.isArray(progress?.learnedCardIds) ? progress.learnedCardIds : []
  );
}

function getActiveCardsForMode(mode, selectedCards, learnedCardIds) {
  const learnedIds =
    learnedCardIds instanceof Set
      ? learnedCardIds
      : getLearnedCardIdSet({ learnedCardIds });

  if (mode === STUDY_MODES.REVIEW) {
    return selectedCards.filter((card) => learnedIds.has(card.id));
  }

  return selectedCards.filter((card) => !learnedIds.has(card.id));
}

function getModeLabel(mode) {
  return mode === STUDY_MODES.REVIEW ? "Révision" : "Apprentissage";
}

function confirmReset(mode, selectionLabel) {
  if (typeof window === "undefined" || typeof window.confirm !== "function") {
    return true;
  }

  const message =
    mode === STUDY_MODES.LEARN
      ? `Réinitialiser l'apprentissage pour ${selectionLabel} ?\n\nLes kanjis appris sur cette sélection seront retirés de la progression et ne reviendront plus en révision tant qu'ils n'auront pas été réappris.`
      : `Réinitialiser la session de révision pour ${selectionLabel} ?\n\nLa progression de révision en cours sera perdue.`;

  return window.confirm(message);
}

function getRuntime(state) {
  const selectedCards = getCardsForDeckSelection(state.selectedDeckIds);
  const learnedCardIds = getLearnedCardIdSet(state.learningProgress);
  const activeCards = getActiveCardsForMode(state.mode, selectedCards, learnedCardIds);
  const activeCardsById = getCardsById(activeCards);

  return {
    selectedCards,
    activeCards,
    activeCardsById,
    learnedCardIds,
    currentCard: activeCardsById[state.session.queue[0]] || activeCards[0] || null,
    summary:
      state.mode === STUDY_MODES.LEARN
        ? summarizeLearningSession(
            state.session,
            activeCards,
            selectedCards,
            learnedCardIds
          )
        : summarizeSession(state.session, activeCards),
    modeLabel: getModeLabel(state.mode),
    selectionLabel: getDeckSelectionLabel(state.selectedDeckIds),
  };
}

function renderDeckSheet(state, selectionLabel) {
  return `
    <div class="deck-sheet-layer ${state.deckPickerOpen ? "is-open" : ""}" aria-hidden="${!state.deckPickerOpen}">
      <button
        type="button"
        class="deck-sheet-backdrop"
        data-action="close-decks"
        aria-label="Fermer le panneau de decks"
      ></button>
      <section class="deck-sheet" role="dialog" aria-modal="true" aria-labelledby="deck-sheet-title">
        <div class="deck-sheet-header">
          <div>
            <p class="deck-sheet-kicker">Sélection</p>
            <h2 id="deck-sheet-title" class="deck-sheet-title">Decks actifs</h2>
            <p class="deck-sheet-subtitle">${escapeHtml(selectionLabel)}</p>
          </div>
          <button type="button" class="sheet-close" data-action="close-decks">Fermer</button>
        </div>

        <div class="deck-list">
          ${deckCatalog
            .map((deck) => {
              const isSelected = state.selectedDeckIds.includes(deck.id);
              const status = deck.available ? deck.note : "Indisponible";

              return `
                <button
                  type="button"
                  class="deck-option ${isSelected ? "is-selected" : ""} ${deck.available ? "" : "is-disabled"}"
                  data-action="toggle-deck"
                  data-deck-id="${deck.id}"
                  ${deck.available ? "" : "disabled"}
                >
                  <span class="deck-option-main">
                    <span class="deck-option-label">${escapeHtml(deck.label)}</span>
                    <span class="deck-option-meta">${escapeHtml(status)}</span>
                  </span>
                  <span class="deck-option-tag">
                    ${
                      deck.available
                        ? isSelected
                          ? "Actif"
                          : "Ajouter"
                        : "Bientôt"
                    }
                  </span>
                </button>
              `;
            })
            .join("")}
        </div>

        <p class="deck-sheet-note">
          Tous les decks N1 à N5 sont disponibles. Les sessions restent séparées par combinaison de decks, et les cartes apprises alimentent ensuite la révision.
        </p>
      </section>
    </div>
  `;
}

function renderApp(state) {
  const { currentCard, summary, selectionLabel, modeLabel } = getRuntime(state);
  const isLearnMode = state.mode === STUDY_MODES.LEARN;
  const hasCurrentCard = Boolean(currentCard);
  const resetLabel = isLearnMode
    ? "Réinitialiser l'apprentissage"
    : "Réinitialiser la révision";
  const examplePanels = currentCard ? currentCard.examples.slice(0, 3) : [];
  const emptyMessage = isLearnMode
    ? "Tous les kanjis de cette sélection sont déjà appris."
    : "Aucun kanji appris dans cette sélection.";
  const emptyHint = isLearnMode
    ? "Passez en révision pour revoir ce que vous avez déjà validé."
    : "Passez d'abord par apprentissage pour alimenter la révision.";
  const skipLabel = isLearnMode
    ? { title: "Passer", subtitle: "Plus tard" }
    : { title: "Passer", subtitle: "Plus tard" };
  const unknownLabel = isLearnMode
    ? { title: "Encore", subtitle: "Je bloque" }
    : { title: "A revoir", subtitle: "Je bloque" };
  const knownLabel = isLearnMode
    ? { title: "Appris", subtitle: "Je connais" }
    : { title: "Connu", subtitle: "Je l'ai" };

  function renderReadingBlock(kind) {
    if (!currentCard || currentCard.readings[kind].length === 0) {
      return "";
    }

    return `
      <div class="reading-block">
        <p class="card-reading">${escapeHtml(formatReadingKanaList(currentCard, kind))}</p>
        <p class="card-reading-romaji">${escapeHtml(formatReadingRomajiList(currentCard, kind))}</p>
      </div>
    `;
  }

  function renderReadingExample(example) {
    if (!example) {
      return "";
    }

    return `
      <div class="card-example card-example-panel">
        <p class="card-example-jp">${escapeHtml(example.jp)}</p>
        <p class="card-example-reading">${escapeHtml(example.reading)} <span class="card-example-separator">/</span> ${escapeHtml(example.romaji)}</p>
        <p class="card-example-fr">${escapeHtml(example.fr)}</p>
      </div>
    `;
  }

  return `
    <div class="app-shell">
      <header class="topbar">
        <div class="topbar-main">
          <button type="button" class="deck-badge deck-badge-button" data-action="open-decks">
            <span class="deck-badge-label">${escapeHtml(selectionLabel)}</span>
            <span class="deck-badge-meta">${state.selectedDeckIds.length} deck${state.selectedDeckIds.length > 1 ? "s" : ""}</span>
          </button>
          <div class="mode-switch" role="tablist" aria-label="Mode d'étude">
            <button
              type="button"
              class="mode-switch-button ${isLearnMode ? "is-active" : ""}"
              data-action="set-mode"
              data-mode="${STUDY_MODES.LEARN}"
              aria-pressed="${isLearnMode}"
            >
              Apprentissage
            </button>
            <button
              type="button"
              class="mode-switch-button ${!isLearnMode ? "is-active" : ""}"
              data-action="set-mode"
              data-mode="${STUDY_MODES.REVIEW}"
              aria-pressed="${!isLearnMode}"
            >
              Révision
            </button>
          </div>
        </div>
        <div class="topbar-stats">
          ${
            isLearnMode
              ? `
                <span class="mini-stat"><strong>${summary.learnedCards}</strong> appris</span>
                <span class="mini-stat"><strong>${summary.remainingCards}</strong> restants</span>
                <span class="mini-stat"><strong>${summary.progressPercent}%</strong> progression</span>
              `
              : `
                <span class="mini-stat"><strong>${summary.reviewedUnique}</strong> vus</span>
                <span class="mini-stat"><strong>${summary.confidentCards}</strong> connus</span>
                <span class="mini-stat"><strong>${summary.needsReviewCards}</strong> à revoir</span>
              `
          }
        </div>
      </header>

      <main class="board app-screen">
        <div class="card-stack">
          <div class="card-shadow"></div>
          <button
            type="button"
            class="flashcard"
            data-action="flip"
            aria-label="Retourner la carte courante"
            ${hasCurrentCard ? "" : "disabled"}
          >
            <div class="card-meta">
              <span>${escapeHtml(selectionLabel)}</span>
              <span>${escapeHtml(modeLabel)}</span>
            </div>

            ${
              currentCard
                ? !state.session.flipped
                  ? `
                    <div class="card-front">
                      <div class="kanji-large">${escapeHtml(currentCard.kanji)}</div>
                      <p class="card-hint">Touchez pour révéler</p>
                    </div>
                  `
                  : `
                    <div class="card-back">
                      <div class="card-back-main">
                        <div class="kanji-small">${escapeHtml(currentCard.kanji)}</div>
                        <div class="card-details">
                          <p class="card-meaning">${escapeHtml(formatMeaningList(currentCard))}</p>
                          <div class="reading-grid">
                            ${renderReadingBlock("onyomi")}
                            ${renderReadingBlock("kunyomi")}
                          </div>
                        </div>
                      </div>
                      ${
                        examplePanels.length > 0
                          ? `
                            <div class="card-examples-zone">
                              ${examplePanels
                                .map((example) => renderReadingExample(example))
                                .join("")}
                            </div>
                          `
                          : ""
                      }
                    </div>
                  `
                : `
                  <div class="card-front">
                    <div class="card-empty">
                      <p class="card-empty-title">${escapeHtml(emptyMessage)}</p>
                      <p class="card-hint">${escapeHtml(emptyHint)}</p>
                    </div>
                  </div>
                `
            }
          </button>
        </div>

        <div class="actions actions-dock">
          <button type="button" class="action-button action-button-light" data-result="${REVIEW_RESULTS.SKIP}" ${hasCurrentCard ? "" : "disabled"}>
            <span class="action-title">${escapeHtml(skipLabel.title)}</span>
            <span class="action-subtitle">${escapeHtml(skipLabel.subtitle)}</span>
          </button>
          <button type="button" class="action-button action-button-light" data-result="${REVIEW_RESULTS.UNKNOWN}" ${hasCurrentCard ? "" : "disabled"}>
            <span class="action-title">${escapeHtml(unknownLabel.title)}</span>
            <span class="action-subtitle">${escapeHtml(unknownLabel.subtitle)}</span>
          </button>
          <button type="button" class="action-button action-button-dark" data-result="${REVIEW_RESULTS.KNOWN}" ${hasCurrentCard ? "" : "disabled"}>
            <span class="action-title">${escapeHtml(knownLabel.title)}</span>
            <span class="action-subtitle">${escapeHtml(knownLabel.subtitle)}</span>
          </button>
        </div>

        <div class="footer-row footer-compact">
          <button type="button" class="text-button" data-action="reset">
            ${escapeHtml(resetLabel)}
          </button>
        </div>
      </main>

      ${renderDeckSheet(state, selectionLabel)}
    </div>
  `;
}

export function mountApp(root) {
  const selectedDeckIds = loadDeckSelection(sanitizeSelectedDeckIds);
  const mode = loadStudyMode();
  const learningProgress = loadLearningProgress();
  const initialCards = getActiveCardsForMode(
    mode,
    getCardsForDeckSelection(selectedDeckIds),
    getLearnedCardIdSet(learningProgress)
  );

  let state = {
    mode,
    learningProgress,
    session: loadSession(mode, selectedDeckIds, initialCards),
    selectedDeckIds,
    deckPickerOpen: false,
  };

  function persistState(snapshot = state) {
    saveSession(snapshot.mode, snapshot.selectedDeckIds, snapshot.session);
    saveDeckSelection(snapshot.selectedDeckIds);
    saveLearningProgress(snapshot.learningProgress);
    saveStudyMode(snapshot.mode);
  }

  function setState(nextState) {
    state = nextState;
    persistState(state);
    root.innerHTML = renderApp(state);
    bindEvents();
  }

  function getSelectedCards(selectedDeckIds = state.selectedDeckIds) {
    return getCardsForDeckSelection(selectedDeckIds);
  }

  function getActiveCards(
    mode = state.mode,
    selectedDeckIds = state.selectedDeckIds,
    learningProgress = state.learningProgress
  ) {
    return getActiveCardsForMode(
      mode,
      getSelectedCards(selectedDeckIds),
      getLearnedCardIdSet(learningProgress)
    );
  }

  function handleResult(result) {
    const activeCards = getActiveCards();

    if (activeCards.length === 0) {
      return;
    }

    if (state.mode === STUDY_MODES.LEARN) {
      const currentId = state.session.queue[0] || activeCards[0]?.id;
      const nextLearningProgress =
        result === REVIEW_RESULTS.KNOWN && currentId
          ? markCardLearned(state.learningProgress, currentId)
          : state.learningProgress;
      const nextSessionBase = applyLearningResult(state.session, activeCards, result);
      const nextActiveCards = getActiveCards(
        state.mode,
        state.selectedDeckIds,
        nextLearningProgress
      );

      setState({
        ...state,
        learningProgress: nextLearningProgress,
        session: sanitizeSession(nextSessionBase, nextActiveCards),
      });
      return;
    }

    setState({
      ...state,
      session: applyReviewResult(state.session, activeCards, result),
    });
  }

  function handleReset() {
    const selectionLabel = getDeckSelectionLabel(state.selectedDeckIds);

    if (!confirmReset(state.mode, selectionLabel)) {
      return;
    }

    if (state.mode === STUDY_MODES.LEARN) {
      const selectedCardIds = getSelectedCards().map((card) => card.id);
      const nextLearningProgress = unmarkCardsLearned(
        state.learningProgress,
        selectedCardIds
      );
      const nextActiveCards = getActiveCards(
        STUDY_MODES.LEARN,
        state.selectedDeckIds,
        nextLearningProgress
      );

      purgeStoredSessionsForCardIds(selectedCardIds);
      clearSession(STUDY_MODES.LEARN, state.selectedDeckIds);
      clearSession(STUDY_MODES.REVIEW, state.selectedDeckIds);

      setState({
        ...state,
        learningProgress: nextLearningProgress,
        session: resetSession(nextActiveCards),
        deckPickerOpen: false,
      });
      return;
    }

    clearSession(state.mode, state.selectedDeckIds);
    setState({
      ...state,
      session: resetSession(getActiveCards()),
      deckPickerOpen: false,
    });
  }

  function handleToggleDeck(deckId) {
    const nextSelectedDeckIds = toggleDeckSelection(state.selectedDeckIds, deckId);
    const sameSelection =
      nextSelectedDeckIds.length === state.selectedDeckIds.length &&
      nextSelectedDeckIds.every((id, index) => id === state.selectedDeckIds[index]);

    if (sameSelection) {
      return;
    }

    const nextActiveCards = getActiveCards(
      state.mode,
      nextSelectedDeckIds,
      state.learningProgress
    );
    const fallbackSession = sanitizeSession(state.session, nextActiveCards);
    const nextSession = loadSession(
      state.mode,
      nextSelectedDeckIds,
      nextActiveCards,
      fallbackSession
    );

    setState({
      ...state,
      selectedDeckIds: nextSelectedDeckIds,
      session: nextSession,
    });
  }

  function handleSetMode(nextMode) {
    const normalizedMode =
      nextMode === STUDY_MODES.REVIEW ? STUDY_MODES.REVIEW : STUDY_MODES.LEARN;

    if (normalizedMode === state.mode) {
      return;
    }

    const nextActiveCards = getActiveCards(
      normalizedMode,
      state.selectedDeckIds,
      state.learningProgress
    );
    const nextSession = loadSession(
      normalizedMode,
      state.selectedDeckIds,
      nextActiveCards,
      resetSession(nextActiveCards)
    );

    setState({
      ...state,
      mode: normalizedMode,
      session: nextSession,
      deckPickerOpen: false,
    });
  }

  function handleAction(action, dataset = {}) {
    if (action === "flip") {
      if (getActiveCards().length === 0) {
        return;
      }

      setState({
        ...state,
        session: flipSessionCard(state.session),
      });
      return;
    }

    if (action === "reset") {
      handleReset();
      return;
    }

    if (action === "open-decks") {
      setState({
        ...state,
        deckPickerOpen: true,
      });
      return;
    }

    if (action === "close-decks") {
      setState({
        ...state,
        deckPickerOpen: false,
      });
      return;
    }

    if (action === "toggle-deck") {
      handleToggleDeck(dataset.deckId);
      return;
    }

    if (action === "set-mode") {
      handleSetMode(dataset.mode);
    }
  }

  function bindEvents() {
    root.querySelectorAll("[data-action]").forEach((element) => {
      element.addEventListener("click", () => {
        handleAction(element.dataset.action, element.dataset);
      });
    });

    root.querySelectorAll("[data-result]").forEach((element) => {
      element.addEventListener("click", () => {
        handleResult(element.dataset.result);
      });
    });
  }

  window.addEventListener("keydown", (event) => {
    if (event.repeat) {
      return;
    }

    const key = event.key.toLowerCase();

    if (key === "escape" && state.deckPickerOpen) {
      handleAction("close-decks");
      return;
    }

    if (key === " " || key === "enter") {
      event.preventDefault();
      handleAction("flip");
      return;
    }

    if (key === "1") {
      handleResult(REVIEW_RESULTS.UNKNOWN);
      return;
    }

    if (key === "2") {
      handleResult(REVIEW_RESULTS.SKIP);
      return;
    }

    if (key === "3") {
      handleResult(REVIEW_RESULTS.KNOWN);
      return;
    }

    if (key === "r") {
      handleReset();
    }
  });

  window.addEventListener("pagehide", () => {
    persistState();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      persistState();
    }
  });

  root.innerHTML = renderApp(state);
  bindEvents();
}
