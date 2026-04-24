# Little Luxury Web - CMS & UX Architecture Report

This document outlines the current state and forward-looking integration plan for the **Little Luxury Web** application. We have transitioned the interface into a cinematic, high-contrast experience while preparing for a full PocketBase (PocketHost) CMS integration.

---

## 1. UX & Visual Architecture (Updated)

We have implemented several high-end interface features that redefine the "Little Luxury" brand online:

### A. Dynamic & Adaptive Navigation
- **Contrast Awareness**: The Navbar now automatically detects scroll position—using **Ivory** text over dark hero content and transitioning to **Gold/Charcoal** over light content.
- **Glassmorphism**: A subtle `backdrop-blur` and high-transparency surface (95% Ivory) ensure the UI feels layered and modern.

### B. Cinematic Hero Experience
- **Fluid Carousel**: Replaced static imagery with an automated, overlapping cross-fade carousel.
- **Drift & Zoom**: Utilizes a 2.5s transition timing with simultaneous horizontal drift and scale effects to eliminate "blank space" and create a serene, premium atmosphere.
- **Interactive Pips**: Numbered pagination allows users to explore the visual story at their own pace.

### C. Standalone Gallery Destination
- **Categorized Portfolio**: A new page (`/gallery`) dedicated to visual storytelling, featuring "Living", "Bedrooms", and "Outdoors" filters.
- **Visual Grid**: Replaces standard layouts with a curated grid that supports high-resolution asset management.

### D. Real-Time Availability Guidance
- **Expansive Calendar UI**: A widescreen availability widget (`max-w-2xl`) redesigned for maximum legibility and spatial elegance.
- **Visual Status**: Booked dates are indicated with glowing Red highlights, providing instant "at-a-glance" occupancy status.
- **Polished Micro-Interactions**: Features custom hover states for available dates and scale-animated navigation controls.

---

## 2. Dynamic Collection Schema (PocketBase)

To enable management of these new features from the CMS, the following collections are prioritized:

### A. `site_settings`
- **site_name** (Text)
- **tagline** (Text)
- **hero_carousel** (Files): Controls the images shown in the homepage header.
- **contact_details** (JSON)

### B. `rooms`
- **name**, **price**, **size**, **is_available**.
- **amenities** (Relation): Linked to the `amenities` collection.

### C. `gallery_assets`
- **image** (File)
- **category** (Select): Living, Bedrooms, Outdoors.
- **caption** (Text)
- **sort_order** (Number)

### D. `reservations`
- **date_range** (Date): Feeds the "At-a-glance" calendar red markers.
- **status** (Select): Booked, Maintenance, Closed.

---

## 3. Implementation Roadmap

1.  **PocketHost Connection**: Initialize `src/lib/pocketbase.ts`.
2.  **Asset Migration**: Move all hardcoded Unsplash URLs (from Hero and Gallery) into the PocketBase `Files` field to improve load times via PocketBase's optimized delivery.
3.  **Real-Time Sync**: Implement `pb.collection('reservations').subscribe('*', ...)` to reflect availability changes instantly in the homepage calendar.

---
**Last Updated**: 2026-04-23  
**Status**: **UI Polished** | **CMS Plan Ready**  
**Lead Designer**: Little Luxury Web Team
