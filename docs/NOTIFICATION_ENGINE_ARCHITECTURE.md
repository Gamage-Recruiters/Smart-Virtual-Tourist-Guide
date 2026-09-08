# 🚨 Notification & Alerts Engine — System Architecture & Feature Specification

**Module:** Notification & Alerts Engine  
**Project:** Smart Virtual Tourist Guide (SVTG)  
**Target Release:** Stable Version 04  
**Document Type:** Architecture & Feature Specification  
**Audience:** Technical Lead / Engineering Review  

---

## 1. Notification Types & Delivery Mechanisms

### 1.1 The Three Core Scopes

The engine defines **three delivery scopes** in `backend/src/constants/notificationConstants.js`:

```js
export const NOTIFICATION_SCOPES = {
  UNICAST: 'UNICAST',       // Private message to ONE specific user
  MULTICAST: 'MULTICAST',   // Group message to a Role and/or Region
  BROADCAST: 'BROADCAST'    // Public message to EVERYONE
};
```

| Scope | Target | Example Use Case | Required Fields |
|---|---|---|---|
| **UNICAST** | A single user | "Your bid was accepted" | `recipientId` |
| **MULTICAST** | A role, region, or intersection | "Drivers in Panadura: road closed" | `recipientRole` (+ optional `region`/`district`) |
| **BROADCAST** | All users | "National safety warning" | None |

### 1.2 The Hybrid Delivery Approach

The engine uses a **dual-channel, fire-and-forget** delivery strategy. When a notification is created, `NotificationService.js` dispatches it through **both channels simultaneously**:

```js
const results = await Promise.allSettled([
  deliverViaSocket(io, newNotification),   // Channel 1: Real-time (app open)
  deliverViaPush(newNotification),         // Channel 2: Background (app closed)
]);
```

| Channel | Technology | When It Works | Latency |
|---|---|---|---|
| **Real-time** | Socket.io | User has the app open & connected | < 100ms |
| **Background** | Firebase Cloud Messaging (FCM) | App is closed / in background | 1–5s |

**Why both?** A user who has the app open should see the alert **instantly** (toast + sound). A user who closed the app should still receive the alert as a **system push notification** on their device. Neither channel alone covers both scenarios.

**Failure isolation:** Both deliveries run inside `Promise.allSettled`, so if FCM fails (e.g., network error), the Socket.io delivery still succeeds — and vice versa. The notification is **always persisted to MongoDB first**, so even if both channels fail, the user can retrieve it from the history API.

---

## 2. Matrix Room & Topic Architecture (The Intersection Routing)

### 2.1 Why a Single User Joins Multiple Overlapping Rooms

When a user connects, `notificationHandler.js` joins them into **multiple overlapping Socket.io rooms**:

```js
socket.join(`user_${userId}`);              // Private room
socket.join(`role_${role}`);                // Role-wide room
```

Then, based on their live GPS location, `socketService.js` adds **4 more regional rooms**:

```js
const rooms = [
  `region_${division}`,                   // All users in this division
  `district_${district}`,                 // All users in this district
  `region_${division}_role_${role}`,      // Specific role in this division
  `district_${district}_role_${role}`,    // Specific role in this district
];
```

So a **driver in Panadura** is simultaneously in:

```
user_6a3288a29a73a4c14616ed00
role_driver_user
region_Panadura
district_Kalutara
region_Panadura_role_driver_user
district_Kalutara_role_driver_user
```

### 2.2 The Identical FCM Topic Mirror

This exact logic is **mirrored 1:1 in Firebase topics** via `fcmService.js`:

```js
const topics = [
  `topic_div_${divS}`,
  `topic_dist_${distS}`,
  `topic_div_${divS}_role_${role}`,
  `topic_dist_${distS}_role_${role}`,
  `topic_role_${role}`,
  `topic_all_users`,   // Broadcast topic
];
```

### 2.3 The Architectural "WHY" — O(1) Intersection Targeting

The core reason for this **matrix architecture** is **instant intersection targeting without database queries**.

**Without this design**, sending "Drivers in Panadura" would require:

```js
// ❌ O(N) — Expensive, slow, scales poorly
const drivers = await User.find({ role: "driver_user", "currentLocation.region": "Panadura" });
drivers.forEach(d => io.to(`user_${d._id}`).emit("new_notification", notif));
```

**With this design**, the same operation is a **single O(1) emit**:

```js
// ✅ O(1) — Instant, no DB query, no iteration
io.to("region_Panadura_role_driver_user").emit("new_notification", notification);
```

The server has **pre-computed the membership** at connection time. When a notification needs to reach "Drivers in Panadura", the server simply addresses the pre-existing room/topic. This is the same principle as a **database index** — we pay a small cost at write time (joining rooms) to make reads (targeting) instant.

---

## 3. Dynamic Geospatial Tracking & The `Region` Model

### 3.1 Live GPS Tracking via `update_location`

The frontend (`SocketContext.jsx`) uses the browser's `navigator.geolocation.watchPosition` to stream live GPS coordinates to the server:

```js
socket.emit("update_location", { lat: latitude, lng: longitude });
```

The backend (`notificationHandler.js`) receives these and performs **throttled geofencing**:

```js
// Client-side throttle: don't emit if moved < 50m
if (dist < 50) return;

// Server-side throttle: don't re-run geofencing if moved < 100m
if (distance < 100) {
  return await updateDBLocation(userId, lat, lng, role);
}
```

**Why track live GPS?** The engine needs to know *where* each user is to:
1. Join them into the correct regional rooms/topics.
2. Detect when they **cross a region boundary** and re-route them (leave old rooms, join new ones).
3. Update their `currentLocation` in MongoDB for the driver-tracking feature.

### 3.2 The `Region` Model & Database Seeder

The `Region` model stores **local GeoJSON polygon boundaries** of Sri Lanka's administrative divisions:

```js
const regionSchema = new mongoose.Schema({
  name: { type: String, required: true },      // Divisional Secretariat (e.g., "Panadura")
  district: { type: String, required: true },  // District (e.g., "Kalutara")
  geometry: { type: { type: String, enum: ["Polygon", "MultiPolygon"] }, coordinates: Array },
});
regionSchema.index({ geometry: "2dsphere" });
```

The `dbSeeder.js` auto-loads this data from `data/gadm41_LKA_2.json` on server startup if the collection is empty.

### 3.3 The "WHY" — Local Geofencing vs. External Reverse Geocoding

When a user sends GPS coordinates, `locationHelper.js` uses MongoDB's **`$geoIntersects`** operator:

```js
const foundRegion = await Region.findOne({
  geometry: {
    $geoIntersects: {
      $geometry: { type: "Point", coordinates: [nLng, nLat] }
    }
  }
}).lean();
```

**Why this instead of Google Maps Reverse Geocoding API?**

| Approach | Cost | Latency | Rate Limits | Offline |
|---|---|---|---|---|
| **External API** (Google Maps) | 💰 Per-request cost | 200–500ms | Strict | ❌ |
| **Local `$geoIntersects`** | Free (MongoDB) | < 5ms | None | ✅ |

Every GPS update would otherwise be a paid API call. With thousands of users streaming locations every few seconds, external APIs would be **prohibitively expensive and rate-limited**. By storing the polygon data locally and using MongoDB's native geospatial index, the engine performs **instant, free, unlimited** reverse geocoding.

---

## 4. Priority Levels, UI/UX Representation & Interactions

### 4.1 The Four Priority Levels

```js
export const NOTIFICATION_PRIORITIES = {
  LOW: 'low',        // Informational
  MEDIUM: 'medium',  // Standard
  HIGH: 'high',      // Important — triggers sound + vibration
  CRITICAL: 'critical' // Emergency — triggers loud alarm + SOS vibration
};
```

### 4.2 Visual Representation in the UI

The frontend maps priorities to **distinct visual treatments** via `notificationHelpers.jsx`:

| Priority | Icon Color | Left Border | Toast Duration |
|---|---|---|---|
| **LOW** | Green (`#4CAF50`) | Green | 4s |
| **MEDIUM** | Neutral (`#F4F9FF`) | Neutral | 5s |
| **HIGH** | Dark (`#111111`) | Dark | 7s |
| **CRITICAL** | Red (`#E53935`) | Red | 10s |

**Toast queue logic** (`notificationSlice.js`): A maximum of **3 toasts** display simultaneously. If a CRITICAL alert arrives while the queue is full, it **preempts** a non-critical toast to ensure the emergency is seen immediately.

### 4.3 Audio & Haptic Strategy

`feedbackHelper.js` implements a **safety-first** alert strategy:

```js
// CRITICAL: SOS vibration pattern + loud emergency sound
navigator.vibrate([200, 100, 200, 100, 500]);
criticalSound.play();

// HIGH: Short pulse + chime
navigator.vibrate([100, 50, 100]);
highSound.play();
```

**Why:** In a tourist safety context, a CRITICAL alert (e.g., tsunami warning) must be **impossible to miss** — even if the user is not looking at the screen. The distinct SOS vibration pattern and loud sound ensure the user is alerted through multiple sensory channels. The global **Mute** toggle (`localStorage: mute_alerts`) lets users suppress audio while still receiving visual toasts.

### 4.4 Notification Modal Features

The `NotificationModal` + `NotificationList` provide a full-featured inbox:

| Feature | Implementation |
|---|---|
| **Infinite Scroll Pagination** | `useInfiniteQuery` from React Query — loads 10 per page, auto-fetches next page at scroll bottom |
| **Mark All as Read** | **Optimistic UI** — Redux state updates instantly, then `markAllAsReadApi` syncs to DB; rollback on error |
| **Clear All** | Soft-delete via `NotificationReadStatus` `isDeleted: true` (preserves history for other users) |
| **Mute/Unmute** | Global toggle persisted in `localStorage` |
| **Deep-Linking** | Clicking "View Details" navigates to `actionUrl` with `actionData` (e.g., map coordinates) passed via router state |

**Optimistic UI pattern** (from `NotificationList.jsx`):

```js
onMutate: async (notificationId) => {
  await queryClient.cancelQueries({ queryKey: ["notifications", userId] });
  // Immediately mark as read in cache
  queryClient.setQueryData(["notifications", userId], /* ... */);
  return { previousNotifications };  // For rollback
},
onError: (_err, _vars, context) => {
  // Rollback to previous state on failure
  queryClient.setQueryData(["notifications", userId], context.previousNotifications);
}
```

---

## 5. Technology Stack & Architectural Justifications

| Technology | Role in the Engine | Why Chosen |
|---|---|---|
| **Node.js + Express** | REST API server, route handling, middleware | Non-blocking I/O ideal for high-concurrency socket + push workloads; Express is the de-facto standard with mature middleware ecosystem |
| **MongoDB + Mongoose** | Persistent storage, geospatial queries, aggregation | Native `2dsphere` index for `$geoIntersects`; `$lookup` for cross-collection joins; **TTL index** (`expireAfterSeconds: 0`) auto-deletes expired notifications — zero cron jobs needed |
| **Socket.io** | Real-time bidirectional communication | Automatic reconnection, room-based broadcasting, fallback to polling when WebSockets blocked |
| **Firebase Admin SDK (FCM)** | Background push notifications | Free, reliable, cross-platform (Android/iOS/Web); topic-based messaging perfectly matches our room architecture |
| **React** | Frontend UI | Component-based, declarative; enables complex toast/modal state management |
| **Redux Toolkit** | Global state (unread count, toasts, modal, mute) | Predictable state management for cross-component notification state; `createSlice` reduces boilerplate |
| **TanStack React Query** | Server-state caching, pagination, optimistic updates | Automatic cache invalidation, infinite queries for pagination, optimistic UI rollback — eliminates manual loading/error state management |
| **Tailwind CSS** | Styling | Utility-first, rapid iteration, consistent design system across all notification components |

### Key Database Optimizations

```js
// 1. Geospatial index for instant region lookup
notificationSchema.index({ location: "2dsphere" }, { sparse: true });

// 2. Compound indexes for fast history loading
notificationSchema.index({ recipientId: 1, createdAt: -1 });
notificationSchema.index({ scope: 1, recipientRole: 1, createdAt: -1 });

// 3. TTL index — auto-delete expired notifications
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// 4. Unique compound index — prevent duplicate read-status records
readStatusSchema.index({ userId: 1, notificationId: 1 }, { unique: true });
```

### Aggregation Pipeline Optimization

The `notificationController.js` uses a **single aggregation pipeline** to fetch notifications with read-status, sorted and paginated **before** the `$lookup` to minimize the join scope:

```js
const notifications = await Notification.aggregate([
  { $match: { $or: matchCriteria } },   // Filter by user/role/region
  { $sort: { createdAt: -1 } },          // Sort (index-backed)
  { $skip: skip },                       // Paginate BEFORE $lookup
  { $limit: limit },
  { $lookup: { from: "notificationreadstatuses", ... } },  // Join only the page
  { $addFields: { isRead: ... } },       // Compute read status
]);
```

---

## Summary

The Notification & Alerts Engine is a **hybrid, geospatial-aware, multi-channel** system that:

1. **Delivers** via Socket.io (real-time) + FCM (background) with failure isolation.
2. **Targets** users via a pre-computed matrix of overlapping rooms/topics for O(1) intersection routing.
3. **Tracks** live GPS with throttled Haversine checks and local `$geoIntersects` geofencing (no external API costs).
4. **Prioritizes** alerts with 4 levels, distinct visual/audio/haptic treatments, and a safety-first CRITICAL escalation path.
5. **Optimizes** the database with `2dsphere`, compound, unique, and TTL indexes, plus index-friendly aggregation pipelines.

This architecture is designed to scale from a single server to a distributed deployment without fundamental redesign.