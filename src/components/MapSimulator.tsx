import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Animated, Text } from 'react-native';
import Svg, {
  Path,
  Rect,
  Circle,
  G,
  Text as SvgText,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import { Location, Driver, RideStatus } from '../types';

export interface MapSimulatorProps {
  pickup?: Location | null;
  dropoff?: Location | null;
  driver?: Driver | null;
  rideStatus?: RideStatus;
  driverLat?: number;
  driverLng?: number;
  onRecenter?: () => void;
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
}

export default function MapSimulator({
  pickup,
  dropoff,
  driver,
  rideStatus,
}: MapSimulatorProps) {
  // Smooth animated coordinates for Ola Cabs using React Native Animated API
  const car1Anim = useRef(new Animated.Value(0)).current;
  const car2Anim = useRef(new Animated.Value(0)).current;
  const car3Anim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const routeFlowAnim = useRef(new Animated.Value(0)).current;

  const [car1Pos, setCar1Pos] = useState({ x: 145, y: 220, angle: 0 });
  const [car2Pos, setCar2Pos] = useState({ x: 270, y: 130, angle: -15 });
  const [car3Pos, setCar3Pos] = useState({ x: 210, y: 340, angle: 45 });
  const [pulse, setPulse] = useState({ scale: 1, opacity: 0.5 });
  const [dashOffset, setDashOffset] = useState(0);

  useEffect(() => {
    // Car 1 cruises along central Saharsa corridor
    const anim1 = Animated.loop(
      Animated.sequence([
        Animated.timing(car1Anim, {
          toValue: 1,
          duration: 3800,
          useNativeDriver: false,
        }),
        Animated.timing(car1Anim, {
          toValue: 0,
          duration: 3800,
          useNativeDriver: false,
        }),
      ])
    );

    // Car 2 cruises towards highway interchange
    const anim2 = Animated.loop(
      Animated.sequence([
        Animated.timing(car2Anim, {
          toValue: 1,
          duration: 4400,
          useNativeDriver: false,
        }),
        Animated.timing(car2Anim, {
          toValue: 0,
          duration: 4400,
          useNativeDriver: false,
        }),
      ])
    );

    // Car 3 cruises across south sector
    const anim3 = Animated.loop(
      Animated.sequence([
        Animated.timing(car3Anim, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: false,
        }),
        Animated.timing(car3Anim, {
          toValue: 0,
          duration: 5000,
          useNativeDriver: false,
        }),
      ])
    );

    // Ola Live Radar pulse
    const animPulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: false,
        }),
      ])
    );

    // Flowing route dash animation
    const animRoute = Animated.loop(
      Animated.timing(routeFlowAnim, {
        toValue: 20,
        duration: 1200,
        useNativeDriver: false,
      })
    );

    const id1 = car1Anim.addListener(({ value }) => {
      setCar1Pos({
        x: 145 + Math.sin(value * Math.PI) * 12,
        y: 200 + value * 55,
        angle: value > 0.5 ? 180 : 0,
      });
    });

    const id2 = car2Anim.addListener(({ value }) => {
      setCar2Pos({
        x: 260 + value * 40,
        y: 135 - value * 25,
        angle: -20,
      });
    });

    const id3 = car3Anim.addListener(({ value }) => {
      setCar3Pos({
        x: 190 + value * 50,
        y: 330 + value * 20,
        angle: 25,
      });
    });

    const idPulse = pulseAnim.addListener(({ value }) => {
      setPulse({
        scale: 1 + value * 0.45,
        opacity: 0.5 - value * 0.35,
      });
    });

    const idRoute = routeFlowAnim.addListener(({ value }) => {
      setDashOffset(value);
    });

    anim1.start();
    anim2.start();
    anim3.start();
    animPulse.start();
    animRoute.start();

    return () => {
      anim1.stop();
      anim2.stop();
      anim3.stop();
      animPulse.stop();
      animRoute.stop();
      car1Anim.removeListener(id1);
      car2Anim.removeListener(id2);
      car3Anim.removeListener(id3);
      pulseAnim.removeListener(idPulse);
      routeFlowAnim.removeListener(idRoute);
    };
  }, [car1Anim, car2Anim, car3Anim, pulseAnim, routeFlowAnim]);

  // Route path calculation if pickup & dropoff exist
  const getRouteSvgPath = () => {
    const x1 = 145;
    const y1 = 255;
    const x2 = 285;
    const y2 = 440;
    const cx = (x1 + x2) / 2 - 35;
    const cy = (y1 + y2) / 2 - 15;
    return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
  };

  return (
    <View style={styles.container} pointerEvents="none">
      <Svg
        style={styles.svgMap}
        viewBox="0 0 400 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <Defs>
          {/* Ola Water Body Gradient */}
          <LinearGradient id="olaWaterGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#C9E6FD" />
            <Stop offset="1" stopColor="#B3DCFC" />
          </LinearGradient>

          {/* Ola Signature Neon Lime Route Gradient */}
          <LinearGradient id="olaRouteGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#00D25B" />
            <Stop offset="0.6" stopColor="#10B981" />
            <Stop offset="1" stopColor="#059669" />
          </LinearGradient>

          {/* Ola Park Gradient */}
          <LinearGradient id="olaParkGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#DCFCE7" />
            <Stop offset="1" stopColor="#D1FAE5" />
          </LinearGradient>
        </Defs>

        {/* 1. Ola Map Base Canvas Ground */}
        <Rect x="0" y="0" width="400" height="800" fill="#F4F6F8" />

        {/* Radar Field Cone (Light Blue Sector from top center downwards) */}
        <Path
          d="M 190 -20 L 70 420 L 330 420 Z"
          fill="#BAE6FD"
          opacity={0.4}
        />

        {/* Airport District Grid Lines & Label */}
        <Path
          d="M 125 0 L 125 430 M 0 178 L 400 178 M 0 325 L 400 325 M 340 0 L 340 430"
          stroke="#CBD5E1"
          strokeWidth="1.2"
          strokeDasharray="5, 5"
          fill="none"
        />
        <SvgText
          x="22"
          y="192"
          fill="#64748B"
          fontSize="9.5"
          fontWeight="800"
          letterSpacing="1.2"
        >
          AIRPORT DISTRICT
        </SvgText>

        {/* Scooter circular badges matching screenshot */}
        <G x="306" y="168">
          <Circle cx="0" cy="0" r="14" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.5" />
          <Circle cx="0" cy="0" r="12" fill="#F1F5F9" />
          <Path
            d="M -5 3 A 2 2 0 1 0 -1 3 A 2 2 0 1 0 -5 3 M 3 3 A 2 2 0 1 0 7 3 A 2 2 0 1 0 3 3 M -3 3 L -1 0 L 3 0 L 5 3 M 1 -3 L 3 0"
            stroke="#6366F1"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>
        <G x="140" y="362">
          <Circle cx="0" cy="0" r="14" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.5" />
          <Circle cx="0" cy="0" r="12" fill="#F1F5F9" />
          <Path
            d="M -5 3 A 2 2 0 1 0 -1 3 A 2 2 0 1 0 -5 3 M 3 3 A 2 2 0 1 0 7 3 A 2 2 0 1 0 3 3 M -3 3 L -1 0 L 3 0 L 5 3 M 1 -3 L 3 0"
            stroke="#6366F1"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>

        {/* 2. Waterways & Rivers (Kosi River Basin) */}
        <Path
          d="M 30 -60 C 130 -70, 390 -40, 440 130 C 470 250, 330 320, 190 260 C 90 220, 10 90, 30 -60 Z"
          fill="url(#olaWaterGrad)"
          opacity={0.9}
        />
        <Path
          d="M -30 190 C 30 185, 75 225, 115 210 C 150 195, 180 235, 220 225 L 210 255 C 170 265, 140 230, 100 240 C 60 250, 20 225, -30 230 Z"
          fill="#BAE6FD"
          opacity={0.7}
        />

        {/* 3. Ola Green Parks & Eco Zones */}
        <Rect x="20" y="295" width="70" height="55" rx="10" fill="url(#olaParkGrad)" />
        <Rect x="250" y="375" width="90" height="65" rx="12" fill="url(#olaParkGrad)" />
        <Rect x="30" y="640" width="95" height="75" rx="12" fill="url(#olaParkGrad)" />
        <Rect x="280" y="580" width="75" height="50" rx="8" fill="url(#olaParkGrad)" />

        {/* Park Trees/Decorations */}
        <Circle cx="35" cy="310" r="4" fill="#86EFAC" opacity={0.8} />
        <Circle cx="50" cy="325" r="5" fill="#4ADE80" opacity={0.7} />
        <Circle cx="275" cy="395" r="5" fill="#4ADE80" opacity={0.7} />
        <Circle cx="300" cy="410" r="6" fill="#86EFAC" opacity={0.8} />

        {/* 4. Urban Buildings & Real Estate Blocks */}
        <Rect x="45" y="370" width="48" height="42" rx="4" fill="#E2E8F0" opacity={0.9} />
        <Rect x="105" y="370" width="58" height="42" rx="4" fill="#E2E8F0" opacity={0.9} />
        <Rect x="45" y="430" width="48" height="52" rx="4" fill="#E2E8F0" opacity={0.9} />
        <Rect x="105" y="430" width="58" height="52" rx="4" fill="#E2E8F0" opacity={0.9} />
        <Rect x="205" y="460" width="68" height="48" rx="4" fill="#E2E8F0" opacity={0.9} />
        <Rect x="285" y="460" width="68" height="48" rx="4" fill="#E2E8F0" opacity={0.9} />
        <Rect x="205" y="525" width="68" height="55" rx="4" fill="#E2E8F0" opacity={0.9} />
        <Rect x="285" y="525" width="68" height="55" rx="4" fill="#E2E8F0" opacity={0.9} />

        {/* 5. City Road Grid & Residential Streets */}
        <Path
          d="M 100 0 L 100 800 M 190 0 L 190 800 M 295 0 L 295 800"
          stroke="#E2E8F0"
          strokeWidth="3.5"
          fill="none"
        />
        <Path
          d="M 0 85 L 400 85 M 0 155 L 400 155 M 0 225 L 400 225 M 0 360 L 400 360 M 0 440 L 400 440 M 0 520 L 400 520 M 0 600 L 400 600 M 0 680 L 400 680"
          stroke="#E2E8F0"
          strokeWidth="3.5"
          fill="none"
        />

        {/* 6. Ola Arterial Roads & Expressways (Clean White with Grey outline) */}
        {/* Main State Highway */}
        <Path
          d="M -10 320 Q 150 275 250 335 T 410 325"
          stroke="#CBD5E1"
          strokeWidth="9"
          fill="none"
        />
        <Path
          d="M -10 320 Q 150 275 250 335 T 410 325"
          stroke="#FFFFFF"
          strokeWidth="7"
          fill="none"
        />
        <Path
          d="M -10 320 Q 150 275 250 335 T 410 325"
          stroke="#FBBF24"
          strokeWidth="1.2"
          strokeDasharray="8, 6"
          fill="none"
        />

        {/* Vertical City Expressway */}
        <Path
          d="M 145 0 Q 160 240 145 480 T 150 800"
          stroke="#CBD5E1"
          strokeWidth="8"
          fill="none"
        />
        <Path
          d="M 145 0 Q 160 240 145 480 T 150 800"
          stroke="#FFFFFF"
          strokeWidth="6"
          fill="none"
        />
        <Path
          d="M 145 0 Q 160 240 145 480 T 150 800"
          stroke="#94A3B8"
          strokeWidth="1"
          strokeDasharray="6, 5"
          fill="none"
        />

        {/* 7. Ola Map Street & District Labels */}
        <SvgText x="28" y="135" fill="#94A3B8" fontSize="10" fontWeight="800" letterSpacing="1">
          STADIUM ROAD
        </SvgText>
        <SvgText x="250" y="80" fill="#94A3B8" fontSize="9" fontWeight="700" letterSpacing="0.8">
          KOSI CORRIDOR
        </SvgText>
        <SvgText x="25" y="270" fill="#94A3B8" fontSize="9.5" fontWeight="800" letterSpacing="1">
          SAHARSA JUNCTION
        </SvgText>
        <SvgText x="240" y="660" fill="#94A3B8" fontSize="9" fontWeight="700" letterSpacing="0.8">
          PATNA BYPASS
        </SvgText>

        {/* 8. Ola Active Route Line (When Pickup & Dropoff Active) */}
        {pickup && dropoff && (
          <G>
            {/* Soft Green Route Glow Background */}
            <Path
              d={getRouteSvgPath()}
              stroke="#00D25B"
              strokeWidth="9"
              strokeOpacity={0.28}
              strokeLinecap="round"
              fill="none"
            />
            {/* Main Solid Vibrant Route Path */}
            <Path
              d={getRouteSvgPath()}
              stroke="url(#olaRouteGrad)"
              strokeWidth="4.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Animated Flowing Dashes */}
            <Path
              d={getRouteSvgPath()}
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeDasharray="6, 8"
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              fill="none"
              opacity={0.85}
            />
          </G>
        )}

        {/* 9. Live Ola Cab Markers on Roads */}
        {/* Cab 1: Ola Prime (Near pickup on central road) */}
        <G>
          {/* Radar Ripple */}
          <Circle
            cx={car1Pos.x}
            cy={car1Pos.y}
            r={18 * pulse.scale}
            fill="#00D25B"
            fillOpacity={pulse.opacity}
          />
          {/* Cab Base Circle */}
          <Circle
            cx={car1Pos.x}
            cy={car1Pos.y}
            r="14"
            fill="#0F172A"
            stroke="#00D25B"
            strokeWidth="2"
          />
          {/* Ola Cab Silhouette Icon */}
          <G x={car1Pos.x} y={car1Pos.y}>
            <Path
              d="M -5 2.5 L -4 -2 Q -3 -5 0 -5 Q 3 -5 4 -2 L 5 2.5 Q 6 3.5 6 4.5 L 6 5.5 Q 6 6.5 5 6.5 L 4 6.5 Q 4 7.5 3 7.5 L 2 7.5 Q 2 6.5 1 6.5 L -1 6.5 Q -1 7.5 -2 7.5 L -3 7.5 Q -4 7.5 -4 6.5 L -5 6.5 Q -6 6.5 -6 5.5 L -6 4.5 Q -6 3.5 -5 2.5 Z"
              fill="#00D25B"
            />
            <Path d="M -3 -1.5 Q -2.5 -3.5 0 -3.5 Q 2.5 -3.5 3 -1.5 Z" fill="#0F172A" />
            <Circle cx="-3.5" cy="4.5" r="0.9" fill="#FBBF24" />
            <Circle cx="3.5" cy="4.5" r="0.9" fill="#FBBF24" />
          </G>
        </G>

        {/* Cab 2: Ola Mini (Upper Highway) */}
        <G>
          <Circle
            cx={car2Pos.x}
            cy={car2Pos.y}
            r={16 * pulse.scale}
            fill="#00D25B"
            fillOpacity={pulse.opacity * 0.8}
          />
          <Circle
            cx={car2Pos.x}
            cy={car2Pos.y}
            r="13"
            fill="#0F172A"
            stroke="#FFFFFF"
            strokeWidth="1.8"
          />
          <G x={car2Pos.x} y={car2Pos.y}>
            <Path
              d="M -4.5 2 L -3.5 -2 Q -2.5 -4.5 0 -4.5 Q 2.5 -4.5 3.5 -2 L 4.5 2 Q 5.5 3 5.5 4 L 5.5 5 Q 5.5 6 4.5 6 L 3.5 6 Q 3.5 7 2.5 7 L 1.5 7 Q 1.5 6 0.8 6 L -0.8 6 Q -0.8 7 -1.5 7 L -2.5 7 Q -3.5 7 -3.5 6 L -4.5 6 Q -5.5 6 -5.5 5 L -5.5 4 Q -5.5 3 -4.5 2 Z"
              fill="#FFFFFF"
            />
            <Circle cx="-3" cy="4" r="0.8" fill="#FBBF24" />
            <Circle cx="3" cy="4" r="0.8" fill="#FBBF24" />
          </G>
        </G>

        {/* Cab 3: Ola Auto (South Corridor) */}
        <G>
          <Circle
            cx={car3Pos.x}
            cy={car3Pos.y}
            r="12"
            fill="#0F172A"
            stroke="#00D25B"
            strokeWidth="1.5"
          />
          <G x={car3Pos.x} y={car3Pos.y}>
            <Path
              d="M -4 2 L -3 -2 Q -2 -4 0 -4 Q 2 -4 3 -2 L 4 2 Q 5 3 5 4 L 5 5 Q 5 6 4 6 L -4 6 Q -5 6 -5 5 L -5 4 Q -5 3 -4 2 Z"
              fill="#FBBF24"
            />
          </G>
        </G>

        {/* 10. Ola Pickup Pin */}
        {pickup && (
          <G x="145" y="255">
            <Circle cx="0" cy="0" r="20" fill="#00D25B" fillOpacity="0.25" />
            <Circle cx="0" cy="0" r="11" fill="#00D25B" stroke="#FFFFFF" strokeWidth="2.8" />
            <Circle cx="0" cy="0" r="4" fill="#0F172A" />
            {/* Floating Tag */}
            <Rect x="-28" y="-34" width="56" height="18" rx="9" fill="#0F172A" />
            <SvgText x="0" y="-22" fill="#00D25B" fontSize="8.5" fontWeight="800" textAnchor="middle">
              PICKUP
            </SvgText>
          </G>
        )}

        {/* 11. Ola Dropoff Pin */}
        {dropoff && (
          <G x="285" y="440">
            <Circle cx="0" cy="0" r="20" fill="#EF4444" fillOpacity="0.2" />
            <Circle cx="0" cy="0" r="11" fill="#EF4444" stroke="#FFFFFF" strokeWidth="2.8" />
            <Circle cx="0" cy="0" r="4" fill="#FFFFFF" />
            {/* Floating Tag */}
            <Rect x="-30" y="-34" width="60" height="18" rx="9" fill="#EF4444" />
            <SvgText x="0" y="-22" fill="#FFFFFF" fontSize="8.5" fontWeight="800" textAnchor="middle">
              DROPOFF
            </SvgText>
          </G>
        )}

        {/* 12. Active Driver Position in In-Progress Ride */}
        {driver && ['ACCEPTED', 'ARRIVING', 'PICKED_UP'].includes(rideStatus || '') && (
          <G x="180" y="325">
            <Circle cx="0" cy="0" r="24" fill="#00D25B" fillOpacity="0.35" />
            <Circle cx="0" cy="0" r="15" fill="#0F172A" stroke="#00D25B" strokeWidth="2.5" />
            <G x="0" y="0">
              <Path
                d="M -5 2.5 L -4 -2 Q -3 -5 0 -5 Q 3 -5 4 -2 L 5 2.5 Q 6 3.5 6 4.5 L 6 5.5 Q 6 6.5 5 6.5 L 4 6.5 Q 4 7.5 3 7.5 L 2 7.5 Q 2 6.5 1 6.5 L -1 6.5 Q -1 7.5 -2 7.5 L -3 7.5 Q -4 7.5 -4 6.5 L -5 6.5 Q -6 6.5 -6 5.5 L -6 4.5 Q -6 3.5 -5 2.5 Z"
                fill="#00D25B"
              />
            </G>
          </G>
        )}
      </Svg>

      {/* Ola Maps Watermark Badge in Bottom Left */}
      <View style={styles.olaWatermark}>
        <View style={styles.olaLogoDot} />
        <Text style={styles.olaWatermarkText}>ola maps</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#F4F6F8',
  },
  svgMap: {
    width: '100%',
    height: '100%',
  },
  olaWatermark: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  olaLogoDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00D25B',
  },
  olaWatermarkText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.4,
  },
});
