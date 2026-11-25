export interface Location {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  rating: number;
  tripsCount: number;
  carModel: string;
  carColor: string;
  carPlate: string;
  lat: number;
  lng: number;
}

export type RideStatus = 'IDLE' | 'SEARCHING' | 'ACCEPTED' | 'ARRIVING' | 'PICKED_UP' | 'COMPLETED' | 'CANCELLED';

export interface Ride {
  id: string;
  userId: string;
  userName: string;
  pickup: Location;
  dropoff: Location;
  vehicleClass: string;
  fare: number;
  paymentMethod: string;
  status: RideStatus;
  driverId: string | null;
  createdAt: string;
  driverLat?: number;
  driverLng?: number;
  rideType?: 'ONEWAY' | 'ROUNDTRIP' | 'RENTAL' | 'AIRPORT' | 'CHAI_PANI';
  returnTime?: string;
  rentalPackage?: string;
  flightNumber?: string;
  terminal?: string;
  otp?: string;
  scheduledTime?: string;
}

export interface ParcelOrder {
  id: string;
  type: 'SEND' | 'RECEIVE';
  senderAddress: string;
  recipientAddress: string;
  senderPhone?: string;
  recipientPhone?: string;
  packageDescription?: string;
  fare: number;
  status: 'DELIVERED' | 'IN_TRANSIT' | 'PICKED_UP' | 'CANCELLED';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  rideId: string;
  sender: 'passenger' | 'driver' | 'system';
  text: string;
  timestamp: string;
}

export interface VehicleClass {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  multiplier: number;
  capacity: number;
  eta: number; // in minutes
  icon: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  walletBalance: number;
  homeLocation?: Location;
  workLocation?: Location;
}
