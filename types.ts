
export interface StayEnquiry {
  id?: string;
  created_at?: string;
  name: string;
  phone: string;
  checkin: string;
  checkout: string;
  guests: number;
  message: string;
  source: string;
  status: 'new' | 'contacted' | 'booked';
}

export interface EventEnquiry {
  id?: string;
  created_at?: string;
  name: string;
  phone: string;
  event_date: string;
  event_type: string;
  guests: number;
  requirements: string;
  source: string;
  status: 'new' | 'contacted' | 'booked';
}

export enum EventType {
  HALDI = 'Haldi',
  MEHENDI = 'Mehendi',
  COCKTAIL = 'Cocktail',
  BIRTHDAY = 'Birthday',
  CORPORATE = 'Corporate',
  WEDDING = 'Wedding',
  OTHER = 'Other'
}
