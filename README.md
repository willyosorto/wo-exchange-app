# WO Exchange App - QA Portfolio

> A comprehensive testing portfolio showcasing SDET and QA automation expertise

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://wo-exchange-app.netlify.app/)
[![PWA](https://img.shields.io/badge/PWA-Ready-blue)](https://wo-exchange-app.netlify.app/)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-orange)](https://github.com/willyosorto/wo-exchange-app/actions)

## 🎯 About This Project

This repository demonstrates my **Software Development Engineer in Test (SDET)** skills and comprehensive QA experience, including both **manual and automated testing**. As a **Web Developer** with strong QA expertise, I developed this currency exchange application from scratch and implemented a complete testing strategy covering all quality aspects.

**Live Application**: [https://wo-exchange-app.netlify.app/](https://wo-exchange-app.netlify.app/)

The application is a **Progressive Web App (PWA)** that can be installed and used on mobile devices like a native app, providing offline support and a seamless user experience.

---

## 📱 About the Application

A modern, responsive currency exchange application built with React, TypeScript, and Vite. Features include:

- **Real-time currency conversion** using Exchange Rate API
- **Currency calculator** for quick calculations
- **PWA functionality** - Install on mobile devices
- **Offline support** with service workers
- **Responsive design** - Works on desktop and mobile
- **Exchange rate caching** for improved performance
- **Copy to clipboard** functionality
- **Currency swap** feature

### Technologies Used

**Frontend Stack:**
- React 18 with TypeScript
- Vite for fast development and builds
- Tailwind CSS for styling
- Radix UI for accessible components
- Axios for API requests
- PWA with Workbox for offline support

**Testing Stack:**
- Vitest for unit testing
- Cypress for E2E testing
- Playwright for cross-browser testing
- Pact for contract testing
- K6 for performance testing
- GitHub Actions for CI/CD

---

## 🧪 Testing Strategy

This project showcases a **complete testing pyramid** with multiple testing types and tools, demonstrating proficiency in modern QA practices.

### Testing Types Implemented

| Test Type | Tool | Coverage | Purpose |
|-----------|------|----------|---------|
| **Unit Tests** | Vitest + React Testing Library | 97%+ components | Validate individual components in isolation |
| **E2E Tests** | Cypress | Full user flows | Test complete user journeys with real API |
| **Cross-Browser E2E** | Playwright | Desktop + Mobile | Ensure compatibility across browsers and devices |
| **Contract Tests** | Pact | 7 interactions | Validate API contracts between consumer/provider |
| **Performance Tests** | K6 | Load + Browser | Measure performance and identify bottlenecks |
| **API Tests** | Cypress + Playwright | All endpoints | Validate API responses and error handling |

### Test Coverage Summary

```
Overall Coverage: 56.64%
Components:       97.36% ⭐
API Layer:        39.39%
```

---

## 🎓 QA Skills Demonstrated

### Test Automation
- ✅ **Component Testing**: Vitest with React Testing Library
- ✅ **E2E Automation**: Cypress and Playwright for comprehensive coverage
- ✅ **API Testing**: REST API validation with multiple tools
- ✅ **Contract Testing**: Consumer-driven contracts with Pact
- ✅ **Performance Testing**: Load testing with K6 and browser metrics
- ✅ **Mobile Testing**: Responsive testing on mobile viewports

### CI/CD & DevOps
- ✅ **GitHub Actions**: 5 automated workflows for different test types
- ✅ **Docker**: Container orchestration for Pact stub server
- ✅ **Test Reports**: HTML, JSON, and JUnit formats
- ✅ **Artifact Management**: Screenshots, videos, coverage reports
- ✅ **Parallel Execution**: Optimized test runs
- ✅ **Caching Strategy**: Node modules and Playwright browsers

### Test Design & Strategy
- ✅ **Test Pyramid**: Proper balance of unit, integration, and E2E tests
- ✅ **Page Object Model**: Reusable, maintainable page classes for Cypress and Playwright
- ✅ **Viewport-Aware POM**: Page objects resolve mobile/desktop nav selectors automatically
- ✅ **Error Handling**: Comprehensive edge case coverage
- ✅ **Mock Strategies**: API mocking to avoid external dependencies

### Tools & Frameworks
- ✅ **Test Frameworks**: Vitest, Jest, Cypress, Playwright
- ✅ **Assertion Libraries**: Chai, Jest matchers, Playwright assertions
- ✅ **Reporting**: Mochawesome, HTML reports, JUnit XML
- ✅ **Version Control**: Git with conventional commits
- ✅ **Package Management**: Yarn workspaces

### Manual Testing Skills
- ✅ **Exploratory Testing**: Comprehensive manual testing coverage
- ✅ **Test Case Design**: Documented test scenarios
- ✅ **Bug Reporting**: Detailed issue documentation
- ✅ **Regression Testing**: Systematic validation of changes
- ✅ **User Acceptance Testing**: Real-world usage scenarios
- ✅ **Cross-Browser Testing**: Manual verification across browsers

---

## 🚀 Quick Start

### Prerequisites
- Node.js 22+
- Yarn 1.22+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/willyosorto/wo-exchange-app.git

# Navigate to project directory
cd wo-exchange-app

# Install dependencies
yarn install

# Create environment file
cp .env.example .env

# Add your Exchange Rate API key to .env
# Get a free key at: https://www.exchangerate-api.com/
```

### Running the Application

```bash
# Start development server
yarn dev

# Open http://localhost:3000
```

---

## 🧪 Running Tests

### Unit Tests
```bash
# Run all unit tests
yarn test

# Run with coverage
yarn test:coverage

# Run with UI
yarn test:ui
```

### Cypress E2E Tests
```bash
# Run all Cypress tests
yarn test:e2e:cypress:run

# Open Cypress UI
yarn test:e2e:cypress:open
```

### Playwright E2E Tests
```bash
# Run all Playwright tests
yarn test:e2e:playwright:run

# Run in UI mode
yarn test:e2e:playwright:ui

# View report
yarn test:e2e:playwright:report
```

### Contract Tests
```bash
# Generate Pact contracts
yarn test:contract:pact

# Validate contracts with Playwright
# (Requires Docker for Pact stub server)
docker compose -f docker-compose.pact-stub.yml up -d
yarn test:contract:validation
```

### Performance Tests
```bash
# Start mock API server
yarn test:k6:mock-server

# In another terminal, start app in mock mode
yarn dev:mock

# Run K6 tests
yarn test:k6:api          # API load tests
yarn test:k6:browser      # Browser performance tests (local only)
```

---

## 📊 CI/CD Pipeline

All tests run automatically in GitHub Actions on every push and pull request:

### Workflows

1. **Cypress E2E Tests** (`.github/workflows/cypress.yml`)
   - Runs on Node.js 22
   - Tests against real API
   - Publishes test results
   - Uploads screenshots and videos

2. **Playwright E2E Tests** (`.github/workflows/playwright.yml`)
   - Desktop and mobile viewports
   - Chromium browser
   - Cross-browser compatibility

3. **Unit Tests** (`.github/workflows/unit-tests.yml`)
   - Component testing with coverage
   - Coverage reports as artifacts
   - 97%+ component coverage

4. **Contract Tests** (`.github/workflows/contract-tests.yml`)
   - Generates Pact contracts
   - Validates with Docker stub server
   - Sequential job execution

5. **K6 Performance Tests** (`.github/workflows/k6-tests.yml`)
   - API load testing
   - Mock server to avoid stressing external API
   - JSON reports as artifacts

### CI Features
- ✅ Parallel test execution where possible
- ✅ Test result publishing to PRs
- ✅ Artifact retention (screenshots, videos, reports)
- ✅ Automatic cleanup (videos deleted on pass)
- ✅ Docker integration for contract testing
- ✅ Skip CI option with `[skip ci]` in commits

---

## 📁 Project Structure

```
wo-exchange-app/
├── src/                      # Application source code
│   ├── api/                  # API integration
│   ├── components/           # React components
│   ├── context/              # React context
│   └── styles/               # Global styles
├── tests/                    # All test files
│   ├── cypress/              # Cypress E2E tests
│   ├── playwright/           # Playwright E2E tests
│   ├── unit/                 # Unit tests
│   ├── contract/             # Pact contract tests
│   └── k6/                   # K6 performance tests
├── .github/workflows/        # CI/CD pipelines
└── public/                   # Static assets
```

### Test Documentation

Each test directory includes detailed README with:
- Test coverage details
- Running instructions
- Configuration guide
- Best practices
- CI/CD integration

**Read More:**
- [Unit Tests README](tests/unit/README.md)
- [Cypress Tests README](tests/cypress/README.md)
- [Playwright Tests README](tests/playwright/README.md)
- [Contract Tests README](tests/contract/README.md)
- [K6 Tests README](tests/k6/README.md)

---

## 🎯 Key Features

### Why This Portfolio Stands Out

1. **Full-Stack Testing**: Demonstrates expertise across all testing levels
2. **Real-World Application**: Production-ready PWA with actual deployment
3. **CI/CD Excellence**: Complete automation with GitHub Actions
4. **Modern Tools**: Latest testing frameworks and best practices
5. **Comprehensive Coverage**: 97%+ component coverage
6. **Cross-Browser**: Desktop and mobile testing
7. **Performance Focus**: K6 performance testing included
8. **Contract Testing**: Advanced API contract validation
9. **Clean Code**: TypeScript, ESLint, well-documented
10. **DevOps Skills**: Docker, CI/CD, artifact management
11. **Page Object Model**: Both Cypress and Playwright test suites use POM for clean, maintainable specs — with viewport-aware page classes that handle mobile/desktop navigation automatically

### Testing Metrics

- **47 Unit Tests** - Fast, isolated component validation
- **Multiple E2E Suites** - Comprehensive user flow coverage
- **7 Contract Interactions** - API compatibility validation
- **Performance Benchmarks** - Load and browser metrics
- **5 CI/CD Workflows** - Automated quality gates
- **97%+ Component Coverage** - High code quality

---

## 👨‍💻 About Me

**Willy Osorto** - SDET | QA Engineer | Web Developer

I'm a quality-focused engineer with expertise in both **manual and automated testing**, combined with **full-stack web development** skills. This project showcases my ability to:

- Build production-ready applications from scratch
- Implement comprehensive testing strategies
- Set up CI/CD pipelines
- Work with modern testing frameworks
- Write clean, maintainable code
- Apply DevOps best practices

**Professional Skills:**
- ✅ Manual Testing & Test Case Design
- ✅ Test Automation (Cypress, Playwright, Selenium, Detox, Appium, WebDriverIO, Espresso, Kotlin, TestCafe)
- ✅ API Testing (Postman, REST Assured)
- ✅ Performance Testing (K6, JMeter)
- ✅ CI/CD (GitHub Actions, Jenkins, GitLab CI/CD, Azure DevOps)
- ✅ Web Development (React, TypeScript, Node.js)
- ✅ Mobile Development (React Native, Expo,  TypeScript)
- ✅ Agile/Scrum Methodologies
- ✅ Bug Tracking (Jira, GitHub Issues, Azure DevOps)
- ✅ Test Management Tools (TestRail, Testmo, Testiny)

---

## 📫 Contact

- **Email**: [willy@wodevs.com](mailto:willy@wodevs.com)
- **LinkedIn**: [linkedin.com/in/willy-osorto](https://linkedin.com/in/willy-osorto)

---

## 📄 License

This project is part of my professional portfolio and is available for review by potential employers and collaborators.

---

## 🙏 Acknowledgments

- Exchange Rate API for providing free currency conversion data
- Open source testing frameworks that make quality engineering accessible
- The QA and developer communities for continuous learning resources

---

**Built with ❤️ by Willy Osorto** | *Showcasing SDET & QA Excellence*
