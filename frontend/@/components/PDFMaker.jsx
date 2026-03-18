"use client";
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Color palette
const COLORS = {
  primary: "#E85D26", // vibrant orange-red
  secondary: "#F5A623", // warm golden yellow
  accent: "#2C3E50", // dark navy for text
  light: "#FFF8F2", // warm off-white background
  white: "#FFFFFF",
  muted: "#7F8C8D",
  stepBg: "#FDF3E3",
  badgeBg: "#2C3E50",
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: COLORS.light,
    fontFamily: "Helvetica",
    padding: 0,
  },

  // ── Header Banner ──────────────────────────────────────────────
  headerBanner: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 36,
    paddingTop: 28,
    paddingBottom: 20,
    position: "relative",
  },
  headerTag: {
    backgroundColor: COLORS.secondary,
    color: COLORS.white,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 2,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 2,
    alignSelf: "flex-start",
    marginBottom: 10,
    textTransform: "uppercase",
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: COLORS.white,
    lineHeight: 1.2,
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 11,
    color: "rgba(255,255,255,0.85)",
    lineHeight: 1.5,
    maxWidth: 420,
  },

  // ── Meta Badges Row ─────────────────────────────────────────────
  metaRow: {
    flexDirection: "row",
    backgroundColor: COLORS.accent,
    paddingHorizontal: 36,
    paddingVertical: 12,
    gap: 24,
  },
  metaBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.secondary,
  },
  metaLabel: {
    fontSize: 8,
    color: "rgba(255,255,255,0.55)",
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  metaValue: {
    fontSize: 10,
    color: COLORS.white,
    fontFamily: "Helvetica-Bold",
    marginTop: 1,
  },

  // ── Body Layout ─────────────────────────────────────────────────
  body: {
    flexDirection: "row",
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
    gap: 18,
  },

  // ── Left Column: Ingredients ────────────────────────────────────
  leftCol: {
    width: 175,
    flexShrink: 0,
  },
  sectionLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 2.5,
    color: COLORS.primary,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  ingredientCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    marginBottom: 10,
    shadowColor: "#000",
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 7,
    gap: 8,
  },
  ingredientBullet: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.secondary,
    marginTop: 4,
    flexShrink: 0,
  },
  ingredientText: {
    fontSize: 9,
    color: COLORS.accent,
    lineHeight: 1.5,
    flex: 1,
  },

  // Tips card in left col
  tipsCard: {
    backgroundColor: COLORS.secondary,
    borderRadius: 8,
    padding: 14,
    marginTop: 4,
  },
  tipsTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 2,
    color: COLORS.white,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  tipItem: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 6,
  },
  tipBullet: {
    fontSize: 9,
    color: COLORS.white,
    fontFamily: "Helvetica-Bold",
  },
  tipText: {
    fontSize: 8.5,
    color: COLORS.white,
    lineHeight: 1.5,
    flex: 1,
  },

  // ── Right Column: Steps ─────────────────────────────────────────
  rightCol: {
    flex: 1,
  },
  stepCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  stepNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  stepNumberText: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: COLORS.white,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: COLORS.accent,
    marginBottom: 3,
  },
  stepInstruction: {
    fontSize: 8.5,
    color: "#555",
    lineHeight: 1.55,
  },

  // ── Footer ──────────────────────────────────────────────────────
  footer: {
    backgroundColor: COLORS.accent,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 36,
    paddingVertical: 10,
  },
  footerText: {
    fontSize: 8,
    color: "rgba(255,255,255,0.5)",
    letterSpacing: 1,
  },
  footerAccent: {
    width: 40,
    height: 3,
    backgroundColor: COLORS.secondary,
    borderRadius: 2,
  },

  // ── Decorative Corner ───────────────────────────────────────────
  cornerAccent: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 80,
    height: 80,
    backgroundColor: "rgba(0,0,0,0.12)",
    borderBottomLeftRadius: 80,
  },
  cornerDot: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.secondary,
    opacity: 0.8,
  },

  divider: {
    height: 1,
    backgroundColor: "#F0E8E0",
    marginBottom: 10,
  },
});

// ── Helpers ──────────────────────────────────────────────────────

function MetaBadge({ label, value }) {
  return (
    <View style={styles.metaBadge}>
      <View>
        <View style={styles.metaDot} />
      </View>
      <View>
        <Text style={styles.metaLabel}>{label}</Text>
        <Text style={styles.metaValue}>{value}</Text>
      </View>
    </View>
  );
}

function StepCard({ step }) {
  return (
    <View style={styles.stepCard}>
      <View style={styles.stepNumber}>
        <Text style={styles.stepNumberText}>{step.step}</Text>
      </View>
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>{step.title}</Text>
        <Text style={styles.stepInstruction}>{step.instruction}</Text>
      </View>
    </View>
  );
}

// ── Main Component ───────────────────────────────────────────────

export default function PDFMaker({ recipe }) {
  const totalTime =
    parseInt(recipe.prepTime || 0) + parseInt(recipe.cookTime || 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ── Header ── */}
        <View style={styles.headerBanner}>
          <View style={styles.cornerAccent} />
          <View style={styles.cornerDot} />
          <Text style={styles.headerTag}>
            {recipe.cuisine} • {recipe.category}
          </Text>
          <Text style={styles.headerTitle}>{recipe.title}</Text>
          {recipe.description ? (
            <Text style={styles.headerSubtitle}>{recipe.description}</Text>
          ) : null}
        </View>

        {/* ── Meta Badges ── */}
        <View style={styles.metaRow}>
          <MetaBadge label="Total Time" value={`${totalTime} mins`} />
          <MetaBadge label="Servings" value={`${recipe.servings} people`} />
          {recipe.prepTime ? (
            <MetaBadge label="Prep" value={`${recipe.prepTime} mins`} />
          ) : null}
          {recipe.cookTime ? (
            <MetaBadge label="Cook" value={`${recipe.cookTime} mins`} />
          ) : null}
          {recipe.difficulty ? (
            <MetaBadge label="Difficulty" value={recipe.difficulty} />
          ) : null}
        </View>

        {/* ── Body ── */}
        <View style={styles.body}>
          {/* Left: Ingredients + Tips */}
          <View style={styles.leftCol}>
            <Text style={styles.sectionLabel}>Ingredients</Text>
            <View style={styles.ingredientCard}>
              {recipe.ingredients?.map((ing, i) => (
                <View key={i} style={styles.ingredientItem}>
                  <View style={styles.ingredientBullet} />
                  <Text style={styles.ingredientText}>
                    {typeof ing === "string"
                      ? ing
                      : `${ing.amount ?? ""} ${ing.unit ?? ""} ${ing.name ?? ing}`.trim()}
                  </Text>
                </View>
              ))}
            </View>

            {recipe.tips?.length > 0 && (
              <View style={styles.tipsCard}>
                <Text style={styles.tipsTitle}>Chef's Tips</Text>
                {recipe.tips.map((tip, i) => (
                  <View key={i} style={styles.tipItem}>
                    <Text style={styles.tipBullet}>★</Text>
                    <Text style={styles.tipText}>{tip}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Right: Steps */}
          <View style={styles.rightCol}>
            <Text style={styles.sectionLabel}>Method (in steps)</Text>
            {recipe.instructions?.map((step) => (
              <StepCard key={step.step} step={step} />
            ))}
          </View>
        </View>

        {/* ── Footer ── */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {recipe.title?.toUpperCase()} — RECIPE CARD
          </Text>
          <View style={styles.footerAccent} />
          <Text style={styles.footerText}>QUICK STEPS. BIG FLAVORS.</Text>
        </View>
      </Page>
    </Document>
  );
}
