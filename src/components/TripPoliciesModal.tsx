import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, CheckCircle2, AlertTriangle, AlertOctagon, Clock, ChevronDown } from 'lucide-react-native';
import { brandColors, spacing, borderRadius } from '../theme';

interface TripPoliciesModalProps {
  onClose: () => void;
}

export default function TripPoliciesModal({ onClose }: TripPoliciesModalProps) {
  const [openSection, setOpenSection] = useState<'INC' | 'EXC' | 'RES' | 'CAN'>('INC');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backBtn}>
          <ArrowLeft size={22} color={brandColors.aoloText} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trip Policies & Guidelines</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Accordion 1: Inclusions (Green check list) */}
        <TouchableOpacity
          style={[styles.accordionHeader, openSection === 'INC' && styles.activeAccordionHeader]}
          onPress={() => setOpenSection(openSection === 'INC' ? '' as any : 'INC')}
        >
          <View style={styles.headerLeftRow}>
            <CheckCircle2 size={20} color={brandColors.aoloGreen} />
            <Text style={styles.accordionTitle}>Inclusions (Included in Fare)</Text>
          </View>
          <ChevronDown size={18} color={brandColors.aoloGray} />
        </TouchableOpacity>

        {openSection === 'INC' && (
          <View style={styles.accordionBody}>
            <View style={styles.listItem}>
              <View style={styles.greenCheckDot} />
              <Text style={styles.itemText}>Fuel charges, vehicle hire & driver allowance for specified route.</Text>
            </View>
            <View style={styles.listItem}>
              <View style={styles.greenCheckDot} />
              <Text style={styles.itemText}>State toll taxes & mandatory highway parking fees.</Text>
            </View>
            <View style={styles.listItem}>
              <View style={styles.greenCheckDot} />
              <Text style={styles.itemText}>AC comfort throughout the entire journey duration.</Text>
            </View>
            <View style={styles.listItem}>
              <View style={styles.greenCheckDot} />
              <Text style={styles.itemText}>Free 45-minute pickup buffer for intercity rides.</Text>
            </View>
          </View>
        )}

        {/* Accordion 2: Exclusions (Amber warning list) */}
        <TouchableOpacity
          style={[styles.accordionHeader, openSection === 'EXC' && styles.activeAccordionHeader]}
          onPress={() => setOpenSection(openSection === 'EXC' ? '' as any : 'EXC')}
        >
          <View style={styles.headerLeftRow}>
            <AlertTriangle size={20} color="#D97706" />
            <Text style={styles.accordionTitle}>Exclusions (Extra Charges)</Text>
          </View>
          <ChevronDown size={18} color={brandColors.aoloGray} />
        </TouchableOpacity>

        {openSection === 'EXC' && (
          <View style={styles.accordionBody}>
            <View style={styles.listItem}>
              <View style={styles.amberDot} />
              <Text style={styles.itemText}>Extra km beyond package limits: ₹14/km for Compact, ₹16/km for Sedan.</Text>
            </View>
            <View style={styles.listItem}>
              <View style={styles.amberDot} />
              <Text style={styles.itemText}>Night shift charges (10 PM to 6 AM): ₹250 flat payout to driver.</Text>
            </View>
            <View style={styles.listItem}>
              <View style={styles.amberDot} />
              <Text style={styles.itemText}>Multiple unannounced detours off the primary highway route.</Text>
            </View>
          </View>
        )}

        {/* Accordion 3: Restrictions (Red no-entry list) */}
        <TouchableOpacity
          style={[styles.accordionHeader, openSection === 'RES' && styles.activeAccordionHeader]}
          onPress={() => setOpenSection(openSection === 'RES' ? '' as any : 'RES')}
        >
          <View style={styles.headerLeftRow}>
            <AlertOctagon size={20} color={brandColors.aoloRed} />
            <Text style={styles.accordionTitle}>Restrictions & Safety Rules</Text>
          </View>
          <ChevronDown size={18} color={brandColors.aoloGray} />
        </TouchableOpacity>

        {openSection === 'RES' && (
          <View style={styles.accordionBody}>
            <View style={styles.listItem}>
              <View style={styles.redDot} />
              <Text style={styles.itemText}>Strictly NO PETS allowed inside cab interiors without prior carrier box.</Text>
            </View>
            <View style={styles.listItem}>
              <View style={styles.redDot} />
              <Text style={styles.itemText}>No smoking or alcohol consumption inside vehicle at any time.</Text>
            </View>
            <View style={styles.listItem}>
              <View style={styles.redDot} />
              <Text style={styles.itemText}>Maximum 4 adult passengers per vehicle as per transport authority rules.</Text>
            </View>
          </View>
        )}

        {/* Accordion 4: Cancellation Policy */}
        <TouchableOpacity
          style={[styles.accordionHeader, openSection === 'CAN' && styles.activeAccordionHeader]}
          onPress={() => setOpenSection(openSection === 'CAN' ? '' as any : 'CAN')}
        >
          <View style={styles.headerLeftRow}>
            <Clock size={20} color={brandColors.aoloText} />
            <Text style={styles.accordionTitle}>Cancellation & Refund Policy</Text>
          </View>
          <ChevronDown size={18} color={brandColors.aoloGray} />
        </TouchableOpacity>

        {openSection === 'CAN' && (
          <View style={styles.accordionBody}>
            <View style={styles.policyTierCard}>
              <Text style={styles.tierTitle}>FREE CANCELLATION</Text>
              <Text style={styles.tierSub}>Up to 4 hours prior to scheduled pickup time — 100% full refund to wallet.</Text>
            </View>

            <View style={styles.policyTierCard}>
              <Text style={styles.tierTitle}>50% CANCELLATION FEE</Text>
              <Text style={styles.tierSub}>Between 2 to 4 hours prior to pickup — 50% advance token refunded.</Text>
            </View>

            <View style={[styles.policyTierCard, { borderColor: brandColors.aoloRed }]}>
              <Text style={[styles.tierTitle, { color: brandColors.aoloRed }]}>NO REFUND</Text>
              <Text style={styles.tierSub}>Under 2 hours prior to pickup or captain already arrived at location.</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: brandColors.aoloBg, // Off-white #F7F9F5
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.px_4,
    paddingVertical: spacing.px_3,
    backgroundColor: brandColors.aoloCardBg,
    borderBottomWidth: 1,
    borderColor: brandColors.aoloBorderLight,
  },
  backBtn: {
    padding: spacing.px_2,
  },
  headerTitle: {
    color: brandColors.aoloText,
    fontSize: 18,
    fontWeight: '800',
    fontFamily: 'Roboto',
  },
  scrollContent: {
    padding: spacing.px_4,
    gap: 12,
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: brandColors.aoloCardBg,
    borderRadius: borderRadius.xl,
    padding: spacing.px_4,
    borderWidth: 1,
    borderColor: brandColors.aoloBorderLight,
  },
  activeAccordionHeader: {
    borderColor: brandColors.aoloText,
    borderWidth: 1.5,
  },
  headerLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  accordionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: brandColors.aoloText,
    fontFamily: 'Roboto',
  },
  accordionBody: {
    backgroundColor: brandColors.aoloCardBg,
    borderRadius: borderRadius.xl,
    padding: spacing.px_4,
    borderWidth: 1,
    borderColor: brandColors.aoloBorderLight,
    marginTop: -4,
    gap: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  greenCheckDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: brandColors.aoloGreen,
  },
  amberDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D97706',
  },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: brandColors.aoloRed,
  },
  itemText: {
    flex: 1,
    fontSize: 12,
    color: brandColors.aoloText,
    fontFamily: 'Roboto',
    lineHeight: 18,
  },
  policyTierCard: {
    backgroundColor: brandColors.aoloBg,
    borderRadius: borderRadius.lg,
    padding: spacing.px_3,
    borderWidth: 1,
    borderColor: brandColors.aoloBorderLight,
  },
  tierTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: brandColors.aoloText,
    fontFamily: 'Roboto',
    marginBottom: 2,
  },
  tierSub: {
    fontSize: 11,
    color: brandColors.aoloGray,
    fontFamily: 'Roboto',
  },
});
