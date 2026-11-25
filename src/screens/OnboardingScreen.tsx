import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  MapPin,
  Car,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Repeat,
  Clock,
  Plane,
  Navigation,
} from 'lucide-react-native';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';
import { brandColors, spacing, borderRadius } from '../theme';
import OnboardingStep, { OnboardingStepConfig } from '../components/onboarding/OnboardingStep';
import ProgressDots from '../components/onboarding/ProgressDots';
import AnimatedButton from '../components/onboarding/AnimatedButton';
import LuxurySplashTransition from '../components/LuxurySplashTransition';

/* ==========================================================================
   SVG VECTOR ILLUSTRATIONS (Pixel-perfect, lightweight, GPU optimized)
   ========================================================================== */

function FlatCardIllustration() {
  return (
    <Svg width="22" height="15" viewBox="0 0 22 15" fill="none">
      <Rect width="22" height="15" rx="2.5" fill="#2563EB" />
      <Rect y="2.5" width="22" height="2.5" fill="#1D4ED8" />
      <Rect x="2.5" y="6.5" width="4.5" height="3.5" rx="0.6" fill="#FBBF24" />
      <Path d="M2.5 8.2 H7 M4.7 6.5 V10" stroke="#D97706" strokeWidth="0.5" />
      <Rect x="2.5" y="11.5" width="6" height="1" rx="0.5" fill="#BFDBFE" />
      <Rect x="9.5" y="11.5" width="3.5" height="1" rx="0.5" fill="#BFDBFE" />
      <Circle cx="16.5" cy="8.2" r="1.8" fill="#EF4444" opacity="0.9" />
      <Circle cx="18.5" cy="8.2" r="1.8" fill="#F59E0B" opacity="0.9" />
    </Svg>
  );
}

function FlatWalletIllustration() {
  return (
    <Svg width="22" height="18" viewBox="0 0 22 18" fill="none">
      <Rect x="4" y="1" width="11" height="6" rx="1.5" fill="#38BDF8" />
      <Rect x="7.5" y="0" width="8" height="3" rx="1" fill="#FBBF24" />
      <Rect x="1" y="4" width="20" height="13" rx="3" fill="#047857" />
      <Path d="M1 7 H21" stroke="#065F46" strokeWidth="1.2" />
      <Rect x="14" y="8" width="6.5" height="5" rx="1.5" fill="#065F46" />
      <Circle cx="17" cy="10.5" r="1.2" fill="#FBBF24" />
    </Svg>
  );
}

function FlatUpiIllustration() {
  return (
    <Svg width="18" height="22" viewBox="0 0 18 22" fill="none">
      <Rect x="0.5" y="0.5" width="17" height="21" rx="3.5" fill="#7C3AED" />
      <Rect x="6.5" y="1.5" width="5" height="0.8" rx="0.4" fill="#C4B5FD" />
      <Rect x="2" y="3" width="14" height="15.5" rx="1.5" fill="#FFFFFF" />
      <Rect x="3.8" y="4.8" width="4.5" height="4.5" rx="1" fill="#F59E0B" />
      <Rect x="9.7" y="4.8" width="4.5" height="4.5" rx="1" fill="#EF4444" />
      <Rect x="3.8" y="10.2" width="4.5" height="4.5" rx="1" fill="#3B82F6" />
      <Rect x="9.7" y="10.2" width="4.5" height="4.5" rx="1" fill="#10B981" />
      <Rect x="6.5" y="19.7" width="5" height="0.8" rx="0.4" fill="#C4B5FD" />
    </Svg>
  );
}

function TaxiIllustration() {
  return (
    <Svg width="24" height="16" viewBox="0 0 24 16" fill="none">
      <Rect x="10" y="1" width="4" height="2" rx="0.5" fill="#F59E0B" />
      <Path d="M5 8 L7 3 H17 L19 8 Z" fill="#FBBF24" />
      <Path d="M7.5 7.5 L9 4 H15 L16.5 7.5 Z" fill="#67E8F9" />
      <Rect x="2" y="7" width="20" height="6" rx="2" fill="#F59E0B" />
      <Circle cx="6" cy="13" r="2" fill="#1E293B" />
      <Circle cx="18" cy="13" r="2" fill="#1E293B" />
      <Circle cx="3" cy="9.5" r="1" fill="#FEF08A" />
      <Circle cx="21" cy="9.5" r="1" fill="#EF4444" />
    </Svg>
  );
}

function LollipopPin() {
  return (
    <Svg width="18" height="26" viewBox="0 0 18 26" fill="none">
      <Path d="M9 14 V24" stroke="#F43F5E" strokeWidth="2.2" strokeLinecap="round" />
      <Circle cx="9" cy="8" r="6.5" fill="#F43F5E" />
      <Circle cx="9" cy="8" r="2.2" fill="#FFFFFF" />
    </Svg>
  );
}

function RouteNodesIcon() {
  return (
    <Svg width="18" height="16" viewBox="0 0 18 16" fill="none">
      <Circle cx="3.5" cy="11.5" r="1.8" fill="#10B981" />
      <Circle cx="14.5" cy="4.5" r="1.8" fill="#10B981" />
      <Path
        d="M3.5 11.5 H7 C9.5 11.5 8.5 4.5 11 4.5 H14.5"
        stroke="#10B981"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Svg>
  );
}

function ReadySparkleGraphic() {
  return (
    <View style={styles.readyGraphicContainer}>
      <View style={styles.readyDashedCircle}>
        <Svg width="88" height="88" viewBox="0 0 88 88">
          <Circle
            cx="44"
            cy="44"
            r="40"
            stroke={brandColors.aoloGreen}
            strokeWidth="2"
            strokeDasharray="6,4.5"
            fill="#F7FCF0"
          />
          <Path
            d="M 44 26 C 44 38 38 44 26 44 C 38 44 44 50 44 62 C 44 50 50 44 62 44 C 50 44 44 38 44 26 Z"
            stroke={brandColors.aoloGreen}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <Path
            d="M 57 24 V 32 M 53 28 H 61"
            stroke={brandColors.aoloGreen}
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <Circle cx="31" cy="57" r="3.6" fill={brandColors.aoloGreen} />
        </Svg>
      </View>

      <View style={styles.readyBadgePill}>
        <Text style={styles.readyBadgeText} numberOfLines={1}>
          100% READY
        </Text>
      </View>
    </View>
  );
}

/* ==========================================================================
   ONBOARDING CONFIG DATA & STEP DEFINITIONS
   ========================================================================== */

interface OnboardingScreenProps {
  onComplete: () => void;
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [direction, setDirection] = useState<'next' | 'back'>('next');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<'wallet' | 'upi' | 'card'>('wallet');

  // Animation values for back button expansion
  const backBtnWidth = useRef(new Animated.Value(0)).current;
  const backBtnOpacity = useRef(new Animated.Value(0)).current;

  // Stagger / Step transition handler with double-tap protection
  const handleNext = () => {
    if (isTransitioning) return;
    if (currentStepIndex < 4) {
      setIsTransitioning(true);
      setDirection('next');
      setCurrentStepIndex((prev) => prev + 1);
      setTimeout(() => setIsTransitioning(false), 400);
    } else if (currentStepIndex === 4) {
      setCurrentStepIndex(5);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (isTransitioning) return;
    if (currentStepIndex > 0) {
      setIsTransitioning(true);
      setDirection('back');
      setCurrentStepIndex((prev) => prev - 1);
      setTimeout(() => setIsTransitioning(false), 400);
    }
  };

  // Animate Back button entrance/exit from step 2 onwards
  useEffect(() => {
    if (currentStepIndex > 0 && currentStepIndex < 5) {
      Animated.parallel([
        Animated.spring(backBtnWidth, {
          toValue: 96,
          friction: 8,
          tension: 45,
          useNativeDriver: false,
        }),
        Animated.timing(backBtnOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backBtnWidth, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(backBtnOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [currentStepIndex, backBtnWidth, backBtnOpacity]);

  if (currentStepIndex === 5) {
    return <LuxurySplashTransition onComplete={onComplete} />;
  }

  // Steps configuration
  const steps: OnboardingStepConfig[] = [
    {
      id: 'step-1-welcome',
      title: 'WELCOME TO AOLO CABS',
      subtitle: 'Fast, safe, and affordable rides for every journey.',
      renderIllustration: (floatingAnim) => {
        const floatUp = floatingAnim.interpolate({
          inputRange: [-1, 1],
          outputRange: [-4, 4],
        });
        const floatDown = floatingAnim.interpolate({
          inputRange: [-1, 1],
          outputRange: [4, -4],
        });

        return (
          <View style={styles.phoneMockupContainer}>
            {/* Soft White Backdrop Card with City Skyline */}
            <View style={styles.cityBackdrop}>
              <View style={styles.skylineBottomContainer}>
                <View style={styles.buildingsRow}>
                  <View style={[styles.buildingBar, { height: 26, width: 20 }]} />
                  <View style={[styles.buildingBar, { height: 48, width: 28 }]} />
                  <View style={[styles.buildingBar, { height: 32, width: 22 }]} />
                  <View style={[styles.buildingBar, { height: 56, width: 30 }]} />
                  <View style={[styles.buildingBar, { height: 36, width: 24 }]} />
                  <View style={[styles.buildingBar, { height: 46, width: 26 }]} />
                  <View style={[styles.buildingBar, { height: 28, width: 20 }]} />
                </View>
                <View style={styles.roadBar}>
                  <View style={styles.roadDash} />
                  <View style={styles.roadDash} />
                  <View style={styles.roadDash} />
                  <View style={styles.roadDash} />
                  <View style={styles.roadDash} />
                  <View style={styles.roadDash} />
                </View>
              </View>
            </View>

            {/* Phone Shell Wrapper */}
            <View style={styles.phoneShellWrapper}>
              {/* Floating Location Card (Overlapping Top-Left) */}
              <Animated.View
                style={[
                  styles.floatingLocationPill,
                  { transform: [{ translateY: floatUp }] },
                ]}
              >
                <View style={styles.locIconCircle}>
                  <MapPin size={13} color="#84CC16" />
                </View>
                <View>
                  <Text style={styles.locSubLabel}>YOUR LOCATION</Text>
                  <Text style={styles.locMainLabel}>Saharsa, IN</Text>
                </View>
              </Animated.View>

              {/* Dark Phone Shell */}
              <View style={styles.darkPhoneShell}>
                <View style={styles.phoneTopSection}>
                  <View style={styles.phonePillNotch} />
                  <View style={styles.phoneTopBar}>
                    <View style={styles.phoneLogoRow}>
                      <View style={styles.phoneGreenDot} />
                      <Text style={styles.phoneLogoTextWhite}>AOLO</Text>
                    </View>
                    <Text style={styles.phoneTimeTextCyan}>12:30 PM</Text>
                  </View>

                  <View style={styles.phoneRideCard}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <TaxiIllustration />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.phoneCarName}>Comfort Sedan</Text>
                        <Text style={styles.phoneCarMeta}>ETA: 3 min • AC</Text>
                      </View>
                      <Text style={styles.phoneCarPrice}>₹240</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.phoneMapArea}>
                  <View style={styles.redPinPosition}>
                    <LollipopPin />
                  </View>
                </View>

                <View style={styles.phoneConfirmBtn}>
                  <Text style={styles.phoneConfirmText}>CONFIRM BOOKING</Text>
                </View>
              </View>

              {/* Floating Reliability Card (Overlapping Middle-Right) */}
              <Animated.View
                style={[
                  styles.floatingReliabilityBadge,
                  { transform: [{ translateY: floatDown }] },
                ]}
              >
                <View style={styles.relIconSquare}>
                  <RouteNodesIcon />
                </View>
                <View>
                  <Text style={styles.relSubLabel}>RELIABILITY</Text>
                  <Text style={styles.relMainLabel}>99.8% ETA</Text>
                </View>
              </Animated.View>
            </View>
          </View>
        );
      },
    },
    {
      id: 'step-2-modes',
      title: 'RIDE YOUR WAY',
      subtitle: 'Book One-Way, Round Trip, Rental, or Airport rides with just a few taps.',
      renderIllustration: () => (
        <View style={styles.modesContainer}>
          <Text style={styles.sectionLabel}>4 PREMIUM BOOKING MODES</Text>
          <View style={styles.grid2x2}>
            {/* One-Way */}
            <View style={[styles.gridCard, styles.gridCardSelected]}>
              <View style={styles.popularTag}>
                <Text style={styles.popularTagText}>POPULAR</Text>
              </View>
              <View style={styles.iconBoxGreen}>
                <Car size={20} color={brandColors.aoloBlack} />
              </View>
              <Text style={styles.gridCardTitle}>One-Way</Text>
              <Text style={styles.gridCardSub}>Intercity trips made simple</Text>
            </View>

            {/* Round Trip */}
            <View style={styles.gridCard}>
              <View style={styles.iconBoxBlue}>
                <Repeat size={20} color="#2563EB" />
              </View>
              <Text style={styles.gridCardTitle}>Round Trip</Text>
              <Text style={styles.gridCardSub}>Flexible multi-day returns</Text>
            </View>

            {/* Rental Packages */}
            <View style={styles.gridCard}>
              <View style={styles.iconBoxGray}>
                <Clock size={20} color={brandColors.aoloBlack} />
              </View>
              <Text style={styles.gridCardTitle}>Rental Packages</Text>
              <Text style={styles.gridCardSub}>Hourly and daily plans</Text>
            </View>

            {/* Airport Transfers */}
            <View style={styles.gridCard}>
              <View style={styles.iconBoxGray}>
                <Plane size={20} color={brandColors.aoloBlack} />
              </View>
              <Text style={styles.gridCardTitle}>Airport Transfers</Text>
              <Text style={styles.gridCardSub}>Guaranteed flight pickup</Text>
            </View>
          </View>
        </View>
      ),
    },
    {
      id: 'step-3-tracking',
      title: 'TRACK EVERY RIDE',
      subtitle: 'Monitor your driver in real time, view ETA, and share your live location.',
      renderIllustration: (floatingAnim) => {
        // Glide smoothly along the curve path so the badge stays attached to the line
        const carAlongCurveX = floatingAnim.interpolate({
          inputRange: [-1, 1],
          outputRange: [-6, 6],
        });
        const carAlongCurveY = floatingAnim.interpolate({
          inputRange: [-1, 1],
          outputRange: [1, -1],
        });
        const carPulse = floatingAnim.interpolate({
          inputRange: [-1, 0, 1],
          outputRange: [0.98, 1, 1.03],
        });

        return (
          <View style={styles.darkMapCard}>
            <View style={styles.darkMapCardHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={styles.navCircleGreen}>
                  <Navigation size={13} color={brandColors.aoloGreen} fill={brandColors.aoloGreen} />
                </View>
                <View>
                  <Text style={styles.driverEtaLabel}>DRIVER ETA</Text>
                  <Text style={styles.driverEtaValue}>Arriving in 3.5 mins</Text>
                </View>
              </View>

              <View style={styles.liveMapPill}>
                <Text style={styles.liveMapPillText}>LIVE MAP</Text>
              </View>
            </View>

            <View style={styles.mapGraphicArea}>
              <Svg width="275" height="245" viewBox="0 0 275 245" style={StyleSheet.absoluteFill}>
                <Path
                  d="M -10 65 Q 120 30 285 130"
                  stroke="rgba(255, 255, 255, 0.12)"
                  strokeWidth="1.5"
                  fill="none"
                />
                <Path
                  d="M 50 245 L 285 85"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="1.5"
                  fill="none"
                />
                <Path
                  d="M 50 115 Q 145 52 225 95"
                  stroke={brandColors.aoloGreen}
                  strokeWidth="3"
                  strokeDasharray="5,4"
                  fill="none"
                />
                <Circle cx="50" cy="115" r="6" fill="#10B981" stroke="#A8E63C" strokeWidth="2" />
                <Circle cx="225" cy="95" r="7" fill="#E53935" stroke="#FFFFFF" strokeWidth="1.5" />
              </Svg>

              <View style={styles.startBadgePos}>
                <Text style={styles.pinLabelText}>Start</Text>
              </View>

              <Animated.View
                style={[
                  styles.carBadgeOnCurve,
                  {
                    transform: [
                      { translateX: carAlongCurveX },
                      { translateY: carAlongCurveY },
                      { scale: carPulse },
                    ],
                  },
                ]}
              >
                <Car size={11} color={brandColors.aoloBlack} />
                <Text style={styles.carBadgeText}>AO</Text>
              </Animated.View>

              <View style={styles.endBadgePos}>
                <Text style={styles.pinLabelText}>End</Text>
              </View>
            </View>
          </View>
        );
      },
    },
    {
      id: 'step-4-payments',
      title: 'EASY & SECURE PAYMENTS',
      subtitle: 'Pay using UPI, Cards, Wallet, or Cash with transparent pricing.',
      renderIllustration: () => (
        <View style={styles.paymentVisualCard}>
          <View style={styles.paymentHeaderRow}>
            <Text style={styles.paymentHeaderTitle}>SELECT PAYMENT</Text>
            <View style={styles.secureBadgeTextCol}>
              <Text style={styles.secureBadgeTextLine1}>SECURE</Text>
              <Text style={styles.secureBadgeTextLine2}>256-BIT</Text>
            </View>
          </View>

          <View style={styles.paymentListContainer}>
            {/* Wallet */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setSelectedPayment('wallet')}
              style={[
                styles.paymentMethodRow,
                selectedPayment === 'wallet' && styles.paymentMethodRowSelected,
              ]}
            >
              <View style={styles.paymentRowLeft}>
                <View
                  style={[
                    styles.paymentIconBoxWallet,
                    selectedPayment === 'wallet' && styles.paymentIconBoxSelected,
                  ]}
                >
                  <FlatWalletIllustration />
                </View>
                <View style={styles.paymentTextCol}>
                  <Text style={styles.paymentTitle}>AOLO Wallet</Text>
                  <Text style={styles.paymentSubtitle}>Instant auto-debit</Text>
                </View>
              </View>
              {selectedPayment === 'wallet' ? (
                <CheckCircle2 size={19} color={brandColors.aoloGreen} />
              ) : (
                <View style={styles.unselectedRadioCircle} />
              )}
            </TouchableOpacity>

            {/* UPI */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setSelectedPayment('upi')}
              style={[
                styles.paymentMethodRow,
                selectedPayment === 'upi' && styles.paymentMethodRowSelected,
              ]}
            >
              <View style={styles.paymentRowLeft}>
                <View
                  style={[
                    styles.paymentIconBoxUpi,
                    selectedPayment === 'upi' && styles.paymentIconBoxSelected,
                  ]}
                >
                  <FlatUpiIllustration />
                </View>
                <View style={styles.paymentTextCol}>
                  <Text style={styles.paymentTitle}>UPI (GPay/PhonePe)</Text>
                  <Text style={styles.paymentSubtitle}>Pay via any UPI app</Text>
                </View>
              </View>
              {selectedPayment === 'upi' ? (
                <CheckCircle2 size={19} color={brandColors.aoloGreen} />
              ) : (
                <View style={styles.unselectedRadioCircle} />
              )}
            </TouchableOpacity>

            {/* Card */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setSelectedPayment('card')}
              style={[
                styles.paymentMethodRow,
                selectedPayment === 'card' && styles.paymentMethodRowSelected,
              ]}
            >
              <View style={styles.paymentRowLeft}>
                <View
                  style={[
                    styles.paymentIconBoxCard,
                    selectedPayment === 'card' && styles.paymentIconBoxSelected,
                  ]}
                >
                  <FlatCardIllustration />
                </View>
                <View style={styles.paymentTextCol}>
                  <Text style={styles.paymentTitle}>Credit / Debit Card</Text>
                  <Text style={styles.paymentSubtitle}>All major cards accepted</Text>
                </View>
              </View>
              {selectedPayment === 'card' ? (
                <CheckCircle2 size={19} color={brandColors.aoloGreen} />
              ) : (
                <View style={styles.unselectedRadioCircle} />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.transparentFareBanner}>
            <ShieldCheck size={14} color="#059669" />
            <Text style={styles.transparentFareText}>TRANSPARENT FARE • NO HIDDEN CHARGES</Text>
          </View>
        </View>
      ),
    },
    {
      id: 'step-5-ready',
      title: "LET'S GET STARTED",
      subtitle: 'Create your account and book your first ride in seconds.',
      renderIllustration: () => (
        <View style={styles.readyContainer}>
          <ReadySparkleGraphic />
          <Text style={styles.bookStepsLabelDark}>BOOK IN 3 EASY STEPS</Text>
          <View style={styles.stepsVisualContainer}>
            <View style={styles.stepItemCard}>
              <View style={styles.stepNumCircle}>
                <Text style={styles.stepNumText}>1</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.stepTitle}>Register instantly</Text>
                <Text style={styles.stepSub}>Requires only email & mobile</Text>
              </View>
            </View>

            <View style={styles.stepItemCard}>
              <View style={styles.stepNumCircle}>
                <Text style={styles.stepNumText}>2</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.stepTitle}>Select Destination</Text>
                <Text style={styles.stepSub}>Get upfront fare estimates</Text>
              </View>
            </View>

            <View style={styles.stepItemCard}>
              <View style={[styles.stepNumCircle, styles.stepNumCircleGreen]}>
                <Text style={styles.stepNumTextGreen}>3</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.stepTitle}>Hop In & Relax</Text>
                <Text style={[styles.stepSub, styles.stepSubGreen]}>
                  AOLO ride captain guarantees safety
                </Text>
              </View>
            </View>
          </View>
        </View>
      ),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Header */}
      <View style={styles.topBar}>
        <View style={styles.badgePill}>
          <View style={styles.greenDot} />
          <Text style={styles.badgeText}>AOLO APP · ONBOARDING</Text>
        </View>

        <TouchableOpacity
          onPress={onComplete}
          style={styles.skipBtn}
          activeOpacity={0.7}
        >
          <Text style={styles.skipText}>SKIP FLOW</Text>
        </TouchableOpacity>
      </View>

      {/* Center Body: Keyed Transition Screen */}
      <ScrollView
        contentContainerStyle={styles.scrollBody}
        showsVerticalScrollIndicator={false}
      >
        <OnboardingStep
          key={steps[currentStepIndex].id}
          step={steps[currentStepIndex]}
          direction={direction}
          stepIndex={currentStepIndex}
        />
      </ScrollView>

      {/* Footer Navigation */}
      <View style={styles.footerContainer}>
        {/* Animated Progress Dots */}
        <ProgressDots
          totalSteps={5}
          activeIndex={currentStepIndex}
          activeColor="#A6E22E"
          inactiveColor="#E2E8F0"
        />

        {/* Buttons Row with smooth spring width expansion */}
        <View style={styles.actionButtonsRow}>
          {/* Back Button (Expands from 0 to 96px width on step 2+) */}
          <Animated.View
            style={[
              styles.backButtonWrap,
              {
                width: backBtnWidth,
                opacity: backBtnOpacity,
                marginRight: currentStepIndex > 0 ? 10 : 0,
              },
            ]}
          >
            <AnimatedButton
              onPress={handleBack}
              disabled={isTransitioning || currentStepIndex === 0}
              style={styles.backBtn}
            >
              <Text style={styles.backBtnText}>BACK</Text>
            </AnimatedButton>
          </Animated.View>

          {/* Next / Get Started Button (Resizes smoothly to fit) */}
          <View style={styles.nextButtonWrap}>
            <AnimatedButton
              onPress={handleNext}
              disabled={isTransitioning}
              style={[
                styles.primaryBtn,
                currentStepIndex === 4 && styles.getStartedBtn,
              ]}
            >
              <Text
                style={[
                  styles.primaryBtnText,
                  currentStepIndex === 4 && styles.getStartedBtnText,
                ]}
              >
                {currentStepIndex === 4 ? 'GET STARTED' : 'NEXT STEP'}
              </Text>
              <ArrowRight
                size={18}
                color={currentStepIndex === 4 ? '#0A0A0A' : '#FFFFFF'}
              />
            </AnimatedButton>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

/* ==========================================================================
   STYLESHEET
   ========================================================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 6,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#84CC16',
    marginRight: 6,
  },
  badgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
    letterSpacing: 0.8,
  },
  skipBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
  },
  skipText: {
    fontSize: 11,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  scrollBody: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },

  // Step 1: Phone Mockup
  phoneMockupContainer: {
    width: 320,
    height: 330,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cityBackdrop: {
    position: 'absolute',
    width: 300,
    height: 290,
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  skylineBottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  buildingsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-evenly',
    paddingHorizontal: 10,
  },
  buildingBar: {
    backgroundColor: '#E2E8F0',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  roadBar: {
    height: 20,
    backgroundColor: '#CBD5E1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  roadDash: {
    width: 16,
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
  phoneShellWrapper: {
    width: 230,
    height: 300,
    position: 'relative',
    alignItems: 'center',
  },
  darkPhoneShell: {
    width: 200,
    height: 285,
    backgroundColor: '#0F172A',
    borderRadius: 28,
    borderWidth: 4,
    borderColor: '#1E293B',
    padding: 8,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  phoneTopSection: {
    alignItems: 'center',
  },
  phonePillNotch: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#334155',
    marginBottom: 6,
  },
  phoneTopBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  phoneLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  phoneGreenDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#A6E22E',
  },
  phoneLogoTextWhite: {
    fontSize: 10,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#FFFFFF',
  },
  phoneTimeTextCyan: {
    fontSize: 9,
    fontWeight: '700',
    fontFamily: 'Roboto',
    color: '#67E8F9',
  },
  phoneRideCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 8,
  },
  phoneCarName: {
    fontSize: 11,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  phoneCarMeta: {
    fontSize: 8.5,
    color: '#64748B',
    fontFamily: 'Roboto',
  },
  phoneCarPrice: {
    fontSize: 12,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  phoneMapArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  redPinPosition: {
    alignItems: 'center',
  },
  phoneConfirmBtn: {
    backgroundColor: '#A6E22E',
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  phoneConfirmText: {
    fontSize: 9.5,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0A0A0A',
    letterSpacing: 0.5,
  },
  floatingLocationPill: {
    position: 'absolute',
    top: 15,
    left: -15,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  locIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F7FEE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locSubLabel: {
    fontSize: 7.5,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#94A3B8',
    letterSpacing: 0.3,
  },
  locMainLabel: {
    fontSize: 10,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  floatingReliabilityBadge: {
    position: 'absolute',
    bottom: 45,
    right: -25,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  relIconSquare: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  relSubLabel: {
    fontSize: 7.5,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#94A3B8',
    letterSpacing: 0.3,
  },
  relMainLabel: {
    fontSize: 10,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#059669',
  },

  // Step 2: 4 Modes
  modesContainer: {
    width: '100%',
    alignItems: 'center',
  },
  sectionLabel: {
    fontSize: 10.5,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#94A3B8',
    letterSpacing: 1.2,
    marginBottom: 14,
  },
  grid2x2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    width: '100%',
    maxWidth: 330,
  },
  gridCard: {
    width: '47%',
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    position: 'relative',
  },
  gridCardSelected: {
    borderColor: '#A6E22E',
    backgroundColor: '#FFFFFF',
    shadowColor: '#A6E22E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  popularTag: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#A6E22E',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  popularTagText: {
    fontSize: 7.5,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0A0A0A',
  },
  iconBoxGreen: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#ECFCCB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  iconBoxBlue: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  iconBoxGray: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  gridCardTitle: {
    fontSize: 13,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0F172A',
    marginBottom: 2,
  },
  gridCardSub: {
    fontSize: 10,
    fontFamily: 'Roboto',
    color: '#64748B',
  },

  // Step 3: Dark Map Card
  darkMapCard: {
    width: 300,
    height: 290,
    backgroundColor: '#0F172A',
    borderRadius: 24,
    padding: 14,
    justifyContent: 'space-between',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 6,
  },
  darkMapCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    zIndex: 5,
  },
  navCircleGreen: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#14532D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverEtaLabel: {
    fontSize: 7.5,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#94A3B8',
    letterSpacing: 0.4,
  },
  driverEtaValue: {
    fontSize: 10.5,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#FFFFFF',
  },
  liveMapPill: {
    backgroundColor: '#A6E22E',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  liveMapPillText: {
    fontSize: 8,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0A0A0A',
  },
  mapGraphicArea: {
    flex: 1,
    position: 'relative',
    marginTop: 10,
  },
  startBadgePos: {
    position: 'absolute',
    left: 36,
    top: 130,
    backgroundColor: '#10B981',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  pinLabelText: {
    fontSize: 8,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#FFFFFF',
  },
  carBadgeOnCurve: {
    position: 'absolute',
    left: 122,
    top: 70,
    backgroundColor: '#A6E22E',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#0F172A',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  carBadgeText: {
    fontSize: 8.5,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0A0A0A',
  },
  endBadgePos: {
    position: 'absolute',
    right: 32,
    top: 110,
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },

  // Step 4: Payments
  paymentVisualCard: {
    width: 300,
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  paymentHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  paymentHeaderTitle: {
    fontSize: 11,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0F172A',
    letterSpacing: 0.6,
  },
  secureBadgeTextCol: {
    alignItems: 'flex-end',
  },
  secureBadgeTextLine1: {
    fontSize: 7.5,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#059669',
  },
  secureBadgeTextLine2: {
    fontSize: 7,
    fontWeight: '700',
    fontFamily: 'Roboto',
    color: '#94A3B8',
  },
  paymentListContainer: {
    gap: 8,
    marginBottom: 12,
  },
  paymentMethodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
  },
  paymentMethodRowSelected: {
    borderColor: '#A6E22E',
    backgroundColor: '#FAFCF5',
  },
  paymentRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  paymentIconBoxWallet: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentIconBoxUpi: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#F5F3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentIconBoxCard: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentIconBoxSelected: {
    backgroundColor: '#ECFCCB',
  },
  paymentTextCol: {
    justifyContent: 'center',
  },
  paymentTitle: {
    fontSize: 12,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  paymentSubtitle: {
    fontSize: 9.5,
    fontFamily: 'Roboto',
    color: '#64748B',
  },
  unselectedRadioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  transparentFareBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingVertical: 6,
    borderRadius: 10,
  },
  transparentFareText: {
    fontSize: 8,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#059669',
    letterSpacing: 0.4,
  },

  // Step 5: Ready Sparkle Graphic
  readyContainer: {
    width: '100%',
    alignItems: 'center',
  },
  readyGraphicContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 14,
  },
  readyDashedCircle: {
    width: 88,
    height: 88,
    alignItems: 'center',
    justifyContent: 'center',
  },
  readyBadgePill: {
    position: 'absolute',
    bottom: -6,
    backgroundColor: '#0A0A0A',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A6E22E',
  },
  readyBadgeText: {
    fontSize: 8,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#FFFFFF',
    letterSpacing: 0.6,
  },
  bookStepsLabelDark: {
    fontSize: 11,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0F172A',
    letterSpacing: 1,
    marginBottom: 12,
  },
  stepsVisualContainer: {
    width: '100%',
    maxWidth: 300,
    gap: 8,
  },
  stepItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  stepNumCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumCircleGreen: {
    backgroundColor: '#A6E22E',
  },
  stepNumText: {
    fontSize: 11,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#475569',
  },
  stepNumTextGreen: {
    fontSize: 11,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#0A0A0A',
  },
  stepTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
  },
  stepSub: {
    fontSize: 9.5,
    fontFamily: 'Roboto',
    color: '#64748B',
  },
  stepSubGreen: {
    color: '#16A34A',
    fontWeight: '600',
  },

  // Footer Navigation & Buttons
  footerContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 8,
    backgroundColor: '#FFFFFF',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  backButtonWrap: {
    overflow: 'hidden',
  },
  backBtn: {
    height: 52,
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#475569',
    letterSpacing: 0.6,
  },
  nextButtonWrap: {
    flex: 1,
  },
  primaryBtn: {
    height: 52,
    backgroundColor: '#0F172A',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnText: {
    fontSize: 13.5,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  getStartedBtn: {
    backgroundColor: '#A6E22E',
    shadowColor: '#A6E22E',
    shadowOpacity: 0.35,
  },
  getStartedBtnText: {
    color: '#0A0A0A',
  },
});
