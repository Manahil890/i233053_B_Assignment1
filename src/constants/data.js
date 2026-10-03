// src/constants/data.js

export const student = {
  name: "Ahmed Raza",
  rollNumber: "FA22-BCS-045",
  program: "BS Computer Science",
  semester: "5th Semester",
  cgpa: 3.42,
  avatarInitials: "AR",
};

export const courses = [
  {
    id: "c1",
    code: "CS301",
    title: "Software for Mobile Devices",
    instructor: "Dr. Ayesha Khan",
    creditHours: 3,
    attendedClasses: 23,
    totalClasses: 28,
    obtainedMarks: 78,
    totalMarks: 100,
    assessments: [
      { id: "a1", name: "Quiz 1", obtained: 8, total: 10 },
      { id: "a2", name: "Assignment 1", obtained: 18, total: 20 },
      { id: "a3", name: "Midterm", obtained: 22, total: 30 },
    ],
    // Raw marks per grading component - used for absolute/grade calculation
    gradeComponents: {
      quiz: { obtained: 8, total: 10 },
      assignment: { obtained: 36, total: 40 },
      project: { obtained: 26, total: 30 },
      mid1: { obtained: 24, total: 30 },
      mid2: { obtained: 0, total: 0 },   // not held yet
      final: { obtained: 0, total: 0 },  // not held yet
    },
        feedback: [
      { id: "f1", rating: 4, comment: "Great practical examples, but pace is a bit fast.", date: "2026-09-10" },
    ],
  },
  {
    id: "c2",
    code: "CS305",
    title: "Database Systems",
    instructor: "Mr. Bilal Ahmed",
    creditHours: 4,
    attendedClasses: 19,
    totalClasses: 28,
    obtainedMarks: 61,
    totalMarks: 100,
    assessments: [
      { id: "a1", name: "Quiz 1", obtained: 6, total: 10 },
      { id: "a2", name: "Assignment 1", obtained: 15, total: 20 },
      { id: "a3", name: "Midterm", obtained: 20, total: 30 },
    ],
    gradeComponents: {
      quiz: { obtained: 5, total: 10 },
      assignment: { obtained: 28, total: 40 },
      project: { obtained: 18, total: 30 },
      mid1: { obtained: 16, total: 30 },
      mid2: { obtained: 0, total: 0 },
      final: { obtained: 0, total: 0 },
    },
        feedback: [
      { id: "f1", rating: 4, comment: "Great practical examples, but pace is a bit fast.", date: "2026-09-10" },
    ],
  },
  {
    id: "c3",
    code: "CS310",
    title: "Computer Networks",
    instructor: "Dr. Sana Malik",
    creditHours: 3,
    attendedClasses: 26,
    totalClasses: 28,
    obtainedMarks: 85,
    totalMarks: 100,
    assessments: [
      { id: "a1", name: "Quiz 1", obtained: 9, total: 10 },
      { id: "a2", name: "Assignment 1", obtained: 19, total: 20 },
      { id: "a3", name: "Midterm", obtained: 27, total: 30 },
    ],
    // Fully completed course - demonstrates the "final grade already determined" state
    gradeComponents: {
      quiz: { obtained: 9, total: 10 },
      assignment: { obtained: 38, total: 40 },
      project: { obtained: 28, total: 30 },
      mid1: { obtained: 28, total: 30 },
      mid2: { obtained: 28, total: 30 },
      final: { obtained: 36, total: 40 },
    },
        feedback: [
      { id: "f1", rating: 4, comment: "Great practical examples, but pace is a bit fast.", date: "2026-09-10" },
    ],
  },
  {
    id: "c4",
    code: "MG201",
    title: "Entrepreneurship",
    instructor: "Ms. Hira Yousaf",
    creditHours: 2,
    attendedClasses: 20,
    totalClasses: 28,
    obtainedMarks: 70,
    totalMarks: 100,
    assessments: [
      { id: "a1", name: "Quiz 1", obtained: 7, total: 10 },
      { id: "a2", name: "Assignment 1", obtained: 16, total: 20 },
      { id: "a3", name: "Midterm", obtained: 21, total: 30 },
    ],
    gradeComponents: {
      quiz: { obtained: 7, total: 10 },
      assignment: { obtained: 32, total: 40 },
      project: { obtained: 21, total: 30 },
      mid1: { obtained: 20, total: 30 },
      mid2: { obtained: 0, total: 0 },
      final: { obtained: 0, total: 0 },
    },
  },
];

export const ATTENDANCE_THRESHOLD = 75;

// ---- Attendance helpers (unchanged) ----

export const getAttendancePercentage = (course) => {
  if (!course || course.totalClasses === 0) return 0;
  return Math.round((course.attendedClasses / course.totalClasses) * 100);
};

export const getOverallAttendance = (courseList) => {
  if (!courseList || courseList.length === 0) return 0;
  const total = courseList.reduce((sum, c) => sum + getAttendancePercentage(c), 0);
  return Math.round(total / courseList.length);
};

export const getLowAttendanceCourses = (courseList, threshold = ATTENDANCE_THRESHOLD) => {
  return courseList.filter((c) => getAttendancePercentage(c) < threshold);
};

export const simulateAttendance = (course, futureClasses, attendedOfFuture) => {
  const projectedTotal = course.totalClasses + futureClasses;
  const projectedAttended = course.attendedClasses + attendedOfFuture;
  if (projectedTotal === 0) return 0;
  return Math.round((projectedAttended / projectedTotal) * 100);
};

export const getSafeSkipCount = (course, threshold = ATTENDANCE_THRESHOLD) => {
  let skips = 0;
  while (skips < 50) {
    const projected = simulateAttendance(course, skips + 1, 0);
    if (projected < threshold) break;
    skips++;
  }
  return skips;
};

// ---- Grade calculation (NEW) ----

// Absolute weightage of each component out of 100 total
export const GRADE_WEIGHTAGES = {
  quiz: 5,
  assignment: 10,
  project: 15,
  mid1: 20,
  mid2: 20,
  final: 30,
};

// Human-readable labels for each component key
export const COMPONENT_LABELS = {
  quiz: "Quiz",
  assignment: "Assignment",
  project: "Project",
  mid1: "Mid 1",
  mid2: "Mid 2",
  final: "Final Exam",
};

// Grade bands, checked top to bottom (highest first)
export const GRADE_BANDS = [
  { grade: "A", min: 85 },
  { grade: "A-", min: 80 },
  { grade: "B+", min: 75 },
  { grade: "B", min: 71 },
  { grade: "B-", min: 68 },
  { grade: "C+", min: 64 },
  { grade: "C", min: 61 },
  { grade: "C-", min: 58 },
  { grade: "D+", min: 54 },
  { grade: "D", min: 50 },
  { grade: "F", min: 0 },
];

export const A_GRADE_THRESHOLD = 85;
export const PASSING_THRESHOLD = 50;

// Percentage for a single component, or null if not held yet (total === 0)
export const getComponentPercentage = (component) => {
  if (!component || component.total === 0) return null;
  return (component.obtained / component.total) * 100;
};

// Absolute marks earned for ONE component, out of its own weightage
// e.g. Quiz weightage = 5, student got 70% in quiz -> earns 3.5 absolutes
export const getComponentAbsolute = (component, weightage) => {
  const pct = getComponentPercentage(component);
  if (pct === null) return null;
  return Math.round((weightage * pct) / 100 * 10) / 10;
};

// Absolute score accumulated so far, out of 100 (only counts completed components)
export const getAbsoluteScore = (course) => {
  let score = 0;
  Object.keys(GRADE_WEIGHTAGES).forEach((key) => {
    const pct = getComponentPercentage(course.gradeComponents[key]);
    if (pct !== null) {
      score += (GRADE_WEIGHTAGES[key] * pct) / 100;
    }
  });
  return Math.round(score * 10) / 10;
};

// Total weight of components not yet held
export const getRemainingWeight = (course) => {
  let remaining = 0;
  Object.keys(GRADE_WEIGHTAGES).forEach((key) => {
    const component = course.gradeComponents[key];
    if (!component || component.total === 0) {
      remaining += GRADE_WEIGHTAGES[key];
    }
  });
  return remaining;
};

// Names of components not yet held, e.g. ["Mid 2", "Final Exam"]
export const getRemainingComponentNames = (course) => {
  return Object.keys(GRADE_WEIGHTAGES)
    .filter((key) => {
      const component = course.gradeComponents[key];
      return !component || component.total === 0;
    })
    .map((key) => COMPONENT_LABELS[key]);
};

// Converts an absolute score (0-100) into a letter grade
export const predictLetterGrade = (absoluteScore) => {
  for (const band of GRADE_BANDS) {
    if (absoluteScore >= band.min) return band.grade;
  }
  return "F";
};

// What average % is needed on the REMAINING components to hit a target score.
// Returns: a number (0-100), "achieved" (already there / course finished and passed),
// or "not-achievable" (impossible even with 100% on everything remaining)
export const getRequiredPercentageForTarget = (course, targetScore) => {
  const completedScore = getAbsoluteScore(course);
  const remainingWeight = getRemainingWeight(course);

  if (remainingWeight === 0) {
    return completedScore >= targetScore ? "achieved" : "not-achievable";
  }

  const needed = ((targetScore - completedScore) / remainingWeight) * 100;

  if (needed <= 0) return "achieved"; // already secured even with 0 on the rest
  if (needed > 100) return "not-achievable";
  return Math.round(needed * 10) / 10;
};
// ---- Feedback helpers (NEW) ----

// Average rating for a course, rounded to 1 decimal. Returns null if no feedback yet.
export const getAverageRating = (course) => {
  if (!course.feedback || course.feedback.length === 0) return null;
  const total = course.feedback.reduce((sum, f) => sum + f.rating, 0);
  return Math.round((total / course.feedback.length) * 10) / 10;
};

export const getFeedbackCount = (course) => {
  return course.feedback ? course.feedback.length : 0;
};