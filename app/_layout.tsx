import { Stack } from 'expo-router';
import React from 'react';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Hides the top bar for a cleaner look
        animation: 'fade',  // Smooth transition between screens
      }}
    >
      {/* The Stack will automatically find your files. 
        You don't need to list every screen here, 
        but you can define the initial route.
      */}
      <Stack.Screen name="index" /> 
      <Stack.Screen name="Mobile UI/UserLogInSignUpScreen" />
      <Stack.Screen name="Mobile UI/Dashboard" />
    </Stack>
  );
}