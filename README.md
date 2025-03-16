# SecureProctor

SecureProctor is a privacy-preserving online assessment system that uses behavioral analysis and machine learning to maintain academic integrity without relying on invasive surveillance methods.

## Features

- **Privacy-First Approach**: No camera or video recording required
- **Real-time Risk Assessment**: Continuous monitoring of user behavior patterns
- **Smart Behavioral Analysis**: Tracks and analyzes:
  - Typing patterns
  - Mouse movements
  - Focus behaviors
  - Tab switching
  - Screen exits
- **Adaptive Learning**: System improves accuracy by learning from each exam session
- **Dashboard for Administrators**: Monitor active exam sessions and risk assessments

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
```sh
git clone https://github.com/yourusername/SecureProctor.git
cd SecureProctor
```

2. Install dependencies
```sh
npm install
```

3. Start the development server
```sh
npm start
```

The application will be available at `http://localhost:3000`

## Technology Stack

- React.js
- React Router DOM
- Chart.js
- Web Vitals
- Local Storage for data persistence

## Project Structure

```
SecureProctor/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── AdminDashboard.js
│   │   ├── BaselineProgress.js
│   │   ├── ExamPage.js
│   │   ├── Footer.js
│   │   ├── Header.js
│   │   ├── Home.js
│   │   ├── Login.js
│   │   └── RiskMeter.js
│   ├── models/
│   │   └── UserBehaviorModel.js
│   ├── utils/
│   │   ├── behaviorTracking.js
│   │   ├── reportWebVitals.js
│   │   └── sampleExamData.js
│   ├── styles/
│   │   ├── App.css
│   │   └── index.css
│   ├── App.js
│   └── index.js
└── package.json
```

## Key Components

### UserBehaviorModel

The core of the system that:
- Establishes behavioral baselines
- Detects anomalies in real-time
- Calculates risk scores based on multiple factors
- Adapts to user patterns over time

### RiskMeter

Visual component that:
- Displays current risk level
- Shows risk factor breakdowns
- Provides real-time feedback
- Alerts on suspicious behavior

### Behavior Tracking

Monitors various user interactions:
- Keystroke patterns
- Mouse movement analytics
- Tab focus events
- Screen exit patterns
- Typing burst detection

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Created as part of a hackathon project
- Inspired by the need for privacy-respecting online proctoring solutions
- Built with focus on user privacy and academic integrity.
