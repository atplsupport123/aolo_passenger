import { create } from 'zustand';

export type SheetType =
  | 'NONE'
  | 'PICKUP'
  | 'BOOKING'
  | 'RIDE_PROGRESS'
  | 'CHAT'
  | 'WALLET'
  | 'HISTORY'
  | 'PROFILE'
  | 'SIDEBAR'
  | 'RENTAL'
  | 'AIRPORT'
  | 'CORPORATE'
  | 'TRAVEL_MODE'
  | 'OFFERS'
  | 'ROAD_TRIPS'
  | 'REFERRAL'
  | 'SAVED_PLACES'
  | 'SCHEDULE'
  | 'FAVOURITES'
  | 'SAFETY'
  | 'UPDATES'
  | 'SUPPORT'
  | 'PRIVACY'
  | 'TERMS'
  | 'LANGUAGE'
  | 'WEATHER'
  | 'TRIP_POLICIES'
  | 'CHAI_PANI'
  | 'PARCEL';

export type MainTabType = 'home' | 'bookings' | 'wallet' | 'account' | 'rides' | 'travel' | 'corporate';

interface UIState {
  activeTab: MainTabType;
  currentSheet: SheetType;
  drawerOpen: boolean;
  setActiveTab: (tab: MainTabType) => void;
  setCurrentSheet: (sheet: SheetType) => void;
  setDrawerOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeTab: 'home',
  currentSheet: 'NONE',
  drawerOpen: false,
  setActiveTab: (tab) => set({ activeTab: tab }),
  setCurrentSheet: (sheet) => set({ currentSheet: sheet }),
  setDrawerOpen: (open) => set({ drawerOpen: open }),
}));
