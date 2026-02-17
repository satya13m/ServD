"use client";
import React from 'react'
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 11,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 16,
  },
  heading: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: "bold",
  },
  text: {
    marginBottom: 4,
  },
});

export default function PDFMaker({recipe}) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          {/**Title */}
          <Text style={styles.title}>{recipe.title}</Text>
          <Text style={styles.text}>{recipe.description}</Text>

          {/**Meta Section */}
          <View style={styles.section}>
            <Text>
              Cuisine : {recipe.cuisine} | Category : {recipe.category}
            </Text>
            <Text>
              Time : {parseInt(recipe.prepTime) + parseInt(recipe.cookTime)}{" "}
              mins
            </Text>
            <Text>Servings : {recipe.servings}</Text>
          </View>

          {/**Ingredient Section */}
          <View style={styles.action}>
            <Text style={styles.heading}>Instructions</Text>
            {recipe.instructions.map((step) => (
              <View key={step.step} style={{ marginBottom: 6 }}>
                <Text>
                  {step.step}. {step.title}
                </Text>
                <Text>{step.instruction}</Text>
              </View>
            ))}
          </View>

          {/**Tips */}
          {recipe.tips?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.heading}>Chef’s Tips</Text>
              {recipe.tips.map((tip, i) => (
                <Text key={i}>{tip}</Text>
              ))}
            </View>
          )}
        </Page>
      </Document>
    );
}

