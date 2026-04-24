import PocketBase from 'pocketbase';

// Your PocketHost instance URL
export const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);

// ── Type definitions matching your collections ──────────────────────────────

export interface SiteSettings {
  id: string;
  site_name: string;
  tagline: string;
  hero_carousel: string[];   // array of file token strings
  logo_url: string;
  contact_phone: string;
  contact_email: string;
  contact_address: string;
  instagram_url: string;
  facebook_url: string;
  tiktok_url: string;
  whatsapp_number: string;
  // --- New Page Hero Images ---
  rooms_hero?: string;
  booking_hero?: string;
  about_hero?: string;
  contact_hero?: string;
  // --- About Page: Our Story section ---
  about_story_p1?: string;
  about_story_p2?: string;
  about_story_p3?: string;
  about_story_quote?: string;
  about_story_img_1?: string;
  about_story_img_2?: string;
  // --- Contact Page ---
  contact_phone_2?: string;
  contact_email_2?: string;
  business_hours_reception?: string;
  business_hours_support?: string;
  maps_embed_url?: string;
  instagram_preview_1?: string;
  instagram_preview_2?: string;
  instagram_preview_3?: string;
  // --- Home Page ---
  home_intro_subtitle?: string;
  home_intro_headline?: string;
  home_intro_p1?: string;
  home_intro_p2?: string;
  home_intro_image?: string;
  home_intro_stat_num?: string;
  home_intro_stat_text?: string;

  home_about_headline?: string;
  home_about_text?: string;
  home_about_img_1?: string;
  home_about_img_2?: string;
  home_booking_title?: string;
  home_booking_text?: string;
  checkin_checkout?: string;
  virtual_tour_video?: string;
  virtual_tour_enabled?: boolean;
  booking_agreement_text?: string;
}

export interface Room {
  id: string;
  slug: string;
  name: string;
  category: 'Standard' | 'Deluxe' | 'Suite' | 'Residence';
  type_label: string;
  image: string;           // file token
  guests: number;
  bed: string;
  size: string;
  price: number;
  description: string;
  floor: string;
  amenities: string[];
  sort_order: number;
}

export interface GalleryAsset {
  id: string;
  image: string;
  caption: string;
  category: 'Living' | 'Bedrooms' | 'Outdoors';
  sort_order: number;
  is_featured: boolean;
}

export interface Reservation {
  id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  check_in: string;           // ISO date string YYYY-MM-DD
  check_out: string;
  room: string;               // room record ID
  guests_adults: number;
  guests_children: number;
  arrival_time: string;
  special_requests: string;
  payment_method: string;
  nationality: string;
  total_amount: number;
  status: 'Pending' | 'Booked' | 'Maintenance' | 'Closed' | 'Cancelled';
  notes: string;
}

export interface Testimonial {
  id: string;
  guest_name: string;
  location: string;
  quote: string;
  rating: number;
  is_published: boolean;
}

// ── Helper: build a PocketBase file URL ─────────────────────────────────────
// Uses the SDK's built-in getUrl() which correctly resolves the collection ID
// from the record object — much more reliable than manual string construction.

export function getFileUrl(record: any, filename: string | string[], thumb?: string): string {
  if (!record) return '';
  // Handle both single filename (string) and first item of multi-file array
  const file = Array.isArray(filename) ? filename[0] : filename;
  if (!file) return '';
  return pb.files.getURL(record, file, thumb ? { thumb } : {});
}

export function getCarouselUrls(record: any, filenames: string | string[], thumb?: string): string[] {
  if (!record) return [];
  const files = Array.isArray(filenames) ? filenames : (filenames ? [filenames] : []);
  return files.map(file => pb.files.getURL(record, file, thumb ? { thumb } : {}));
}

// Keep pbFileUrl as a fallback (used in a few places) — prefer getFileUrl above
export function pbFileUrl(
  collectionId: string,
  recordId: string,
  filename: string,
  thumb?: string
): string {
  const base = `${import.meta.env.VITE_POCKETBASE_URL}/api/files/${collectionId}/${recordId}/${filename}`;
  return thumb ? `${base}?thumb=${thumb}` : base;
}
