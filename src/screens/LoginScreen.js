// src/screens/LoginScreen.js

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { colors, spacing, radius, fontSize, fontWeight } from "../constants/theme";
import InputField from "../components/InputField";
import CustomButton from "../components/CustomButton";

const LoginScreen = ({ onLoginSuccess }) => {
  const [rollNumber, setRollNumber] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Simple roll number format check: e.g. FA22-BCS-045
    const rollNumberPattern = /^\d{2}[A-Za-z]-\d{4}$/;

  const validateForm = () => {
    const newErrors = {};

    if (!rollNumber.trim()) {
      newErrors.rollNumber = "Roll number is required";
    } else if (!rollNumberPattern.test(rollNumber.trim())) {
      newErrors.rollNumber = "Format should be like 23I-3054";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = () => {
    const isValid = validateForm();
    if (!isValid) return;

    setIsSubmitting(true);

    // Simulate a network/auth delay
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess();
    }, 800);
  };

  const handleForgotPassword = () => {
    Alert.alert(
      "Forgot Password",
      "Please contact the IT helpdesk to reset your FLEX password."
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>F</Text>
          </View>
          <Text style={styles.appName}>FLEX</Text>
          <Text style={styles.appTagline}>Student Companion</Text>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.welcomeText}>Welcome back</Text>
          <Text style={styles.subText}>Sign in to continue to your portal</Text>

          <InputField
            label="Roll Number"
            value={rollNumber}
            onChangeText={(text) => {
              setRollNumber(text);
              if (errors.rollNumber) setErrors((prev) => ({ ...prev, rollNumber: null }));
            }}
            placeholder="e.g. 23I-3054"
            error={errors.rollNumber}
            autoCapitalize="characters"
          />

          <InputField
            label="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
            }}
            placeholder="Enter your password"
            error={errors.password}
            secureTextEntry
          />

          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={styles.rememberRow}
              onPress={() => setRememberMe((prev) => !prev)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.rememberText}>Remember Me</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <CustomButton
            title="Sign In"
            onPress={handleSignIn}
            loading={isSubmitting}
            style={styles.signInButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
    justifyContent: "center",
  },
  logoSection: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  logoText: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.white,
  },
  appName: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  appTagline: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  formSection: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  welcomeText: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.xs,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: colors.white,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  rememberText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  forgotText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: fontWeight.medium,
  },
  signInButton: {
    marginTop: spacing.xs,
  },
});

export default LoginScreen;