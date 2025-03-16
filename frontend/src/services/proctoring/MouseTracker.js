import ProctorService from './ProctorService';

class MouseTracker {
  constructor() {
    this.positions = [];
    this.lastPosition = null;
    this.clickCount = 0;
  }

  start() {
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('click', this.handleClick);
    document.addEventListener('mousedown', this.handleMouseDown);
  }

  stop() {
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('click', this.handleClick);
    document.removeEventListener('mousedown', this.handleMouseDown);
  }

  handleMouseMove = (event) => {
    const currentPosition = {
      x: event.clientX,
      y: event.clientY,
      time: Date.now()
    };

    if (this.lastPosition) {
      const speed = this.calculateSpeed(this.lastPosition, currentPosition);
      if (speed > 1000) { // Unusually fast movement
        ProctorService.addEvent({
          type: 'ERRATIC_MOUSE_MOVEMENT',
          speed: speed
        });
      }
    }

    this.positions.push(currentPosition);
    this.lastPosition = currentPosition;

    // Keep only last 100 positions
    if (this.positions.length > 100) {
      this.positions.shift();
    }
  }

  handleClick = () => {
    this.clickCount++;
    if (this.clickCount > 50) {
      ProctorService.addEvent({
        type: 'EXCESSIVE_CLICKING',
        count: this.clickCount
      });
    }
  }

  calculateSpeed(pos1, pos2) {
    const dx = pos2.x - pos1.x;
    const dy = pos2.y - pos1.y;
    const time = pos2.time - pos1.time;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance / (time || 1);
  }
}

export default new MouseTracker();