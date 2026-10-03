// src/components/StarRating.js

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors, spacing, fontSize, fontWeight } from "../constants/theme";

const StarRating = ({
  rating = 0,
  onRatingChange,
  size = 24,
  showNumber = false,
}) => {
  const isInteractive = typeof onRatingChange === "function";
  const stars = [1, 2, 3, 4, 5];
  const filledCount = Math.round(rating);

  return (
    <View style={styles.container}>
      <View style={styles.starsRow}>
        {stars.map((starValue) => {
          const isFilled = starValue <= filledCount;

          if (isInteractive) {
            return (
              <TouchableOpacity
                key={starValue}
                onPress={() => onRatingChange(starValue)}
                activeOpacity={0.6}
                style={styles.starButton}
              >
                <Text style={[styles.star, { fontSize: size }, isFilled && styles.starFilled]}>
                  {isFilled ? "★" : "☆"}
                </Text>
              </TouchableOpacity>
            );
          }

          return (
            <Text
              key={starValue}
              style={[styles.star, { fontSize: size }, isFilled && styles.starFilled]}
            >
              {isFilled ? "★" : "☆"}
            </Text>
          );
        })}
      </View>

      {showNumber && (
        <Text style={styles.numberText}>{rating > 0 ? rating.toFixed(1) : "—"}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  starsRow: {
    flexDirection: "row",
  },
  starButton: {
    paddingHorizontal: 2,
  },
  star: {
    color: colors.border,
  },
  starFilled: {
    color: "#F59E0B",
  },
  numberText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
  },
});

export default StarRating;