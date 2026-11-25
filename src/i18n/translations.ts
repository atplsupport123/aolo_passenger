export type LanguageCode = 'en' | 'hi';

export interface TranslationDictionary {
  [key: string]: string;
}

export const translations: Record<LanguageCode, TranslationDictionary> = {
  en: {
    // Header & Brand
    brandName: 'AOLO',
    tagline: 'Ride Smarter. Ride AOLO.',
    whereTo: 'Where to go?',
    searchDestination: 'Search destination, airport, railway...',
    currentLocation: 'Current Location',
    pickupLocation: 'Pickup Location',
    dropoffLocation: 'Drop Location',
    confirmPickup: 'Confirm Pickup',
    bookRide: 'Book Ride',
    bookingRide: 'Booking your ride...',
    findingDriver: 'Finding nearby drivers...',
    driverArriving: 'Driver is arriving',
    rideCompleted: 'Ride Completed',

    // Tabs
    tabHome: 'Home',
    tabBookings: 'Bookings',
    tabWallet: 'Wallet',
    tabAccount: 'Account',
    tabTravel: 'Travel',

    // Quick Portals & Travel
    dailyRides: 'Daily Rides',
    rentals: 'Rentals',
    airport: 'Airport',
    outstation: 'Outstation',
    hourlyRentals: 'Hourly Rentals',
    corporate: 'Corporate',
    travelDesk: 'Travel Desk',
    flightBooking: 'Flights & Jets',
    hotelBooking: 'Hotels & Stays',
    trainBooking: 'Trains & IRCTC',
    busBooking: 'Intercity Bus',

    // Sidebar & Menus
    myProfile: 'My Profile',
    rideHistory: 'Ride History',
    myWallet: 'My Wallet',
    savedPlaces: 'Saved Places',
    emergencyContacts: 'Safety & SOS',
    referAndEarn: 'Refer & Earn',
    support: '24/7 Support',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    tripPolicies: 'Trip Policies',
    changeLanguage: 'Change Language',
    signOut: 'Sign Out Account',
    deleteAccount: 'Delete Account',

    // Actions & Buttons
    done: 'Done',
    close: 'Close',
    cancel: 'Cancel',
    apply: 'Apply',
    confirm: 'Confirm',
    save: 'Save',
    selected: 'Selected',
    languageChangedSuccess: 'Language updated successfully',
  },

  hi: {
    // Header & Brand
    brandName: 'आओलो',
    tagline: 'स्मार्ट यात्रा. आओलो के साथ.',
    whereTo: 'कहाँ जाना है?',
    searchDestination: 'गंतव्य, एयरपोर्ट, स्टेशन खोजें...',
    currentLocation: 'वर्तमान स्थान',
    pickupLocation: 'पिकअप स्थान',
    dropoffLocation: 'ड्रॉप स्थान',
    confirmPickup: 'पिकअप कन्फर्म करें',
    bookRide: 'राइड बुक करें',
    bookingRide: 'आपकी राइड बुक हो रही है...',
    findingDriver: 'नजदीकी ड्राइवर खोज रहे हैं...',
    driverArriving: 'ड्राइवर पहुँच रहे हैं',
    rideCompleted: 'यात्रा पूर्ण हुई',

    // Tabs
    tabHome: 'होम',
    tabBookings: 'मेरी बुकिंग्स',
    tabWallet: 'वॉलेट',
    tabAccount: 'खाता',
    tabTravel: 'यात्रा',

    // Quick Portals & Travel
    dailyRides: 'दैनिक राइड्स',
    rentals: 'रेंटल कैब्स',
    airport: 'एयरपोर्ट कैब',
    outstation: 'आउटस्टेशन',
    hourlyRentals: 'घंटे के हिसाब से रेंटल',
    corporate: 'कॉर्पोरेट',
    travelDesk: 'ट्रैवल डेस्क',
    flightBooking: 'फ्लाइट्स & जेट्स',
    hotelBooking: 'होटल्स & रिसॉर्ट्स',
    trainBooking: 'ट्रेन्स & IRCTC',
    busBooking: 'इंटरसिटी बस',

    // Sidebar & Menus
    myProfile: 'मेरी प्रोफाइल',
    rideHistory: 'राइड इतिहास',
    myWallet: 'मेरा वॉलेट',
    savedPlaces: 'सेव किए गए स्थान',
    emergencyContacts: 'सुरक्षा & SOS',
    referAndEarn: 'रेफर करें और कमाएं',
    support: '24/7 सहायता',
    privacyPolicy: 'गोपनीयता नीति',
    termsOfService: 'सेवा की शर्तें',
    tripPolicies: 'यात्रा नीतियां',
    changeLanguage: 'भाषा बदलें',
    signOut: 'साइन आउट करें',
    deleteAccount: 'खाता हटाएं',

    // Actions & Buttons
    done: 'पूर्ण',
    close: 'बंद करें',
    cancel: 'रद्द करें',
    apply: 'लागू करें',
    confirm: 'पुष्टि करें',
    save: 'सहेजें',
    selected: 'चुना हुआ',
    languageChangedSuccess: 'भाषा सफलतापूर्वक बदल दी गई',
  },
};

export type TranslationKey = keyof typeof translations.en;
