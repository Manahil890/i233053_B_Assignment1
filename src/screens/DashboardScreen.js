// src/screens/DashboardScreen.js

import React from "react";
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { BarChart, LineChart } from "react-native-chart-kit";
import { colors, spacing, radius, fontSize, fontWeight, getStatusColor } from "../constants/theme";
import Header from "../components/Header";
import ProgressBar from "../components/ProgressBar";
import {
  student,
  getOverallAttendance,
  getLowAttendanceCourses,
  getAttendancePercentage,
} from "../constants/data";

const screenWidth = Dimensions.get("window").width;

const chartConfig = {
  backgroundGradientFrom: colors.surface,
  backgroundGradientTo: colors.surface,
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(124, 58, 237, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
  propsForDots: { r: "4", strokeWidth: "2", stroke: colors.primary },
  barPercentage: 0.6,
};

const DashboardScreen = ({ courses, onNavigateToCourses, onNavigateToAttendance }) => {
  const overallAttendance = getOverallAttendance(courses);
  const lowAttendanceCourses = getLowAttendanceCourses(courses);

  // Data-driven chart data — generated from the courses array, not hardcoded
  const barChartData = {
    labels: courses.map((c) => c.code),
    datasets: [{ data: courses.map((c) => getAttendancePercentage(c)) }],
  };

  const lineChartData = {
    labels: courses.map((c) => c.code),
    datasets: [
      {
        data: courses.map((c) => Math.round((c.obtainedMarks / c.totalMarks) * 100)),
      },
    ],
  };

  return (
    <View style={styles.flex}>
      <Header
        title={`Hi, ${student.name.split(" ")[0]} 👋`}
        subtitle={`${student.rollNumber} • ${student.semester}`}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Summary cards */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>CGPA</Text>
            <Text style={styles.summaryValue}>{student.cgpa}</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Overall Attendance</Text>
            <Text
              style={[
                styles.summaryValue,
                { color: getStatusColor(overallAttendance) },
              ]}
            >
              {overallAttendance}%
            </Text>
          </View>
        </View>

        {/* Smart alert banner - only shows if there ARE low-attendance courses */}
        {lowAttendanceCourses.length > 0 && (
          <TouchableOpacity
            style={styles.alertBanner}
            onPress={onNavigateToAttendance}
            activeOpacity={0.8}
          >
            <Text style={styles.alertIcon}>⚠</Text>
            <View style={styles.alertTextWrapper}>
              <Text style={styles.alertTitle}>
                {lowAttendanceCourses.length} course
                {lowAttendanceCourses.length > 1 ? "s" : ""} need attention
              </Text>
              <Text style={styles.alertSubtitle}>
                {lowAttendanceCourses.map((c) => c.code).join(", ")} below threshold. Tap to view.
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Empty state variant - shown if attendance is healthy everywhere */}
        {lowAttendanceCourses.length === 0 && (
          <View style={styles.goodBanner}>
            <Text style={styles.goodIcon}>✓</Text>
            <Text style={styles.goodText}>All courses have healthy attendance</Text>
          </View>
        )}

        {/* Chart 1: Bar chart - Attendance per course */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Attendance by Course</Text>
          <BarChart
            data={barChartData}
            width={screenWidth - spacing.md * 2 - spacing.md * 2}
            height={200}
            fromZero
            yAxisSuffix="%"
            yAxisLabel=""
            chartConfig={chartConfig}
            style={styles.chartStyle}
            showValuesOnTopOfBars
          />
        </View>

        {/* Chart 2: Line chart - Marks trend per course */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Marks Performance (%)</Text>
          <LineChart
            data={lineChartData}
            width={screenWidth - spacing.md * 2 - spacing.md * 2}
            height={200}
            fromZero
            yAxisSuffix="%"
            yAxisLabel=""
            chartConfig={chartConfig}
            bezier
            style={styles.chartStyle}
          />
        </View>

        {/* Quick list of courses needing attention, driven from data */}
        {lowAttendanceCourses.length > 0 && (
          <View style={styles.warningSection}>
            <Text style={styles.sectionTitle}>Courses Needing Attention</Text>
            {lowAttendanceCourses.map((course) => (
              <View key={course.id} style={styles.warningCard}>
                <View style={styles.warningCardLeft}>
                  <Text style={styles.warningCardCode}>{course.code}</Text>
                  <Text style={styles.warningCardTitle}>{course.title}</Text>
                </View>
                <ProgressBar
                  percentage={getAttendancePercentage(course)}
                  showPercentageText
                  label={null}
                  height={8}
                />
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.viewCoursesButton} onPress={onNavigateToCourses}>
          <Text style={styles.viewCoursesText}>View All Courses →</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.md, paddingBottom: spacing.xxl },

  summaryRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  summaryValue: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },

  alertBanner: {
    flexDirection: "row",
    backgroundColor: colors.dangerLight,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    alignItems: "center",
  },
  alertIcon: { fontSize: fontSize.xl, marginRight: spacing.sm },
  alertTextWrapper: { flex: 1 },
  alertTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.danger,
  },
  alertSubtitle: {
    fontSize: fontSize.xs,
    color: colors.danger,
    marginTop: 2,
  },

  goodBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.successLight,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  goodIcon: {
    fontSize: fontSize.md,
    color: colors.success,
    fontWeight: fontWeight.bold,
    marginRight: spacing.sm,
  },
  goodText: {
    fontSize: fontSize.sm,
    color: colors.success,
    fontWeight: fontWeight.medium,
  },

  chartCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },
  chartTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    alignSelf: "flex-start",
    marginBottom: spacing.sm,
  },
  chartStyle: {
    borderRadius: radius.md,
  },

  warningSection: { marginBottom: spacing.md },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  warningCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  warningCardLeft: { marginBottom: spacing.xs },
  warningCardCode: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  warningCardTitle: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
  },

  viewCoursesButton: {
    alignItems: "center",
    paddingVertical: spacing.md,
  },
  viewCoursesText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
  },
});

export default DashboardScreen;