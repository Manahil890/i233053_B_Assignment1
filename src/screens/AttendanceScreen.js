// src/screens/AttendanceScreen.js

import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { colors, spacing, radius, fontSize, fontWeight, getStatusColor } from "../constants/theme";
import Header from "../components/Header";
import ProgressBar from "../components/ProgressBar";
import {
  ATTENDANCE_THRESHOLD,
  getOverallAttendance,
  getLowAttendanceCourses,
  getAttendancePercentage,
} from "../constants/data";

const AttendanceScreen = ({ courses, onBack }) => {
  const overallAttendance = getOverallAttendance(courses);
  const lowAttendanceCourses = getLowAttendanceCourses(courses);
  const hasWarnings = lowAttendanceCourses.length > 0;

  const getClassesNeededMessage = (attendancePercentage) => {
    const deficit = ATTENDANCE_THRESHOLD - attendancePercentage;
    if (deficit <= 0) return null;
    return `${deficit}% below threshold — attend upcoming classes consistently`;
  };

  return (
    <View style={styles.flex}>
      <Header
        title="Attendance"
        subtitle={`Threshold: ${ATTENDANCE_THRESHOLD}% minimum`}
        onBackPress={onBack}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Overall summary card */}
        <View style={styles.overallCard}>
          <Text style={styles.overallLabel}>Overall Attendance</Text>
          <Text
            style={[styles.overallValue, { color: getStatusColor(overallAttendance) }]}
          >
            {overallAttendance}%
          </Text>
          <ProgressBar percentage={overallAttendance} showPercentageText={false} height={10} />
        </View>

        {/* Smart Attendance Alerts section - conditional based on data */}
        {hasWarnings ? (
          <View style={styles.alertsSection}>
            <Text style={styles.sectionTitle}>
              Smart Attendance Alerts ({lowAttendanceCourses.length})
            </Text>
            {lowAttendanceCourses.map((course) => {
              const percentage = getAttendancePercentage(course);
              return (
                <View key={course.id} style={styles.alertCard}>
                  <View style={styles.alertHeader}>
                    <Text style={styles.alertIcon}>⚠</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.alertCourseCode}>{course.code}</Text>
                      <Text style={styles.alertCourseTitle}>{course.title}</Text>
                    </View>
                    <Text style={styles.alertPercentage}>{percentage}%</Text>
                  </View>
                  <Text style={styles.alertMessage}>
                    {getClassesNeededMessage(percentage)}
                  </Text>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.noWarningsCard}>
            <Text style={styles.noWarningsIcon}>✓</Text>
            <Text style={styles.noWarningsText}>
              Great job! All your courses are above the attendance threshold.
            </Text>
          </View>
        )}

        {/* Full course-wise breakdown */}
        <View style={styles.breakdownSection}>
          <Text style={styles.sectionTitle}>Course-wise Breakdown</Text>
          {courses.map((course) => {
            const percentage = getAttendancePercentage(course);
            return (
              <View key={course.id} style={styles.breakdownCard}>
                <View style={styles.breakdownTopRow}>
                  <View>
                    <Text style={styles.breakdownCode}>{course.code}</Text>
                    <Text style={styles.breakdownTitle}>{course.title}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: getStatusColor(percentage) },
                    ]}
                  />
                </View>
                <ProgressBar percentage={percentage} label={null} height={8} />
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.md, paddingBottom: spacing.xxl },

  overallCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },
  overallLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  overallValue: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.sm,
  },

  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },

  alertsSection: { marginBottom: spacing.md },
  alertCard: {
    backgroundColor: colors.dangerLight,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  alertHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  alertIcon: {
    fontSize: fontSize.lg,
    marginRight: spacing.sm,
  },
  alertCourseCode: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.danger,
  },
  alertCourseTitle: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    fontWeight: fontWeight.medium,
  },
  alertPercentage: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.danger,
  },
  alertMessage: {
    fontSize: fontSize.xs,
    color: colors.danger,
  },

  noWarningsCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.successLight,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  noWarningsIcon: {
    fontSize: fontSize.lg,
    color: colors.success,
    marginRight: spacing.sm,
    fontWeight: fontWeight.bold,
  },
  noWarningsText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.success,
    fontWeight: fontWeight.medium,
  },

  breakdownSection: { marginBottom: spacing.md },
  breakdownCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  breakdownTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.sm,
  },
  breakdownCode: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  breakdownTitle: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    fontWeight: fontWeight.medium,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: radius.full,
    marginTop: 4,
  },
});

export default AttendanceScreen;