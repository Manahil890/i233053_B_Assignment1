// src/screens/CoursesScreen.js

import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { colors, spacing, radius, fontSize, fontWeight } from "../constants/theme";
import Header from "../components/Header";
import CourseCard from "../components/CourseCard";
import { ATTENDANCE_THRESHOLD, getAttendancePercentage } from "../constants/data";

const CoursesScreen = ({ courses, onSelectCourse, onBack }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showLowAttendanceOnly, setShowLowAttendanceOnly] = useState(false);

  // Filtering pipeline: search text first, then the low-attendance toggle
  const filteredCourses = courses
    .filter((course) => {
      const query = searchQuery.trim().toLowerCase();
      if (!query) return true;
      return (
        course.title.toLowerCase().includes(query) ||
        course.code.toLowerCase().includes(query) ||
        course.instructor.toLowerCase().includes(query)
      );
    })
    .filter((course) => {
      if (!showLowAttendanceOnly) return true;
      return getAttendancePercentage(course) < ATTENDANCE_THRESHOLD;
    });

  const isEmpty = filteredCourses.length === 0;

  return (
    <View style={styles.flex}>
      <Header
        title="My Courses"
        subtitle={`${courses.length} enrolled this semester`}
        onBackPress={onBack}
      />

      <View style={styles.controlsSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by course, code, or instructor"
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <TouchableOpacity
          style={[styles.filterChip, showLowAttendanceOnly && styles.filterChipActive]}
          onPress={() => setShowLowAttendanceOnly((prev) => !prev)}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.filterChipText,
              showLowAttendanceOnly && styles.filterChipTextActive,
            ]}
          >
            ⚠ Low Attendance Only
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {isEmpty ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No courses found</Text>
            <Text style={styles.emptySubtitle}>
              {showLowAttendanceOnly
                ? "No courses are currently below the attendance threshold."
                : "Try a different search term."}
            </Text>
          </View>
        ) : (
          filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} onPress={onSelectCourse} />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },

  controlsSection: {
    padding: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
  },
  searchInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  filterChip: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  filterChipActive: {
    backgroundColor: colors.dangerLight,
    borderColor: colors.danger,
  },
  filterChipText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
  },
  filterChipTextActive: {
    color: colors.danger,
    fontWeight: fontWeight.semibold,
  },

  scrollContent: {
    padding: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xxl,
  },

  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxl,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: spacing.sm,
  },
  emptyTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: spacing.lg,
  },
});

export default CoursesScreen;