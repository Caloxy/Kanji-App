# Kanji Deck

Application Vite mobile-first pour apprendre et reviser des kanjis `JLPT N1` a `N5`.

## Structure active

```text
index.html
styles/app.css
src/
  data/
  lib/
  ui/
  main.js
```

## Lancer en local

```powershell
npm install
npm run dev
```

Puis ouvrir `http://127.0.0.1:4173/`.

## Build

```powershell
npm run build
```

Le build produit maintenant une `PWA` installable et utilisable hors ligne apres la premiere ouverture.

## Fonctionnel aujourd'hui

- Modes `Apprentissage` et `Revision`
- Persistance locale via `localStorage`
- Selection d'un ou plusieurs decks
- Decks `N1` a `N5` embarques
- Interface optimisee pour mobile

## Notes

- Le moteur de session est dans `src/lib/session.js`.
- La persistance locale est dans `src/lib/storage.js`.
- Le rendu UI est dans `src/ui/app.js`.
- Les donnees de decks sont dans `src/data/`.

## Installation sur iPhone sans Mac

1. Deployer le contenu de `dist/` sur un hebergement statique HTTPS.
2. Ouvrir l'URL depuis Safari sur l'iPhone.
3. Attendre le chargement complet une premiere fois pour que le mode hors ligne soit mis en cache.
4. Faire `Partager` puis `Ajouter a l'ecran d'accueil`.
5. Relancer l'app depuis l'icone. Elle peut ensuite fonctionner sans connexion au PC.

Hebergements simples adaptes:

- Netlify
- Vercel
- Cloudflare Pages
- GitHub Pages

## Deploiement permanent avec GitHub Pages

Le repo contient un workflow GitHub Actions dans `.github/workflows/deploy-pages.yml`.

1. Pousser le projet sur GitHub.
2. Aller dans `Settings` > `Pages`.
3. Choisir `Source` = `GitHub Actions`.
4. Laisser le workflow deployer automatiquement le contenu de `dist/` a chaque `push` sur `main` ou `master`.

Attention:

- Avec `GitHub Free`, GitHub Pages est disponible pour les repositories publics.
- Un changement de domaine ou d'URL cree un stockage local distinct sur l'iPhone.
