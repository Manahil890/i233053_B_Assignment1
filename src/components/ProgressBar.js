// src/components/ProgressBar.js

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, radius, fontSize, fontWeight, getStatusColor } from "../constants/theme";

const ProgressBar = ({
  percentage = 0,       // 0-100
  label,                 // optional text above the bar, e.g. "Attendance"
  showPercentageText = true,
  height = 10,
  useStatusColor = true,  // if true, bar color changes based on value (green/yellow/red)
  barColor,                // manual override color, used if useStatusColor is false
}) => {
  // Clamp value between 0 and 100 so bad data can't break the UI
  const clampedValue = Math.max(0, Math.min(100, percentage));

  const resolvedColor = useStatusColor ? getStatusColor(clampedValue) : barColor || colors.primary;

  return (
    <View style={styles.container}>
      {(label || showPercentageText) && (
        <View style={styles.topRow}>
          {label ? <Text style={styles.label}>{label}</Text> : <View />}
          {showPercentageText && (
            <Text style={[styles.percentageText, { color: resolvedColor }]}>
              {clampedValue}%
            </Text>
          )}
        </View>
      )}

      <View style={[styles.track, { height }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${clampedValue}%`,
              backgroundColor: resolvedColor,
              height,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: spacing.xs,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
  },
  percentageText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  track: {
    width: "100%",
    backgroundColor: colors.border,
    borderRadius: radius.full,
    overflow: "hidden",
  },
  fill: {
    borderRadius: radius.full,
  },
});

export default ProgressBar;