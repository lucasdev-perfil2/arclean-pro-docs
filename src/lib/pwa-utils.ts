export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('SW registered:', registration);
        })
        .catch((error) => {
          console.log('SW registration failed:', error);
        });
    });
  }
}

export function isInstallable(): boolean {
  // Check if the app is already installed
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return false;
  }
  
  // Check if browser supports installation
  return 'serviceWorker' in navigator && 'BeforeInstallPromptEvent' in window;
}

export function isOnline(): boolean {
  return navigator.onLine;
}
