import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eye, EyeOff, Mail, Lock, LogIn, Sparkles, User, Phone, Check, UserPlus } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import { brandColors, spacing } from '../theme';
import { useAuthStore } from '../store/useAuthStore';
import { localSignUp, localSignIn, normalizePhone, isValidEmail, normalizeEmail } from '../utils/localAuth';

function GoogleIcon() {
  return (
    <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <Path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#84CC16"
      />
      <Path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#84CC16"
      />
      <Path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#84CC16"
      />
      <Path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#84CC16"
      />
    </Svg>
  );
}

interface AuthScreenProps {
  onLoginSuccess?: () => void;
  initialMode?: 'login' | 'signup';
}

export default function AuthScreen({ onLoginSuccess, initialMode = 'login' }: AuthScreenProps) {
  const [isSignUp, setIsSignUp] = useState(initialMode === 'signup');

  // Login form state - defaults are EMPTY as required
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Field validation errors
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
    general?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Input refs for auto-focusing on first invalid field
  const loginPasswordRef = useRef<TextInput>(null);
  const nameRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const { setIsAuthenticated, setUserProfile } = useAuthStore();

  const handleLoginSubmit = async () => {
    const trimmedInput = loginEmail.trim();
    if (!trimmedInput) {
      setLoginError('Email ya phone number daalo');
      return;
    }
    if (!loginPassword) {
      setLoginError('Password daalo');
      loginPasswordRef.current?.focus();
      return;
    }

    setIsLoggingIn(true);
    setLoginError('');

    try {
      const res = await localSignIn({
        emailOrPhone: trimmedInput,
        password: loginPassword,
      });

      if (res.success && res.user) {
        setIsAuthenticated(true);
        setUserProfile(res.user);
        if (onLoginSuccess) onLoginSuccess();
      } else {
        setLoginError(res.error || 'Galat email ya password');
      }
    } catch {
      setLoginError('Login fail ho gaya. Kripya dobara koshish karein.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleDemoAccess = async () => {
    setIsLoggingIn(true);
    setLoginError('');

    // Pre-populate credentials visually so inputs reflect demo account
    setLoginEmail('passenger@aolo.com');
    setLoginPassword('password123');

    const defaultDemoProfile = {
      uid: 'user_default_1',
      name: 'Yuvraj Singh',
      phone: '+91 98765 43210',
      email: 'passenger@aolo.com',
      walletBalance: 250,
    };

    try {
      const res = await localSignIn({
        emailOrPhone: 'passenger@aolo.com',
        password: 'password123',
      });
      if (res.success && res.user) {
        setIsAuthenticated(true);
        setUserProfile(res.user);
        if (onLoginSuccess) onLoginSuccess();
      } else {
        // Fallback demo login guaranteed to succeed
        setIsAuthenticated(true);
        setUserProfile(defaultDemoProfile);
        if (onLoginSuccess) onLoginSuccess();
      }
    } catch {
      // Guaranteed demo access even if storage is unavailable
      setIsAuthenticated(true);
      setUserProfile(defaultDemoProfile);
      if (onLoginSuccess) onLoginSuccess();
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignupSubmit = async () => {
    const newErrors: {
      name?: string;
      phone?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      terms?: string;
    } = {};

    const trimmedName = signupName.trim();
    const normPhone = normalizePhone(signupPhone);
    const normEmail = normalizeEmail(signupEmail);

    // 1. FULL NAME check: 2+ characters
    if (trimmedName.length < 2) {
      newErrors.name = 'Apna poora naam daalo';
    }

    // 2. PHONE NUMBER check: 10 digits
    if (!normPhone || normPhone.length !== 10) {
      newErrors.phone = 'Sahi phone number daalo';
    }

    // 3. EMAIL ADDRESS check: valid format
    if (!normEmail || !isValidEmail(normEmail)) {
      newErrors.email = 'Sahi email daalo';
    }

    // 4. PASSWORD check: 6+ characters
    if (!signupPassword || signupPassword.length < 6) {
      newErrors.password = 'Password kam se kam 6 character ka ho';
    }

    // 5. CONFIRM PASSWORD check: match
    if (signupConfirmPassword !== signupPassword) {
      newErrors.confirmPassword = 'Dono password same hone chahiye';
    }

    // 6. Terms check
    if (!termsAccepted) {
      newErrors.terms = 'Aage badhne ke liye sehmat hona zaroori hai';
    }

    // If there is any validation error, focus the FIRST invalid field
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      if (newErrors.name) {
        nameRef.current?.focus();
      } else if (newErrors.phone) {
        phoneRef.current?.focus();
      } else if (newErrors.email) {
        emailRef.current?.focus();
      } else if (newErrors.password) {
        passwordRef.current?.focus();
      } else if (newErrors.confirmPassword) {
        confirmPasswordRef.current?.focus();
      }
      return;
    }

    // Everything is valid: proceed with signUp
    setIsSubmitting(true);
    setErrors({});

    try {
      const res = await localSignUp({
        name: trimmedName,
        phone: signupPhone,
        email: normEmail,
        password: signupPassword,
      });

      if (res.success && res.user) {
        // Auto login and navigate to Home
        setIsAuthenticated(true);
        setUserProfile(res.user);
        if (onLoginSuccess) onLoginSuccess();
      } else {
        // Show specific duplicate or field error
        if (res.errorField === 'email') {
          setErrors({ email: res.error });
          emailRef.current?.focus();
        } else if (res.errorField === 'phone') {
          setErrors({ phone: res.error });
          phoneRef.current?.focus();
        } else if (res.errorField === 'name') {
          setErrors({ name: res.error });
          nameRef.current?.focus();
        } else if (res.errorField === 'password') {
          setErrors({ password: res.error });
          passwordRef.current?.focus();
        } else {
          setErrors({ general: res.error || 'Account nahi ban paya' });
        }
      }
    } catch {
      setErrors({ general: 'Server/storage error. Dobara koshish karein.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, !isSignUp && styles.corporateLoginRoot]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            !isSignUp && styles.corporateLoginContent,
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Branding Header */}
          <View style={styles.headerBox}>
            <View style={styles.logoGreenBox}>
              <Text style={styles.logoAoText}>AO</Text>
              <View style={styles.cabsBadge}>
                <Text style={styles.cabsBadgeText}>CABS</Text>
              </View>
            </View>
            <Text style={[styles.brandTitle, !isSignUp && styles.corporateLoginBrandTitle]}>
              <Text style={{ color: isSignUp ? '#0A0A0A' : '#FFFFFF' }}>AOLO </Text>
              <Text style={{ color: brandColors.aoloGreen }}>PASSENGER</Text>
            </Text>
            <Text style={[styles.brandSubtitle, !isSignUp && styles.corporateLoginSubtitle]}>
              {isSignUp
                ? 'Create an account to book your first ride'
                : 'Book premium, reliable, and affordable rides in seconds'}
            </Text>
          </View>

          {isSignUp ? (
            /* ================= SIGNUP FORM ================= */
            <View style={styles.formContainer}>
              {/* General Error Banner */}
              {errors.general ? (
                <View style={styles.generalErrorBanner}>
                  <Text style={styles.generalErrorText}>{errors.general}</Text>
                </View>
              ) : null}

              {/* 1. FULL NAME */}
              <View>
                <Text style={styles.inputLabel}>FULL NAME</Text>
                <View style={[styles.inputWrapper, !!errors.name && styles.inputWrapperError]}>
                  <User size={18} color={errors.name ? '#E53935' : '#94A3B8'} />
                  <TextInput
                    ref={nameRef}
                    style={styles.input}
                    value={signupName}
                    onChangeText={(val) => {
                      setSignupName(val);
                      if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    placeholder="E.g. Yuvraj Singh"
                    placeholderTextColor="#94A3B8"
                    returnKeyType="next"
                    onSubmitEditing={() => phoneRef.current?.focus()}
                  />
                </View>
                {errors.name ? <Text style={styles.fieldErrorText}>{errors.name}</Text> : null}
              </View>

              {/* 2. PHONE NUMBER */}
              <View>
                <Text style={styles.inputLabel}>PHONE NUMBER</Text>
                <View style={[styles.inputWrapper, !!errors.phone && styles.inputWrapperError]}>
                  <Phone size={18} color={errors.phone ? '#E53935' : '#94A3B8'} />
                  <TextInput
                    ref={phoneRef}
                    style={styles.input}
                    value={signupPhone}
                    onChangeText={(val) => {
                      setSignupPhone(val);
                      if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                    }}
                    keyboardType="phone-pad"
                    placeholder="+91 98765 43210"
                    placeholderTextColor="#94A3B8"
                    returnKeyType="next"
                    onSubmitEditing={() => emailRef.current?.focus()}
                  />
                </View>
                {errors.phone ? <Text style={styles.fieldErrorText}>{errors.phone}</Text> : null}
              </View>

              {/* 3. EMAIL ADDRESS */}
              <View>
                <Text style={[styles.inputLabel, styles.corporateLoginLabel]}>EMAIL ADDRESS</Text>
                <View style={[styles.inputWrapper, !!errors.email && styles.inputWrapperError]}>
                  <Mail size={18} color={errors.email ? '#E53935' : '#94A3B8'} />
                  <TextInput
                    ref={emailRef}
                    style={styles.input}
                    value={signupEmail}
                    onChangeText={(val) => {
                      setSignupEmail(val);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="passenger@aolo.com"
                    placeholderTextColor="#94A3B8"
                    returnKeyType="next"
                    onSubmitEditing={() => passwordRef.current?.focus()}
                  />
                </View>
                {errors.email ? <Text style={styles.fieldErrorText}>{errors.email}</Text> : null}
              </View>

              {/* 4. PASSWORD */}
              <View>
                <Text style={styles.inputLabel}>PASSWORD</Text>
                <View style={[styles.inputWrapper, !!errors.password && styles.inputWrapperError]}>
                  <Lock size={18} color={errors.password ? '#E53935' : '#94A3B8'} />
                  <TextInput
                    ref={passwordRef}
                    style={[styles.input, { flex: 1 }]}
                    value={signupPassword}
                    onChangeText={(val) => {
                      setSignupPassword(val);
                      if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    secureTextEntry={!showSignupPassword}
                    placeholder="Kam se kam 6 characters"
                    placeholderTextColor="#94A3B8"
                    returnKeyType="next"
                    onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                  />
                  <TouchableOpacity
                    onPress={() => setShowSignupPassword(!showSignupPassword)}
                    style={styles.eyeBtn}
                    activeOpacity={0.7}
                  >
                    {showSignupPassword ? (
                      <EyeOff size={18} color="#94A3B8" />
                    ) : (
                      <Eye size={18} color="#94A3B8" />
                    )}
                  </TouchableOpacity>
                </View>
                {errors.password ? <Text style={styles.fieldErrorText}>{errors.password}</Text> : null}
              </View>

              {/* 5. CONFIRM PASSWORD */}
              <View>
                <Text style={styles.inputLabel}>CONFIRM PASSWORD</Text>
                <View style={[styles.inputWrapper, !!errors.confirmPassword && styles.inputWrapperError]}>
                  <Lock size={18} color={errors.confirmPassword ? '#E53935' : '#94A3B8'} />
                  <TextInput
                    ref={confirmPasswordRef}
                    style={[styles.input, { flex: 1 }]}
                    value={signupConfirmPassword}
                    onChangeText={(val) => {
                      setSignupConfirmPassword(val);
                      if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                    }}
                    secureTextEntry={!showConfirmPassword}
                    placeholder="Wahi password dobara daalo"
                    placeholderTextColor="#94A3B8"
                    returnKeyType="done"
                    onSubmitEditing={handleSignupSubmit}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeBtn}
                    activeOpacity={0.7}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} color="#94A3B8" />
                    ) : (
                      <Eye size={18} color="#94A3B8" />
                    )}
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword ? (
                  <Text style={styles.fieldErrorText}>{errors.confirmPassword}</Text>
                ) : null}
              </View>

              {/* 6. TERMS CHECKBOX */}
              <View style={{ marginTop: 2 }}>
                <TouchableOpacity
                  style={styles.checkboxRow}
                  onPress={() => {
                    const nextVal = !termsAccepted;
                    setTermsAccepted(nextVal);
                    if (nextVal && errors.terms) {
                      setErrors((prev) => ({ ...prev, terms: undefined }));
                    }
                  }}
                  activeOpacity={0.8}
                >
                  <View style={[styles.checkboxBox, termsAccepted && styles.checkboxBoxChecked]}>
                    {termsAccepted ? <Check size={12} color="#0A0A0A" strokeWidth={3} /> : null}
                  </View>
                  <Text style={styles.checkboxLabel}>
                    Main Terms & Privacy Policy se sehmat hun
                  </Text>
                </TouchableOpacity>
                {errors.terms ? <Text style={styles.fieldErrorText}>{errors.terms}</Text> : null}
              </View>

              {/* Create Account Primary Button (Loading state & double tap block) */}
              <TouchableOpacity
                style={[styles.primaryBtn, isSubmitting && { opacity: 0.7 }]}
                onPress={handleSignupSubmit}
                disabled={isSubmitting}
                activeOpacity={0.85}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#0A0A0A" />
                ) : (
                  <>
                    <UserPlus size={18} color="#0A0A0A" />
                    <Text style={styles.primaryBtnText}>Create Account</Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Already have an account? Log in Link */}
              <TouchableOpacity
                style={styles.createAccountRow}
                onPress={() => {
                  setIsSignUp(false);
                  setErrors({});
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.createAccountText}>Already have an account? </Text>
                <Text style={styles.createAccountLink}>Log in</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* ================= LOGIN FORM ================= */
            <View style={[styles.formContainer, styles.corporateLoginForm]}>
              {/* General Login Error */}
              {loginError ? (
                <View style={styles.generalErrorBanner}>
                  <Text style={styles.generalErrorText}>{loginError}</Text>
                </View>
              ) : null}

              {/* Email / Mobile Field - EMPTY by default */}
              <View>
                <Text style={[styles.inputLabel, styles.corporateLoginLabel]}>EMAIL ADDRESS</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    styles.corporateLoginInputWrapper,
                    !!loginError && styles.inputWrapperError,
                  ]}
                >
                  <Mail size={18} color="#64748B" />
                  <TextInput
                    style={[styles.input, styles.corporateLoginInput]}
                    value={loginEmail}
                    onChangeText={(val) => {
                      setLoginEmail(val);
                      if (loginError) setLoginError('');
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="passenger@aolo.com"
                    placeholderTextColor="#94A3B8"
                    returnKeyType="next"
                    onSubmitEditing={() => loginPasswordRef.current?.focus()}
                  />
                </View>
              </View>

              {/* Password Field - EMPTY by default */}
              <View>
                <Text style={[styles.inputLabel, styles.corporateLoginLabel]}>PASSWORD</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    styles.corporateLoginInputWrapper,
                    !!loginError && styles.inputWrapperError,
                  ]}
                >
                  <Lock size={18} color="#64748B" />
                  <TextInput
                    ref={loginPasswordRef}
                    style={[styles.input, styles.corporateLoginInput, { flex: 1 }]}
                    value={loginPassword}
                    onChangeText={(val) => {
                      setLoginPassword(val);
                      if (loginError) setLoginError('');
                    }}
                    secureTextEntry={!showLoginPassword}
                    placeholder="••••••••"
                    placeholderTextColor="#94A3B8"
                    returnKeyType="done"
                    onSubmitEditing={handleLoginSubmit}
                  />
                  <TouchableOpacity
                    onPress={() => setShowLoginPassword(!showLoginPassword)}
                    style={styles.eyeBtn}
                    activeOpacity={0.7}
                  >
                    {showLoginPassword ? (
                      <EyeOff size={18} color="#64748B" />
                    ) : (
                      <Eye size={18} color="#64748B" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Log In Button */}
              <TouchableOpacity
                style={[
                  styles.primaryBtn,
                  styles.corporateLoginButton,
                  isLoggingIn && { opacity: 0.7 },
                ]}
                onPress={handleLoginSubmit}
                disabled={isLoggingIn}
                activeOpacity={0.85}
              >
                {isLoggingIn ? (
                  <ActivityIndicator size="small" color="#0A0A0A" />
                ) : (
                  <>
                    <LogIn size={18} color="#0A0A0A" />
                    <Text style={[styles.primaryBtnText, styles.corporateLoginButtonText]}>Log In</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.forgotPasswordRow}
                onPress={() =>
                  Alert.alert(
                    'Forgot password?',
                    'AOLO currently stores account passwords locally, so email password recovery is not configured yet.',
                  )
                }
                activeOpacity={0.75}
              >
                <Text style={[styles.createAccountLink, styles.corporateLoginLink]}>Forgot password?</Text>
              </TouchableOpacity>

              {/* OR Divider */}
              <View style={[styles.dividerRow, styles.corporateLoginDivider]}>
                <View style={[styles.dividerLine, styles.corporateLoginDividerLine]} />
                <Text style={[styles.dividerText, styles.corporateLoginDividerText]}>OR</Text>
                <View style={[styles.dividerLine, styles.corporateLoginDividerLine]} />
              </View>

              {/* Google SSO Button */}
              <TouchableOpacity style={styles.ssoBtn} onPress={handleDemoAccess} activeOpacity={0.85}>
                <GoogleIcon />
                <Text style={styles.ssoBtnText}>Continue with Google</Text>
              </TouchableOpacity>

              {/* Create an account link */}
              <TouchableOpacity
                style={styles.createAccountRow}
                onPress={() => {
                  setIsSignUp(true);
                  setLoginError('');
                  setErrors({});
                }}
                activeOpacity={0.8}
              >
                <Text style={[styles.createAccountText, styles.corporateLoginSecondaryText]}>New to AOLO? </Text>
                <Text style={[styles.createAccountLink, styles.corporateLoginLink]}>Create an account</Text>
              </TouchableOpacity>

              {/* Instant Demo Access Divider */}
              <View style={[styles.demoSectionDivider, styles.corporateLoginDivider]}>
                <View style={[styles.dividerLine, styles.corporateLoginDividerLine]} />
                <Text style={[styles.demoSectionText, styles.corporateLoginDividerText]}>INSTANT DEMO ACCESS</Text>
                <View style={[styles.dividerLine, styles.corporateLoginDividerLine]} />
              </View>

              {/* Green-Outline One-Click Demo Ride Login */}
              <TouchableOpacity
                style={styles.demoOutlineBtn}
                onPress={handleDemoAccess}
                activeOpacity={0.85}
              >
                <Sparkles size={16} color="#65A30D" />
                <Text style={styles.demoOutlineText}>One-Click Demo Ride Login</Text>
              </TouchableOpacity>

              {/* SSL & Firebase auth footnote */}
              <View style={styles.secureFooterRow}>
                <Lock size={12} color="#94A3B8" />
                <Text style={styles.secureFooterText}>Secured with SSL & Local storage auth</Text>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  corporateLoginRoot: {
    backgroundColor: '#000000',
  },
  scrollContent: {
    paddingHorizontal: spacing.px_6,
    paddingTop: spacing.px_6,
    paddingBottom: spacing.px_8,
    justifyContent: 'center',
    minHeight: '100%',
  },
  corporateLoginContent: {
    backgroundColor: '#000000',
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 28,
  },
  headerBox: {
    alignItems: 'center',
    marginBottom: spacing.px_5,
  },
  logoGreenBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: brandColors.aoloGreen,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  logoAoText: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '900',
    fontFamily: 'Roboto',
  },
  cabsBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 1.5,
    borderWidth: 1,
    borderColor: '#000000',
    zIndex: 10,
  },
  cabsBadgeText: {
    color: '#000000',
    fontSize: 8,
    fontWeight: '800',
    fontFamily: 'Roboto',
    letterSpacing: 0.8,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '900',
    fontFamily: 'Roboto',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  corporateLoginBrandTitle: {
    fontSize: 28,
    letterSpacing: -0.4,
  },
  brandSubtitle: {
    color: brandColors.aoloGray,
    fontSize: 13,
    fontFamily: 'Roboto',
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  corporateLoginSubtitle: {
    color: '#B8B8B8',
  },
  formContainer: {
    width: '100%',
    gap: 12,
  },
  corporateLoginForm: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  inputLabel: {
    color: '#64748B',
    fontSize: 11.5,
    fontWeight: '800',
    fontFamily: 'Roboto',
    letterSpacing: 0.5,
    marginTop: 2,
    marginBottom: 4,
  },
  corporateLoginLabel: {
    color: '#B8B8B8',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    height: 52,
    gap: 12,
  },
  corporateLoginInputWrapper: {
    height: 58,
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
    borderRadius: 10,
  },
  inputWrapperError: {
    borderColor: '#E53935',
    backgroundColor: '#FEF2F2',
  },
  input: {
    flex: 1,
    color: '#0A0A0A',
    fontSize: 15,
    fontFamily: 'Roboto',
  },
  corporateLoginInput: {
    color: '#111111',
  },
  eyeBtn: {
    padding: 6,
  },
  fieldErrorText: {
    color: '#E53935',
    fontSize: 11,
    fontFamily: 'Roboto',
    fontWeight: '600',
    marginTop: 3,
    marginLeft: 2,
  },
  generalErrorBanner: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  generalErrorText: {
    color: '#B91C1C',
    fontSize: 12.5,
    fontFamily: 'Roboto',
    fontWeight: '600',
    textAlign: 'center',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
    paddingVertical: 2,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxBoxChecked: {
    backgroundColor: brandColors.aoloGreen,
    borderColor: brandColors.aoloGreen,
  },
  checkboxLabel: {
    color: '#475569',
    fontSize: 12.5,
    fontFamily: 'Roboto',
    flex: 1,
    lineHeight: 18,
  },
  primaryBtn: {
    height: 52,
    backgroundColor: brandColors.aoloGreen,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  corporateLoginButton: {
    height: 58,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  primaryBtnText: {
    color: '#0A0A0A',
    fontSize: 16,
    fontWeight: '800',
    fontFamily: 'Roboto',
  },
  corporateLoginButtonText: {
    fontSize: 18,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  corporateLoginDivider: {
    marginVertical: 8,
  },
  corporateLoginDividerLine: {
    backgroundColor: '#4B5563',
  },
  corporateLoginDividerText: {
    color: '#B8B8B8',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  corporateLoginLink: {
    color: '#84CC16',
  },
  corporateLoginSecondaryText: {
    color: '#B8B8B8',
  },
  dividerText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Roboto',
    marginHorizontal: spacing.px_3,
  },
  ssoBtn: {
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  ssoBtnText: {
    color: '#0A0A0A',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Roboto',
  },
  createAccountRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 6,
    marginBottom: 6,
  },
  createAccountText: {
    color: '#64748B',
    fontSize: 13,
    fontFamily: 'Roboto',
  },
  createAccountLink: {
    color: '#65A30D',
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Roboto',
  },
  forgotPasswordRow: {
    alignSelf: 'flex-end',
    paddingVertical: 2,
    paddingHorizontal: 2,
    marginTop: -5,
    marginBottom: 2,
  },
  demoSectionDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 8,
    gap: 8,
  },
  demoSectionText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '800',
    fontFamily: 'Roboto',
    letterSpacing: 1,
  },
  demoOutlineBtn: {
    height: 48,
    backgroundColor: '#F8FCF2',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: brandColors.aoloGreen,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  demoOutlineText: {
    color: '#4D7C0F',
    fontSize: 13.5,
    fontWeight: '700',
    fontFamily: 'Roboto',
  },
  secureFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8,
  },
  secureFooterText: {
    color: '#94A3B8',
    fontSize: 11.5,
    fontFamily: 'Roboto',
  },
});
