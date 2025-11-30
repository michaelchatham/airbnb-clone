// ============================================
// USER TYPES
// ============================================
export interface User {
  id: string;
  authId: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  phone?: string;
  bio?: string;
  isHost: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  authId: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  phone?: string;
}

export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  phone?: string;
  bio?: string;
}

// ============================================
// PROPERTY TYPES
// ============================================
export type PropertyType =
  | 'house'
  | 'apartment'
  | 'guesthouse'
  | 'hotel'
  | 'cabin'
  | 'villa'
  | 'cottage'
  | 'condo';

export type RoomType = 'entire_place' | 'private_room' | 'shared_room';

export interface Property {
  id: string;
  hostId: string;
  title: string;
  description: string;
  propertyType: PropertyType;
  roomType: RoomType;

  // Location
  address: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;

  // Capacity
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;

  // Pricing
  pricePerNight: number;
  cleaningFee: number;
  serviceFeePercent: number;
  currency: string;

  // Rules
  minNights: number;
  maxNights: number;
  checkInTime: string;
  checkOutTime: string;

  // Status
  isPublished: boolean;
  isInstantBook: boolean;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Relations (optional, for populated queries)
  host?: User;
  images?: PropertyImage[];
  amenities?: Amenity[];
  reviews?: Review[];
}

export interface CreatePropertyInput {
  title: string;
  description: string;
  propertyType: PropertyType;
  roomType: RoomType;
  address: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  pricePerNight: number;
  cleaningFee?: number;
  minNights?: number;
  maxNights?: number;
  checkInTime?: string;
  checkOutTime?: string;
  isInstantBook?: boolean;
  amenityIds?: string[];
}

export interface UpdatePropertyInput extends Partial<CreatePropertyInput> {
  isPublished?: boolean;
}

export interface PropertySearchParams {
  city?: string;
  country?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: PropertyType;
  roomType?: RoomType;
  amenities?: string[];
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'rating' | 'newest';
  sortOrder?: 'asc' | 'desc';
}

// ============================================
// PROPERTY IMAGE TYPES
// ============================================
export interface PropertyImage {
  id: string;
  propertyId: string;
  url: string;
  caption?: string;
  displayOrder: number;
  isCover: boolean;
  createdAt: Date;
}

export interface CreatePropertyImageInput {
  propertyId: string;
  url: string;
  caption?: string;
  displayOrder?: number;
  isCover?: boolean;
}

// ============================================
// AMENITY TYPES
// ============================================
export type AmenityCategory = 'basic' | 'standout' | 'safety';

export interface Amenity {
  id: string;
  name: string;
  category: AmenityCategory;
  icon?: string;
}

// ============================================
// BOOKING TYPES
// ============================================
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed';

export interface Booking {
  id: string;
  propertyId: string;
  guestId: string;

  // Dates
  checkInDate: string;
  checkOutDate: string;

  // Guests
  adults: number;
  children: number;
  infants: number;
  pets: number;

  // Pricing
  pricePerNight: number;
  numNights: number;
  subtotal: number;
  cleaningFee: number;
  serviceFee: number;
  taxes: number;
  totalPrice: number;
  currency: string;

  // Status
  status: BookingStatus;
  paymentIntentId?: string;
  paymentStatus: PaymentStatus;

  // Messages
  guestMessage?: string;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  cancelledAt?: Date;

  // Relations (optional)
  property?: Property;
  guest?: User;
}

export interface CreateBookingInput {
  propertyId: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children?: number;
  infants?: number;
  pets?: number;
  guestMessage?: string;
}

export interface BookingSearchParams {
  status?: BookingStatus;
  upcoming?: boolean;
  past?: boolean;
  page?: number;
  limit?: number;
}

// ============================================
// REVIEW TYPES
// ============================================
export interface Review {
  id: string;
  bookingId: string;
  propertyId: string;
  reviewerId: string;

  // Ratings
  overallRating: number;
  cleanlinessRating?: number;
  accuracyRating?: number;
  checkInRating?: number;
  communicationRating?: number;
  locationRating?: number;
  valueRating?: number;

  // Content
  comment: string;
  hostResponse?: string;
  hostResponseAt?: Date;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Relations (optional)
  reviewer?: User;
  property?: Property;
}

export interface CreateReviewInput {
  bookingId: string;
  overallRating: number;
  cleanlinessRating?: number;
  accuracyRating?: number;
  checkInRating?: number;
  communicationRating?: number;
  locationRating?: number;
  valueRating?: number;
  comment: string;
}

export interface HostResponseInput {
  response: string;
}

// ============================================
// FAVORITE TYPES
// ============================================
export interface Favorite {
  id: string;
  userId: string;
  propertyId: string;
  createdAt: Date;
  property?: Property;
}

// ============================================
// MESSAGE TYPES
// ============================================
export interface Message {
  id: string;
  bookingId?: string;
  senderId: string;
  recipientId: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
  sender?: User;
  recipient?: User;
}

export interface CreateMessageInput {
  bookingId?: string;
  recipientId: string;
  content: string;
}

// ============================================
// AVAILABILITY TYPES
// ============================================
export interface Availability {
  id: string;
  propertyId: string;
  date: string;
  isAvailable: boolean;
  customPrice?: number;
  note?: string;
}

export interface SetAvailabilityInput {
  propertyId: string;
  dates: {
    date: string;
    isAvailable: boolean;
    customPrice?: number;
    note?: string;
  }[];
}

// ============================================
// API RESPONSE TYPES
// ============================================
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  statusCode: number;
  error: string;
  message: string;
}

// ============================================
// AUTH TYPES
// ============================================
export interface AuthUser {
  id: string;
  email: string;
  user: User;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface SignUpInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
