/**
 * Version Switcher Controller
 * Manages navigation between Black Friday versions
 */
class VersionSwitcher {
  constructor() {
    this.currentVersion = 'original';
    this.versions = ['original', 'v1', 'v2', 'v3', 'compare'];
    this.containers = {};
    this.init();
  }

  init() {
    this.initContainers();
    this.attachEventListeners();
    this.loadVersionFromURL();
  }

  initContainers() {
    this.versions.forEach(version => {
      const container = document.querySelector(`[data-version-content="${version}"]`);
      if (container) {
        this.containers[version] = container;
        container.style.display = 'none';
      }
    });
  }

  attachEventListeners() {
    // Tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const version = e.target.dataset.version;
        this.loadVersion(version);
      });
    });

    // Reset timer button
    const resetBtn = document.getElementById('resetTimer');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (window.BlackFridayTimers) {
          window.BlackFridayTimers.resetAll();
        }
        this.showNotification('⏱️ All timers reset to 1 minute');
      });
    }

    // Live countdown toggle
    const liveToggle = document.getElementById('liveCountdown');
    if (liveToggle) {
      liveToggle.addEventListener('change', (e) => {
        if (window.BlackFridayTimers) {
          if (e.target.checked) {
            window.BlackFridayTimers.startAll();
            this.showNotification('▶️ Timers started');
          } else {
            window.BlackFridayTimers.stopAll();
            this.showNotification('⏸️ Timers paused');
          }
        }
      });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
          case '1':
            e.preventDefault();
            this.loadVersion('v1');
            break;
          case '2':
            e.preventDefault();
            this.loadVersion('v2');
            break;
          case '3':
            e.preventDefault();
            this.loadVersion('v3');
            break;
          case '0':
            e.preventDefault();
            this.loadVersion('original');
            break;
          case 'r':
            e.preventDefault();
            if (window.BlackFridayTimers) {
              window.BlackFridayTimers.resetAll();
            }
            break;
        }
      }
    });

    // Browser back/forward
    window.addEventListener('popstate', () => {
      this.loadVersionFromURL();
    });
  }

  loadVersionFromURL() {
    const params = new URLSearchParams(window.location.search);
    const version = params.get('version') || 'original';
    this.loadVersion(version, false); // Don't update URL again
  }

  loadVersion(version, updateURL = true) {
    // Validate version
    if (!this.versions.includes(version)) {
      console.warn(`Invalid version: ${version}`);
      return;
    }

    // Hide all versions
    Object.values(this.containers).forEach(container => {
      container.style.display = 'none';
      container.classList.remove('active');
    });

    // Show selected version
    if (this.containers[version]) {
      this.containers[version].style.display = 'block';
      this.containers[version].classList.add('active');
    }

    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.version === version);
    });

    this.currentVersion = version;

    // Update URL without reload
    if (updateURL) {
      const url = new URL(window.location);
      url.searchParams.set('version', version);
      window.history.pushState({ version }, '', url);
    }

    // Log for debugging
    console.log(`📍 Loaded version: ${version}`);
  }

  showNotification(message) {
    // Remove existing notifications
    document.querySelectorAll('.version-notification').forEach(n => n.remove());

    const notification = document.createElement('div');
    notification.className = 'version-notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }

  getCurrentVersion() {
    return this.currentVersion;
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.versionSwitcher = new VersionSwitcher();
  console.log('🎯 Black Friday Version Switcher initialized');
  console.log('💡 Keyboard shortcuts: Ctrl+0 (original), Ctrl+1 (V1), Ctrl+2 (V2), Ctrl+3 (V3), Ctrl+R (reset timers)');
});
