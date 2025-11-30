import { z } from 'zod';

// ============================================
// COMMON SCHEMAS
// ============================================
export const uuidSchema = z.uuid();

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

// ============================================
// USER SCHEMAS
// ============================================
export const createUserSchema = z.object({
  authId: z.uuid(),
  email: z.email(),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  avatarUrl: z.url().optional(),
  phone: z.string().max(20).optional(),
});

export const updateUserSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  avatarUrl: z.url().optional(),
  phone: z.string().max(20).optional(),
  bio: z.string().max(1000).optional(),
});

// ============================================
// PROPERTY SCHEMAS
// ============================================
export const propertyTypeSchema = z.enum([
  'house',
  'apartment',
  'guesthouse',
  'hotel',
  'cabin',
  'villa',
  'cottage',
  'condo',
]);

export const roomTypeSchema = z.enum([
  'entire_place',
  'private_room',
  'shared_room',
]);

export const createPropertySchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1).max(5000),
  propertyType: propertyTypeSchema,
  roomType: roomTypeSchema,

  // Location
  address: z.string().min(1).max(255),
  city: z.string().min(1).max(100),
  state: z.string().max(100).optional(),
  country: z.string().min(1).max(100),
  postalCode: z.string().max(20).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),

  // Capacity
  maxGuests: z.number().int().positive().max(50).default(1),
  bedrooms: z.number().int().nonnegative().max(50).default(1),
  beds: z.number().int().positive().max(50).default(1),
  bathrooms: z.number().positive().max(50).default(1),

  // Pricing
  pricePerNight: z.number().positive().max(100000),
  cleaningFee: z.number().nonnegative().max(10000).default(0),
  minNights: z.number().int().positive().max(365).default(1),
  maxNights: z.number().int().positive().max(365).default(365),
  checkInTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).default('15:00'),
  checkOutTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).default('11:00'),
  isInstantBook: z.boolean().default(false),

  // Amenities
  amenityIds: z.array(z.uuid()).optional(),
});

export const updatePropertySchema = createPropertySchema.partial().extend({
  isPublished: z.boolean().optional(),
});

export const propertySearchSchema = z.object({
  city: z.string().optional(),
  country: z.string().optional(),
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  guests: z.coerce.number().int().positive().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  propertyType: propertyTypeSchema.optional(),
  roomType: roomTypeSchema.optional(),
  amenities: z.union([z.string(), z.array(z.string())]).optional().transform(val => {
    if (!val) return undefined;
    return Array.isArray(val) ? val : [val];
  }),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(['price', 'rating', 'newest']).default('newest'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// ============================================
// PROPERTY IMAGE SCHEMAS
// ============================================
export const createPropertyImageSchema = z.object({
  propertyId: z.uuid(),
  url: z.url(),
  caption: z.string().max(255).optional(),
  displayOrder: z.number().int().nonnegative().default(0),
  isCover: z.boolean().default(false),
});

export const updatePropertyImageSchema = z.object({
  caption: z.string().max(255).optional(),
  displayOrder: z.number().int().nonnegative().optional(),
  isCover: z.boolean().optional(),
});

// ============================================
// BOOKING SCHEMAS
// ============================================
export const bookingStatusSchema = z.enum([
  'pending',
  'confirmed',
  'cancelled',
  'completed',
]);

export const createBookingSchema = z.object({
  propertyId: z.uuid(),
  checkInDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkOutDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  adults: z.number().int().positive().max(50).default(1),
  children: z.number().int().nonnegative().max(50).default(0),
  infants: z.number().int().nonnegative().max(10).default(0),
  pets: z.number().int().nonnegative().max(10).default(0),
  guestMessage: z.string().max(1000).optional(),
}).refine(data => new Date(data.checkOutDate) > new Date(data.checkInDate), {
  message: 'Check-out date must be after check-in date',
  path: ['checkOutDate'],
});

export const bookingSearchSchema = z.object({
  status: bookingStatusSchema.optional(),
  upcoming: z.coerce.boolean().optional(),
  past: z.coerce.boolean().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

// ============================================
// REVIEW SCHEMAS
// ============================================
const ratingSchema = z.number().min(1).max(5);

export const createReviewSchema = z.object({
  bookingId: z.uuid(),
  overallRating: ratingSchema,
  cleanlinessRating: ratingSchema.optional(),
  accuracyRating: ratingSchema.optional(),
  checkInRating: ratingSchema.optional(),
  communicationRating: ratingSchema.optional(),
  locationRating: ratingSchema.optional(),
  valueRating: ratingSchema.optional(),
  comment: z.string().min(10).max(2000),
});

export const hostResponseSchema = z.object({
  response: z.string().min(1).max(1000),
});

// ============================================
// FAVORITE SCHEMAS
// ============================================
export const toggleFavoriteSchema = z.object({
  propertyId: z.uuid(),
});

// ============================================
// MESSAGE SCHEMAS
// ============================================
export const createMessageSchema = z.object({
  bookingId: z.uuid().optional(),
  recipientId: z.uuid(),
  content: z.string().min(1).max(2000),
});

// ============================================
// AVAILABILITY SCHEMAS
// ============================================
export const setAvailabilitySchema = z.object({
  propertyId: z.uuid(),
  dates: z.array(z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    isAvailable: z.boolean(),
    customPrice: z.number().positive().optional(),
    note: z.string().max(255).optional(),
  })).min(1).max(365),
});

export const getAvailabilitySchema = z.object({
  propertyId: z.uuid(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

// ============================================
// AUTH SCHEMAS
// ============================================
export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const signUpSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(100),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
});

// ============================================
// PARAM SCHEMAS
// ============================================
export const idParamSchema = z.object({
  id: z.uuid(),
});

export const propertyIdParamSchema = z.object({
  propertyId: z.uuid(),
});
