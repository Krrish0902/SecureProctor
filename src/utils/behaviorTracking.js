/**
 * Behavior Tracking Utilities
 * 
 * This module contains functions for tracking user behavior during exams,
 * including keystroke patterns, mouse movements, and tab focus.
 */

// Store for behavioral data
let behaviorData = {
  keystrokes: [],
  mouseMovements: [],
  mouseClicks: [],
  focusEvents: [],
  lastKeyTime: null,
  lastMousePosition: null,
  lastMouseTime: null,
  tabSwitchStartTime: null,
  currentBehaviorWindow: {
    keystrokes: [],
    mouseMovements: [],
    mouseClicks: [],
    focusEvents: [],
    tabSwitches: 0,
    timeAwayFromTab: 0,
    startTime: Date.now(),
    durationSeconds: 0,
    questions: [],
    questionsAnswered: 0
  }
};

/**
 * Initialize behavior tracking by setting up event listeners
 */
export const initBehaviorTracking = () => {
  // Reset data
  resetBehaviorData();
  
  // Set up event listeners
  setupKeystrokeTracking();
  setupMouseTracking();
  setupFocusTracking();
  
  // Start the behavior window timer
  startBehaviorWindowTimer();
  
  return () => {
    // Cleanup function to remove event listeners
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('click', handleMouseClick);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
};

/**
 * Reset behavior data to initial state
 */
export const resetBehaviorData = () => {
  behaviorData = {
    keystrokes: [],
    mouseMovements: [],
    mouseClicks: [],
    focusEvents: [],
    lastKeyTime: null,
    lastMousePosition: null,
    lastMouseTime: null,
    tabSwitchStartTime: null,
    currentBehaviorWindow: {
      keystrokes: [],
      mouseMovements: [],
      mouseClicks: [],
      focusEvents: [],
      tabSwitches: 0,
      timeAwayFromTab: 0,
      startTime: Date.now(),
      durationSeconds: 0,
      questions: [],
      questionsAnswered: 0
    }
  };
};

/**
 * Get the current behavior data
 */
export const getBehaviorData = () => {
  return behaviorData;
};

/**
 * Get the current behavior window
 */
export const getCurrentBehaviorWindow = () => {
  // Update the duration
  behaviorData.currentBehaviorWindow.durationSeconds = 
    (Date.now() - behaviorData.currentBehaviorWindow.startTime) / 1000;
  
  return behaviorData.currentBehaviorWindow;
};

/**
 * Start a new behavior window
 */
export const startNewBehaviorWindow = () => {
  // Store the old window if needed
  // ...
  
  // Reset the current window
  behaviorData.currentBehaviorWindow = {
    keystrokes: [],
    mouseMovements: [],
    mouseClicks: [],
    focusEvents: [],
    tabSwitches: 0,
    timeAwayFromTab: 0,
    startTime: Date.now(),
    durationSeconds: 0,
    questions: [],
    questionsAnswered: 0
  };
};

// Keystroke tracking
const handleKeyDown = (e) => {
  const currentTime = Date.now();
  const keyData = {
    key: e.key,
    keyCode: e.keyCode,
    downTime: currentTime,
    upTime: null,
    latency: behaviorData.lastKeyTime ? currentTime - behaviorData.lastKeyTime : null
  };
  
  behaviorData.keystrokes.push(keyData);
  behaviorData.lastKeyTime = currentTime;
  
  // Add to current window
  behaviorData.currentBehaviorWindow.keystrokes.push(keyData);
};

const handleKeyUp = (e) => {
  const currentTime = Date.now();
  
  // Find the matching keydown event and update it
  const matchingKeyEvent = behaviorData.keystrokes
    .filter(k => k.keyCode === e.keyCode && !k.upTime)
    .pop();
    
  if (matchingKeyEvent) {
    matchingKeyEvent.upTime = currentTime;
    matchingKeyEvent.pressDuration = matchingKeyEvent.upTime - matchingKeyEvent.downTime;
    
    // Update in current window
    const windowKeyEvent = behaviorData.currentBehaviorWindow.keystrokes
      .find(k => k.downTime === matchingKeyEvent.downTime && !k.upTime);
    
    if (windowKeyEvent) {
      windowKeyEvent.upTime = matchingKeyEvent.upTime;
      windowKeyEvent.pressDuration = matchingKeyEvent.pressDuration;
    }
  }
};

const setupKeystrokeTracking = () => {
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
};

// Mouse tracking
const handleMouseMove = (e) => {
  const currentTime = Date.now();
  
  // Don't track every pixel movement - sample at intervals
  if (behaviorData.lastMouseTime && currentTime - behaviorData.lastMouseTime < 50) {
    return;
  }
  
  const position = {
    x: e.clientX,
    y: e.clientY,
    time: currentTime
  };
  
  // Calculate speed if we have a previous position
  if (behaviorData.lastMousePosition) {
    const distance = calculateDistance(behaviorData.lastMousePosition, position);
    const timeDiff = currentTime - behaviorData.lastMousePosition.time;
    position.speed = distance / timeDiff;
    
    // Calculate direction change
    if (behaviorData.mouseMovements.length >= 2) {
      position.directionChange = calculateDirectionChange(
        behaviorData.mouseMovements[behaviorData.mouseMovements.length - 2],
        behaviorData.lastMousePosition,
        position
      );
    }
  }
  
  behaviorData.mouseMovements.push(position);
  behaviorData.lastMousePosition = position;
  behaviorData.lastMouseTime = currentTime;
  
  // Add to current window
  behaviorData.currentBehaviorWindow.mouseMovements.push(position);
  
  // Keep a reasonable history size
  if (behaviorData.mouseMovements.length > 100) {
    behaviorData.mouseMovements.shift();
  }
};

const handleMouseClick = (e) => {
  const clickData = {
    x: e.clientX,
    y: e.clientY,
    time: Date.now(),
    target: e.target.tagName,
    button: e.button
  };
  
  behaviorData.mouseClicks.push(clickData);
  behaviorData.currentBehaviorWindow.mouseClicks.push(clickData);
};

const setupMouseTracking = () => {
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('click', handleMouseClick);
};

// Focus tracking
const handleVisibilityChange = () => {
  const currentTime = Date.now();
  
  if (document.hidden) {
    // User left the tab - record the start time
    behaviorData.tabSwitchStartTime = currentTime;
    
    behaviorData.focusEvents.push({
      type: 'blur',
      timestamp: currentTime
    });
    
    behaviorData.currentBehaviorWindow.focusEvents.push({
      type: 'blur',
      timestamp: currentTime
    });
  } else if (behaviorData.tabSwitchStartTime !== null) {
    // User returned to tab - calculate the duration
    const timeAway = currentTime - behaviorData.tabSwitchStartTime;
    
    behaviorData.focusEvents.push({
      type: 'focus',
      timestamp: currentTime,
      duration: timeAway
    });
    
    behaviorData.currentBehaviorWindow.focusEvents.push({
      type: 'focus',
      timestamp: currentTime,
      duration: timeAway
    });
    
    // Add to current window
    behaviorData.currentBehaviorWindow.tabSwitches += 1;
    behaviorData.currentBehaviorWindow.timeAwayFromTab += timeAway;
    
    // Reset the start time
    behaviorData.tabSwitchStartTime = null;
  }
};

const setupFocusTracking = () => {
  document.addEventListener('visibilitychange', handleVisibilityChange);
};

// Helper functions
const calculateDistance = (point1, point2) => {
  return Math.sqrt(
    Math.pow(point2.x - point1.x, 2) + 
    Math.pow(point2.y - point1.y, 2)
  );
};

const calculateDirectionChange = (point1, point2, point3) => {
  // Calculate vectors
  const vector1 = {
    x: point2.x - point1.x,
    y: point2.y - point1.y
  };
  
  const vector2 = {
    x: point3.x - point2.x,
    y: point3.y - point2.y
  };
  
  // Calculate magnitudes
  const magnitude1 = Math.sqrt(vector1.x * vector1.x + vector1.y * vector1.y);
  const magnitude2 = Math.sqrt(vector2.x * vector2.x + vector2.y * vector2.y);
  
  // Avoid division by zero
  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0;
  }
  
  // Calculate dot product
  const dotProduct = vector1.x * vector2.x + vector1.y * vector2.y;
  
  // Calculate cosine of angle
  const cosine = dotProduct / (magnitude1 * magnitude2);
  
  // Convert to angle in degrees
  const angle = Math.acos(Math.min(Math.max(cosine, -1), 1)) * (180 / Math.PI);
  
  return angle;
};

// Behavior window timer
const startBehaviorWindowTimer = () => {
  // Update the window duration every second
  setInterval(() => {
    behaviorData.currentBehaviorWindow.durationSeconds = 
      (Date.now() - behaviorData.currentBehaviorWindow.startTime) / 1000;
  }, 1000);
};

// Question tracking
export const recordQuestionInteraction = (questionId, action, data = {}) => {
  const interaction = {
    questionId,
    action, // 'view', 'answer', 'change', etc.
    timestamp: Date.now(),
    ...data
  };
  
  // Find if the question is already in the current window
  const existingQuestion = behaviorData.currentBehaviorWindow.questions.find(
    q => q.id === questionId
  );
  
  if (existingQuestion) {
    existingQuestion.interactions.push(interaction);
    
    // Update answered status if this is an answer
    if (action === 'answer') {
      existingQuestion.answered = true;
      
      // If this is the first time answering, increment the count
      if (!existingQuestion.answeredAt) {
        behaviorData.currentBehaviorWindow.questionsAnswered += 1;
        existingQuestion.answeredAt = interaction.timestamp;
      }
    }
  } else {
    // Add new question to the window
    behaviorData.currentBehaviorWindow.questions.push({
      id: questionId,
      interactions: [interaction],
      answered: action === 'answer',
      answeredAt: action === 'answer' ? interaction.timestamp : null
    });
    
    // If this is an answer, increment the count
    if (action === 'answer') {
      behaviorData.currentBehaviorWindow.questionsAnswered += 1;
    }
  }
}; 