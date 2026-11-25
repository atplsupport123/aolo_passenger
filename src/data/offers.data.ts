export interface OfferItem {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  image: string;
}

export const OFFERS_DATA: OfferItem[] = [
  {
    id: 'offer_1',
    tag: 'OFFERS',
    title: 'Up to 20% off',
    subtitle: 'on all cab bookings*',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'offer_2',
    tag: 'OFFERS',
    title: 'Flat ₹150 off',
    subtitle: 'on outstation & rentals*',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'offer_3',
    tag: 'OFFERS',
    title: 'Airport SuperSaver',
    subtitle: 'zero surge pricing 24x7*',
    image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=300&auto=format&fit=crop&q=80',
  },
];
