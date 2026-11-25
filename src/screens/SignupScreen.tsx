import React from 'react';
import AuthScreen from './AuthScreen';

interface SignupScreenProps {
  onSignupSuccess?: () => void;
}

export default function SignupScreen({ onSignupSuccess }: SignupScreenProps) {
  return <AuthScreen onLoginSuccess={onSignupSuccess} initialMode="signup" />;
}
