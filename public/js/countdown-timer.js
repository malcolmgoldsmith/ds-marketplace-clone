/**
 * Universal Countdown Timer
 * Shared across all 3 Black Friday versions
 */
class CountdownTimer {
  constructor(options = {}) {
    this.startOffset = options.startOffset || 60000; // Default: 1 minute (60000ms)
    this.targetDate = new Date(Date.now() + this.startOffset);
    this.onTick = options.onTick || (() => {});
    this.onComplete = options.onComplete || this.defaultComplete;
    this.format = options.format || 'full'; // 'full', 'compact', 'minimal'
    this.interval = null;
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.update(); // Initial update
    this.interval = setInterval(() => this.update(), 1000);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      this.isRunning = false;
    }
  }

  reset(newOffset = this.startOffset) {
    this.stop();
    this.targetDate = new Date(Date.now() + newOffset);
    this.start();
  }

  update() {
    const now = Date.now();
    const diff = this.targetDate - now;

    if (diff <= 0) {
      this.stop();
      this.onComplete();
      return;
    }

    const time = this.calculateTime(diff);
    this.onTick(time);
  }

  calculateTime(diff) {
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
      total: diff
    };
  }

  formatTime(time) {
    const pad = (num) => String(num).padStart(2, '0');

    switch(this.format) {
      case 'full':
        return `${pad(time.days)}:${pad(time.hours)}:${pad(time.minutes)}:${pad(time.seconds)}`;
      case 'compact':
        return `${time.days}d ${time.hours}h ${time.minutes}m ${time.seconds}s`;
      case 'minimal':
        return `${pad(time.hours)}:${pad(time.minutes)}:${pad(time.seconds)}`;
      default:
        return time;
    }
  }

  defaultComplete() {
    console.log('🔥 SALE IS LIVE!');
  }

  getTimeRemaining() {
    const now = Date.now();
    const diff = this.targetDate - now;
    return diff > 0 ? this.calculateTime(diff) : null;
  }
}

// Global timer manager for version switcher
window.BlackFridayTimers = {
  timers: new Map(),

  create(id, options) {
    const timer = new CountdownTimer(options);
    this.timers.set(id, timer);
    return timer;
  },

  get(id) {
    return this.timers.get(id);
  },

  resetAll() {
    this.timers.forEach(timer => timer.reset());
    console.log('⏱️ All timers reset to 1 minute');
  },

  stopAll() {
    this.timers.forEach(timer => timer.stop());
    console.log('⏸️ All timers stopped');
  },

  startAll() {
    this.timers.forEach(timer => timer.start());
    console.log('▶️ All timers started');
  }
};
