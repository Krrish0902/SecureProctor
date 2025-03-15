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
      return 0; // No baseline yet, return zero risk
    }
    
    // Extract metrics from current window
    const currentKeyLatency = this.average(
      currentWindow.keystrokes.map(k => k.latency).filter(l => l !== null)
    );
    
    const currentKeyPressDuration = this.average(
      currentWindow.keystrokes.map(k => k.pressDuration).filter(d => d !== undefined)
    );
    
    const currentMouseSpeed = this.average(
      currentWindow.mouseMovements.map(m => m.speed).filter(s => s !== undefined)
    );
    
    const currentMouseDirectionChange = this.average(
      currentWindow.mouseMovements.map(m => m.directionChange).filter(d => d !== undefined)
    );
    
    const currentTabSwitchFrequency = 
      currentWindow.tabSwitches / (currentWindow.durationSeconds / 60); // per minute
    
    // Add inactivity check
  const isInactive = 
  (!currentWindow.keystrokes || currentWindow.keystrokes.length === 0) &&
  (!currentWindow.mouseMovements || currentWindow.mouseMovements.length === 0);

  if (isInactive) {
    return {
      score: 75, // High risk score for complete inactivity
      factors: {
        keyLatency: 0,
        tabSwitchFrequency: 0,
        mouseSpeed: 0,
        mouseDirectionChange: 0,
        inactivity: true // New flag to indicate inactivity
      }
    };
  }  
    // Calculate deviations from baseline (z-scores)
    let deviations = {};
    
    if (!isNaN(currentKeyLatency) && this.baseline.keyLatency.stdDev > 0) {
      deviations.keyLatency = Math.abs(
        (currentKeyLatency - this.baseline.keyLatency.mean) / 
        this.baseline.keyLatency.stdDev
      );
    } else {
      deviations.keyLatency = 0;
    }
    
    if (!isNaN(currentKeyPressDuration) && this.baseline.keyPressDuration.stdDev > 0) {
      deviations.keyPressDuration = Math.abs(
        (currentKeyPressDuration - this.baseline.keyPressDuration.mean) / 
        this.baseline.keyPressDuration.stdDev
      );
    } else {
      deviations.keyPressDuration = 0;
    }
    
    if (!isNaN(currentMouseSpeed) && this.baseline.mouseSpeeds.stdDev > 0) {
      deviations.mouseSpeed = Math.abs(
        (currentMouseSpeed - this.baseline.mouseSpeeds.mean) / 
        this.baseline.mouseSpeeds.stdDev
      );
    } else {
      deviations.mouseSpeed = 0;
    }
    
    if (!isNaN(currentMouseDirectionChange) && this.baseline.mouseDirectionChanges.stdDev > 0) {
      deviations.mouseDirectionChange = Math.abs(
        (currentMouseDirectionChange - this.baseline.mouseDirectionChanges.mean) / 
        this.baseline.mouseDirectionChanges.stdDev
      );
    } else {
      deviations.mouseDirectionChange = 0;
    }
    
    if (!isNaN(currentTabSwitchFrequency) && this.baseline.tabSwitches.frequency > 0) {
      deviations.tabSwitchFrequency = Math.abs(
        (currentTabSwitchFrequency - this.baseline.tabSwitches.frequency) / 
        Math.max(0.1, this.baseline.tabSwitches.frequency) // Avoid division by zero
      );
    } else {
      deviations.tabSwitchFrequency = 0;
    }
    
    // Combine deviations into anomaly score (0-100)
    // Weight factors can be adjusted based on importance
    const weights = {
      keyLatency: 15,
      keyPressDuration: 15,
      mouseSpeed: 20,
      mouseDirectionChange: 10,
      tabSwitchFrequency: 40
    };
    
    let weightedScore = 0;
    let totalWeight = 0;
    
    for (const [key, deviation] of Object.entries(deviations)) {
      if (!isNaN(deviation)) {
        weightedScore += deviation * weights[key];
        totalWeight += weights[key];
      }
    }
    
    // Normalize to 0-100 scale
    const anomalyScore = Math.min(100, (weightedScore / totalWeight) * 100);
    
    return {
      score: anomalyScore,
      factors: {
        keyLatency: deviations.keyLatency,
        tabSwitchFrequency: deviations.tabSwitchFrequency,
        mouseSpeed: deviations.mouseSpeed,
        mouseDirectionChange: deviations.mouseDirectionChange
      }
    };
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