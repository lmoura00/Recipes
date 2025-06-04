import React from "react";
import { Stack } from "expo-router";
import { FavoritesProvider } from "../context/FavoritesContext"; 

export default function RootLayout() {
  return (
    <FavoritesProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="recipes/page" />
        <Stack.Screen name="recipes/[id]" />
        <Stack.Screen name="about/page" />
      </Stack>
    </FavoritesProvider>
  );
}
