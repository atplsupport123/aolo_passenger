import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  User,
  ShieldCheck,
  Edit3,
  Phone,
  Mail,
  Home,
  Briefcase,
  LogOut,
  Check,
  X,
  Trash2,
  AlertTriangle,
} from 'lucide-react-native';
import { UserProfile } from '../types';
import { useAuthStore } from '../store/useAuthStore';
import BottomNavBar from './BottomNavBar';

interface ProfileSheetProps {
  userProfile: UserProfile | null;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onClose: () => void;
}

export default function ProfileSheet({
  userProfile,
  onUpdateProfile,
  onClose,
}: ProfileSheetProps) {
  const insets = useSafeAreaInsets();
  const { logout, deleteAccount } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const initialName = userProfile?.name || 'Yuvraj Singh';
  const initialEmail = userProfile?.email || 'passenger@aolo.com';
  const initialPhone = userProfile?.phone || '+1 (555) 101-7000';

  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState(initialPhone);

  // Initial letter for avatar
  const avatarLetter = (name.trim().charAt(0) || 'Y').toUpperCase();

  const handleSave = () => {
    onUpdateProfile({ name, email, phone });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(initialName);
    setEmail(initialEmail);
    setPhone(initialPhone);
    setIsEditing(false);
  };

  const handleSignOut = () => {
    setShowSignOutModal(true);
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      await deleteAccount();
      setShowDeleteModal(false);
      onClose();
    } catch (err) {
      console.error('[ProfileSheet] Failed to delete account:', err);
      setIsDeleting(false);
    }
  };

  const confirmSignOut = () => {
    setIsSigningOut(true);
    logout();
    setShowSignOutModal(false);
    onClose();
  };


  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <User size={20} color="#84CC16" strokeWidth={2.4} />
          <Text style={styles.headerTitle}>ACCOUNT SETTINGS</Text>
        </View>

        <TouchableOpacity
          onPress={onClose}
          style={styles.closeBtn}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.closeText}>CLOSE</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 20) + 30 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarLetter}>{avatarLetter}</Text>
          </View>

          <View style={styles.profileInfoCol}>
            <Text style={styles.profileName} numberOfLines={1}>
              {name}
            </Text>
            <Text style={styles.profileEmail} numberOfLines={1}>
              {email}
            </Text>

            <View style={styles.verifiedBadge}>
              <ShieldCheck size={13} color="#84CC16" strokeWidth={2.2} />
              <Text style={styles.verifiedBadgeText}>VERIFIED ACCOUNT</Text>
            </View>
          </View>
        </View>

        {/* Section: Personal Details */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>PERSONAL DETAILS</Text>
          <TouchableOpacity
            onPress={() => (isEditing ? handleCancel() : setIsEditing(true))}
            style={styles.editBtn}
            activeOpacity={0.7}
          >
            {isEditing ? (
              <>
                <X size={13} color="#84CC16" strokeWidth={2.5} />
                <Text style={styles.editText}>CANCEL</Text>
              </>
            ) : (
              <>
                <Edit3 size={13} color="#84CC16" strokeWidth={2.5} />
                <Text style={styles.editText}>EDIT</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Details Card */}
        <View style={styles.detailsCard}>
          {/* Full Name Row */}
          <View style={styles.detailRow}>
            <View style={styles.detailIconBox}>
              <User size={18} color="#94A3B8" strokeWidth={2} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>FULL NAME</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter full name"
                  placeholderTextColor="#94A3B8"
                />
              ) : (
                <Text style={styles.detailValue}>{name}</Text>
              )}
            </View>
          </View>

          <View style={styles.rowDivider} />

          {/* Phone Number Row */}
          <View style={styles.detailRow}>
            <View style={styles.detailIconBox}>
              <Phone size={18} color="#94A3B8" strokeWidth={2} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>PHONE NUMBER</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  placeholder="Enter phone number"
                  placeholderTextColor="#94A3B8"
                />
              ) : (
                <Text style={styles.detailValue}>{phone}</Text>
              )}
            </View>
          </View>

          <View style={styles.rowDivider} />

          {/* Email Address Row */}
          <View style={styles.detailRow}>
            <View style={styles.detailIconBox}>
              <Mail size={18} color="#94A3B8" strokeWidth={2} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>EMAIL ADDRESS</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="Enter email address"
                  placeholderTextColor="#94A3B8"
                />
              ) : (
                <Text style={styles.detailValue}>{email}</Text>
              )}
            </View>
          </View>

          {isEditing && (
            <TouchableOpacity
              style={styles.saveChangesBtn}
              onPress={handleSave}
              activeOpacity={0.85}
            >
              <Check size={16} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.saveChangesText}>SAVE CHANGES</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Section: Saved Hotspots */}
        <Text style={[styles.sectionTitle, { marginTop: 22, marginBottom: 10 }]}>
          SAVED HOTSPOTS
        </Text>

        {/* Home Address Card */}
        <View style={styles.hotspotCard}>
          <View style={styles.hotspotLeft}>
            <View style={styles.hotspotIconBox}>
              <Home size={18} color="#84CC16" strokeWidth={2.2} />
            </View>
            <Text style={styles.hotspotTitle}>Home Address</Text>
          </View>

          <TouchableOpacity
            style={styles.setAddressTouch}
            onPress={() => Alert.alert('Home Address', 'Update your home hotspot location.')}
            activeOpacity={0.7}
          >
            <Text style={styles.setAddressText}>SET ADDRESS</Text>
          </TouchableOpacity>
        </View>

        {/* Work Address Card */}
        <View style={styles.hotspotCard}>
          <View style={styles.hotspotLeft}>
            <View style={styles.hotspotIconBox}>
              <Briefcase size={18} color="#84CC16" strokeWidth={2.2} />
            </View>
            <Text style={styles.hotspotTitle}>Work Address</Text>
          </View>

          <TouchableOpacity
            style={styles.setAddressTouch}
            onPress={() => Alert.alert('Work Address', 'Update your workplace hotspot location.')}
            activeOpacity={0.7}
          >
            <Text style={styles.setAddressText}>SET ADDRESS</Text>
          </TouchableOpacity>
        </View>

        {/* Section: Account Actions */}
        <Text style={[styles.sectionTitle, { marginTop: 24, marginBottom: 10 }]}>
          ACCOUNT ACTIONS
        </Text>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={styles.signOutBtn}
          onPress={handleSignOut}
          activeOpacity={0.8}
        >
          <LogOut size={18} color="#B91C1C" strokeWidth={2.5} />
          <Text style={styles.signOutBtnText}>SIGN OUT ACCOUNT</Text>
        </TouchableOpacity>

        {/* Delete Account Button */}
        <TouchableOpacity
          style={styles.deleteAccountBtn}
          onPress={handleDeleteAccount}
          activeOpacity={0.8}
        >
          <Trash2 size={16} color="#FFFFFF" strokeWidth={2.2} />
          <Text style={styles.deleteAccountBtnText}>DELETE ACCOUNT</Text>
        </TouchableOpacity>

        {/* Account Deletion Disclaimer */}
        <Text style={styles.deleteDisclaimer}>
          Deleting your account will permanently remove all profile data, wallet balance, and ride history.
        </Text>
      </ScrollView>

      <BottomNavBar activeTab="account" />

      {/* Delete Account Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => !isDeleting && setShowDeleteModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.alertCard}>
            <View style={styles.deleteIconBadge}>
              <AlertTriangle size={28} color="#DC2626" strokeWidth={2.4} />
            </View>

            <Text style={styles.alertTitle}>Delete Account Permanently?</Text>
            <Text style={styles.alertDescription}>
              Are you sure you want to delete your AOLO account? This will permanently delete your profile, saved locations, wallet balance, and ride history. This action cannot be undone.
            </Text>

            <View style={styles.alertBtnRow}>
              <TouchableOpacity
                style={styles.alertCancelBtn}
                onPress={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                activeOpacity={0.7}
              >
                <Text style={styles.alertCancelBtnText}>CANCEL</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.alertConfirmDeleteBtn}
                onPress={confirmDeleteAccount}
                disabled={isDeleting}
                activeOpacity={0.8}
              >
                {isDeleting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.alertConfirmDeleteBtnText}>DELETE</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Sign Out Confirmation Modal */}
      <Modal
        visible={showSignOutModal}
        transparent
        animationType="fade"
        onRequestClose={() => !isSigningOut && setShowSignOutModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.alertCard}>
            <View style={styles.signOutIconBadge}>
              <LogOut size={26} color="#F59E0B" strokeWidth={2.4} />
            </View>

            <Text style={styles.alertTitle}>Sign Out from AOLO?</Text>
            <Text style={styles.alertDescription}>
              Are you sure you want to sign out from your account? You can log back in anytime with your phone or email.
            </Text>

            <View style={styles.alertBtnRow}>
              <TouchableOpacity
                style={styles.alertCancelBtn}
                onPress={() => setShowSignOutModal(false)}
                disabled={isSigningOut}
                activeOpacity={0.7}
              >
                <Text style={styles.alertCancelBtnText}>CANCEL</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.alertConfirmSignOutBtn}
                onPress={confirmSignOut}
                disabled={isSigningOut}
                activeOpacity={0.8}
              >
                {isSigningOut ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.alertConfirmSignOutBtnText}>SIGN OUT</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 12 : 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    fontFamily: 'Roboto',
    letterSpacing: 0.4,
  },
  closeBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  closeText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#84CC16',
    fontFamily: 'Roboto',
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  profileCard: {
    backgroundColor: '#F6F8F5',
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 22,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#A8E63C',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#A8E63C',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  avatarLetter: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    fontFamily: 'Roboto',
  },
  profileInfoCol: {
    flex: 1,
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
    fontFamily: 'Roboto',
  },
  profileEmail: {
    fontSize: 12.5,
    color: '#94A3B8',
    fontFamily: 'Roboto',
    marginTop: 2,
    marginBottom: 6,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#F2F9EC',
    borderWidth: 1,
    borderColor: '#C2ECA4',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 14,
    gap: 4,
  },
  verifiedBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#84CC16',
    fontFamily: 'Roboto',
    letterSpacing: 0.4,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#8A9184',
    fontFamily: 'Roboto',
    letterSpacing: 0.8,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  editText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#84CC16',
    fontFamily: 'Roboto',
    letterSpacing: 0.5,
  },
  detailsCard: {
    backgroundColor: '#F6F8F5',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 14,
  },
  detailIconBox: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#8A9184',
    fontFamily: 'Roboto',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    fontFamily: 'Roboto',
    marginTop: 2,
  },
  input: {
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: '700',
    color: '#0F172A',
    borderBottomWidth: 1,
    borderColor: '#84CC16',
    paddingVertical: 2,
    marginTop: 2,
  },
  rowDivider: {
    height: 1,
    backgroundColor: '#E8EDE5',
    marginLeft: 42,
  },
  saveChangesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#A8E63C',
    borderRadius: 12,
    height: 40,
    marginTop: 8,
    marginBottom: 8,
    gap: 6,
  },
  saveChangesText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    fontFamily: 'Roboto',
    letterSpacing: 0.5,
  },
  hotspotCard: {
    backgroundColor: '#F6F8F5',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  hotspotLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  hotspotIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hotspotTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    fontFamily: 'Roboto',
  },
  setAddressTouch: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  setAddressText: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#84CC16',
    fontFamily: 'Roboto',
    letterSpacing: 0.5,
  },
  signOutBtn: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 18,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 10,
  },
  signOutBtnText: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#B91C1C',
    fontFamily: 'Roboto',
    letterSpacing: 0.6,
  },
  deleteAccountBtn: {
    backgroundColor: '#DC2626',
    borderWidth: 1,
    borderColor: '#B91C1C',
    borderRadius: 18,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
  },
  deleteAccountBtnText: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#FFFFFF',
    fontFamily: 'Roboto',
    letterSpacing: 0.6,
  },
  deleteDisclaimer: {
    fontSize: 11,
    fontWeight: '500',
    fontFamily: 'Roboto',
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 12,
    marginBottom: 20,
  },

  /* Custom Confirmation Dialogs */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  alertCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  deleteIconBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  signOutIconBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
  },
  alertDescription: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'Roboto',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 24,
  },
  alertBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  alertCancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertCancelBtnText: {
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#475569',
    letterSpacing: 0.5,
  },
  alertConfirmDeleteBtn: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  alertConfirmDeleteBtnText: {
    fontSize: 13,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#FFFFFF',
    letterSpacing: 0.6,
  },
  alertConfirmSignOutBtn: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#D97706',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  alertConfirmSignOutBtnText: {
    fontSize: 13,
    fontWeight: '900',
    fontFamily: 'Roboto',
    color: '#FFFFFF',
    letterSpacing: 0.6,
  },
});

