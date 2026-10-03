# FLEX Student Companion

A mobile-first React Native redesign of the university's FLEX student portal, built for *Software for Mobile Devices — Assignment 1*.

## 1. The Problem

FLEX, the existing student portal, presents attendance, marks, and course data as static numbers with no guidance. Students routinely find out they've fallen below the attendance threshold only after it's too late to recover, and have no way to know what score they actually need on upcoming exams to pass or get a good grade. There's also no lightweight way for students to leave feedback on a course while it's fresh in their mind.

**FLEX** addresses three concrete problems:

1. **Reactive, not proactive, attendance tracking** — students don't know they're at risk until it's a crisis.
2. **No visibility into what's needed to pass or excel** — grade calculation is manual and error-prone.
3. **No easy, in-context way to give course feedback.**

## 2. Key Features

| Feature | What it does |
|---|---|
| **Login with validation** | Roll-number format and password checks, Remember Me, Forgot Password |
| **Personalized Dashboard** | CGPA, overall attendance, two live charts (Bar: attendance by course, Line: marks performance), smart alert banner |
| **Course List** | Search by name/code/instructor, filter to low-attendance courses only, empty-state handling |
| **Smart Attendance Alerts** | Automatically flags any course below the 75% threshold, app-wide |
| **What-If Attendance Simulator** | Stepper lets a student simulate skipping upcoming classes and see the projected attendance % live, plus a "safe skip count" |
| **Weighted Grade Predictor** | Calculates absolute marks earned per component (Quiz, Assignment, Project, Mid 1, Mid 2, Final) against real university weightages, predicts a letter grade, and tells the student the average score needed on remaining components to get an A or to pass |
| **Course Feedback** | Students rate (1–5 stars) and comment on a course; average rating and review list update live; empty state when no feedback exists yet |
| **Course Details** | Full breakdown of attendance, marks, assessments, grade prediction, and feedback for a single course |

## 3. How It Addresses the Problem

- The **Attendance Simulator** and **Smart Alerts** turn a passive number into an actionable warning — a student can see *before* skipping a class whether it's safe to do so.
- The **Grade Predictor** replaces manual, error-prone arithmetic with a live, weighted calculation, and directly answers "what do I need to pass / get an A?"
- **Course Feedback** gives students a voice in the same screen where they already review their own performance, lowering the friction to actually leave feedback.

## 4. Technical Overview

### Stack
- React Native (Expo)
- `react-native-chart-kit` + `react-native-svg` for the dashboard charts
- No navigation library — screen switching is handled entirely through `useState` in `App.js`, as required by the assignment brief

### Project Structure
```
src/
  constants/
    data.js      → student, courses, and all calculation helper functions
    theme.js      → colors, spacing, typography, radius tokens
  components/
    CustomButton.js
    InputField.js
    ProgressBar.js
    Header.js
    CourseCard.js
    StarRating.js
  screens/
    LoginScreen.js
    DashboardScreen.js
    CoursesScreen.js
    AttendanceScreen.js
    CourseDetailsScreen.js
App.js            → holds current screen + courses in state; wires everything together
```

### React & JavaScript Concepts Demonstrated

- **State**: `useState` for screen navigation, form inputs, validation errors, and the `courses` array itself (lifted to `App.js` so changes — like a new feedback entry — propagate to every screen that reads it)
- **Props**: every screen receives data and callback functions (`onSelectCourse`, `onAddFeedback`, `onNavigateToCourses`, etc.) from `App.js`, rather than managing its own copy of shared data
- **Conditional rendering**: empty states (no search results, no feedback yet), warning banners vs. "all healthy" banners, show/hide password, loading spinners
- **Array methods**: `.map()` to render course cards, chart data, assessment rows, and feedback entries from data; `.filter()` for search and low-attendance filtering; `.reduce()` for totals (marks, average rating, absolute grade score)
- **Immutable state updates**: `courses` is never mutated directly — updates (like adding feedback) always produce a new array via `.map()`, which is the correct React pattern
- **Data-driven UI**: nothing is hand-duplicated; every list, chart, and card is generated from objects/arrays in `data.js`

### Data-Driven & Dynamic Behavior
Submitting course feedback is the clearest demonstration: the `feedback` array starts empty for most courses (showing a genuine empty state), and submitting a rating + comment appends a new entry to shared state in `App.js`. The average rating, review count, and review list all recalculate and re-render immediately, without navigating away or refreshing.

## 5. Setup & Run Instructions

```bash
# Install dependencies
npm install

# Install chart dependencies if not already present
npx expo install react-native-chart-kit react-native-svg

# Start the Expo development server
npx expo start

# To clear cache if you hit a stale bundler error
npx expo start -c
```

Scan the QR code with Expo Go (Android/iOS) or run on an emulator.

### Test Login Credentials
- **Roll Number:** `23I-3054` *(format: 2 digits + 1 letter + dash + 4 digits)*
- **Password:** any value 6+ characters, e.g. `test123`

## 6. Known Limitations

- Data resets on app reload — there is no backend or persistent storage, by design, since the assignment scope is React/JS concepts rather than a data layer.
- Attendance figures (`attendedClasses` / `totalClasses`) are static seed data; there is currently no UI action that increments attendance (this was intentionally descoped in favor of the Course Feedback and Grade Predictor features).

## 7. AI-Assisted Development

This project was built with AI assistance (Claude). See `AI_Usage_Report.pdf` for details on what was AI-generated, what was reviewed/modified, and the reasoning behind key design decisions.
