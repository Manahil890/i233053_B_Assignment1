// src/components/CourseCard.js

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors, spacing, radius, fontSize, fontWeight, getStatusColor } from "../constants/theme";
import ProgressBar from "./ProgressBar";
import { ATTENDANCE_THRESHOLD, getAttendancePercentage } from "../constants/data";

const CourseCard = ({ course, onPress }) => {
  const attendancePercentage = getAttendancePercentage(course);
  const isLowAttendance = attendancePercentage < ATTENDANCE_THRESHOLD;
  const marksPercentage = Math.round((course.obtainedMarks / course.totalMarks) * 100);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(course)}
      activeOpacity={0.8}
    >
      <View style={styles.topRow}>
        <View style={styles.codeBox}>
          <Text style={styles.codeText}>{course.code}</Text>
        </View>

        {isLowAttendance && (
          <View style={styles.warningBadge}>
            <Text style={styles.warningBadgeText}>⚠ Low Attendance</Text>
          </View>
        )}
      </View>

      <Text style={styles.title} numberOfLines={1}>
        {course.title}
      </Text>
      <Text style={styles.instructor}>{course.instructor}</Text>

      <View style={styles.metricsRow}>
        <View style={styles.metric}>
          <ProgressBar
            percentage={attendancePercentage}
            label="Attendance"
            height={8}
          />
        </View>
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.creditText}>{course.creditHours} Credit Hours</Text>
        <Text style={[styles.marksText, { color: getStatusColor(marksPercentage) }]}>
          Marks: {course.obtainedMarks}/{course.totalMarks}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  codeBox: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  codeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  warningBadge: {
    backgroundColor: colors.dangerLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  warningBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.danger,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  instructor: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  metricsRow: {
    marginBottom: spacing.sm,
  },
  metric: {
    width: "100%",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  creditText: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  marksText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
});

export default CourseCard;