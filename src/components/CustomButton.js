// src/components/CustomButton.js

import React from "react";
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";
import { colors, spacing, radius, fontSize, fontWeight } from "../constants/theme";

const CustomButton = ({
  title,
  onPress,
  variant = "primary",   // "primary" | "secondary" | "outline"
  disabled = false,
  loading = false,
  style,
}) => {
  const isOutline = variant === "outline";
  const isSecondary = variant === "secondary";

  const buttonStyles = [
    styles.base,
    isOutline && styles.outline,
    isSecondary && styles.secondary,
    !isOutline && !isSecondary && styles.primary,
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    isOutline && styles.outlineText,
    isSecondary && styles.secondaryText,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? colors.primary : colors.white} />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.primaryLight,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.white,
  },
  secondaryText: {
    color: colors.primary,
  },
  outlineText: {
    color: colors.primary,
  },
});

export default CustomButton;