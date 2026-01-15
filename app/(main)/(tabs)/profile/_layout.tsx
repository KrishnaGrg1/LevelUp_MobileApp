import { Slot } from 'expo-router';
import React from 'react';

// Memoize the screen options to prevent recreating them
const screenOptions = { headerShown: false };

export default function ProfileLayout() {
  // CRITICAL: Use static options objects to prevent React from seeing
  // this as a different component when language changes
  return (
    <Slot />
  );
}
