# SecureProctor - Privacy-First Online Exam Proctoring System

SecureProctor is a non-intrusive online exam proctoring system that uses behavioral analysis and machine learning to detect suspicious activity without requiring camera access.

## Project Structure
```
secure-proctor-frontend/
├── public/                      # Static files
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/             # React components
│   │   ├── auth/              # Authentication components
│   │   │   ├── Login.js
│   │   │   └── AuthContext.js
│   │   ├── exam/             # Exam related components
│   │   │   ├── ExamPage.js
│   │   │   └── QuestionNav.js
│   │   └── admin/            # Admin dashboard components
│   │       ├── Dashboard.js
│   │       └── ProctorAnalytics.js
│   ├── services/             # Service layer
│   │   └── proctoring/      # Proctoring services
│   │       ├── KeystrokeMonitor.js
│   │       ├── MouseTracker.js
│   │       └── WindowMonitor.js
│   ├── utils/               # Utility functions
│   │   ├── behaviorTracking.js
│   │   └── sampleExamData.js
│   ├── models/             # Data models
│   │   └── UserBehaviorModel.js
│   └── styles/            # CSS styles
│       ├── App.css
│       └── index.css
└── package.json
```

## Features

### Proctoring Capabilities
- Keystroke Analysis
  - Typing speed monitoring
  - Key hold time patterns
  - Backspace frequency
  - Copy-paste detection

- Mouse Movement Analysis
  - Movement patterns
  - Click frequency
  - Cursor position tracking
  - Drag events monitoring

- Window Activity Monitoring
  - Tab switching detection
  - Focus/blur events
  - Browser history tracking
  - Multiple window detection

### Risk Assessment
- Real-time risk scoring
- Adaptive interventions based on risk level
- Behavioral baseline establishment
- Anomaly detection

## Technology Stack
- React.js for frontend
- Material-UI for components
- Chart.js for analytics
- Browser APIs for behavior tracking

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/secure-proctor.git
```

2. Install dependencies:
```bash
cd secure-proctor
npm install
```

3. Start the development server:
```bash
npm start
```

## Test Credentials
- Admin: admin@test.com / admin123
- Student: student@test.com / student123

## License
MIT License
