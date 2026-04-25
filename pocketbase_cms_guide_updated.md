# Little Luxury Web — UPDATED PocketBase CMS Integration Guide

> **Your PocketHost Instance:** `https://little-luxur.pockethost.io/`  
> **Admin Panel:** `https://little-luxur.pockethost.io/_/`  

---

## IMPORTANT: NEW FIELDS ADDED

To enable the new premium features (Virtual Tour, Survey, and Booking Agreements), you **MUST** add these specific fields to your `site_settings` collection in the PocketBase Admin Panel.

### 1. Update `site_settings` Collection
Go to **Settings** → **Collections** → `site_settings` and add these fields:

| Field Name | Type | Notes |
|---|---|---|
| `virtual_tour_video` | File | Upload your MP4 tour video here. |
| `virtual_tour_enabled` | Bool | **Check this to make the button visible on the site.** |
| `booking_agreement_text` | Editor (Rich Text) | The legal text/rules for the booking checkbox. |
| `checkin_checkout` | Text | e.g. "Check-in: 2PM | Check-out: 11AM" |

### 2. Update `testimonials` Collection
Ensure you have this collection for the new Survey feature:

| Field Name | Type | Notes |
|---|---|---|
| `guest_name` | Text | Name of the reviewer |
| `location` | Text | e.g. "Nairobi, Kenya" |
| `quote` | Text | The actual review text |
| `rating` | Number | 1 to 5 stars |
| `is_published` | Bool | Set to `false` by default for moderation. |

---

## Summary of All Collections

### `site_settings`
Controls branding, contact info, and global toggles.
- `site_name` (Text)
- `tagline` (Text)
- `hero_carousel` (File, Multiple)
- `contact_phone` (Text)
- `contact_email` (Text)
- `contact_address` (Text)
- `instagram_url` (URL)
- `facebook_url` (URL)
- `whatsapp_number` (Text)
- `maps_embed_url` (Text/URL)
- **NEW:** `virtual_tour_video` (File)
- **NEW:** `virtual_tour_enabled` (Bool)
- **NEW:** `booking_agreement_text` (Editor)

### `rooms`
- `name`, `slug`, `category`, `image`, `price`, `description`, etc.

### `gallery_assets`
- `image`, `caption`, `category`, `is_featured`.

### `testimonials` (The Survey Data)
- `guest_name`, `quote`, `rating`, `is_published`.

---

## Why is the Virtual Tour button not showing?
The button is programmed to only appear if **`virtual_tour_enabled`** is checked (True) in your `site_settings` record. 

1. Go to your Admin Panel.
2. Open the `site_settings` collection.
3. Edit your existing record.
4. Ensure `virtual_tour_enabled` is **ON**.
5. Save the record.
6. Refresh the website.
