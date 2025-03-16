import ProctorService from './ProctorService';

class KeystrokeMonitor {
  constructor() {
    this.keyPresses = [];
    this.lastKeyTime = null;
    this.backspaceCount = 0;
    this.copyPasteCount = 0;
  }

  start() {
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('copy', this.handleCopyPaste);
    document.addEventListener('paste', this.handleCopyPaste);
  }

  stop() {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('copy', this.handleCopyPaste);
    document.removeEventListener('paste', this.handleCopyPaste);
  }

  handleKeyDown = (event) => {
    const currentTime = Date.now();
    
    if (this.lastKeyTime) {
      const timeDiff = currentTime - this.lastKeyTime;
      if (timeDiff < 50) { // Suspiciously fast typing
        ProctorService.addEvent({
          type: 'SUSPICIOUS_TYPING',
          value: timeDiff
        });
      }
    }

    if (event.key === 'Backspace') {
      this.backspaceCount++;
      if (this.backspaceCount > 20) {
        ProctorService.addEvent({
          type: 'EXCESSIVE_BACKSPACE',
          count: this.backspaceCount
        });
      }
    }

    this.lastKeyTime = currentTime;
  }

  handleCopyPaste = (event) => {
    this.copyPasteCount++;
    ProctorService.addEvent({
      type: 'COPY_PASTE_DETECTED',
      count: this.copyPasteCount
    });

    // Optionally prevent copy/paste
    // event.preventDefault();
  }
}

export default new KeystrokeMonitor();