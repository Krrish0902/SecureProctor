import ProctorService from './ProctorService';

class WindowMonitor {
  constructor() {
    this.focusLossCount = 0;
    this.tabSwitchCount = 0;
    this.lastActiveTime = Date.now();
  }

  start() {
    window.addEventListener('blur', this.handleFocusLoss);
    window.addEventListener('focus', this.handleFocusGain);
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  stop() {
    window.removeEventListener('blur', this.handleFocusLoss);
    window.removeEventListener('focus', this.handleFocusGain);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  }

  handleFocusLoss = () => {
    this.focusLossCount++;
    ProctorService.addEvent({
      type: 'FOCUS_LOSS',
      count: this.focusLossCount
    });
  }

  handleVisibilityChange = () => {
    if (document.hidden) {
      this.tabSwitchCount++;
      ProctorService.addEvent({
        type: 'TAB_SWITCH',
        count: this.tabSwitchCount
      });
    }
  }

  isDevToolsOpen() {
    const threshold = 160;
    return window.outerWidth - window.innerWidth > threshold ||
           window.outerHeight - window.innerHeight > threshold;
  }
}

export default new WindowMonitor();