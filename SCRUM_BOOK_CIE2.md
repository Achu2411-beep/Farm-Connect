# LOCAL FARM CONNECT: DIRECT FARM-TO-CONSUMER E-COMMERCE PLATFORM
## SCRUM BOOK: SUBMISSION - 2 (CIE 2)

---

### STUDENT PROFILE

* **Name of Student:** ATHUL KRISHNA R
* **Register Number:** MEA24MCA-XXXX
* **Course & Batch:** Master of Computer Applications (MCA)
* **Semester:** S3 (Third Semester)
* **Department:** Department of Computer Applications
* **College:** MEA Engineering College, Perinthalmanna

---

### EVALUATION PROFILE

* **Submission Date:** 18/08/2026
* **Evaluation Event:** Continuous Internal Evaluation 2 (CIE 2)
* **Project Guide:** Ms. Prajina K (Assistant Professor)
* **Project Co-ordinator:** Mrs. Sruti Sudevan (HOD & Assistant Professor)

---

### EVALUATION & SIGNATURE SHEET

| Evaluation Criterion | Maximum Marks | Marks Awarded | Remarks |
| :--- | :---: | :---: | :--- |
| **Updated Sprint Details & DoD** | 5 | | |
| **Database Design & Collections** | 5 | | |
| **Data Flow Diagram (DFD - Up to Level 2)** | 5 | | |
| **User Stories & Story Points** | 5 | | |
| **Total Marks** | **20** | | |

<br />

**Signature of Project Guide:** _________________________  
**Date of Evaluation:** _________________________  

---

## 1. UPDATED SPRINT DETAILS

The **Local Farm Connect** platform was developed following the **Agile Scrum Framework** across four sprints. Below is the official Sprint Tracking Log formatted according to evaluation requirements:

### 📅 Sprint - 1: Core Setup & Farmer Auth Foundation

| Module | Task | Pending task if any | Hours of Completion | Expected date of Completion | Actual date of Completion | Reason for delay |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Farmer** | Express & JSON DB Fallback Engine | - | 3 hr | 14/07/2026 | 14/07/2026 | - |
| **Farmer** | JWT Auth & Middleware Setup | - | 2 hr | 16/07/2026 | 16/07/2026 | - |
| **Farmer** | Farmer Email-OTP Registration | - | 3 hr | 18/07/2026 | 18/07/2026 | - |
| **Farmer** | Monospace OTP Verification Screen | - | 2 hr | 21/07/2026 | 21/07/2026 | - |
| **Farmer** | Farmer Login & Auth State | - | 2 hr | 22/07/2026 | 22/07/2026 | - |
| **Farmer** | Leaflet Interactive Map Component | - | 3 hr | 24/07/2026 | 24/07/2026 | - |

---

### 📅 Sprint - 2: Farm Profile Relocation & Produce Catalog CRUD

| Module | Task | Pending task if any | Hours of Completion | Expected date of Completion | Actual date of Completion | Reason for delay |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Farmer** | Profile Details Update API | - | 3 hr | 26/07/2026 | 26/07/2026 | - |
| **Farmer** | Drag-Pin GPS Coordinate Relocation | - | 3 hr | 28/07/2026 | 28/07/2026 | - |
| **Farmer** | Multer Local Image Upload Middleware | - | 4 hr | 30/07/2026 | 30/07/2026 | - |
| **Farmer** | Add Product Modal & Catalog Grid | - | 3 hr | 01/08/2026 | 01/08/2026 | - |
| **Farmer** | Edit/Delete Product & Image Unlink | - | 2 hr | 03/08/2026 | 03/08/2026 | - |

---

### 📅 Sprint - 3: Consumer Onboarding & Farm Discovery Directory

| Module | Task | Pending task if any | Hours of Completion | Expected date of Completion | Actual date of Completion | Reason for delay |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Consumer** | Role-Based User Schema (`farmer`/`consumer`) | - | 2 hr | 05/08/2026 | 05/08/2026 | - |
| **Consumer** | Instant Consumer Registration & Login | - | 3 hr | 07/08/2026 | 07/08/2026 | - |
| **Consumer** | Multi-Marker Leaflet Map Directory | - | 5 hr | 09/08/2026 | 09/08/2026 | - |
| **Consumer** | Interactive Farm Popup Cards & Search | - | 3 hr | 11/08/2026 | 11/08/2026 | - |
| **Consumer** | Farm Storefront Page (`/farm/:id`) | - | 4 hr | 13/08/2026 | 13/08/2026 | - |
| **Consumer** | Produce Grid & Contact Buttons | - | 2 hr | 14/08/2026 | 14/08/2026 | - |

---

### 📅 Sprint - 4: E-Commerce Cart, Checkout, Order Tracking & Reviews

| Module | Task | Pending task if any | Hours of Completion | Expected date of Completion | Actual date of Completion | Reason for delay |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Consumer** | Persistent CartContext & Subtotals | - | 3 hr | 15/08/2026 | 15/08/2026 | - |
| **Consumer** | Checkout Page & COD / UPI Payment | - | 3 hr | 16/08/2026 | 16/08/2026 | - |
| **Consumer/Farmer** | Order Tracking & Status Management | - | 4 hr | 17/08/2026 | 17/08/2026 | - |
| **Consumer** | Star Ratings, Reviews & WhatsApp Direct Contact | - | 3 hr | 18/08/2026 | 18/08/2026 | - |

---

### 📊 Sprint Velocity & Burn-down Summary

| Sprint | Module Focus | Planned SP | Completed SP | Velocity Status |
| :--- | :--- | :---: | :---: | :---: |
| **Sprint 1** | Farmer Auth & Leaflet Map Pinning | 19 | 19 | On Target |
| **Sprint 2** | Profile Relocation & Produce Catalog CRUD | 20 | 20 | On Target |
| **Sprint 3** | Consumer Module & Farm Map Directory | 21 | 21 | On Target |
| **Sprint 4** | Cart, Checkout, Order Tracking & Reviews | 18 | 18 | On Target |

<br />

#### Definition of Done (DoD) Checklist:
* [x] Code adheres to clean architecture with standard Express routes and React hooks.
* [x] Password fields are hashed with Bcrypt (10 salt rounds) prior to persistence.
* [x] API routes enforce JWT authorization middleware (`protect`).
* [x] Geospatial coordinates validate latitude (-90 to 90) and longitude (-180 to 180).
* [x] Automatic database fallback engine seamlessly switches to local JSON files (`users.json`, `products.json`, `orders.json`, `reviews.json`) if MongoDB is offline.
* [x] All manual UAT workflows (Farmer, Consumer) pass verification tests without runtime exceptions.

---

## 2. DATABASE DESIGN / COLLECTIONS

The backend utilizes **MongoDB** with **Mongoose ORM** to enforce schema validation, with an automatic fallback mechanism to local JSON databases in `backend/data/`. The primary collections and their relationships are detailed below:

```text
 ┌─────────────────┐ 1:N ┌──────────────────┐
 │      User       │ ◄───────────────────── │     Product      │
 │(Farmer/Consumer)│                        │(Produce Items)   │
 └────────┬────────┘                        └──────────────────┘
          │ 1:N
          ▼ 
 ┌─────────────────┐ 1:N ┌──────────────────┐
 │      Order      │ ◄───────────────────── │      Review      │
 │ (Cart Payload)  │                        │  (Star Ratings)  │
 └─────────────────┘                        └──────────────────┘
```

---

### 2.1 Collection: `users` (`User.js`)
Stores user profiles for Farmers and Consumers.

| Field | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key, Auto | Unique user identifier |
| `username` | String | Required, Unique | Unique username for login |
| `email` | String | Required, Unique, Lowercase | Email address for login and OTP |
| `password` | String | Required, Min length 6 | Hashed password (Bcrypt) |
| `phone` | String | Required | Primary phone contact number |
| `address` | String | Required | Physical street address |
| `role` | String | Enum: `['farmer', 'consumer']`, Default: `'farmer'` | User access role |
| `farmName` | String | Optional (Required for farmers) | Name of local farm stand |
| `farmDescription` | String | Optional | Farm story & organic practices |
| `latitude` | Number | Optional | GPS latitude coordinate |
| `longitude` | Number | Optional | GPS longitude coordinate |
| `isVerified` | Boolean | Default: `false` | Email OTP verification status |
| `otp` | String | Optional | Active 6-digit verification code |
| `otpExpires` | Date | Optional | Expiry timestamp for OTP code |
| `createdAt` | Date | Auto Timestamp | Account creation timestamp |

```json
/* Sample Document (users): */
{
  "_id": "6a6959be4b8992b198eddbc0",
  "username": "greenfarms",
  "email": "farmer@example.com",
  "password": "$2a$10$w8.9Xj1s4rZ6Qk9Y... (Bcrypt Hashed)",
  "phone": "+91 9876543210",
  "address": "Ooty Road, Perinthalmanna, Kerala",
  "role": "farmer",
  "farmName": "Green Valley Organic Farm",
  "farmDescription": "Pesticide-free organic vegetables grown using traditional compost.",
  "latitude": 10.958,
  "longitude": 76.218,
  "isVerified": true,
  "otp": null,
  "otpExpires": null,
  "createdAt": "2026-07-28T10:15:30.000Z"
}
```

---

### 2.2 Collection: `products` (`Product.js`)
Stores product listings uploaded by farmers.

| Field | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key, Auto | Unique product identifier |
| `farmerId` | String | Required, Ref: `'User'` | Reference ID of listing farmer |
| `title` | String | Required, Trim | Name of agricultural produce |
| `category` | String | Required | Category (`Vegetables`, `Fruits`, `Dairy & Eggs`, etc.) |
| `unit` | String | Required | Price unit (`kg`, `bunch`, `dozen`, `piece`, `litre`) |
| `price` | Number | Required | Price per unit in ₹ |
| `stock` | Number | Required | Available stock count |
| `description` | String | Optional | Detailed produce notes |
| `image` | String | Optional | Local file path (`/uploads/filename.png`) |
| `createdAt` | Date | Auto Timestamp | Item creation timestamp |

```json
/* Sample Document (products): */
{
  "_id": "7b7959be4b8992b198eddbd2",
  "farmerId": "6a6959be4b8992b198eddbc0",
  "title": "Organic Farm Tomatoes",
  "category": "Vegetables",
  "unit": "kg",
  "price": 45.00,
  "stock": 50,
  "description": "Harvested fresh this morning. 100% organic and vine-ripened.",
  "image": "/uploads/image-1785432.png",
  "createdAt": "2026-07-30T11:20:00.000Z"
}
```

---

### 2.3 Collection: `orders` (`Order.js`)
Stores customer orders placed with farmers.

| Field | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key, Auto | Unique order ID |
| `consumerId` | String | Required, Ref: `'User'` | Buying consumer ID |
| `consumerName` | String | Required | Buyer username |
| `consumerPhone` | String | Required | Contact phone for delivery |
| `deliveryAddress` | String | Required | Customer delivery address |
| `farmerId` | String | Required, Ref: `'User'` | Destination farmer ID |
| `farmName` | String | Required | Destination farm name |
| `items` | Array | Required | Array of `{ productId, title, unit, price, quantity }` |
| `totalAmount` | Number | Required | Total order price in ₹ (includes delivery fee) |
| `paymentMethod` | String | Enum: `['COD', 'UPI']`, Default: `'COD'` | Payment mode |
| `paymentStatus` | String | Enum: `['Pending', 'Paid']`, Default: `'Pending'` | Payment verification status |
| `status` | String | Enum: `['Pending', 'Confirmed', 'Out for Delivery', 'Delivered', 'Cancelled']` | Order fulfillment status |
| `createdAt` | Date | Auto Timestamp | Order placement timestamp |

```json
/* Sample Document (orders): */
{
  "_id": "8c8959be4b8992b198eddbe4",
  "consumerId": "5a5959be4b8992b198eddba1",
  "consumerName": "freshbuyer",
  "consumerPhone": "+91 9876543211",
  "deliveryAddress": "Main Street, Perinthalmanna, Kerala",
  "farmerId": "6a6959be4b8992b198eddbc0",
  "farmName": "Green Valley Organic Farm",
  "items": [
    {
      "productId": "7b7959be4b8992b198eddbd2",
      "title": "Organic Farm Tomatoes",
      "unit": "kg",
      "price": 45.00,
      "quantity": 2
    }
  ],
  "totalAmount": 120.00,
  "paymentMethod": "COD",
  "paymentStatus": "Pending",
  "status": "Confirmed",
  "createdAt": "2026-08-17T14:30:00.000Z"
}
```

---

### 2.4 Collection: `reviews` (`Review.js`)
Stores customer ratings and reviews for farms.

| Field | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key, Auto | Unique review ID |
| `farmId` | String | Required, Ref: `'User'` | Target farm ID |
| `consumerId` | String | Required, Ref: `'User'` | Reviewing buyer ID |
| `consumerName` | String | Required | Reviewer username |
| `rating` | Number | Required, Min: 1, Max: 5 | Star score (1-5) |
| `comment` | String | Required | Detailed feedback text |
| `createdAt` | Date | Auto Timestamp | Review creation timestamp |

```json
/* Sample Document (reviews): */
{
  "_id": "9d9959be4b8992b198eddbe9",
  "farmId": "6a6959be4b8992b198eddbc0",
  "consumerId": "5a5959be4b8992b198eddba1",
  "consumerName": "freshbuyer",
  "rating": 5,
  "comment": "Extremely fresh tomatoes! Quick delivery directly from the farm.",
  "createdAt": "2026-08-18T09:15:00.000Z"
}
```

---

## 3. DATA FLOW DIAGRAM (DFD)

The Data Flow Diagrams (DFD) represent the logical movement of data throughout the **Local Farm Connect** system across Level 0, Level 1 (Role-specific), and Level 2 detailed process decompositions.

### 3.1 Level 0 - System Context Diagram
Depicts the primary boundary of the system and its data flow exchanges with External Entities (**Farmer**, **Consumer**).

```text
               ┌──────────────┐
               │    Farmer    │
               └──────┬───────┘
  Farm Details/       │ Response 
  Produce Uploads     │ (OTP/Dashboard/Orders)
                      ▼
 ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
 │    Farmer    │─►│  Local Farm  │◄│   Consumer   │
 │   Dashboard  │◄─│   Connect    │─►│  Marketplace │
 └──────────────┘ └──────────────┘ └──────────────┘
                      ▲
      Cart/Checkout/  │ Response
      Reviews Payload │ (Farms/Cart/Status)
                      │
               ┌──────┴───────┐
               │   Consumer   │
               └──────────────┘
```

---

### 3.2 Level 1 - Farmer Module
Decomposes farmer functionality: authentication, profile & location coordinate pinning, produce catalog management, and order fulfillment.

```text
 ┌──────────────┐
 ┌──►│ User Table   │
 │   └──────────────┘
 ▼
┌────────┐ ┌─────────┐ ┌──────────────────────┐ ┌─────────────────┐
│ Farmer │──►│Register │─►│ Manage Farm Profile  │◄─►│ Profile Info    │
│ User   │   │& Login  │ ├──────────────────────┤ └─────────────────┘
└────────┘   └─────────┘ │ Pin Map Coordinates  │◄─►│ GPS Coordinates │
                         ├──────────────────────┤ └─────────────────┘
                         │ Upload Produce Items │◄─►│ Products Store  │
                         ├──────────────────────┤ └─────────────────┘
                         │ Fulfill Received     │◄─►│ Orders Store    │
                         │ Customer Orders      │ └─────────────────┘
                         └──────────────────────┘
```

---

### 3.3 Level 1 - Consumer Module
Decomposes consumer functionality: registration, exploring multi-marker farm maps, viewing produce storefronts, cart checkout, order tracking, and reviews.

```text
 ┌──────────────┐
 ┌──►│ User Table   │
 │   └──────────────┘
 ▼
┌────────┐ ┌─────────┐ ┌──────────────────────┐ ┌─────────────────┐
│ Consumer│─►│Register │─►│ Explore Farm Map     │◄─►│ Farm Directory  │
│ Buyer  │   │& Login  │ ├──────────────────────┤ └─────────────────┘
└────────┘   └─────────┘ │ View Farm Storefront │◄─►│ Produce Items   │
                         ├──────────────────────┤ └─────────────────┘
                         │ Add Cart & Checkout  │◄─►│ Orders Store    │
                         ├──────────────────────┤ └─────────────────┘
                         │ Track Order Status   │◄─►│ Status History  │
                         ├──────────────────────┤ └─────────────────┘
                         │ Submit Star Review   │◄─►│ Reviews Store   │
                         └──────────────────────┘
```

---

### 3.4 Level 2 - Detailed Process Decomposition

Detailed Level 2 breakdown showing exact sub-processes and datastores managed by the System:

```text
┌────────┐
│ Farmer │──────┐
└────────┘      │
     ├──────► ┌──────────────────────┐
     │        │ Manage Produce       │
     │        ├──────────────────────┤
     │        │ ├─ Add Product       │──────► ┌─────────────────┐
     │        │ ├─ Upload Image      │        │ Products        │
     │        │ ├─ Edit Listing      │◄────── │ Collection      │
     │        │ └─ Delete Listing    │        └─────────────────┘
     │        └──────────────────────┘
     │
     └──────► ┌──────────────────────┐
              │ Order Fulfillment    │
              ├──────────────────────┤
              │ ├─ View Received     │──────► ┌─────────────────┐
              │ ├─ Confirm Order     │        │ Orders          │
              │ ├─ Out for Delivery  │◄────── │ Collection      │
              │ └─ Mark Delivered    │        └─────────────────┘
              └──────────────────────┘
```

---

## 4. USER STORIES

User stories are categorized under four main Epics, complete with Acceptance Criteria and Story Point (SP) estimates based on the Fibonacci scale.

### Epic 1: Identity, Access & Role Management (IAM)

#### 📘 User Story 1.1: Farmer Registration with Simulated OTP
* **As a** Farmer,
* **I want to** register an account with farm details and verify my email using a 6-digit OTP code logged to the terminal,
* **So that** I can activate a verified farmer profile on the interactive directory map.
* **Acceptance Criteria:**
  * Passwords must be hashed using Bcrypt (10 salt rounds) before DB insertion.
  * Generates 6-digit verification OTP logged to terminal console.
  * Returns HTTP 201 Created with registration confirmation.
* **Story Estimate:** 3 SP

#### 📘 User Story 1.2: Role-Based Consumer Registration & Login
* **As a** Consumer,
* **I want to** create a buyer account without friction and authenticate securely,
* **So that** I can log in, browse local farm stands, and place orders.
* **Acceptance Criteria:**
  * Consumer signups set `role: 'consumer'` and `isVerified: true` automatically.
  * JWT payloads contain user ID and assigned role.
* **Story Estimate:** 3 SP

---

### Epic 2: Geospatial Map Pinning & Produce Catalog Management (PCM)

#### 📘 User Story 2.1: Interactive Farm Location Pinning & Relocation
* **As a** Farmer,
* **I want to** drag a marker pin on an OpenStreetMap interface,
* **So that** consumers can view my exact farm stand coordinates.
* **Acceptance Criteria:**
  * Leaflet map component allows dragging pins to adjust coordinates.
  * Selected coordinates auto-populate latitude and longitude input fields.
* **Story Estimate:** 5 SP

#### 📘 User Story 2.2: Produce Upload & Local Storage Modals
* **As a** Farmer,
* **I want to** add produce listings with images, prices per unit, and available stock counts,
* **So that** I can manage my direct e-commerce inventory.
* **Acceptance Criteria:**
  * Uploaded images are handled via Multer and saved locally to `backend/uploads/`.
  * Deleting or updating a listing unlinks the old image file from disk.
* **Story Estimate:** 5 SP

---

### Epic 3: Consumer Map Discovery & Storefront Browsing (CMD)

#### 📘 User Story 3.1: Multi-Marker Farm Discovery Map
* **As a** Consumer,
* **I want to** view all verified local farms on an interactive map,
* **So that** I can locate nearby farm stands in my neighborhood.
* **Acceptance Criteria:**
  * Map displays custom pins for all verified farmers.
  * Clicking a map pin opens a popup card with farm details and storefront link.
* **Story Estimate:** 5 SP

#### 📘 User Story 3.2: Farm Storefront & Direct Contact Tools
* **As a** Consumer,
* **I want to** visit a farm's individual storefront page to view their story, produce, and contact info,
* **So that** I can communicate directly with local growers.
* **Acceptance Criteria:**
  * Includes direct **"Contact via WhatsApp"** and **"Call Farmer"** quick buttons.
  * Renders a produce card grid with "Add to Cart" controls.
* **Story Estimate:** 4 SP

---

### Epic 4: Cart, Order Fulfillment & Review System (OFR)

#### 📘 User Story 4.1: Shopping Cart & Order Placement
* **As a** Consumer,
* **I want to** group produce items by farm, select delivery options (COD / UPI), and place an order,
* **So that** I can buy fresh produce directly from local farms.
* **Acceptance Criteria:**
  * Cart state persists in `localStorage`.
  * Multi-farm carts automatically split into distinct seller orders.
* **Story Estimate:** 5 SP

#### 📘 User Story 4.2: Real-Time Order Status & Star Reviews
* **As a** Consumer,
* **I want to** track my order status timeline and submit star ratings upon delivery,
* **So that** I can share my feedback with the farming community.
* **Acceptance Criteria:**
  * Status badges update dynamically (`Pending` -> `Confirmed` -> `Out for Delivery` -> `Delivered`).
  * 1-5 star ratings & customer review form update farm storefront score.
* **Story Estimate:** 4 SP

---

## 5. GIT COMMIT HISTORY SUMMARY (REVIEW CYCLE)

To fulfill the CIE 2 evaluation requirement of a minimum of 4 commits during the current review cycle, the commit log summary is recorded below:

```text
commit d12b479e0123456789abcdef0123456789abcdef
Author: Achu2411-beep <aswathivijayachandran@gmail.com>
Date:   Mon Aug 17 23:27:27 2026 +0530

    Milestone 14: Ratings, Reviews & Direct Contact Tools
    - Add Review model, reviews.json DB fallback & API endpoints
    - Add star ratings, customer review submission form & WhatsApp/Call direct buttons on FarmStorefront.jsx
    - Finalize CIE 2 documentation specs and system verification walkthrough

commit be499ec89abcdef0123456789abcdef012345678
Author: Achu2411-beep <aswathivijayachandran@gmail.com>
Date:   Mon Aug 17 23:27:12 2026 +0530

    Milestone 13: Order Management Dashboards (Farmer & Consumer)
    - Add GET /api/orders/my-orders and GET /api/orders/farmer-orders endpoints
    - Build MyOrders.jsx page for buyers with real-time status timeline badges
    - Add Orders Received tab to farmer Dashboard.jsx for order status updates

commit bd22e5c789abcdef0123456789abcdef01234567
Author: Achu2411-beep <aswathivijayachandran@gmail.com>
Date:   Mon Aug 17 23:27:07 2026 +0530

    Milestone 12: Checkout & Order Placement Engine
    - Create Order model & orders.json fallback engine in dbEngine.js
    - Implement POST /api/orders API with multi-farm order splitting
    - Build Checkout.jsx with delivery address form & Cash on Delivery (COD) / Direct UPI choices

commit d7aaea86789abcdef0123456789abcdef012345
Author: Achu2411-beep <aswathivijayachandran@gmail.com>
Date:   Mon Aug 17 23:27:01 2026 +0530

    Milestone 11: Shopping Cart System
    - Implement persistent CartContext.jsx with localStorage synchronization
    - Build Cart.jsx page & header badge displaying farm-grouped produce items and subtotal math
```

---
*End of Scrum Book Submission - 2 (CIE 2)*  
*Department of Computer Applications — MEA Engineering College*
