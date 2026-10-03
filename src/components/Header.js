// src/components/Header.js

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { colors, spacing, fontSize, fontWeight } from "../constants/theme";

const Header = ({
  title,
  subtitle,          // optional smaller text under the title
  onBackPress,        // if provided, shows a back arrow
  rightElement,        // optional element on the right side (e.g. avatar, icon)
}) => {
  const hasBack = !!onBackPress;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.leftSection}>
          {hasBack && (
            <TouchableOpacity onPress={onBackPress} style={styles.backButton} activeOpacity={0.7}>
              <Text style={styles.backArrow}>‹</Text>
            </TouchableOpacity>
          )}

          <View>
            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
        </View>

        {rightElement ? <View>{rightElement}</View> : null}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
  },
  backButton: {
    marginRight: spacing.sm,
    paddingRight: spacing.xs,
  },
  backArrow: {
    fontSize: 28,
    color: colors.textPrimary,
    fontWeight: fontWeight.regular,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
});

export default Header;