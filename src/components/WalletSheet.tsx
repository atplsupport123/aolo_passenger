import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  Modal,
  ActivityIndicator,
  Alert,
  BackHandler,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Wallet,
  Plus,
  CreditCard,
  Building,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  ShieldCheck,
  X,
} from 'lucide-react-native';
import { brandColors } from '../theme';

interface WalletSheetProps {
  balance: number;
  onAddMoney: (amount: number) => void;
  onClose: () => void;
}

const TAB_BAR_H = Platform.OS === 'ios' ? 78 : 64;
const MONO_FONT = 'Roboto';

const PRESET_AMOUNTS = [100, 200, 500, 1000];

interface PaymentMethodItem {
  id: string;
  icon: typeof CreditCard | typeof Building;
  title: string;
  subtitle: string;
}

const SAVED_METHODS: PaymentMethodItem[] = [
  {
    id: 'pm_card',
    icon: CreditCard,
    title: 'HDFC Bank Visa Debit (•••• 4092)',
    subtitle: 'Expires 11/2029 • Preferred',
  },
  {
    id: 'pm_bank',
    icon: Building,
    title: 'State Bank of India',
    subtitle: 'A/C •••••••• 0021',
  },
];

interface TransactionItem {
  id: string;
  type: string;
  title: string;
  date: string;
  amount: number;
}

const INITIAL_TRANSACTIONS: TransactionItem[] = [
  { id: 'tx_1', type: 'CREDIT', title: 'Wallet Top-Up via UPI', date: '26 Sep 2026, 02:15 PM', amount: 500 },
  { id: 'tx_2', type: 'DEBIT', title: 'Advance Token for #AOLO111192', date: '26 Sep 2026, 01:30 PM', amount: 250 },
  { id: 'tx_3', type: 'CREDIT', title: 'Referral Cashback Bonus', date: '25 Sep 2026, 06:45 PM', amount: 100 },
];

export default function WalletSheet({
  balance,
  onAddMoney,
  onClose,
}: WalletSheetProps) {
  const insets = useSafeAreaInsets();
  const topPad = Math.max(insets.top, 12);

  const [autoReplenish, setAutoReplenish] = useState(true);
  const [topupAmount, setTopupAmount] = useState('200');
  const [selectedMethodId, setSelectedMethodId] = useState('pm_card');
  const [transactions, setTransactions] = useState<TransactionItem[]>(INITIAL_TRANSACTIONS);

  // Transfer flow states
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferModalVisible, setTransferModalVisible] = useState(false);
  const [successData, setSuccessData] = useState<{
    amount: number;
    bankName: string;
    txnId: string;
    timestamp: string;
    newBalance: number;
  } | null>(null);

  const selectedMethod = SAVED_METHODS.find((m) => m.id === selectedMethodId) || SAVED_METHODS[0];
  const selectedBankName = selectedMethod.title.split('(')[0].trim();

  const numericAmount = parseFloat(topupAmount);
  const formattedAmount =
    isNaN(numericAmount) || numericAmount <= 0
      ? '0'
      : numericAmount.toLocaleString('en-IN');

  const handleBankTransfer = () => {
    const amt = parseFloat(topupAmount);
    if (isNaN(amt) || amt <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount to transfer from bank.');
      return;
    }

    setIsTransferring(true);
    setTransferModalVisible(true);
    setSuccessData(null);

    // Simulate secure instant bank transfer
    setTimeout(() => {
      setIsTransferring(false);
      onAddMoney(amt);

      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const dateStr = `Today, ${timeStr}`;

      const newTx: TransactionItem = {
        id: `tx_${Date.now()}`,
        type: 'CREDIT',
        title: `Bank Transfer from ${selectedBankName}`,
        date: dateStr,
        amount: amt,
      };

      setTransactions((prev) => [newTx, ...prev]);

      setSuccessData({
        amount: amt,
        bankName: selectedBankName,
        txnId: `AOLO${Math.floor(10000000 + Math.random() * 90000000)}`,
        timestamp: dateStr,
        newBalance: balance + amt,
      });
    }, 1200);
  };

  const handleCloseSuccess = () => {
    setTransferModalVisible(false);
    setSuccessData(null);
  };

  useEffect(() => {
    const onBackPress = () => {
      onClose();
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [onClose]);

  return (
    <View style={styles.container}>
      {/* 1. Header: Wallet Icon + AOLO WALLET on left, DONE button on right */}
      <View style={[styles.header, { paddingTop: topPad }]}>
        <View style={styles.headerLeft}>
          <Wallet size={20} color={brandColors.aoloGreen} strokeWidth={2.5} />
          <Text style={styles.headerTitle}>AOLO WALLET</Text>
        </View>
        <TouchableOpacity
          onPress={onClose}
          style={styles.doneBtn}
          activeOpacity={0.7}
        >
          <Text style={styles.doneBtnText}>DONE</Text>
        </TouchableOpacity>
      </View>

      {/* Main Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceCapsLabel}>TOTAL BALANCE AVAILABLE</Text>
          <Text style={styles.balanceAmountText}>
            ₹{balance.toLocaleString('en-IN')}.00
          </Text>

          {/* Divider & Auto-Replenish Pill Button */}
          <TouchableOpacity
            style={styles.autoReplenishRow}
            onPress={() => setAutoReplenish(!autoReplenish)}
            activeOpacity={0.8}
          >
            <View style={styles.autoLeft}>
              <Plus size={14} color={brandColors.aoloGreen} strokeWidth={3} />
              <Text style={styles.autoTitle}>Fast Auto-Replenish</Text>
            </View>
            <View
              style={[
                styles.statusPill,
                !autoReplenish && styles.statusPillInactive,
              ]}
            >
              <Text
                style={[
                  styles.statusPillText,
                  !autoReplenish && styles.statusPillTextInactive,
                ]}
              >
                {autoReplenish ? 'ACTIVE' : 'INACTIVE'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* 3. Section: TOP-UP WALLET */}
        <Text style={styles.sectionLabel}>TOP-UP WALLET</Text>
        <View style={styles.topupCard}>
          <View style={styles.topupLeft}>
            <View style={styles.blackPlusTile}>
              <Plus size={18} color={brandColors.aoloGreen} strokeWidth={2.5} />
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                style={styles.amountInput}
                value={topupAmount}
                onChangeText={setTopupAmount}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#8A9184"
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.rechargeBtn}
            onPress={handleBankTransfer}
            activeOpacity={0.8}
          >
            <Plus size={14} color={brandColors.aoloGreen} strokeWidth={3} />
            <Text style={styles.rechargeBtnText}>Recharge</Text>
          </TouchableOpacity>
        </View>

        {/* Preset Chips */}
        <View style={styles.presetsRow}>
          {PRESET_AMOUNTS.map((amt) => {
            const isSelected = topupAmount === String(amt);
            return (
              <TouchableOpacity
                key={amt}
                style={[
                  styles.presetChip,
                  isSelected && styles.presetChipSelected,
                ]}
                onPress={() => setTopupAmount(String(amt))}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.presetChipText,
                    isSelected && styles.presetChipTextSelected,
                  ]}
                >
                  +₹{amt}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 4. Section: SAVED PAYMENT METHODS */}
        <Text style={styles.sectionLabel}>SAVED PAYMENT METHODS</Text>
        <View style={styles.methodsList}>
          {SAVED_METHODS.map((method) => {
            const isSelected = selectedMethodId === method.id;
            const Icon = method.icon;
            return (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.methodRow,
                  !isSelected && styles.methodRowDimmed,
                ]}
                onPress={() => setSelectedMethodId(method.id)}
                activeOpacity={0.8}
              >
                <View style={styles.methodIconTile}>
                  <Icon size={18} color={brandColors.aoloGreen} />
                </View>
                <View style={styles.methodTextCol}>
                  <Text style={styles.methodTitle}>{method.title}</Text>
                  <Text style={styles.methodSubtitle}>{method.subtitle}</Text>
                </View>
                <View
                  style={[
                    styles.radioOuter,
                    isSelected && styles.radioOuterSelected,
                  ]}
                >
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 5. Section: RECENT TRANSACTIONS */}
        <Text style={styles.sectionLabel}>RECENT TRANSACTIONS</Text>
        <View style={styles.txContainer}>
          {transactions.map((tx, idx) => {
            const isCredit = tx.type === 'CREDIT';
            const isLast = idx === transactions.length - 1;
            return (
              <View
                key={tx.id}
                style={[styles.txRow, !isLast && styles.txRowBorder]}
              >
                <View
                  style={[
                    styles.txIconBox,
                    isCredit ? styles.creditIcon : styles.debitIcon,
                  ]}
                >
                  {isCredit ? (
                    <ArrowDownLeft
                      size={16}
                      color="#15803D"
                      strokeWidth={2.5}
                    />
                  ) : (
                    <ArrowUpRight
                      size={16}
                      color="#64748B"
                      strokeWidth={2.5}
                    />
                  )}
                </View>

                <View style={styles.txTextCol}>
                  <Text style={styles.txTitle}>{tx.title}</Text>
                  <Text style={styles.txDate}>{tx.date}</Text>
                </View>

                <Text
                  style={[
                    styles.txAmount,
                    isCredit ? styles.creditAmount : styles.debitAmount,
                  ]}
                >
                  {isCredit ? '+' : '-'}₹{tx.amount}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* 6. BOTTOM SPACE AREA: ADD MONEY FROM BANK ACTION BUTTON */}
      <View style={styles.bottomActionBar}>
        <View style={styles.bottomTransferHeader}>
          <View style={styles.bankSourceTag}>
            <Building size={13} color="#4D7C0F" strokeWidth={2.4} />
            <Text style={styles.bankSourceLabel} numberOfLines={1}>
              From: <Text style={styles.bankSourceValue}>{selectedBankName}</Text>
            </Text>
          </View>
          <View style={styles.secureBadge}>
            <ShieldCheck size={12} color="#059669" strokeWidth={2.2} />
            <Text style={styles.secureBadgeText}>Instant Bank Transfer</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.addMoneyBtn,
            (!numericAmount || numericAmount <= 0 || isTransferring) && styles.addMoneyBtnDisabled,
          ]}
          onPress={handleBankTransfer}
          activeOpacity={0.85}
          disabled={isTransferring}
        >
          {isTransferring ? (
            <View style={styles.btnLoadingRow}>
              <ActivityIndicator size="small" color={brandColors.aoloGreen} />
              <Text style={styles.btnLoadingText}>
                Transferring from {selectedBankName}...
              </Text>
            </View>
          ) : (
            <View style={styles.btnContentRow}>
              <View style={styles.btnIconBubble}>
                <ArrowDownLeft size={16} color="#A8E63C" strokeWidth={3} />
              </View>
              <View style={styles.btnTextCol}>
                <Text style={styles.addMoneyBtnTitle}>
                  ADD ₹{formattedAmount} TO WALLET
                </Text>
                <Text style={styles.addMoneyBtnSubtitle}>
                  Direct Bank Transfer • Instant Credit
                </Text>
              </View>
              <View style={styles.btnActionBadge}>
                <Text style={styles.btnActionBadgeText}>TRANSFER</Text>
              </View>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* 7. Modal for Bank Transfer Progress & Success */}
      <Modal
        visible={transferModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseSuccess}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            {isTransferring ? (
              <View style={styles.modalContentCenter}>
                <View style={styles.modalBankIconCircle}>
                  <Building size={34} color={brandColors.aoloGreen} strokeWidth={2.2} />
                </View>
                <Text style={styles.modalTransferringTitle}>Connecting to Bank</Text>
                <Text style={styles.modalTransferringSub}>
                  Transferring ₹{formattedAmount} from {selectedBankName} to your AOLO Wallet...
                </Text>
                <View style={styles.modalLoaderRow}>
                  <ActivityIndicator size="small" color="#0A0A0A" />
                  <Text style={styles.modalLoaderText}>Verifying bank authorization...</Text>
                </View>
              </View>
            ) : successData ? (
              <View style={styles.modalContentCenter}>
                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={handleCloseSuccess}
                  activeOpacity={0.7}
                >
                  <X size={18} color="#64748B" />
                </TouchableOpacity>

                <View style={styles.modalSuccessCircle}>
                  <CheckCircle2 size={44} color="#15803D" strokeWidth={2.5} />
                </View>

                <Text style={styles.modalSuccessTitle}>Money Added Successfully!</Text>
                <Text style={styles.modalSuccessAmount}>
                  +₹{successData.amount.toLocaleString('en-IN')}.00
                </Text>
                <Text style={styles.modalSuccessSub}>
                  Successfully transferred from {successData.bankName} into your AOLO Wallet.
                </Text>

                {/* Receipt Details Box */}
                <View style={styles.receiptBox}>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Source Bank</Text>
                    <Text style={styles.receiptValue}>{successData.bankName}</Text>
                  </View>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Destination</Text>
                    <Text style={styles.receiptValue}>AOLO Passenger Wallet</Text>
                  </View>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Reference ID</Text>
                    <Text style={styles.receiptValueMono}>{successData.txnId}</Text>
                  </View>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Updated Balance</Text>
                    <Text style={styles.receiptValueGreen}>
                      ₹{successData.newBalance.toLocaleString('en-IN')}.00
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.modalDoneBtn}
                  onPress={handleCloseSuccess}
                  activeOpacity={0.85}
                >
                  <Text style={styles.modalDoneBtnText}>DONE</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: TAB_BAR_H,
    backgroundColor: '#FFFFFF',
    zIndex: 50,
    elevation: 5,
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E9EDE6',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    color: '#0A0A0A',
    fontSize: 14,
    fontWeight: '800',
    fontFamily: 'Roboto',
    letterSpacing: 1.2,
  },
  doneBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F5F7F3',
    borderWidth: 1,
    borderColor: '#E9EDE6',
  },
  doneBtnText: {
    color: '#0A0A0A',
    fontSize: 12,
    fontWeight: '800',
    fontFamily: 'Roboto',
    letterSpacing: 0.8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 24,
  },
  balanceCard: {
    backgroundColor: '#F4F8F1',
    borderRadius: 28,
    padding: 22,
    borderWidth: 2,
    borderColor: '#0A0A0A',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  balanceCapsLabel: {
    color: '#8A9184',
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'Roboto',
    letterSpacing: 1.2,
  },
  balanceAmountText: {
    color: brandColors.aoloGreen,
    fontSize: 34,
    fontWeight: '700',
    fontFamily: MONO_FONT,
    marginTop: 6,
    marginBottom: 16,
  },
  autoReplenishRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderColor: '#E9EDE6',
    paddingTop: 14,
  },
  autoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  autoTitle: {
    color: '#0A0A0A',
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Roboto',
  },
  statusPill: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: brandColors.aoloGreen,
    backgroundColor: 'rgba(168, 230, 60, 0.15)',
  },
  statusPillInactive: {
    borderColor: '#CBD5E1',
    backgroundColor: 'transparent',
  },
  statusPillText: {
    fontSize: 9,
    fontWeight: '800',
    fontFamily: MONO_FONT,
    color: '#4D7C0F',
    letterSpacing: 0.5,
  },
  statusPillTextInactive: {
    color: '#8A9184',
  },
  sectionLabel: {
    color: '#8A9184',
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'Roboto',
    letterSpacing: 1.2,
    marginBottom: 10,
    marginLeft: 2,
  },
  topupCard: {
    backgroundColor: '#F5F7F3',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E9EDE6',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topupLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  blackPlusTile: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#0A0A0A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  currencySymbol: {
    fontFamily: MONO_FONT,
    fontSize: 18,
    fontWeight: '700',
    color: '#8A9184',
    marginRight: 2,
  },
  amountInput: {
    fontFamily: MONO_FONT,
    fontSize: 18,
    fontWeight: '700',
    color: '#0A0A0A',
    minWidth: 70,
    padding: 0,
  },
  rechargeBtn: {
    backgroundColor: '#0A0A0A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rechargeBtnText: {
    color: brandColors.aoloGreen,
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'Roboto',
  },
  presetsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    marginBottom: 22,
  },
  presetChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9EDE6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetChipSelected: {
    backgroundColor: '#0A0A0A',
    borderColor: '#0A0A0A',
  },
  presetChipText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: MONO_FONT,
    color: '#8A9184',
  },
  presetChipTextSelected: {
    color: brandColors.aoloGreen,
  },
  methodsList: {
    gap: 8,
    marginBottom: 22,
  },
  methodRow: {
    backgroundColor: '#F5F7F3',
    borderWidth: 1,
    borderColor: '#E9EDE6',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  methodRowDimmed: {
    opacity: 0.65,
  },
  methodIconTile: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#0A0A0A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodTextCol: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Roboto',
    color: '#0A0A0A',
  },
  methodSubtitle: {
    fontSize: 10,
    fontWeight: '500',
    fontFamily: 'Roboto',
    color: '#8A9184',
    marginTop: 2,
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: '#0A0A0A',
    backgroundColor: '#0A0A0A',
  },
  radioInner: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: brandColors.aoloGreen,
  },
  txContainer: {
    backgroundColor: '#F5F7F3',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E9EDE6',
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 16,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  txRowBorder: {
    borderBottomWidth: 1,
    borderColor: '#E9EDE6',
  },
  txIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  creditIcon: {
    backgroundColor: '#DCFCE7',
  },
  debitIcon: {
    backgroundColor: '#E2E8F0',
  },
  txTextCol: {
    flex: 1,
  },
  txTitle: {
    color: '#0A0A0A',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Roboto',
  },
  txDate: {
    color: '#8A9184',
    fontSize: 10,
    fontFamily: 'Roboto',
    marginTop: 1,
  },
  txAmount: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: MONO_FONT,
  },
  creditAmount: {
    color: '#15803D',
  },
  debitAmount: {
    color: '#64748B',
  },

  // 6. Bottom Action Bar in the bottom space area
  bottomActionBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderColor: '#E9EDE6',
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 8,
  },
  bottomTransferHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  bankSourceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flex: 1,
  },
  bankSourceLabel: {
    fontSize: 11,
    fontFamily: 'Roboto',
    color: '#64748B',
  },
  bankSourceValue: {
    fontWeight: '700',
    fontFamily: 'Roboto',
    color: '#0A0A0A',
  },
  secureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  secureBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Roboto',
    color: '#15803D',
  },
  addMoneyBtn: {
    backgroundColor: '#0A0A0A',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: '#0A0A0A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  addMoneyBtnDisabled: {
    opacity: 0.5,
  },
  btnContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btnLoadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 4,
  },
  btnLoadingText: {
    color: brandColors.aoloGreen,
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'Roboto',
  },
  addMoneyBtnText: {
    color: brandColors.aoloGreen,
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'Roboto',
  },
  btnIconBubble: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#1E231B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnTextCol: {
    flex: 1,
    marginHorizontal: 10,
  },
  addMoneyBtnTitle: {
    color: brandColors.aoloGreen,
    fontSize: 13,
    fontWeight: '900',
    fontFamily: 'Roboto',
    letterSpacing: 0.6,
  },
  addMoneyBtnSubtitle: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '500',
    fontFamily: 'Roboto',
    marginTop: 1,
  },
  btnActionBadge: {
    backgroundColor: brandColors.aoloGreen,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  btnActionBadgeText: {
    color: '#0A0A0A',
    fontSize: 11,
    fontWeight: '900',
    fontFamily: 'Roboto',
    letterSpacing: 0.5,
  },

  // 7. Transfer & Success Modal Styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1.5,
    borderColor: '#E9EDE6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  modalContentCenter: {
    alignItems: 'center',
    position: 'relative',
  },
  modalCloseBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    padding: 6,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
  },
  modalBankIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#0A0A0A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: brandColors.aoloGreen,
  },
  modalTransferringTitle: {
    color: '#0A0A0A',
    fontSize: 18,
    fontWeight: '800',
    fontFamily: 'Roboto',
    marginBottom: 6,
    textAlign: 'center',
  },
  modalTransferringSub: {
    color: '#64748B',
    fontSize: 12,
    fontFamily: 'Roboto',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  modalLoaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalLoaderText: {
    color: '#334155',
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Roboto',
  },
  modalSuccessCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  modalSuccessTitle: {
    color: '#0A0A0A',
    fontSize: 18,
    fontWeight: '800',
    fontFamily: 'Roboto',
    marginBottom: 4,
  },
  modalSuccessAmount: {
    color: '#15803D',
    fontSize: 26,
    fontWeight: '800',
    fontFamily: MONO_FONT,
    marginBottom: 6,
  },
  modalSuccessSub: {
    color: '#64748B',
    fontSize: 12,
    fontFamily: 'Roboto',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
    paddingHorizontal: 8,
  },
  receiptBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
    gap: 8,
  },
  receiptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  receiptLabel: {
    color: '#64748B',
    fontSize: 11,
    fontFamily: 'Roboto',
  },
  receiptValue: {
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Roboto',
  },
  receiptValueMono: {
    color: '#0F172A',
    fontSize: 11,
    fontWeight: '700',
    fontFamily: MONO_FONT,
  },
  receiptValueGreen: {
    color: '#15803D',
    fontSize: 12,
    fontWeight: '800',
    fontFamily: MONO_FONT,
  },
  modalDoneBtn: {
    width: '100%',
    backgroundColor: '#0A0A0A',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalDoneBtnText: {
    color: brandColors.aoloGreen,
    fontSize: 13,
    fontWeight: '900',
    fontFamily: 'Roboto',
    letterSpacing: 0.8,
  },
});
