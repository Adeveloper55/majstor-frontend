export function unregisterServiceWorkers() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

  if ("caches" in window) {
    caches.keys().then((keys) => {
      keys.forEach((key) => caches.delete(key));
    });
  }

  window.setTimeout(() => {
    navigator.serviceWorker.getRegistrations().then((regs) => {
      regs.forEach((reg) => reg.unregister());
    });
  }, 4000);
}
