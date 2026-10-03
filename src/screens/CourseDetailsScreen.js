// src/screens/CourseDetailsScreen.js

import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native";
import { colors, spacing, radius, fontSize, fontWeight, getStatusColor } from "../constants/theme";
import Header from "../components/Header";
import ProgressBar from "../components/ProgressBar";
import StarRating from "../components/StarRating";
import {
  ATTENDANCE_THRESHOLD,
  getAttendancePercentage,
  simulateAttendance,
  getSafeSkipCount,
  GRADE_WEIGHTAGES,
  COMPONENT_LABELS,
  getComponentPercentage,
  getComponentAbsolute,
  getAbsoluteScore,
  getRemainingWeight,
  getRemainingComponentNames,
  predictLetterGrade,
  getRequiredPercentageForTarget,
  A_GRADE_THRESHOLD,
  PASSING_THRESHOLD,
  getAverageRating,
  getFeedbackCount,
} from "../constants/data";

const CourseDetailsScreen = ({ course, onBack, onAddFeedback }) => {
  const [simulateSkips, setSimulateSkips] = useState(0);

  // Feedback form state
  const [selectedRating, setSelectedRating] = useState(0);
  const [comment, setComment] = useState("");
  const [feedbackError, setFeedbackError] = useState("");

  if (!course) {
    return (
      <View style={styles.flex}>
        <Header title="Course Details" onBackPress={onBack} />
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No course selected.</Text>
        </View>
      </View>
    );
  }

  const attendancePercentage = getAttendancePercentage(course);
  const isLowAttendance = attendancePercentage < ATTENDANCE_THRESHOLD;
  const marksPercentage = Math.round((course.obtainedMarks / course.totalMarks) * 100);

  const totalObtained = course.assessments.reduce((sum, a) => sum + a.obtained, 0);
  const totalPossible = course.assessments.reduce((sum, a) => sum + a.total, 0);

  const safeSkipCount = getSafeSkipCount(course);
  const projectedPercentage = simulateAttendance(course, simulateSkips, 0);
  const willDropBelowThreshold = projectedPercentage < ATTENDANCE_THRESHOLD;

  const incrementSkips = () => setSimulateSkips((prev) => Math.min(prev + 1, 20));
  const decrementSkips = () => setSimulateSkips((prev) => Math.max(prev - 1, 0));

    // ---- Feedback calculations ----
  const averageRating = getAverageRating(course);
  const feedbackCount = getFeedbackCount(course);
  const hasFeedback = feedbackCount > 0;

  const handleSubmitFeedback = () => {
    if (selectedRating === 0) {
      setFeedbackError("Please select a star rating.");
      return;
    }
    if (comment.trim().length < 5) {
      setFeedbackError("Please write at least a few words of feedback.");
      return;
    }

    setFeedbackError("");
    onAddFeedback(course.id, selectedRating, comment.trim());
    setSelectedRating(0);
    setComment("");
    Alert.alert("Thank you!", "Your feedback has been submitted.");
  };

  // ---- Grade prediction calculations ----
  const absoluteScore = getAbsoluteScore(course);
  const predictedGrade = predictLetterGrade(absoluteScore);
  const remainingWeight = getRemainingWeight(course);
  const remainingComponentNames = getRemainingComponentNames(course);
  const isCourseComplete = remainingWeight === 0;

  const requiredForA = getRequiredPercentageForTarget(course, A_GRADE_THRESHOLD);
  const requiredForPass = getRequiredPercentageForTarget(course, PASSING_THRESHOLD);

  const renderRequirementText = (result, targetLabel) => {
    if (result === "achieved") {
      return `✓ You've already secured ${targetLabel}, even with 0% on what's left.`;
    }
    if (result === "not-achievable") {
      return `✕ ${targetLabel} is no longer possible, even with 100% on what's left.`;
    }
    return `You need an average of ${result}% on ${remainingComponentNames.join(" and ")} to get ${targetLabel}.`;
  };

  return (
    <View style={styles.flex}>
      <Header title={course.code} subtitle={course.title} onBackPress={onBack} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Course info card */}
        <View style={styles.infoCard}>
          <Text style={styles.courseTitle}>{course.title}</Text>
          <Text style={styles.instructor}>{course.instructor}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Credit Hours</Text>
            <Text style={styles.infoValue}>{course.creditHours}</Text>
          </View>
        </View>

        {/* Attendance summary */}
        <View style={styles.statCard}>
          <View style={styles.statTopRow}>
            <Text style={styles.statLabel}>Attendance</Text>
            {isLowAttendance && (
              <View style={styles.warningTag}>
                <Text style={styles.warningTagText}>Below Threshold</Text>
              </View>
            )}
          </View>
          <Text style={[styles.statValue, { color: getStatusColor(attendancePercentage) }]}>
            {attendancePercentage}%
          </Text>
          <Text style={styles.classCountText}>
            {course.attendedClasses} of {course.totalClasses} classes attended
          </Text>
          <ProgressBar percentage={attendancePercentage} showPercentageText={false} height={10} />
          {isLowAttendance && (
            <Text style={styles.warningNote}>
              This course is below the {ATTENDANCE_THRESHOLD}% requirement. Attend upcoming
              classes to recover.
            </Text>
          )}
        </View>

        {/* What-If Attendance Simulator */}
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>What-If Attendance Simulator</Text>
          <Text style={styles.simulatorSubtext}>
            If you skip the next {simulateSkips} class{simulateSkips !== 1 ? "es" : ""}...
          </Text>

          <View style={styles.stepperRow}>
            <TouchableOpacity style={styles.stepperButton} onPress={decrementSkips} activeOpacity={0.7}>
              <Text style={styles.stepperButtonText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.stepperValue}>{simulateSkips}</Text>
            <TouchableOpacity style={styles.stepperButton} onPress={incrementSkips} activeOpacity={0.7}>
              <Text style={styles.stepperButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.projectionBox}>
            <Text style={styles.projectionLabel}>Projected Attendance</Text>
            <Text style={[styles.projectionValue, { color: getStatusColor(projectedPercentage) }]}>
              {projectedPercentage}%
            </Text>
          </View>

          {willDropBelowThreshold ? (
            <Text style={styles.simulatorWarning}>
              ⚠ Skipping {simulateSkips} class{simulateSkips !== 1 ? "es" : ""} would drop you
              below the {ATTENDANCE_THRESHOLD}% threshold.
            </Text>
          ) : (
            <Text style={styles.simulatorSafe}>
              ✓ You can safely skip up to {safeSkipCount} more class
              {safeSkipCount !== 1 ? "es" : ""} and stay above {ATTENDANCE_THRESHOLD}%.
            </Text>
          )}
        </View>

        {/* Grade Prediction - NEW */}
        <View style={styles.statCard}>
          <View style={styles.statTopRow}>
            <Text style={styles.statLabel}>Grade Prediction</Text>
            {isCourseComplete && (
              <View style={styles.finalTag}>
                <Text style={styles.finalTagText}>Final</Text>
              </View>
            )}
          </View>

          <View style={styles.gradeSummaryRow}>
            <View>
              <Text style={styles.gradeSummarySubtext}>
                {isCourseComplete ? "Final Absolute Score" : "Absolute Score So Far"}
              </Text>
              <Text style={[styles.statValue, { color: getStatusColor(absoluteScore) }]}>
                {absoluteScore} / 100
              </Text>
            </View>
            <View style={styles.gradePill}>
              <Text style={styles.gradePillText}>{predictedGrade}</Text>
            </View>
          </View>

          <ProgressBar percentage={absoluteScore} showPercentageText={false} height={10} />

          {/* Per-component breakdown, generated from the gradeComponents object */}
                    {/* Per-component breakdown, generated from the gradeComponents object */}
          <View style={styles.componentBreakdown}>
            {Object.keys(GRADE_WEIGHTAGES).map((key) => {
              const component = course.gradeComponents[key];
              const weightage = GRADE_WEIGHTAGES[key];
              const pct = getComponentPercentage(component);
              const absoluteEarned = getComponentAbsolute(component, weightage);
              const isHeld = pct !== null;

              return (
                <View key={key} style={styles.componentRow}>
                  <View style={styles.componentLeft}>
                    <Text style={styles.componentName}>{COMPONENT_LABELS[key]}</Text>
                    {isHeld && (
                      <Text style={styles.componentRawMarks}>
                        {component.obtained}/{component.total} obtained ({Math.round(pct)}%)
                      </Text>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.componentValue,
                      { color: isHeld ? getStatusColor(pct) : colors.textMuted },
                    ]}
                  >
                    {isHeld ? `${absoluteEarned} / ${weightage}` : `— / ${weightage}`}
                  </Text>
                </View>
              );
            })}

            {/* Total row - sums all absolute marks earned */}
            <View style={[styles.componentRow, styles.componentTotalRow]}>
              <Text style={styles.componentTotalName}>Total Absolute</Text>
              <Text style={[styles.componentTotalValue, { color: getStatusColor(absoluteScore) }]}>
                {absoluteScore} / 100
              </Text>
            </View>
          </View>

          {/* Requirement guidance - hidden once the course is fully complete */}
          {!isCourseComplete && (
            <View style={styles.requirementBox}>
              <Text style={styles.requirementTitle}>To get an A (85+)</Text>
              <Text
                style={[
                  styles.requirementText,
                  requiredForA === "not-achievable" && styles.requirementTextDanger,
                  requiredForA === "achieved" && styles.requirementTextSuccess,
                ]}
              >
                {renderRequirementText(requiredForA, "an A")}
              </Text>

              <Text style={[styles.requirementTitle, { marginTop: spacing.sm }]}>
                To Pass (50+)
              </Text>
              <Text
                style={[
                  styles.requirementText,
                  requiredForPass === "not-achievable" && styles.requirementTextDanger,
                  requiredForPass === "achieved" && styles.requirementTextSuccess,
                ]}
              >
                {renderRequirementText(requiredForPass, "a passing grade")}
              </Text>
            </View>
          )}
        </View>

        {/* Marks summary (assignment/quiz records shown earlier in the app) */}
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Overall Marks (Recorded)</Text>
          <Text style={[styles.statValue, { color: getStatusColor(marksPercentage) }]}>
            {totalObtained} / {totalPossible} ({marksPercentage}%)
          </Text>
          <ProgressBar percentage={marksPercentage} showPercentageText={false} height={10} useStatusColor />
        </View>
                {/* Course Feedback - NEW */}
        <View style={styles.statCard}>
          <View style={styles.statTopRow}>
            <Text style={styles.statLabel}>Course Feedback</Text>
            {hasFeedback && (
              <Text style={styles.feedbackCountText}>
                {feedbackCount} review{feedbackCount !== 1 ? "s" : ""}
              </Text>
            )}
          </View>

          {hasFeedback ? (
            <>
              <View style={styles.averageRatingRow}>
                <StarRating rating={averageRating} showNumber size={22} />
              </View>

              <View style={styles.feedbackList}>
                {course.feedback.map((item) => (
                  <View key={item.id} style={styles.feedbackItem}>
                    <View style={styles.feedbackItemHeader}>
                      <StarRating rating={item.rating} size={14} />
                      <Text style={styles.feedbackDate}>{item.date}</Text>
                    </View>
                    <Text style={styles.feedbackComment}>{item.comment}</Text>
                  </View>
                ))}
              </View>
            </>
          ) : (
            <View style={styles.noFeedbackBox}>
              <Text style={styles.noFeedbackText}>
                No feedback submitted yet — be the first to share your thoughts.
              </Text>
            </View>
          )}

          {/* Submission form */}
          <View style={styles.feedbackFormSection}>
            <Text style={styles.feedbackFormLabel}>Your Rating</Text>
            <StarRating rating={selectedRating} onRatingChange={setSelectedRating} size={28} />

            <Text style={[styles.feedbackFormLabel, { marginTop: spacing.sm }]}>
              Your Feedback
            </Text>
            <TextInput
              style={styles.feedbackInput}
              placeholder="Share your thoughts about this course..."
              placeholderTextColor={colors.textMuted}
              value={comment}
              onChangeText={(text) => {
                setComment(text);
                if (feedbackError) setFeedbackError("");
              }}
              multiline
              numberOfLines={3}
            />

            {feedbackError ? <Text style={styles.feedbackErrorText}>{feedbackError}</Text> : null}

            <TouchableOpacity
              style={styles.submitFeedbackButton}
              onPress={handleSubmitFeedback}
              activeOpacity={0.8}
            >
              <Text style={styles.submitFeedbackButtonText}>Submit Feedback</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Assessment breakdown */}
        <View style={styles.assessmentSection}>
          <Text style={styles.sectionTitle}>Assessment Breakdown</Text>

          {course.assessments.length === 0 ? (
            <View style={styles.emptyAssessments}>
              <Text style={styles.emptyAssessmentsText}>
                No assessments recorded for this course yet.
              </Text>
            </View>
          ) : (
            course.assessments.map((assessment) => {
              const percentage = Math.round((assessment.obtained / assessment.total) * 100);
              return (
                <View key={assessment.id} style={styles.assessmentRow}>
                  <View style={styles.assessmentLeft}>
                    <Text style={styles.assessmentName}>{assessment.name}</Text>
                    <Text style={styles.assessmentScore}>
                      {assessment.obtained} / {assessment.total}
                    </Text>
                  </View>
                  <Text style={[styles.assessmentPercentage, { color: getStatusColor(percentage) }]}>
                    {percentage}%
                  </Text>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.md, paddingBottom: spacing.xxl },

  emptyState: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyText: { fontSize: fontSize.md, color: colors.textSecondary },

  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  courseTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.textPrimary, marginBottom: 2 },
  instructor: { fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: spacing.sm },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  infoLabel: { fontSize: fontSize.sm, color: colors.textSecondary },
  infoValue: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.textPrimary },

  statCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  statLabel: { fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: spacing.xs },
  statValue: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, marginBottom: spacing.xs },
  classCountText: { fontSize: fontSize.xs, color: colors.textMuted, marginBottom: spacing.sm },
  warningTag: {
    backgroundColor: colors.dangerLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  warningTagText: { fontSize: fontSize.xs, fontWeight: fontWeight.semibold, color: colors.danger },
  warningNote: { fontSize: fontSize.xs, color: colors.danger, marginTop: spacing.sm },

  simulatorSubtext: { fontSize: fontSize.xs, color: colors.textMuted, marginBottom: spacing.sm },
  stepperRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: spacing.md },
  stepperButton: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperButtonText: { fontSize: fontSize.xl, color: colors.primary, fontWeight: fontWeight.bold },
  stepperValue: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginHorizontal: spacing.xl,
    minWidth: 30,
    textAlign: "center",
  },
  projectionBox: { alignItems: "center", paddingVertical: spacing.sm, marginBottom: spacing.sm },
  projectionLabel: { fontSize: fontSize.xs, color: colors.textSecondary, marginBottom: spacing.xs },
  projectionValue: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold },
  simulatorWarning: { fontSize: fontSize.xs, color: colors.danger, textAlign: "center" },
  simulatorSafe: { fontSize: fontSize.xs, color: colors.success, textAlign: "center" },

  finalTag: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  finalTagText: { fontSize: fontSize.xs, fontWeight: fontWeight.semibold, color: colors.primary },
  gradeSummaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  gradeSummarySubtext: { fontSize: fontSize.xs, color: colors.textSecondary, marginBottom: 2 },
  gradePill: {
    backgroundColor: colors.primary,
    width: 56,
    height: 56,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  gradePillText: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.white },

    componentBreakdown: { marginTop: spacing.md },
  componentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  componentLeft: { flexShrink: 1, paddingRight: spacing.sm },
  componentName: { fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: colors.textPrimary },
  componentRawMarks: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 },
  componentValue: { fontSize: fontSize.sm, fontWeight: fontWeight.bold },
  componentTotalRow: {
    borderBottomWidth: 0,
    marginTop: spacing.xs,
    paddingTop: spacing.sm,
    borderTopWidth: 1.5,
    borderTopColor: colors.textPrimary,
  },
  componentTotalName: { fontSize: fontSize.sm, fontWeight: fontWeight.bold, color: colors.textPrimary },
  componentTotalValue: { fontSize: fontSize.md, fontWeight: fontWeight.bold },

  requirementBox: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  requirementTitle: { fontSize: fontSize.sm, fontWeight: fontWeight.bold, color: colors.textPrimary, marginBottom: 4 },
  requirementText: { fontSize: fontSize.xs, color: colors.textSecondary, lineHeight: 18 },
  requirementTextDanger: { color: colors.danger, fontWeight: fontWeight.medium },
  requirementTextSuccess: { color: colors.success, fontWeight: fontWeight.medium },

  assessmentSection: { marginBottom: spacing.md },
  sectionTitle: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.textPrimary, marginBottom: spacing.sm },
  assessmentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  assessmentLeft: {},
  assessmentName: { fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: colors.textPrimary },
  assessmentScore: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 },
  assessmentPercentage: { fontSize: fontSize.lg, fontWeight: fontWeight.bold },

  emptyAssessments: {
    padding: spacing.lg,
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
    emptyAssessmentsText: { fontSize: fontSize.sm, color: colors.textSecondary },

  feedbackCountText: { fontSize: fontSize.xs, color: colors.textMuted },
  averageRatingRow: { marginBottom: spacing.md },
  feedbackList: { marginBottom: spacing.sm },
  feedbackItem: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  feedbackItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  feedbackDate: { fontSize: fontSize.xs, color: colors.textMuted },
  feedbackComment: { fontSize: fontSize.sm, color: colors.textPrimary, lineHeight: 20 },

  noFeedbackBox: {
    paddingVertical: spacing.md,
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  noFeedbackText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: "center",
  },

  feedbackFormSection: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  feedbackFormLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  feedbackInput: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.sm,
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    textAlignVertical: "top",
    minHeight: 70,
    marginTop: spacing.xs,
  },
  feedbackErrorText: {
    fontSize: fontSize.xs,
    color: colors.danger,
    marginTop: spacing.xs,
  },
  submitFeedbackButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginTop: spacing.sm,
  },
  submitFeedbackButtonText: {
    color: colors.white,
    fontWeight: fontWeight.bold,
    fontSize: fontSize.sm,
  },
});

export default CourseDetailsScreen;