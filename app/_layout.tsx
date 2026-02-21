import { Stack } from 'expo-router';
import React from 'react';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Hides the top bar for a cleaner look
        animation: 'none',
      }}
    >
      {/* The Stack will automatically find your files. 
        You don't need to list every screen here, 
        but you can define the initial route.
      */}
      <Stack.Screen name="index" /> 
      <Stack.Screen name="mobile-ui/user-log-in-sign-up-screen" />
      <Stack.Screen name="mobile-ui/get-started" />
      <Stack.Screen
        name="mobile-ui/dashboard"
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="mobile-ui/profile-screen"
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="mobile-ui/reports-screen"
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="mobile-ui/reports-tracker-screen"
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="mobile-ui/user-form"
        options={{
          gestureEnabled: false,
        }}
      />
    </Stack>
  );
}