class ProctorService {
  constructor() {
    this.riskLevel = 0;
    this.warnings = [];
    this.events = [];
  }

  calculateRiskScore(events) {
    let score = 0;
    
    // Keystroke patterns
    if (events.keySpeed > 200) score += 10;
    if (events.backspaceCount > 20) score += 5;
    if (events.copyPasteCount > 0) score += 15;
    
    // Mouse behavior
    if (events.mouseSpeed > 1000) score += 10;
    if (events.clickCount > 50) score += 5;
    
    // Window activity
    if (events.tabSwitches > 3) score += 20;
    if (events.focusLost > 5) score += 15;
    
    // Inactivity
    if (events.idleTime > 300) score += 25;
    if (events.suddenActivityBursts > 2) score += 20;

    this.riskLevel = score;
    return this.getRiskLevel();
  }

  getRiskLevel() {
    if (this.riskLevel < 30) return 'LOW';
    if (this.riskLevel < 60) return 'MEDIUM';
    return 'HIGH';
  }

  takeAction(riskLevel) {
    switch(riskLevel) {
      case 'LOW':
        return null;
      case 'MEDIUM':
        return {
          type: 'WARNING',
          message: 'Suspicious activity detected. Please focus on your exam.'
        };
      case 'HIGH':
        return {
          type: 'VIOLATION',
          message: 'Multiple violations detected. This incident will be reported.',
          action: 'RESTRICT_ACTIONS'
        };
      default:
        return null;
    }
  }

  addEvent(event) {
    this.events.push({
      ...event,
      timestamp: new Date()
    });
  }

  getCurrentStatus() {
    return {
      riskLevel: this.getRiskLevel(),
      warnings: this.warnings,
      events: this.events
    };
  }
}

export default new ProctorService();