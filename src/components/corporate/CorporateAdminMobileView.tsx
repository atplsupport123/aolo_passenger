import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import {
  Home as HomeIcon,
  CheckCircle,
  Clock,
  Wallet as WalletIcon,
  Menu,
  Bell,
  ChevronRight,
  ArrowLeft,
  Search,
  Check,
  Car,
  FileText,
  Phone,
  Shield,
  Download,
  AlertTriangle,
} from 'lucide-react-native';
import {
  AdminMobileTab,
  AdminMobileSubPage,
  TripBooking,
  EmployeeRecord,
  DepartmentRecord,
  WalletTransactionRecord,
  InvoiceRecord,
  DriverRecord,
  SupportTicketRecord,
  CompanyPortalRecord,
  INITIAL_DRIVERS,
  INITIAL_TICKETS,
  INITIAL_COMPANY_PORTALS,
} from './corporateTypes';

interface CorporateAdminMobileViewProps {
  trips: TripBooking[];
  employees: EmployeeRecord[];
  departments: DepartmentRecord[];
  transactions: WalletTransactionRecord[];
  invoices: InvoiceRecord[];
  walletBalance: number;
  onApproveTrip: (tripId: string) => void;
  onRejectTrip: (tripId: string) => void;
  onAssignDriver: (tripId: string, driverName: string, cabNumber: string) => void;
  onAddEmployee: (emp: EmployeeRecord) => void;
  onAddMoney: (amt: number) => void;
  onExit: () => void;
}

export default function CorporateAdminMobileView({
  trips,
  employees,
  departments,
  transactions,
  invoices,
  walletBalance,
  onApproveTrip,
  onRejectTrip,
  onAssignDriver,
  onAddEmployee,
  onAddMoney,
  onExit,
}: CorporateAdminMobileViewProps) {
  const [activeTab, setActiveTab] = useState<AdminMobileTab>('HOME');
  const [subPage, setSubPage] = useState<AdminMobileSubPage>('NONE');

  // Approvals tab filter (Page 35)
  const [approvalTab, setApprovalTab] = useState<'PENDING' | 'AUTO' | 'REJECTED'>('PENDING');
  const [selectedTripId, setSelectedTripId] = useState<string>('ACB-0482-2026');

  // Trips tab filter (Page 37)
  const [tripsFilter, setTripsFilter] = useState<'ALL' | 'SCHEDULED' | 'COMPLETED' | 'PENDING' | 'CANCELLED'>('ALL');

  // Assign driver state (Page 38)
  const [selectedDriverId, setSelectedDriverId] = useState('DRV-101');
  const [drivers] = useState<DriverRecord[]>(INITIAL_DRIVERS);

  // Employee search (Page 40)
  const [empSearch, setEmpSearch] = useState('');

  // Support tickets (Page 48)
  const [tickets, setTickets] = useState<SupportTicketRecord[]>(INITIAL_TICKETS);
  const [ticketTab, setTicketTab] = useState<'OPEN' | 'IN PROGRESS' | 'RESOLVED'>('OPEN');
  const [ticketReplyText, setTicketReplyText] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState('TCK-1082');

  const pendingTrips = trips.filter((t) => t.status === 'PENDING');
  const activeDetailTrip = trips.find((t) => t.id === selectedTripId) || trips[0];

  const handleOpenSubPage = (page: AdminMobileSubPage) => {
    setSubPage(page);
  };

  const handleBackToMore = () => {
    setSubPage('NONE');
  };

  return (
    <View style={styles.mobileShellContainer}>
      {/* ================= TOP BLACK HEADER ================= */}
      <View style={styles.topHeader}>
        <View style={styles.topHeaderLeft}>
          {subPage !== 'NONE' ? (
            <TouchableOpacity style={styles.backButton} onPress={handleBackToMore}>
              <Text style={styles.backArrowChar}>‹</Text>
              <Text style={styles.headerCompanySub}>ABC CORPORATION · ADMIN</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.headerCompanySub}>ABC CORPORATION · ADMIN</Text>
          )}

          <Text style={styles.headerPageTitle}>
            {subPage === 'APPROVAL_DETAIL' && activeDetailTrip?.id}
            {subPage === 'ASSIGN_DRIVER' && 'Assign driver'}
            {subPage === 'EMPLOYEES' && 'Employees'}
            {subPage === 'DEPARTMENTS' && 'Departments'}
            {subPage === 'POLICIES' && 'Policies and auto-approval'}
            {subPage === 'RATE_CARD' && 'Rate card'}
            {subPage === 'INVOICES' && 'Invoices and GST'}
            {subPage === 'REPORTS' && 'Reports and charts'}
            {subPage === 'LIVE_TRACKING' && 'Live tracking'}
            {subPage === 'SUPPORT' && 'Support and complaints'}
            {subPage === 'ROLES' && 'Roles and permissions'}
            {subPage === 'SECURITY' && 'Security'}
            {subPage === 'COMPANY_PORTALS' && 'Company portals'}
            {subPage === 'NONE' && (
              activeTab === 'HOME' ? 'Overview' :
              activeTab === 'APPROVALS' ? 'Approvals' :
              activeTab === 'TRIPS' ? 'Trips' :
              activeTab === 'WALLET' ? 'Wallet' : 'More'
            )}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.bellIconBtn}
          onPress={() => Alert.alert('Notifications', 'Corporate wallet threshold warning · 2 mins ago')}
        >
          <Bell size={20} color="#FBBF24" />
        </TouchableOpacity>
      </View>

      {/* ================= SCROLLABLE CONTENT BODY ================= */}
      <ScrollView style={styles.contentBody} contentContainerStyle={styles.contentBodyInner}>
        {/* ================= PAGE 34: OVERVIEW ================= */}
        {subPage === 'NONE' && activeTab === 'HOME' && (
          <View>
            {/* Yellow Bar Alert Cards */}
            <View style={styles.alertCard}>
              <View style={styles.alertYellowBar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.alertTitleBold}>Wallet below ₹25,000</Text>
                <Text style={styles.alertSubText}>Threshold warning · 2 mins ago</Text>
              </View>
            </View>

            <View style={[styles.alertCard, { marginTop: 10 }]}>
              <View style={styles.alertYellowBar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.alertTitleBold}>ACB-0482-2026 awaiting approval</Text>
                <Text style={styles.alertSubText}>1 hr ago</Text>
              </View>
            </View>

            {/* Corporate Wallet Card */}
            <View style={styles.walletCardHero}>
              <View>
                <Text style={styles.walletCardSub}>Corporate wallet</Text>
                <Text style={styles.walletAmountGreen}>
                  ₹{walletBalance.toLocaleString('en-IN')}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.addMoneyBtnBlack}
                onPress={() => {
                  onAddMoney(25000);
                  Alert.alert('Top Up Added', '₹25,000 added to Corporate Wallet.');
                }}
              >
                <Text style={styles.addMoneyBtnBlackText}>+ ADD</Text>
              </TouchableOpacity>
            </View>

            {/* 4 Metric Cards (2x2 Grid) */}
            <View style={styles.metricGrid2x2}>
              <View style={styles.metricCell}>
                <Text style={styles.metricCellLabel}>Employees</Text>
                <Text style={styles.metricCellValue}>{employees.length}</Text>
                <Text style={styles.metricCellSub}>Active</Text>
              </View>

              <View style={styles.metricCell}>
                <Text style={styles.metricCellLabel}>Active trips</Text>
                <Text style={styles.metricCellValue}>1</Text>
                <Text style={styles.metricCellSub}>Scheduled</Text>
              </View>

              <View style={styles.metricCell}>
                <Text style={styles.metricCellLabel}>Pending</Text>
                <Text style={styles.metricCellValue}>{pendingTrips.length}</Text>
                <Text style={styles.metricCellSub}>Needs action</Text>
              </View>

              <View style={styles.metricCell}>
                <Text style={styles.metricCellLabel}>This month</Text>
                <Text style={styles.metricCellValue}>₹630</Text>
                <Text style={styles.metricCellSub}>Spend</Text>
              </View>
            </View>

            {/* Needs Approval Section */}
            <Text style={[styles.sectionTitleBold, { marginTop: 24 }]}>Needs approval</Text>

            {pendingTrips.length > 0 ? (
              <View style={styles.approvalItemCard}>
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.tripIdBold}>{pendingTrips[0].id}</Text>
                  <View style={styles.pillPending}>
                    <Text style={styles.pillPendingText}>PENDING</Text>
                  </View>
                </View>

                <Text style={styles.tripRouteEmployeeText}>
                  {pendingTrips[0].traveler} · {pendingTrips[0].pickup} to {pendingTrips[0].dropoff}
                </Text>

                <View style={styles.dateTimeFareRow}>
                  <Text style={styles.dateTimeText}>
                    {pendingTrips[0].date} at {pendingTrips[0].time}
                  </Text>
                  <Text style={styles.farePriceBold}>{pendingTrips[0].fare}</Text>
                </View>

                {/* Two Action Buttons: APPROVE & REJECT */}
                <View style={styles.twoBtnRow}>
                  <TouchableOpacity
                    style={[styles.btnGreenAction, { flex: 1 }]}
                    onPress={() => {
                      onApproveTrip(pendingTrips[0].id);
                      Alert.alert('Approved', `Ride ${pendingTrips[0].id} has been approved.`);
                    }}
                  >
                    <Text style={styles.btnGreenActionText}>APPROVE</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.btnRejectAction, { flex: 1 }]}
                    onPress={() => {
                      onRejectTrip(pendingTrips[0].id);
                      Alert.alert('Rejected', `Ride ${pendingTrips[0].id} has been rejected.`);
                    }}
                  >
                    <Text style={styles.btnRejectActionText}>REJECT</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.emptyStateBox}>
                <Text style={styles.emptyStateText}>No pending ride requests at this moment.</Text>
              </View>
            )}
          </View>
        )}

        {/* ================= PAGE 35: APPROVALS ================= */}
        {subPage === 'NONE' && activeTab === 'APPROVALS' && (
          <View>
            {/* Filter Pills */}
            <View style={styles.filterPillsRow}>
              {(['PENDING', 'AUTO', 'REJECTED'] as const).map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={[
                    styles.filterPill,
                    approvalTab === tab && styles.filterPillActive,
                  ]}
                  onPress={() => setApprovalTab(tab)}
                >
                  <Text
                    style={[
                      styles.filterPillText,
                      approvalTab === tab && styles.filterPillTextActive,
                    ]}
                  >
                    {tab === 'PENDING' ? `PENDING (${pendingTrips.length})` : tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.policySubBanner}>
              <Text style={styles.policySubBannerText}>
                Rides up to ₹1000 are approved automatically.
              </Text>
            </View>

            {trips.map((tr) => (
              <TouchableOpacity
                key={tr.id}
                style={styles.approvalItemCard}
                activeOpacity={0.85}
                onPress={() => {
                  setSelectedTripId(tr.id);
                  setSubPage('APPROVAL_DETAIL');
                }}
              >
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.tripIdBold}>{tr.id}</Text>
                  <View
                    style={[
                      styles.pillStatus,
                      tr.status === 'PENDING' ? styles.pillPending : styles.pillApproved,
                    ]}
                  >
                    <Text
                      style={[
                        styles.pillStatusText,
                        tr.status === 'PENDING' && { color: '#000000' },
                      ]}
                    >
                      {tr.status}
                    </Text>
                  </View>
                </View>

                <Text style={styles.tripRouteEmployeeText}>
                  {tr.traveler} · {tr.pickup} to {tr.dropoff}
                </Text>

                <View style={styles.dateTimeFareRow}>
                  <Text style={styles.dateTimeText}>
                    {tr.date} at {tr.time}
                  </Text>
                  <Text style={styles.farePriceBold}>{tr.fare}</Text>
                </View>

                {tr.status === 'PENDING' && (
                  <View style={styles.twoBtnRow}>
                    <TouchableOpacity
                      style={[styles.btnGreenAction, { flex: 1 }]}
                      onPress={() => {
                        onApproveTrip(tr.id);
                        Alert.alert('Approved', `Ride ${tr.id} approved.`);
                      }}
                    >
                      <Text style={styles.btnGreenActionText}>APPROVE</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.btnRejectAction, { flex: 1 }]}
                      onPress={() => {
                        onRejectTrip(tr.id);
                        Alert.alert('Rejected', `Ride ${tr.id} rejected.`);
                      }}
                    >
                      <Text style={styles.btnRejectActionText}>REJECT</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ================= PAGE 36: APPROVAL DETAIL ================= */}
        {subPage === 'APPROVAL_DETAIL' && activeDetailTrip && (
          <View>
            <View style={[styles.pillPending, { alignSelf: 'flex-start', marginBottom: 14 }]}>
              <Text style={styles.pillPendingText}>{activeDetailTrip.status}</Text>
            </View>

            <View style={styles.routeCardContainer}>
              <View style={styles.routePointRow}>
                <View style={styles.squareIconBox} />
                <View>
                  <Text style={styles.routePointBold}>{activeDetailTrip.pickup}</Text>
                  <Text style={styles.routePointSub}>{activeDetailTrip.pickupAddress}</Text>
                </View>
              </View>

              <View style={[styles.routePointRow, { marginTop: 14 }]}>
                <View style={styles.circleIconBox} />
                <View>
                  <Text style={styles.routePointBold}>{activeDetailTrip.dropoff}</Text>
                  <Text style={styles.routePointSub}>{activeDetailTrip.dropoffAddress}</Text>
                </View>
              </View>
            </View>

            <View style={styles.detailsTableCard}>
              <View style={styles.tableRow}>
                <Text style={styles.tableRowLabel}>Employee</Text>
                <Text style={styles.tableRowValue}>{activeDetailTrip.traveler}</Text>
              </View>
              <View style={styles.tableDivider} />

              <View style={styles.tableRow}>
                <Text style={styles.tableRowLabel}>Date and time</Text>
                <Text style={styles.tableRowValue}>
                  {activeDetailTrip.date} at {activeDetailTrip.time}
                </Text>
              </View>
              <View style={styles.tableDivider} />

              <View style={styles.tableRow}>
                <Text style={styles.tableRowLabel}>Cost center</Text>
                <Text style={styles.tableRowValue}>{activeDetailTrip.costCenter}</Text>
              </View>
              <View style={styles.tableDivider} />

              <View style={styles.tableRow}>
                <Text style={styles.tableRowLabel}>Billing</Text>
                <Text style={styles.tableRowValue}>{activeDetailTrip.billingMode}</Text>
              </View>
              <View style={styles.tableDivider} />

              <View style={styles.tableRow}>
                <Text style={styles.tableRowLabel}>Fare</Text>
                <Text style={[styles.tableRowValue, { fontSize: 20, fontWeight: '800' }]}>
                  {activeDetailTrip.fare}
                </Text>
              </View>
            </View>

            {activeDetailTrip.status === 'PENDING' ? (
              <View style={{ gap: 12, marginTop: 24 }}>
                <TouchableOpacity
                  style={styles.fullWidthGreenBtn}
                  onPress={() => {
                    onApproveTrip(activeDetailTrip.id);
                    Alert.alert('Approved', `Ride ${activeDetailTrip.id} has been approved.`);
                    setSubPage('NONE');
                  }}
                >
                  <Text style={styles.fullWidthGreenBtnText}>APPROVE RIDE</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.fullWidthRejectBtn}
                  onPress={() => {
                    onRejectTrip(activeDetailTrip.id);
                    Alert.alert('Rejected', `Ride ${activeDetailTrip.id} has been rejected.`);
                    setSubPage('NONE');
                  }}
                >
                  <Text style={styles.fullWidthRejectBtnText}>REJECT RIDE</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.fullWidthSecondaryBtn, { marginTop: 24 }]}
                onPress={() => setSubPage('ASSIGN_DRIVER')}
              >
                <Text style={styles.fullWidthSecondaryBtnText}>ASSIGN DRIVER</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* ================= PAGE 37: TRIPS ================= */}
        {subPage === 'NONE' && activeTab === 'TRIPS' && (
          <View>
            <View style={styles.filterPillsRow}>
              {(['ALL', 'SCHEDULED', 'COMPLETED', 'PENDING', 'CANCELLED'] as const).map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={[
                    styles.filterPill,
                    tripsFilter === tab && styles.filterPillActive,
                  ]}
                  onPress={() => setTripsFilter(tab)}
                >
                  <Text
                    style={[
                      styles.filterPillText,
                      tripsFilter === tab && styles.filterPillTextActive,
                    ]}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.downloadAllBtn}
              onPress={() => Alert.alert('Invoices', 'All invoices downloaded as PDF archive.')}
            >
              <Text style={styles.downloadAllBtnText}>DOWNLOAD ALL COMPLETE INVOICES</Text>
            </TouchableOpacity>

            {trips.map((item) => (
              <View key={item.id} style={styles.approvalItemCard}>
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.tripIdBold}>{item.id}</Text>
                  <View
                    style={[
                      styles.pillStatus,
                      item.status === 'PENDING'
                        ? styles.pillPending
                        : item.status === 'APPROVED' || item.status === 'SCHEDULED'
                        ? styles.pillApproved
                        : styles.pillCompleted,
                    ]}
                  >
                    <Text
                      style={[
                        styles.pillStatusText,
                        item.status === 'PENDING' && { color: '#000000' },
                      ]}
                    >
                      {item.status}
                    </Text>
                  </View>
                </View>

                <Text style={styles.tripRouteEmployeeText}>
                  {item.traveler} · {item.pickup} to {item.dropoff}
                </Text>

                <View style={styles.dateTimeFareRow}>
                  <Text style={styles.dateTimeText}>
                    {item.date} at {item.time}
                  </Text>
                  <Text style={styles.farePriceBold}>{item.fare}</Text>
                </View>

                {item.status === 'APPROVED' && (
                  <TouchableOpacity
                    style={styles.assignDriverBtn}
                    onPress={() => {
                      setSelectedTripId(item.id);
                      setSubPage('ASSIGN_DRIVER');
                    }}
                  >
                    <Text style={styles.assignDriverBtnText}>ASSIGN DRIVER</Text>
                  </TouchableOpacity>
                )}

                {item.status === 'COMPLETED' && (
                  <TouchableOpacity
                    style={styles.downloadInvoiceItemBtn}
                    onPress={() => Alert.alert('Invoice', `Downloaded tax invoice for ${item.id}`)}
                  >
                    <Text style={styles.downloadInvoiceItemBtnText}>DOWNLOAD INVOICE</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        )}

        {/* ================= PAGE 38: ASSIGN DRIVER ================= */}
        {subPage === 'ASSIGN_DRIVER' && activeDetailTrip && (
          <View>
            <View style={styles.approvalItemCard}>
              <Text style={styles.tripIdBold}>{activeDetailTrip.id} · {activeDetailTrip.traveler}</Text>
              <Text style={styles.tripRouteEmployeeText}>
                {activeDetailTrip.pickup} to {activeDetailTrip.dropoff}
              </Text>
              <Text style={styles.dateTimeText}>
                {activeDetailTrip.date} at {activeDetailTrip.time}
              </Text>
            </View>

            <Text style={[styles.sectionTitleBold, { marginTop: 16 }]}>Available drivers</Text>
            <Text style={styles.subtextSmall}>From your driver system</Text>

            <View style={{ gap: 10, marginTop: 12 }}>
              {drivers.map((drv) => (
                <TouchableOpacity
                  key={drv.id}
                  style={[
                    styles.driverSelectCard,
                    selectedDriverId === drv.id && styles.driverSelectCardActive,
                  ]}
                  onPress={() => setSelectedDriverId(drv.id)}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.driverNameBold}>{drv.name}</Text>
                    <Text style={styles.driverCabMeta}>
                      {drv.cabModel} · {drv.cabNumber} · {drv.distance}
                    </Text>
                  </View>
                  {selectedDriverId === drv.id && (
                    <View style={styles.driverCheckCircle}>
                      <Check size={14} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.fullWidthBlackBtn, { marginTop: 24 }]}
              onPress={() => {
                const drv = drivers.find((d) => d.id === selectedDriverId) || drivers[0];
                onAssignDriver(activeDetailTrip.id, drv.name, drv.cabNumber);
                Alert.alert('Driver Assigned', `${drv.name} assigned to ${activeDetailTrip.id}.`);
                setSubPage('NONE');
                setActiveTab('TRIPS');
              }}
            >
              <Text style={styles.fullWidthBlackBtnText}>CONFIRM ASSIGNMENT</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ================= PAGE 39: WALLET ================= */}
        {subPage === 'NONE' && activeTab === 'WALLET' && (
          <View>
            <View style={styles.walletCardHero}>
              <View>
                <Text style={styles.walletCardSub}>Balance</Text>
                <Text style={styles.walletAmountGreen}>
                  ₹{walletBalance.toLocaleString('en-IN')}
                </Text>
                <Text style={styles.alertSubText}>
                  Alert below ₹25,000 · Auto invoice active
                </Text>
              </View>
            </View>

            <View style={styles.twoBtnRow}>
              <TouchableOpacity
                style={[styles.fullWidthBlackBtn, { flex: 1 }]}
                onPress={() => {
                  onAddMoney(25000);
                  Alert.alert('Top Up Added', '₹25,000 added to Corporate Wallet.');
                }}
              >
                <Text style={styles.fullWidthBlackBtnText}>+ ADD MONEY</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.fullWidthSecondaryBtn, { flex: 1 }]}
                onPress={() => Alert.alert('Threshold Alert', 'Alert set for wallet below ₹25,000')}
              >
                <Text style={styles.fullWidthSecondaryBtnText}>SET ALERT</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.walletCardHero, { marginTop: 14 }]}>
              <Text style={styles.walletCardSub}>Current billing cycle</Text>
              <Text style={styles.billingAmountLarge}>₹630</Text>
              <TouchableOpacity
                style={[styles.fullWidthSecondaryBtn, { marginTop: 10 }]}
                onPress={() => handleOpenSubPage('REPORTS')}
              >
                <Text style={styles.fullWidthSecondaryBtnText}>VIEW GRAPH</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.sectionTitleBold, { marginTop: 20 }]}>Transactions</Text>
            {transactions.map((t) => (
              <View key={t.id} style={styles.transactionItemCard}>
                <View>
                  <Text style={styles.transactionTitleBold}>{t.description}</Text>
                  <Text style={styles.transactionDateSub}>{t.date}</Text>
                </View>
                <Text
                  style={[
                    styles.transactionAmountText,
                    { color: t.type === 'CREDIT' ? '#10B981' : '#000000' },
                  ]}
                >
                  {t.type === 'CREDIT' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                </Text>
              </View>
            ))}

            <Text style={[styles.sectionTitleBold, { marginTop: 20 }]}>Invoices</Text>
            {invoices.map((inv) => (
              <View key={inv.id} style={styles.invoiceItemCard}>
                <View>
                  <Text style={styles.transactionTitleBold}>{inv.id}</Text>
                  <Text style={styles.transactionDateSub}>{inv.month} · ₹{inv.amount}</Text>
                </View>
                <TouchableOpacity
                  style={styles.pdfDownloadBadge}
                  onPress={() => Alert.alert('Invoice', `Downloaded ${inv.id}.pdf`)}
                >
                  <Text style={styles.pdfDownloadBadgeText}>PDF</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* ================= PAGE 40: EMPLOYEES ================= */}
        {subPage === 'EMPLOYEES' && (
          <View>
            <View style={styles.twoBtnRow}>
              <TouchableOpacity
                style={[styles.fullWidthBlackBtn, { flex: 1 }]}
                onPress={() => {
                  const newEmp: EmployeeRecord = {
                    id: `AOLO-EMP-0${Math.floor(100 + Math.random() * 900)}`,
                    name: 'Vikas Malhotra',
                    department: 'Operations',
                    costCenter: 'AOLO-OPS-LAUNCH',
                    email: 'vikas.m@abccorp.com',
                    phone: '+91 97788 11223',
                    status: 'ACTIVE',
                  };
                  onAddEmployee(newEmp);
                  Alert.alert('Employee Added', `${newEmp.name} (${newEmp.id}) added.`);
                }}
              >
                <Text style={styles.fullWidthBlackBtnText}>+ ADD</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.fullWidthSecondaryBtn, { flex: 1 }]}
                onPress={() => Alert.alert('Upload CSV', 'File picker opened for bulk import.')}
              >
                <Text style={styles.fullWidthSecondaryBtnText}>UPLOAD EXCEL / CSV</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.searchBox, { marginTop: 14 }]}>
              <Search size={14} color="#71717A" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search employees..."
                placeholderTextColor="#71717A"
                value={empSearch}
                onChangeText={setEmpSearch}
              />
            </View>

            <View style={{ gap: 10, marginTop: 14 }}>
              {employees
                .filter((e) => e.name.toLowerCase().includes(empSearch.toLowerCase()))
                .map((emp) => (
                  <View key={emp.id} style={styles.employeeCardItem}>
                    <View style={styles.empAvatarCircle}>
                      <Text style={styles.empAvatarText}>{emp.name.charAt(0)}</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.employeeNameBold}>{emp.name}</Text>
                      <Text style={styles.employeeMetaText}>
                        {emp.department} · {emp.id}
                      </Text>
                    </View>
                    <View style={styles.pillApproved}>
                      <Text style={styles.pillApprovedText}>{emp.status}</Text>
                    </View>
                  </View>
                ))}
            </View>
          </View>
        )}

        {/* ================= PAGE 41: MORE MENU ================= */}
        {subPage === 'NONE' && activeTab === 'MORE' && (
          <View style={styles.moreMenuList}>
            <TouchableOpacity
              style={styles.moreMenuItem}
              onPress={() => handleOpenSubPage('EMPLOYEES')}
            >
              <Text style={styles.moreMenuText}>Employees</Text>
              <ChevronRight size={18} color="#71717A" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.moreMenuItem}
              onPress={() => handleOpenSubPage('DEPARTMENTS')}
            >
              <Text style={styles.moreMenuText}>Departments and budgets</Text>
              <ChevronRight size={18} color="#71717A" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.moreMenuItem}
              onPress={() => handleOpenSubPage('POLICIES')}
            >
              <Text style={styles.moreMenuText}>Policies and auto-approval</Text>
              <ChevronRight size={18} color="#71717A" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.moreMenuItem}
              onPress={() => handleOpenSubPage('RATE_CARD')}
            >
              <Text style={styles.moreMenuText}>Rate card</Text>
              <ChevronRight size={18} color="#71717A" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.moreMenuItem}
              onPress={() => handleOpenSubPage('INVOICES')}
            >
              <Text style={styles.moreMenuText}>Invoices and GST</Text>
              <ChevronRight size={18} color="#71717A" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.moreMenuItem}
              onPress={() => handleOpenSubPage('REPORTS')}
            >
              <Text style={styles.moreMenuText}>Reports and charts</Text>
              <ChevronRight size={18} color="#71717A" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.moreMenuItem}
              onPress={() => handleOpenSubPage('LIVE_TRACKING')}
            >
              <Text style={styles.moreMenuText}>Live tracking</Text>
              <ChevronRight size={18} color="#71717A" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.moreMenuItem}
              onPress={() => handleOpenSubPage('SUPPORT')}
            >
              <Text style={styles.moreMenuText}>Support and complaints</Text>
              <ChevronRight size={18} color="#71717A" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.moreMenuItem}
              onPress={() => handleOpenSubPage('ROLES')}
            >
              <Text style={styles.moreMenuText}>Roles and permissions</Text>
              <ChevronRight size={18} color="#71717A" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.moreMenuItem}
              onPress={() => handleOpenSubPage('SECURITY')}
            >
              <Text style={styles.moreMenuText}>Security</Text>
              <ChevronRight size={18} color="#71717A" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.moreMenuItem}
              onPress={() => handleOpenSubPage('COMPANY_PORTALS')}
            >
              <Text style={styles.moreMenuText}>Company portals</Text>
              <ChevronRight size={18} color="#71717A" />
            </TouchableOpacity>
          </View>
        )}

        {/* ================= PAGE 42: LIVE TRACKING ================= */}
        {subPage === 'LIVE_TRACKING' && (
          <View>
            <View style={styles.liveMapBoxMobile}>
              <View style={styles.mapGridLines} />
              <View style={styles.cabMarkerPill}>
                <Car size={14} color="#FFFFFF" />
                <Text style={styles.cabMarkerText}>ACB-0482-2026</Text>
              </View>
              <Text style={styles.liveMapCenterLabel}>Live map</Text>
            </View>

            <Text style={[styles.sectionTitleBold, { marginTop: 16 }]}>Active trips (1)</Text>
            <View style={styles.approvalItemCard}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.tripIdBold}>ACB-0482-2026</Text>
                <View style={styles.pillApproved}>
                  <Text style={styles.pillApprovedText}>ON THE WAY</Text>
                </View>
              </View>

              <Text style={styles.tripRouteEmployeeText}>
                Amit Roy · Office HQ to Darbhanga Junction
              </Text>
              <Text style={styles.dateTimeText}>
                Driver and cab: Rameshwar Kumar (BR-01-PA-9921)
              </Text>

              <View style={styles.twoBtnRow}>
                <TouchableOpacity
                  style={[styles.fullWidthBlackBtn, { flex: 1 }]}
                  onPress={() => Alert.alert('Call', 'Connecting to driver (+91 94310 11223)...')}
                >
                  <Text style={styles.fullWidthBlackBtnText}>CALL DRIVER</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.fullWidthSecondaryBtn, { flex: 1 }]}
                  onPress={() => handleOpenSubPage('APPROVAL_DETAIL')}
                >
                  <Text style={styles.fullWidthSecondaryBtnText}>TRIP DETAILS</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* ================= PAGE 43: DEPARTMENTS ================= */}
        {subPage === 'DEPARTMENTS' && (
          <View>
            <TouchableOpacity
              style={styles.fullWidthBlackBtn}
              onPress={() => Alert.alert('Add Department', 'Create new department modal.')}
            >
              <Text style={styles.fullWidthBlackBtnText}>+ ADD DEPARTMENT</Text>
            </TouchableOpacity>

            <View style={{ gap: 12, marginTop: 16 }}>
              {departments.map((dept) => (
                <View key={dept.id} style={styles.departmentCardMobile}>
                  <Text style={styles.tripIdBold}>{dept.name}</Text>
                  <Text style={styles.drawerSubText}>
                    Cost center: {dept.costCenter} · Employees: {dept.employeeCount}
                  </Text>
                  <Text style={styles.dateTimeText}>
                    Budget ₹{dept.monthlyBudget.toLocaleString('en-IN')} · Used ₹
                    {dept.usedBudget.toLocaleString('en-IN')}
                  </Text>
                </View>
              ))}
            </View>

            <View style={[styles.policyToggleCardMobile, { marginTop: 18 }]}>
              <Text style={styles.policyTitle}>Alert at 80% of budget</Text>
              <Switch value={true} trackColor={{ false: '#D4D4D8', true: '#000000' }} thumbColor="#FFFFFF" />
            </View>

            <View style={styles.policyToggleCardMobile}>
              <Text style={styles.policyTitle}>Block new rides at 100%</Text>
              <Switch value={false} trackColor={{ false: '#D4D4D8', true: '#000000' }} thumbColor="#FFFFFF" />
            </View>
          </View>
        )}

        {/* ================= PAGE 44: POLICIES ================= */}
        {subPage === 'POLICIES' && (
          <View>
            <View style={styles.policyToggleCardMobile}>
              <View style={{ flex: 1 }}>
                <Text style={styles.policyTitle}>Admin approval required</Text>
                <Text style={styles.policyDesc}>Every ride waits for approval</Text>
              </View>
              <Switch value={true} trackColor={{ false: '#D4D4D8', true: '#000000' }} thumbColor="#FFFFFF" />
            </View>

            <View style={styles.policyToggleCardMobile}>
              <View style={{ flex: 1 }}>
                <Text style={styles.policyTitle}>Auto approve short rides</Text>
                <Text style={styles.policyDesc}>Up to ₹1000 and within policy</Text>
              </View>
              <Switch value={true} trackColor={{ false: '#D4D4D8', true: '#000000' }} thumbColor="#FFFFFF" />
            </View>

            <View style={styles.policyToggleCardMobile}>
              <View style={{ flex: 1 }}>
                <Text style={styles.policyTitle}>Guest visitor bookings</Text>
                <Text style={styles.policyDesc}>Employees can book for visitors</Text>
              </View>
              <Switch value={true} trackColor={{ false: '#D4D4D8', true: '#000000' }} thumbColor="#FFFFFF" />
            </View>

            <View style={styles.policyToggleCardMobile}>
              <View style={{ flex: 1 }}>
                <Text style={styles.policyTitle}>Airport rides</Text>
              </View>
              <Switch value={true} trackColor={{ false: '#D4D4D8', true: '#000000' }} thumbColor="#FFFFFF" />
            </View>

            <View style={styles.policyToggleCardMobile}>
              <View style={{ flex: 1 }}>
                <Text style={styles.policyTitle}>Rentals</Text>
              </View>
              <Switch value={false} trackColor={{ false: '#D4D4D8', true: '#000000' }} thumbColor="#FFFFFF" />
            </View>

            <Text style={styles.inputLabel}>Monthly limit per employee</Text>
            <TextInput style={styles.mobileInput} value="₹25,000" />

            <Text style={styles.inputLabel}>Allowed hours</Text>
            <TextInput style={styles.mobileInput} value="06:00 to 22:00" />

            <TouchableOpacity
              style={[styles.fullWidthBlackBtn, { marginTop: 24 }]}
              onPress={() => {
                Alert.alert('Saved', 'Policies updated.');
                handleBackToMore();
              }}
            >
              <Text style={styles.fullWidthBlackBtnText}>SAVE</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ================= PAGE 45: RATE CARD ================= */}
        {subPage === 'RATE_CARD' && (
          <View>
            <View style={styles.approvalItemCard}>
              <Text style={styles.tripIdBold}>AOLO Sedan (Dzire)</Text>
              <Text style={styles.dateTimeText}>Base fare: ₹120 · Per km: ₹14/km</Text>
              <Text style={styles.dateTimeText}>Per hour: ₹180/hr · Waiting: ₹2/min</Text>
            </View>

            <Text style={styles.inputLabel}>Airport flat</Text>
            <TextInput style={styles.mobileInput} value="₹750" />

            <Text style={styles.inputLabel}>Outstation / km</Text>
            <TextInput style={styles.mobileInput} value="₹16/km" />

            <Text style={styles.inputLabel}>Company discount</Text>
            <TextInput style={styles.mobileInput} value="10%" />

            <TouchableOpacity
              style={[styles.fullWidthBlackBtn, { marginTop: 24 }]}
              onPress={() => {
                Alert.alert('Saved', 'Rate card updated.');
                handleBackToMore();
              }}
            >
              <Text style={styles.fullWidthBlackBtnText}>SAVE</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ================= PAGE 46: INVOICES AND GST ================= */}
        {subPage === 'INVOICES' && (
          <View>
            <View style={styles.walletCardHero}>
              <Text style={styles.walletCardSub}>Current cycle spend</Text>
              <Text style={styles.billingAmountLarge}>₹630</Text>
              <Text style={styles.alertSubText}>GSTIN 10AAACB2849P1Z2 · Central Corporate Billing</Text>
            </View>

            <View style={[styles.policyToggleCardMobile, { marginTop: 14 }]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.policyTitle}>Create invoice automatically</Text>
                <Text style={styles.policyDesc}>Last day of every month</Text>
              </View>
              <Switch value={true} trackColor={{ false: '#D4D4D8', true: '#000000' }} thumbColor="#FFFFFF" />
            </View>

            <Text style={[styles.sectionTitleBold, { marginTop: 20 }]}>Invoices</Text>
            {invoices.map((inv) => (
              <View key={inv.id} style={styles.invoiceItemCard}>
                <View>
                  <Text style={styles.transactionTitleBold}>{inv.id}</Text>
                  <Text style={styles.transactionDateSub}>{inv.month} · ₹{inv.amount}</Text>
                </View>
                <View style={inv.status === 'PAID' ? styles.pillApproved : styles.pillPending}>
                  <Text
                    style={[
                      styles.pillStatusText,
                      inv.status === 'DUE' && { color: '#000000' },
                    ]}
                  >
                    {inv.status}
                  </Text>
                </View>
              </View>
            ))}

            <TouchableOpacity
              style={[styles.fullWidthBlackBtn, { marginTop: 20 }]}
              onPress={() => Alert.alert('Invoices', 'All PDF invoices downloaded.')}
            >
              <Text style={styles.fullWidthBlackBtnText}>DOWNLOAD ALL</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ================= PAGE 47: REPORTS AND CHARTS ================= */}
        {subPage === 'REPORTS' && (
          <View>
            <View style={styles.filterPillsRow}>
              <TouchableOpacity style={[styles.filterPill, styles.filterPillActive]}>
                <Text style={[styles.filterPillText, styles.filterPillTextActive]}>This month</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterPill}>
                <Text style={styles.filterPillText}>Last month</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterPill}>
                <Text style={styles.filterPillText}>Custom</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.reportCardMobile}>
              <Text style={styles.sectionTitleBold}>Spend by department</Text>
              <View style={styles.chartPlaceholderBox}>
                <Text style={styles.subtextSmall}>Operations: ₹74,200 · Marketing: ₹86,400</Text>
              </View>
            </View>

            <View style={[styles.reportCardMobile, { marginTop: 12 }]}>
              <Text style={styles.sectionTitleBold}>Trips over time</Text>
              <View style={styles.chartPlaceholderBox}>
                <Text style={styles.subtextSmall}>Week 1: 12 · Week 2: 18 · Week 3: 24</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.fullWidthBlackBtn, { marginTop: 24 }]}
              onPress={() => Alert.alert('Export', 'Report generated and downloaded.')}
            >
              <Text style={styles.fullWidthBlackBtnText}>EXPORT REPORT</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ================= PAGE 48: SUPPORT AND COMPLAINTS ================= */}
        {subPage === 'SUPPORT' && (
          <View>
            <View style={styles.filterPillsRow}>
              {(['OPEN', 'IN PROGRESS', 'RESOLVED'] as const).map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={[
                    styles.filterPill,
                    ticketTab === tab && styles.filterPillActive,
                  ]}
                  onPress={() => setTicketTab(tab)}
                >
                  <Text
                    style={[
                      styles.filterPillText,
                      ticketTab === tab && styles.filterPillTextActive,
                    ]}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {tickets.map((tck) => (
              <View key={tck.id} style={styles.approvalItemCard}>
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.tripIdBold}>{tck.id}</Text>
                  <View style={tck.status === 'RESOLVED' ? styles.pillApproved : styles.pillPending}>
                    <Text
                      style={[
                        styles.pillStatusText,
                        tck.status !== 'RESOLVED' && { color: '#000000' },
                      ]}
                    >
                      {tck.status}
                    </Text>
                  </View>
                </View>

                <Text style={styles.tripRouteEmployeeText}>
                  {tck.employeeName} · {tck.issue}
                </Text>
                <Text style={styles.dateTimeText}>Trip: {tck.tripId}</Text>
              </View>
            ))}

            <View style={[styles.approvalItemCard, { marginTop: 14 }]}>
              <Text style={styles.inputLabel}>Reply</Text>
              <TextInput
                style={[styles.mobileInput, { height: 70, textAlignVertical: 'top' }]}
                placeholder="Type reply message..."
                placeholderTextColor="#71717A"
                value={ticketReplyText}
                onChangeText={setTicketReplyText}
                multiline
              />

              <View style={[styles.twoBtnRow, { marginTop: 12 }]}>
                <TouchableOpacity
                  style={[styles.fullWidthBlackBtn, { flex: 1 }]}
                  onPress={() => {
                    Alert.alert('Reply Sent', 'Traveler notified.');
                    setTicketReplyText('');
                  }}
                >
                  <Text style={styles.fullWidthBlackBtnText}>SEND REPLY</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.fullWidthSecondaryBtn, { flex: 1 }]}
                  onPress={() => Alert.alert('Resolved', 'Ticket resolved.')}
                >
                  <Text style={styles.fullWidthSecondaryBtnText}>RESOLVE</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* ================= PAGE 49: ROLES AND PERMISSIONS ================= */}
        {subPage === 'ROLES' && (
          <View>
            <TouchableOpacity
              style={styles.fullWidthBlackBtn}
              onPress={() => Alert.alert('Add Role', 'New role wizard opened.')}
            >
              <Text style={styles.fullWidthBlackBtnText}>+ ADD ROLE</Text>
            </TouchableOpacity>

            <View style={{ gap: 10, marginTop: 14 }}>
              <View style={styles.approvalItemCard}>
                <Text style={styles.tripIdBold}>Super admin</Text>
                <Text style={styles.drawerSubText}>Approve · Billing · Staff (2 Users)</Text>
              </View>

              <View style={styles.approvalItemCard}>
                <Text style={styles.tripIdBold}>Approver</Text>
                <Text style={styles.drawerSubText}>Can approve rides only (4 Users)</Text>
              </View>

              <View style={styles.approvalItemCard}>
                <Text style={styles.tripIdBold}>Billing</Text>
                <Text style={styles.drawerSubText}>Can see invoices and wallet (1 User)</Text>
              </View>
            </View>
          </View>
        )}

        {/* ================= PAGE 50: SECURITY ================= */}
        {subPage === 'SECURITY' && (
          <View>
            <View style={styles.policyToggleCardMobile}>
              <View style={{ flex: 1 }}>
                <Text style={styles.policyTitle}>Two-factor login</Text>
                <Text style={styles.policyDesc}>OTP at every admin login</Text>
              </View>
              <Switch value={true} trackColor={{ false: '#D4D4D8', true: '#000000' }} thumbColor="#FFFFFF" />
            </View>

            <View style={styles.policyToggleCardMobile}>
              <View style={{ flex: 1 }}>
                <Text style={styles.policyTitle}>Auto logout</Text>
                <Text style={styles.policyDesc}>Sign out when idle</Text>
              </View>
              <Switch value={true} trackColor={{ false: '#D4D4D8', true: '#000000' }} thumbColor="#FFFFFF" />
            </View>

            <Text style={[styles.sectionTitleBold, { marginTop: 20 }]}>Admin users</Text>
            <View style={styles.approvalItemCard}>
              <Text style={styles.tripIdBold}>Amit Kumar</Text>
              <Text style={styles.drawerSubText}>admin@abccorp.com · Admin</Text>
            </View>

            <Text style={[styles.sectionTitleBold, { marginTop: 20 }]}>Audit log</Text>
            <View style={styles.approvalItemCard}>
              <Text style={styles.tripRouteEmployeeText}>Approved ACB-0482-2026</Text>
              <Text style={styles.dateTimeText}>Admin · 09:12 AM</Text>
            </View>

            <TouchableOpacity
              style={[styles.fullWidthSecondaryBtn, { marginTop: 24 }]}
              onPress={() => onExit()}
            >
              <Text style={styles.fullWidthSecondaryBtnText}>LOG OUT</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ================= PAGE 51: COMPANY PORTALS ================= */}
        {subPage === 'COMPANY_PORTALS' && (
          <View>
            <TouchableOpacity
              style={styles.fullWidthBlackBtn}
              onPress={() => Alert.alert('Add Company', 'Create new tenant portal.')}
            >
              <Text style={styles.fullWidthBlackBtnText}>+ ADD COMPANY</Text>
            </TouchableOpacity>

            <View style={[styles.approvalItemCard, { marginTop: 14 }]}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.tripIdBold}>ABC CORPORATION</Text>
                <View style={styles.pillApproved}>
                  <Text style={styles.pillApprovedText}>ACTIVE</Text>
                </View>
              </View>
              <Text style={styles.drawerSubText}>Employees: 5</Text>
            </View>

            <Text style={[styles.sectionTitleBold, { marginTop: 20 }]}>Branding</Text>
            <Text style={styles.inputLabel}>Display name</Text>
            <TextInput style={styles.mobileInput} value="ABC CORPORATION" />

            <TouchableOpacity
              style={[styles.fullWidthSecondaryBtn, { marginTop: 12 }]}
              onPress={() => Alert.alert('Upload', 'Select logo image file.')}
            >
              <Text style={styles.fullWidthSecondaryBtnText}>Upload logo</Text>
            </TouchableOpacity>

            <Text style={styles.inputLabel}>Web address</Text>
            <TextInput style={styles.mobileInput} value="abccorp.aolocabs.in" editable={false} />

            <TouchableOpacity
              style={[styles.fullWidthBlackBtn, { marginTop: 24 }]}
              onPress={() => {
                Alert.alert('Saved', 'Company branding updated.');
                handleBackToMore();
              }}
            >
              <Text style={styles.fullWidthBlackBtnText}>SAVE</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* ================= BOTTOM TAB BAR (5 TABS) ================= */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.bottomNavItem}
          onPress={() => {
            setActiveTab('HOME');
            setSubPage('NONE');
          }}
        >
          <HomeIcon
            size={20}
            color={activeTab === 'HOME' && subPage === 'NONE' ? '#000000' : '#71717A'}
            strokeWidth={activeTab === 'HOME' && subPage === 'NONE' ? 2.5 : 2}
          />
          <Text
            style={[
              styles.bottomNavText,
              activeTab === 'HOME' && subPage === 'NONE' && styles.bottomNavTextActive,
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomNavItem}
          onPress={() => {
            setActiveTab('APPROVALS');
            setSubPage('NONE');
          }}
        >
          <CheckCircle
            size={20}
            color={activeTab === 'APPROVALS' && subPage === 'NONE' ? '#000000' : '#71717A'}
            strokeWidth={activeTab === 'APPROVALS' && subPage === 'NONE' ? 2.5 : 2}
          />
          <Text
            style={[
              styles.bottomNavText,
              activeTab === 'APPROVALS' && subPage === 'NONE' && styles.bottomNavTextActive,
            ]}
          >
            Approvals
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomNavItem}
          onPress={() => {
            setActiveTab('TRIPS');
            setSubPage('NONE');
          }}
        >
          <Clock
            size={20}
            color={activeTab === 'TRIPS' && subPage === 'NONE' ? '#000000' : '#71717A'}
            strokeWidth={activeTab === 'TRIPS' && subPage === 'NONE' ? 2.5 : 2}
          />
          <Text
            style={[
              styles.bottomNavText,
              activeTab === 'TRIPS' && subPage === 'NONE' && styles.bottomNavTextActive,
            ]}
          >
            Trips
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomNavItem}
          onPress={() => {
            setActiveTab('WALLET');
            setSubPage('NONE');
          }}
        >
          <WalletIcon
            size={20}
            color={activeTab === 'WALLET' && subPage === 'NONE' ? '#000000' : '#71717A'}
            strokeWidth={activeTab === 'WALLET' && subPage === 'NONE' ? 2.5 : 2}
          />
          <Text
            style={[
              styles.bottomNavText,
              activeTab === 'WALLET' && subPage === 'NONE' && styles.bottomNavTextActive,
            ]}
          >
            Wallet
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomNavItem}
          onPress={() => {
            setActiveTab('MORE');
            setSubPage('NONE');
          }}
        >
          <Menu
            size={20}
            color={activeTab === 'MORE' || subPage !== 'NONE' ? '#000000' : '#71717A'}
            strokeWidth={activeTab === 'MORE' || subPage !== 'NONE' ? 2.5 : 2}
          />
          <Text
            style={[
              styles.bottomNavText,
              (activeTab === 'MORE' || subPage !== 'NONE') && styles.bottomNavTextActive,
            ]}
          >
            More
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mobileShellContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Top Header
  topHeader: {
    backgroundColor: '#000000',
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topHeaderLeft: {
    flex: 1,
  },
  headerCompanySub: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9CA3AF',
    fontFamily: 'Roboto',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  headerPageTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Roboto',
    marginTop: 2,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backArrowChar: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '700',
    marginRight: 4,
  },
  bellIconBtn: {
    padding: 6,
  },

  // Content
  contentBody: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentBodyInner: {
    padding: 20,
    paddingBottom: 36,
  },

  // Alerts
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F4F4F5',
    borderRadius: 12,
    padding: 14,
  },
  alertYellowBar: {
    width: 4,
    height: 36,
    borderRadius: 2,
    backgroundColor: '#FBBF24',
  },
  alertTitleBold: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Roboto',
  },
  alertSubText: {
    fontSize: 12,
    color: '#71717A',
    fontFamily: 'Roboto',
    marginTop: 2,
  },

  // Wallet
  walletCardHero: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F4F4F5',
    borderRadius: 14,
    padding: 18,
    marginTop: 14,
  },
  walletCardSub: {
    fontSize: 12,
    color: '#71717A',
    fontFamily: 'Roboto',
  },
  walletAmountGreen: {
    fontSize: 26,
    fontWeight: '800',
    color: '#10B981',
    fontFamily: 'Roboto',
    marginTop: 2,
  },
  billingAmountLarge: {
    fontSize: 26,
    fontWeight: '800',
    color: '#000000',
    fontFamily: 'Roboto',
    marginTop: 2,
  },
  addMoneyBtnBlack: {
    backgroundColor: '#000000',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  addMoneyBtnBlackText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Roboto',
  },

  // 2x2 Metric Grid
  metricGrid2x2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 14,
  },
  metricCell: {
    width: '48%',
    backgroundColor: '#F4F4F5',
    borderRadius: 12,
    padding: 16,
  },
  metricCellLabel: {
    fontSize: 12,
    color: '#71717A',
    fontFamily: 'Roboto',
  },
  metricCellValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#000000',
    fontFamily: 'Roboto',
    marginVertical: 4,
  },
  metricCellSub: {
    fontSize: 11,
    color: '#71717A',
    fontFamily: 'Roboto',
  },

  // Section titles
  sectionTitleBold: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Roboto',
    marginBottom: 12,
  },
  subtextSmall: {
    fontSize: 12,
    color: '#71717A',
    fontFamily: 'Roboto',
  },

  // Approval Item Card
  approvalItemCard: {
    backgroundColor: '#F4F4F5',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  tripIdBold: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Roboto',
  },
  tripRouteEmployeeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#18181B',
    fontFamily: 'Roboto',
    marginBottom: 4,
  },
  dateTimeFareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  dateTimeText: {
    fontSize: 12,
    color: '#71717A',
    fontFamily: 'Roboto',
  },
  farePriceBold: {
    fontSize: 15,
    fontWeight: '800',
    color: '#000000',
    fontFamily: 'Roboto',
  },
  twoBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  btnGreenAction: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  btnGreenActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Roboto',
    letterSpacing: 0.5,
  },
  btnRejectAction: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    paddingVertical: 10,
    alignItems: 'center',
  },
  btnRejectActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
    fontFamily: 'Roboto',
    letterSpacing: 0.5,
  },

  // Pills
  pillStatus: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  pillStatusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Roboto',
  },
  pillPending: {
    backgroundColor: '#FBBF24',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  pillPendingText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Roboto',
  },
  pillApproved: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  pillApprovedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Roboto',
  },
  pillCompleted: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },

  // Filters
  filterPillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  filterPill: {
    backgroundColor: '#F4F4F5',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  filterPillActive: {
    backgroundColor: '#000000',
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Roboto',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  policySubBanner: {
    backgroundColor: '#F4F4F5',
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
  },
  policySubBannerText: {
    fontSize: 12,
    color: '#71717A',
    fontFamily: 'Roboto',
  },

  // Route & Details
  routeCardContainer: {
    backgroundColor: '#F4F4F5',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },
  routePointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  squareIconBox: {
    width: 12,
    height: 12,
    borderWidth: 2,
    borderColor: '#000000',
  },
  circleIconBox: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#000000',
  },
  routePointBold: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Roboto',
  },
  routePointSub: {
    fontSize: 12,
    color: '#71717A',
    fontFamily: 'Roboto',
  },
  detailsTableCard: {
    backgroundColor: '#F4F4F5',
    borderRadius: 14,
    padding: 16,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  tableRowLabel: {
    fontSize: 13,
    color: '#71717A',
    fontFamily: 'Roboto',
  },
  tableRowValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Roboto',
  },
  tableDivider: {
    height: 1,
    backgroundColor: '#E4E4E7',
  },
  fullWidthGreenBtn: {
    backgroundColor: '#10B981',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  fullWidthGreenBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Roboto',
    letterSpacing: 0.5,
  },
  fullWidthRejectBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E4E7',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  fullWidthRejectBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DC2626',
    fontFamily: 'Roboto',
    letterSpacing: 0.5,
  },
  fullWidthBlackBtn: {
    backgroundColor: '#000000',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidthBlackBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Roboto',
  },
  fullWidthSecondaryBtn: {
    backgroundColor: '#F4F4F5',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidthSecondaryBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Roboto',
  },

  // Trips Tab
  downloadAllBtn: {
    backgroundColor: '#F4F4F5',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 14,
  },
  downloadAllBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Roboto',
  },
  assignDriverBtn: {
    backgroundColor: '#000000',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  assignDriverBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Roboto',
  },
  downloadInvoiceItemBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E4E7',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  downloadInvoiceItemBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Roboto',
  },

  // Driver Assignment
  driverSelectCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F4F4F5',
    borderRadius: 12,
    padding: 14,
  },
  driverSelectCardActive: {
    borderWidth: 1.5,
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
  },
  driverNameBold: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Roboto',
  },
  driverCabMeta: {
    fontSize: 12,
    color: '#71717A',
    fontFamily: 'Roboto',
    marginTop: 2,
  },
  driverCheckCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Transactions & Invoices
  transactionItemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F4F4F5',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  transactionTitleBold: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Roboto',
  },
  transactionDateSub: {
    fontSize: 11,
    color: '#71717A',
    fontFamily: 'Roboto',
    marginTop: 2,
  },
  transactionAmountText: {
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'Roboto',
  },
  invoiceItemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F4F4F5',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  pdfDownloadBadge: {
    backgroundColor: '#000000',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
  },
  pdfDownloadBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Roboto',
  },

  // Employees
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F4F4F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#000000',
    fontFamily: 'Roboto',
  },
  employeeCardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F5',
    borderRadius: 12,
    padding: 12,
  },
  empAvatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  empAvatarText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Roboto',
  },
  employeeNameBold: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Roboto',
  },
  employeeMetaText: {
    fontSize: 12,
    color: '#71717A',
    fontFamily: 'Roboto',
    marginTop: 2,
  },

  // More Menu
  moreMenuList: {
    gap: 8,
  },
  moreMenuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F4F4F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  moreMenuText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Roboto',
  },

  // Live Map Mobile
  liveMapBoxMobile: {
    height: 240,
    backgroundColor: '#1E293B',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  mapGridLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  cabMarkerPill: {
    position: 'absolute',
    top: 30,
    backgroundColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cabMarkerText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Roboto',
  },
  liveMapCenterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
    fontFamily: 'Roboto',
  },

  // Department Card Mobile
  departmentCardMobile: {
    backgroundColor: '#F4F4F5',
    borderRadius: 12,
    padding: 14,
  },
  drawerSubText: {
    fontSize: 12,
    color: '#71717A',
    fontFamily: 'Roboto',
    marginTop: 2,
  },
  policyToggleCardMobile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F4F4F5',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  policyTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Roboto',
  },
  policyDesc: {
    fontSize: 11,
    color: '#71717A',
    fontFamily: 'Roboto',
    marginTop: 2,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#18181B',
    fontFamily: 'Roboto',
    marginTop: 12,
    marginBottom: 6,
  },
  mobileInput: {
    backgroundColor: '#F4F4F5',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: '#000000',
    fontFamily: 'Roboto',
  },
  reportCardMobile: {
    backgroundColor: '#F4F4F5',
    borderRadius: 14,
    padding: 16,
  },
  chartPlaceholderBox: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E4E4E7',
    borderStyle: 'dashed',
    borderRadius: 8,
    marginTop: 10,
  },

  emptyStateBox: {
    backgroundColor: '#F4F4F5',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 13,
    color: '#71717A',
    fontFamily: 'Roboto',
  },

  // Bottom Navigation Bar
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E4E4E7',
    paddingVertical: 10,
    paddingBottom: 16,
  },
  bottomNavItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomNavText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#71717A',
    fontFamily: 'Roboto',
    marginTop: 4,
  },
  bottomNavTextActive: {
    color: '#000000',
    fontWeight: '700',
  },
});
