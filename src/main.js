import { mountApp } from "./ui/app.js";

const root = document.getElementById("app");

if (!root) {
  throw new Error("Le point de montage #app est introuvable.");
}

mountApp(root);

if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    const serviceWorkerUrl = new URL("./sw.js", window.location.href);

    navigator.serviceWorker.register(serviceWorkerUrl).catch((error) => {
      console.warn("Impossible d'enregistrer le mode hors ligne.", error);
    });
  });
}
