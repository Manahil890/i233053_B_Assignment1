// App.js

import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet } from "react-native";

import LoginScreen from "./src/screens/LoginScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import CoursesScreen from "./src/screens/CoursesScreen";
import AttendanceScreen from "./src/screens/AttendanceScreen";
import CourseDetailsScreen from "./src/screens/CourseDetailsScreen";
import { colors } from "./src/constants/theme";
import { courses as initialCourses } from "./src/constants/data";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("login");
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  // courses now lives in App state, not just imported statically -
  // this is what lets "Mark Attendance" changes propagate to every screen
  const [courses, setCourses] = useState(initialCourses);

  // Always look up the fresh course object from state by id,
  // so CourseDetailsScreen re-renders with updated numbers after marking attendance
  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || null;

  const handleLoginSuccess = () => {
    setCurrentScreen("dashboard");
  };

  const handleNavigateToCourses = () => {
    setCurrentScreen("courses");
  };

  const handleNavigateToAttendance = () => {
    setCurrentScreen("attendance");
  };

  const handleSelectCourse = (course) => {
    setSelectedCourseId(course.id);
    setCurrentScreen("courseDetails");
  };

  const handleBackToDashboard = () => {
    setSelectedCourseId(null);
    setCurrentScreen("dashboard");
  };

  const handleBackToCourses = () => {
    setSelectedCourseId(null);
    setCurrentScreen("courses");
  };

    // Adds a new feedback entry to a course. Same immutable-update pattern
  // as attendance marking used earlier - find the course, return a new array
  // with only that course changed.
  const handleAddFeedback = (courseId, rating, comment) => {
    const newFeedback = {
      id: `f${Date.now()}`, // simple unique id based on timestamp
      rating,
      comment,
      date: new Date().toISOString().split("T")[0],
    };

    setCourses((prevCourses) =>
      prevCourses.map((course) => {
        if (course.id !== courseId) return course;
        return {
          ...course,
          feedback: [...course.feedback, newFeedback],
        };
      })
    );
  };


  const renderScreen = () => {
    switch (currentScreen) {
      case "login":
        return <LoginScreen onLoginSuccess={handleLoginSuccess} />;

      case "dashboard":
        return (
          <DashboardScreen
            courses={courses}
            onNavigateToCourses={handleNavigateToCourses}
            onNavigateToAttendance={handleNavigateToAttendance}
          />
        );

      case "courses":
        return (
          <CoursesScreen
            courses={courses}
            onSelectCourse={handleSelectCourse}
            onBack={handleBackToDashboard}
          />
        );

      case "attendance":
        return <AttendanceScreen courses={courses} onBack={handleBackToDashboard} />;

                  case "courseDetails":
        return (
          <CourseDetailsScreen
            course={selectedCourse}
            onBack={handleBackToCourses}
            onAddFeedback={handleAddFeedback}
          />
        );

      default:
        return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      {renderScreen()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});