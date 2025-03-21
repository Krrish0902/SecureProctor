/**
 * UserBehaviorModel
 * 
 * This class handles the creation of user-specific behavioral baselines
 * and performs anomaly detection based on deviations from the baseline.
 */

class UserBehaviorModel {
  constructor(userId) {
    this.userId = userId;
    this.baseline = null;
    this.baselineEstablished = false;
    this.keyMetrics = [];
    this.mouseMetrics = [];
    this.focusMetrics = [];
    this.baselineWindowSize = 600; // 10 minutes in seconds
    this.baselineProgress = 0;
    this.onBaselineProgressUpdate = null;
    this.onBaselineComplete = null;
    this.baseRiskLevel = 10; // Minimum risk level at all times
    this.previousRiskScore = this.baseRiskLevel; // Add this line to track previous score
  }
  
  /**
   * Start collecting baseline data
   * @param {Function} onProgressUpdate - Callback for baseline progress updates
   * @param {Function} onComplete - Callback when baseline is complete
   */
  collectBaselineData(onProgressUpdate = null, onComplete = null) {
    this.onBaselineProgressUpdate = onProgressUpdate;
    this.onBaselineComplete = onComplete;
    
    // Try to load existing model first
    const hasExistingModel = this.loadModel();
    
    if (hasExistingModel) {
      console.log('Loaded existing user model');
      if (this.onBaselineComplete) {
        this.onBaselineComplete(this.baseline);
      }
      return true;
    }
    
    // Reset metrics
    this.keyMetrics = [];
    this.mouseMetrics = [];
    this.focusMetrics = [];
    this.baselineProgress = 0;
    
    console.log('Starting baseline data collection');
    
    // Start a timer to track progress
    const startTime = Date.now();
    const baselineTimer = setInterval(() => {
      const elapsedSeconds = (Date.now() - startTime) / 1000;
      this.baselineProgress = Math.min(100, (elapsedSeconds / this.baselineWindowSize) * 100);
      
      if (this.onBaselineProgressUpdate) {
        this.onBaselineProgressUpdate(this.baselineProgress);
      }
      
      if (elapsedSeconds >= this.baselineWindowSize) {
        clearInterval(baselineTimer);
        this.computeBaseline();
        
        if (this.onBaselineComplete) {
          this.onBaselineComplete(this.baseline);
        }
      }
    }, 1000);
    
    return false;
  }
 
  // Add methods for enhanced pattern analysis
  analyzeKeystrokePattern(keystrokes) {
    return {
      meanLatency: this.average(keystrokes.map(k => k.latency)),
      stdDevLatency: this.standardDeviation(keystrokes.map(k => k.latency)),
      meanDuration: this.average(keystrokes.map(k => k.pressDuration)),
      stdDevDuration: this.standardDeviation(keystrokes.map(k => k.pressDuration))
    };
  }

  analyzeMousePattern(movements) {
    return {
      meanSpeed: this.average(movements.map(m => m.speed)),
      stdDevSpeed: this.standardDeviation(movements.map(m => m.speed)),
      directionChanges: this.average(movements.map(m => m.directionChange || 0))
    };
  }
  /**
   * Add behavioral data to the model
   * @param {Object} behaviorWindow - Current behavior window data
   */
  addBehaviorData(behaviorWindow) {
    // Extract key metrics from the behavior window
    if (behaviorWindow.keystrokes && behaviorWindow.keystrokes.length > 0) {
      this.keyMetrics = this.keyMetrics.concat(behaviorWindow.keystrokes);
    }
    
    if (behaviorWindow.mouseMovements && behaviorWindow.mouseMovements.length > 0) {
      this.mouseMetrics = this.mouseMetrics.concat(behaviorWindow.mouseMovements);
    }
    
    if (behaviorWindow.focusEvents && behaviorWindow.focusEvents.length > 0) {
      this.focusMetrics = this.focusMetrics.concat(behaviorWindow.focusEvents);
    }
  }
  
  /**
   * Compute the baseline from collected data
   */
  computeBaseline() {
    console.log('Computing baseline from collected data');
    console.log(`Key metrics: ${this.keyMetrics.length}`);
    console.log(`Mouse metrics: ${this.mouseMetrics.length}`);
    console.log(`Focus metrics: ${this.focusMetrics.length}`);
    
    // Calculate statistical measures from collected data
    this.baseline = {
      keyLatency: {
        mean: this.average(this.keyMetrics.map(k => k.latency).filter(l => l !== null)),
        stdDev: this.standardDeviation(this.keyMetrics.map(k => k.latency).filter(l => l !== null))
      },
      keyPressDuration: {
        mean: this.average(this.keyMetrics.map(k => k.pressDuration).filter(d => d !== undefined)),
        stdDev: this.standardDeviation(this.keyMetrics.map(k => k.pressDuration).filter(d => d !== undefined))
      },
      mouseSpeeds: {
        mean: this.average(this.mouseMetrics.map(m => m.speed).filter(s => s !== undefined)),
        stdDev: this.standardDeviation(this.mouseMetrics.map(m => m.speed).filter(s => s !== undefined))
      },
      mouseDirectionChanges: {
        mean: this.average(this.mouseMetrics.map(m => m.directionChange).filter(d => d !== undefined)),
        stdDev: this.standardDeviation(this.mouseMetrics.map(m => m.directionChange).filter(d => d !== undefined))
      },
      tabSwitches: {
        frequency: this.focusMetrics.filter(f => f.type === 'blur').length / (this.baselineWindowSize / 60), // per minute
        avgDuration: this.average(this.focusMetrics.filter(f => f.type === 'focus').map(f => f.duration).filter(d => d !== undefined))
      }
    };
    
    this.baselineEstablished = true;
    
    // Save to localStorage for future exams
    this.saveModel();
    
    return this.baseline;
  }
  
  /**
   * Detect anomalies in the current behavior window
   * @param {Object} currentWindow - Current behavior window data
   * @returns {Number} Anomaly score (0-100)
   */
  detectAnomalies(currentWindow) {
    if (!this.baselineEstablished) {
      return { score: 0, factors: {} };
    }

    // Risk weights add up to 90% as specified
    const riskWeights = {
      tabSwitching: 30,
      mouseExit: {
        normal: 15,
        tabBar: 25
      },
      typingBurst: 15,
      keyboardShortcut: 10,
      rightClick: 5,
      dragEvent: 5,
      inactivity: 5
    };

    let riskFactors = {};
    let totalRiskScore = Math.max(this.baseRiskLevel, this.previousRiskScore); // Fix the undefined variable

    // Calculate individual risk factors
    
    // Tab switching (30%)
    const tabSwitchRisk = Math.min(100, (currentWindow.tabSwitches * 25)); // 4 switches = 100% risk
    totalRiskScore += (tabSwitchRisk * riskWeights.tabSwitching) / 100;
    riskFactors.tabSwitching = tabSwitchRisk;

    // Calculate regular mouse exit risk (15%)
    const regularExits = currentWindow.mouseExits.count - currentWindow.mouseExits.topEdgeExits;
    const regularExitRisk = Math.min(100, (regularExits * 33.33)); // 3 regular exits = 100% risk
    totalRiskScore += (regularExitRisk * riskWeights.mouseExit.normal) / 100;
    
    // Calculate tab bar exit risk (25%) - More severe
    const tabBarExitRisk = Math.min(100, (currentWindow.mouseExits.topEdgeExits * 50)); // 2 tab bar exits = 100% risk
    totalRiskScore += (tabBarExitRisk * riskWeights.mouseExit.tabBar) / 100;
    
    riskFactors.mouseExit = {
      regular: regularExitRisk,
      tabBar: tabBarExitRisk,
      totalExits: currentWindow.mouseExits.count,
      tabBarExits: currentWindow.mouseExits.topEdgeExits
    };

    // Typing bursts detection (15%)
    const typingBursts = this.detectTypingBursts(currentWindow.keystrokes);
    const burstRisk = Math.min(100, (typingBursts * 50)); // 2 bursts = 100% risk
    totalRiskScore += (burstRisk * riskWeights.typingBurst) / 100;
    riskFactors.typingBurst = burstRisk;

    // Keyboard shortcuts (10%)
    const shortcutCount = currentWindow.keyboardShortcuts.filter(s => 
      ['c', 'v', 'x'].includes(s.key)
    ).length;
    const shortcutRisk = Math.min(100, (shortcutCount * 33.33)); // 3 shortcuts = 100% risk
    totalRiskScore += (shortcutRisk * riskWeights.keyboardShortcut) / 100;
    riskFactors.keyboardShortcut = shortcutRisk;

    // Right clicks (5%)
    const rightClickRisk = Math.min(100, (currentWindow.rightClicks * 50)); // 2 right clicks = 100% risk
    totalRiskScore += (rightClickRisk * riskWeights.rightClick) / 100;
    riskFactors.rightClick = rightClickRisk;

    // Drag events (5%)
    const dragRisk = Math.min(100, (currentWindow.dragEvents * 50)); // 2 drags = 100% risk
    totalRiskScore += (dragRisk * riskWeights.dragEvent) / 100;
    riskFactors.dragEvent = dragRisk;

    // Inactivity (5%)
    const inactivityRisk = this.calculateInactivityRisk(currentWindow);
    totalRiskScore += (inactivityRisk * riskWeights.inactivity) / 100;
    riskFactors.inactivity = inactivityRisk;

    // Ensure score only increases
    const finalRiskScore = Math.min(100, Math.max(this.baseRiskLevel, totalRiskScore));

    // Update previous score before returning
    this.previousRiskScore = finalRiskScore;

    return {
      score: finalRiskScore,
      factors: riskFactors,
      weights: riskWeights
    };
  }

  detectTypingBursts(keystrokes) {
    if (!keystrokes.length) return 0;
    
    const avgWPM = 40; // Average typing speed
    const burstThreshold = avgWPM * 2; // Suspicious WPM threshold
    
    // Group keystrokes into 5-second windows
    const windows = [];
    let currentWindow = [];
    const windowSize = 5000; // 5 seconds
    
    keystrokes.forEach(stroke => {
      if (currentWindow.length === 0 || 
          stroke.downTime - currentWindow[0].downTime < windowSize) {
        currentWindow.push(stroke);
      } else {
        windows.push(currentWindow);
        currentWindow = [stroke];
      }
    });
    
    if (currentWindow.length > 0) {
      windows.push(currentWindow);
    }
    
    // Count suspicious bursts
    return windows.filter(window => {
      const wpm = (window.length / 5) * 60; // Convert to WPM
      return wpm > burstThreshold;
    }).length;
  }

  calculateInactivityRisk(currentWindow) {
    if (!currentWindow.questions.length) return 0;
    
    const avgTimePerQuestion = this.baseline.avgTimePerQuestion || 60; // Default 1 minute
    const maxInactiveTime = avgTimePerQuestion * 2; // Double the average time
    
    const inactivePeriods = currentWindow.inactivityPeriods.filter(period => 
      period.duration > maxInactiveTime
    );
    
    return Math.min(100, (inactivePeriods.length * 20)); // 20% risk per long inactive period
  }
  
  /**
   * Update the model with data from a completed exam
   * @param {Object} examData - Data from the completed exam
   */
  updateFromCompletedExam(examData) {
    if (!this.baselineEstablished) {
      // If no baseline exists, just compute it from this exam
      this.keyMetrics = examData.keystrokes || [];
      this.mouseMetrics = examData.mouseMovements || [];
      this.focusMetrics = examData.focusEvents || [];
      this.computeBaseline();
      return;
    }
    
    // Calculate new metrics from completed exam
    const newMetrics = this.analyzeExamBehavior(examData);
    
    // Update model with weighted average (favor historical data slightly)
    this.baseline = {
      keyLatency: {
        mean: (this.baseline.keyLatency.mean * 0.7) + (newMetrics.keyLatency.mean * 0.3),
        stdDev: (this.baseline.keyLatency.stdDev * 0.7) + (newMetrics.keyLatency.stdDev * 0.3)
      },
      keyPressDuration: {
        mean: (this.baseline.keyPressDuration.mean * 0.7) + (newMetrics.keyPressDuration.mean * 0.3),
        stdDev: (this.baseline.keyPressDuration.stdDev * 0.7) + (newMetrics.keyPressDuration.stdDev * 0.3)
      },
      mouseSpeeds: {
        mean: (this.baseline.mouseSpeeds.mean * 0.7) + (newMetrics.mouseSpeeds.mean * 0.3),
        stdDev: (this.baseline.mouseSpeeds.stdDev * 0.7) + (newMetrics.mouseSpeeds.stdDev * 0.3)
      },
      mouseDirectionChanges: {
        mean: (this.baseline.mouseDirectionChanges.mean * 0.7) + (newMetrics.mouseDirectionChanges.mean * 0.3),
        stdDev: (this.baseline.mouseDirectionChanges.stdDev * 0.7) + (newMetrics.mouseDirectionChanges.stdDev * 0.3)
      },
      tabSwitches: {
        frequency: (this.baseline.tabSwitches.frequency * 0.7) + (newMetrics.tabSwitches.frequency * 0.3),
        avgDuration: (this.baseline.tabSwitches.avgDuration * 0.7) + (newMetrics.tabSwitches.avgDuration * 0.3)
      }
    };
    
    // Save updated model
    this.saveModel();
  }
  
  /**
   * Analyze exam behavior to extract metrics
   * @param {Object} examData - Data from the completed exam
   * @returns {Object} Extracted metrics
   */
  analyzeExamBehavior(examData) {
    return {
      keyLatency: {
        mean: this.average(examData.keystrokes.map(k => k.latency).filter(l => l !== null)),
        stdDev: this.standardDeviation(examData.keystrokes.map(k => k.latency).filter(l => l !== null))
      },
      keyPressDuration: {
        mean: this.average(examData.keystrokes.map(k => k.pressDuration).filter(d => d !== undefined)),
        stdDev: this.standardDeviation(examData.keystrokes.map(k => k.pressDuration).filter(d => d !== undefined))
      },
      mouseSpeeds: {
        mean: this.average(examData.mouseMovements.map(m => m.speed).filter(s => s !== undefined)),
        stdDev: this.standardDeviation(examData.mouseMovements.map(m => m.speed).filter(s => s !== undefined))
      },
      mouseDirectionChanges: {
        mean: this.average(examData.mouseMovements.map(m => m.directionChange).filter(d => d !== undefined)),
        stdDev: this.standardDeviation(examData.mouseMovements.map(m => m.directionChange).filter(d => d !== undefined))
      },
      tabSwitches: {
        frequency: examData.focusEvents.filter(f => f.type === 'blur').length / (examData.durationSeconds / 60),
        avgDuration: this.average(examData.focusEvents.filter(f => f.type === 'focus').map(f => f.duration).filter(d => d !== undefined))
      }
    };
  }
  
  /**
   * Save the model to localStorage
   */
  saveModel() {
    if (!this.baselineEstablished) {
      return false;
    }
    
    localStorage.setItem(`userModel_${this.userId}`, JSON.stringify({
      baseline: this.baseline,
      timestamp: Date.now()
    }));
    
    return true;
  }
  
  /**
   * Load the model from localStorage
   * @returns {Boolean} Whether a model was successfully loaded
   */
  loadModel() {
    const savedModel = localStorage.getItem(`userModel_${this.userId}`);
    if (savedModel) {
      try {
        const model = JSON.parse(savedModel);
        this.baseline = model.baseline;
        this.baselineEstablished = true;
        return true;
      } catch (error) {
        console.error('Error loading user model:', error);
        return false;
      }
    }
    return false;
  }
  
  /**
   * Calculate the average of an array of numbers
   * @param {Array} values - Array of numbers
   * @returns {Number} Average value
   */
  average(values) {
    if (!values || values.length === 0) {
      return 0;
    }
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }
  
  /**
   * Calculate the standard deviation of an array of numbers
   * @param {Array} values - Array of numbers
   * @returns {Number} Standard deviation
   */
  standardDeviation(values) {
    if (!values || values.length <= 1) {
      return 0;
    }
    
    const avg = this.average(values);
    const squareDiffs = values.map(value => Math.pow(value - avg, 2));
    const avgSquareDiff = this.average(squareDiffs);
    return Math.sqrt(avgSquareDiff);
  }

  /**
   * Force recalculation of baseline from scratch
   * @param {Function} onProgressUpdate - Callback for progress updates
   * @param {Function} onComplete - Callback when complete
   */
  recalculateBaseline(onProgressUpdate = null, onComplete = null) {
    this.onBaselineProgressUpdate = onProgressUpdate;
    this.onBaselineComplete = onComplete;
    
    // Reset all metrics
    this.keyMetrics = [];
    this.mouseMetrics = [];
    this.focusMetrics = [];
    this.baselineProgress = 0;
    this.baselineEstablished = false;
    
    // Clear existing model from storage
    localStorage.removeItem(`userModel_${this.userId}`);
    
    console.log('Starting baseline recalculation');
    
    // Start a new collection period
    const startTime = Date.now();
    const baselineTimer = setInterval(() => {
      const elapsedSeconds = (Date.now() - startTime) / 1000;
      this.baselineProgress = Math.min(100, (elapsedSeconds / this.baselineWindowSize) * 100);
      
      if (this.onBaselineProgressUpdate) {
        this.onBaselineProgressUpdate(this.baselineProgress);
      }
      
      if (elapsedSeconds >= this.baselineWindowSize) {
        clearInterval(baselineTimer);
        this.computeBaseline();
        
        if (this.onBaselineComplete) {
          this.onBaselineComplete(this.baseline);
        }
      }
    }, 1000);
    
    return false;
  }
}

export default UserBehaviorModel;