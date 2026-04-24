# Little Luxury Web — PocketBase CMS Integration Guide

> **Your PocketHost Instance:** `https://little-luxur.pockethost.io/`  
> **Admin Panel:** `https://little-luxur.pockethost.io/_/`  
> **Stack:** React 19 + Vite + TypeScript + Tailwind v4

---

## Overview

This guide turns every hardcoded piece of content in the Little Luxury website — hero images, room cards, gallery photos, availability calendar, and site-wide settings — into live, editable records in your PocketBase CMS. After completing all steps, your property manager can log into `https://little-luxur.pockethost.io/_/` and update the entire site without touching a line of code.

---

## Phase 1 — Admin Setup (PocketHost)

### Step 1 · Log into the Admin Panel

1. Open `https://little-luxur.pockethost.io/_/` in your browser.
2. Create your superuser account on first visit (email + password).
3. You will land on the **Collections** dashboard.

---

## Phase 2 — Create the 4 Collections

### Step 2 · Create `site_settings` Collection

This controls the brand-wide settings (logo, tagline, hero slides, contact info).

1. Click **"New collection"** → name it `site_settings` → keep type **Base**.
2. Add the following fields:

| Field Name | Type | Notes |
|---|---|---|
| `site_name` | Text | e.g. "Little Luxury" |
| `tagline` | Text | e.g. "Your Private Sanctuary in the Heart of Nature" |
| `hero_carousel` | File | **Multiple ON**, accept Images only — these are the hero slides |
| `logo_url` | URL | Optional, if you host your logo externally |
| `contact_phone` | Text | e.g. "+254 700 000 000" |
| `contact_email` | Text | e.g. "hello@littleluxury.co.ke" |
| `contact_address` | Text | Full physical address |
| `instagram_url` | URL | Social link |
| `facebook_url` | URL | Social link |
| `whatsapp_number` | Text | For the sticky WhatsApp button |

3. Click **"Save"**.
4. Click **"New record"** and fill in ONE record with all your real data (there will only ever be one `site_settings` record — it's your global config).

---

### Step 3 · Create `rooms` Collection

This replaces the hardcoded `ROOMS` array in `src/constants/roomsData.ts`.

1. **New collection** → name `rooms` → type **Base**.
2. Add fields:

| Field Name | Type | Notes |
|---|---|---|
| `name` | Text | e.g. "The Obsidian Suite" |
| `slug` | Text | URL-safe ID e.g. "obsidian-suite" — mark as **Unique** |
| `category` | Select | Options: `Standard`, `Deluxe`, `Suite`, `Residence` |
| `type_label` | Text | e.g. "ENSUITE MASTER" |
| `image` | File | Single image for the room card |
| `guests` | Number | Max guests |
| `bed` | Text | e.g. "1 King" |
| `size` | Text | e.g. "35m²" |
| `price` | Number | Nightly rate in KES |
| `description` | Editor (Rich Text) | Room description |
| `floor` | Text | e.g. "Main Floor" |
| `amenities` | JSON | Store as array e.g. `["King Bed", "WiFi", "Smart TV"]` |
| `sort_order` | Number | Controls display order on the page |

3. Click **"Save"**.
4. Click **"New record"** for each of the 5 rooms:
   - The Obsidian Suite (Suite, KES 6,000)
   - The Alabaster Room (Deluxe, KES 4,000)
   - The Amber Quarters (Standard, KES 3,000)
   - The Safari Loft (Standard, KES 3,000)
   - The Little Luxury Sanctuary (Residence, KES 15,000)

> **For images:** Upload your actual photos directly to each room record. PocketBase will host them and give you optimized URLs automatically.

---

### Step 4 · Create `gallery_assets` Collection

This powers the `/gallery` page and the homepage Gallery section.

1. **New collection** → name `gallery_assets` → type **Base**.
2. Add fields:

| Field Name | Type | Notes |
|---|---|---|
| `image` | File | Single image (full-resolution) |
| `caption` | Text | Short alt/label text |
| `category` | Select | Options: `Living`, `Bedrooms`, `Outdoors` |
| `sort_order` | Number | Controls grid display order |
| `is_featured` | Bool | If `true`, shows in the homepage gallery strip |

3. Click **"Save"**.
4. Upload all your property photos, one per record, and assign each a category.

---

### Step 5 · Create `reservations` Collection

This feeds the availability calendar with real booked dates.

1. **New collection** → name `reservations` → type **Base**.
2. Add fields:

| Field Name | Type | Notes |
|---|---|---|
| `guest_name` | Text | For admin reference |
| `check_in` | Date | Check-in date |
| `check_out` | Date | Check-out date |
| `room` | Relation → `rooms` | Which room is booked |
| `status` | Select | Options: `Booked`, `Maintenance`, `Closed` |
| `notes` | Text | Internal notes (not public) |

3. Click **"Save"**.

#### ⚠️ Set API Rules for `reservations`

Because reservation dates are publicly visible on the calendar but should not be fully editable by guests:

- **List/View Rule:** leave empty (public can read)
- **Create Rule:** leave empty (booking form will write here)
- **Update/Delete Rule:** `@request.auth.id != ""` (only logged-in admins)

---

## Phase 3 — Connect Your App to PocketBase

### Step 6 · Install the PocketBase SDK

```bash
npm i pocketbase
```

---

### Step 7 · Create `src/lib/pocketbase.ts`

Create a new file at `src/lib/pocketbase.ts`:

```typescript
import PocketBase from 'pocketbase';

// Your PocketHost instance URL
export const pb = new PocketBase('https://little-luxur.pockethost.io');

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
  whatsapp_number: string;
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
  check_in: string;    // ISO date string
  check_out: string;
  room: string;        // room record ID
  status: 'Booked' | 'Maintenance' | 'Closed';
  notes: string;
}

// ── Helper: build a PocketBase file URL ─────────────────────────────────────

export function pbFileUrl(
  collectionId: string,
  recordId: string,
  filename: string,
  thumb?: string
): string {
  const base = `https://little-luxur.pockethost.io/api/files/${collectionId}/${recordId}/${filename}`;
  return thumb ? `${base}?thumb=${thumb}` : base;
}
```

---

### Step 8 · Create `src/hooks/useSiteSettings.ts`

```typescript
import { useState, useEffect } from 'react';
import { pb, SiteSettings } from '../lib/pocketbase';

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pb.collection('site_settings')
      .getFirstListItem('')          // Fetch the single settings record
      .then(setSettings)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { settings, loading };
}
```

---

### Step 9 · Create `src/hooks/useRooms.ts`

```typescript
import { useState, useEffect } from 'react';
import { pb, Room } from '../lib/pocketbase';

export function useRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pb.collection('rooms')
      .getFullList({ sort: '+sort_order' })
      .then(setRooms)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { rooms, loading };
}
```

---

### Step 10 · Create `src/hooks/useGallery.ts`

```typescript
import { useState, useEffect } from 'react';
import { pb, GalleryAsset } from '../lib/pocketbase';

export function useGallery(featuredOnly = false) {
  const [assets, setAssets] = useState<GalleryAsset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const filter = featuredOnly ? 'is_featured=true' : '';
    pb.collection('gallery_assets')
      .getFullList({ sort: '+sort_order', filter })
      .then(setAssets)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [featuredOnly]);

  return { assets, loading };
}
```

---

### Step 11 · Create `src/hooks/useReservations.ts` (with Real-Time Sync)

```typescript
import { useState, useEffect } from 'react';
import { pb, Reservation } from '../lib/pocketbase';

export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    pb.collection('reservations')
      .getFullList({ sort: '-created' })
      .then(setReservations)
      .catch(console.error)
      .finally(() => setLoading(false));

    // 🔴 Real-time subscription — calendar updates instantly when admin books a date
    pb.collection('reservations').subscribe('*', ({ action, record }) => {
      setReservations(prev => {
        if (action === 'create') return [...prev, record as Reservation];
        if (action === 'update') return prev.map(r => r.id === record.id ? record as Reservation : r);
        if (action === 'delete') return prev.filter(r => r.id !== record.id);
        return prev;
      });
    });

    return () => {
      pb.collection('reservations').unsubscribe('*');
    };
  }, []);

  return { reservations, loading };
}
```

---

## Phase 4 — Wire Hooks into Components

### Step 12 · Update `Hero.tsx` — Dynamic Carousel from CMS

In `Hero.tsx`, replace the hardcoded image array with:

```typescript
import { useSiteSettings } from '../hooks/useSiteSettings';
import { pbFileUrl } from '../lib/pocketbase';

// Inside the component:
const { settings, loading } = useSiteSettings();

const heroImages = settings?.hero_carousel?.map(filename =>
  pbFileUrl('site_settings', settings.id, filename)
) ?? [];
```

---

### Step 13 · Update `Rooms.tsx` and `RoomsPage.tsx` — Rooms from CMS

```typescript
import { useRooms } from '../hooks/useRooms';
import { pbFileUrl } from '../lib/pocketbase';

// Inside the component:
const { rooms, loading } = useRooms();

// Map image filename to URL:
const imageUrl = pbFileUrl('rooms', room.id, room.image, '800x600');
```

Remove the import of `ROOMS` from `src/constants/roomsData.ts`.

---

### Step 14 · Update `GalleryPage.tsx` and `Gallery.tsx` — Gallery from CMS

```typescript
import { useGallery } from '../hooks/useGallery';
import { pbFileUrl } from '../lib/pocketbase';

// GalleryPage (full gallery):
const { assets, loading } = useGallery();

// Homepage Gallery strip (featured only):
const { assets, loading } = useGallery(true);

// Build image URL:
const imageUrl = pbFileUrl('gallery_assets', asset.id, asset.image);
```

---

### Step 15 · Update `AvailabilityCalendar.tsx` — Real-Time Bookings

```typescript
import { useReservations } from '../hooks/useReservations';

const { reservations } = useReservations();

// Build a Set of all booked date strings for O(1) lookup:
const bookedDates = new Set<string>();
reservations.forEach(r => {
  if (r.status === 'Booked' || r.status === 'Maintenance') {
    const start = new Date(r.check_in);
    const end = new Date(r.check_out);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      bookedDates.add(d.toISOString().split('T')[0]);
    }
  }
});

// Then in your calendar render, check:
// bookedDates.has('2026-05-10')  →  true = show red glow
```

---

### Step 16 · Update `Navbar.tsx` and `Footer.tsx` — Site Name & Contact from CMS

```typescript
import { useSiteSettings } from '../hooks/useSiteSettings';

const { settings } = useSiteSettings();

// Use: settings?.site_name, settings?.contact_phone, settings?.instagram_url, etc.
```

---

## Phase 5 — Environment & Deployment

### Step 17 · Add `.env` File

Create `.env` in your project root:

```bash
VITE_POCKETBASE_URL=https://little-luxur.pockethost.io
```

Then update `src/lib/pocketbase.ts` to use:

```typescript
export const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);
```

---

### Step 18 · Enable CORS on PocketHost

PocketHost handles CORS automatically for browser clients — no extra config needed. Your requests from `localhost:3000` (dev) and your deployed domain will both work out of the box.

---

## Phase 6 — Day-to-Day CMS Usage

Once deployed, here is what your property manager does at `https://little-luxur.pockethost.io/_/`:

| Task | Collection | Action |
|---|---|---|
| Change hero slideshow photos | `site_settings` | Edit the record → upload/remove files in `hero_carousel` |
| Update room pricing | `rooms` | Find the room record → change `price` field |
| Add a new gallery photo | `gallery_assets` | New record → upload image → pick category |
| Mark dates as booked | `reservations` | New record → set `check_in`, `check_out`, `status: Booked` |
| Mark dates for maintenance | `reservations` | New record → set status `Maintenance` |
| Update contact details | `site_settings` | Edit the record → update phone/email/address |
| Change tagline | `site_settings` | Edit `tagline` field |
| Reorder gallery | `gallery_assets` | Update `sort_order` numbers on each record |

> The calendar on the website **updates in real time** — no page refresh needed for guests.

---

## Summary of Files to Create/Modify

```
src/
├── lib/
│   └── pocketbase.ts          ← NEW (PocketBase client + types)
├── hooks/
│   ├── useSiteSettings.ts     ← NEW
│   ├── useRooms.ts            ← NEW
│   ├── useGallery.ts          ← NEW
│   └── useReservations.ts     ← NEW (with real-time)
├── components/
│   ├── Hero.tsx               ← MODIFY (use useSiteSettings)
│   ├── Rooms.tsx              ← MODIFY (use useRooms)
│   ├── RoomsPage.tsx          ← MODIFY (use useRooms)
│   ├── Gallery.tsx            ← MODIFY (use useGallery featured)
│   ├── GalleryPage.tsx        ← MODIFY (use useGallery full)
│   ├── AvailabilityCalendar.tsx ← MODIFY (use useReservations)
│   ├── Navbar.tsx             ← MODIFY (use useSiteSettings)
│   └── Footer.tsx             ← MODIFY (use useSiteSettings)
└── constants/
    └── roomsData.ts           ← DELETE (replaced by CMS)
```

---

**PocketHost URL:** `https://little-luxur.pockethost.io/`  
**Admin Panel:** `https://little-luxur.pockethost.io/_/`
