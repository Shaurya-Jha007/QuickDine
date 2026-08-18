# 🍽️ QuickDine

> A full-stack MERN restaurant discovery and table reservation platform with role-based portals for diners, restaurant owners, and administrators.

QuickDine is a modern restaurant reservation platform designed to connect diners with restaurants through a streamlined discovery, availability, and booking experience.

The platform supports three distinct user roles — **User**, **Restaurant Owner**, and **Admin** — with dedicated workflows and protected dashboards for each role.

Diners can discover restaurants, search and filter venues, view restaurant details, check date-specific seat availability, and reserve tables online. Restaurant owners can register and manage their restaurant, configure reservation slots and seating capacity, and manage incoming bookings. Administrators oversee restaurant approvals and monitor platform-level statistics.

---

## 🌐 Live Demo

| Application           | URL                                            |
| --------------------- | ---------------------------------------------- |
| **Frontend**          | https://quick-dine-plum.vercel.app/            |
| **Backend API**       | https://quick-dine-server-nine-chi.vercel.app/ |
| **GitHub Repository** | https://github.com/Shaurya-Jha007/QuickDine    |

The backend root endpoint can be used to verify that the deployed API is live.

---

## ✨ Features

### 👤 Authentication & Authorization

QuickDine implements JWT-based authentication with role-based access control.

#### Authentication

* User registration
* User login
* Persistent authentication using JWT
* Protected routes
* Current-user/session retrieval
* Logout
* Password hashing using `bcrypt`
* Authorization token automatically attached to API requests
* Authentication state managed through React Context

#### Supported Roles

| Role      | Purpose                                               |
| --------- | ----------------------------------------------------- |
| **User**  | Discover restaurants and make/manage reservations     |
| **Owner** | Register and manage a restaurant and its reservations |
| **Admin** | Moderate restaurants and monitor platform statistics  |

Role-specific routes are protected on both the frontend and backend.

---

# 🍴 Restaurant Discovery

Users can browse restaurants that have been approved by an administrator.

### Restaurant browsing

* Browse approved restaurants
* Search by:

  * Restaurant name
  * Cuisine
  * Tags
  * Location
* Filter by:

  * Cuisine
  * Price range
  * Minimum rating
  * Location
* Sort by:

  * Newest
  * Price — low to high
  * Price — high to low
  * Rating
* Featured restaurant section
* Exclusive restaurant listings
* Restaurant cards with imagery and key information
* Individual restaurant detail pages
* Slug-based restaurant URLs

### Restaurant information

Each restaurant can contain:

* Restaurant name
* Description
* Cuisine
* Price range
* Rating
* Review count
* Location
* Address
* Chef
* Cover image
* Tags
* Available reservation slots
* Total seating capacity
* Featured status
* Exclusive status
* Approval status

---

# 🪑 Real-Time Seat Availability

QuickDine includes a capacity-based reservation availability system.

For a selected restaurant and date, the backend:

1. Retrieves the restaurant's configured reservation slots.
2. Finds confirmed bookings for that restaurant and date.
3. Calculates the number of already-booked seats for each slot.
4. Subtracts booked seats from the restaurant's total capacity.
5. Returns the remaining capacity for every slot.
6. Marks each slot as available/unavailable depending on remaining capacity.

This prevents reservations from exceeding the restaurant's configured seating capacity.

### Example

If a restaurant has:

```text
Total capacity: 30 seats

19:00
Already booked: 22
Available: 8
```

A customer attempting to reserve 10 seats for that slot will be rejected.

---

# 📅 Table Reservation System

Authenticated users can make restaurant reservations through a dedicated booking flow.

### Booking flow

```text
Browse Restaurants
       ↓
Select Restaurant
       ↓
Select Date
       ↓
Check Available Slots
       ↓
Select Time & Party Size
       ↓
Enter Reservation Details
       ↓
Confirm Reservation
       ↓
Booking Confirmation
```

### Reservation details

A booking can contain:

* Restaurant
* Date
* Time
* Number of guests
* Occasion
* Special requests
* Booking status
* Unique booking reference ID

### Booking reference

Each booking automatically receives a generated reference such as:

```text
GR-A1B2C3D4
```

### Booking management for diners

Users can:

* View upcoming reservations
* View previous reservations
* View cancelled reservations
* View reservation details
* Cancel their own reservations
* Navigate back to the associated restaurant

---

# 👨‍🍳 Restaurant Owner Portal

Restaurant owners have a dedicated dashboard accessible only to authorized owner accounts.

## Restaurant registration

An owner without an existing restaurant is presented with a restaurant setup wizard.

Owners can configure:

* Restaurant name
* Description
* Cuisine
* Price range
* Location
* Address
* Chef
* Tags
* Cover image
* Available reservation slots
* Total seating capacity

Restaurant images are submitted using multipart form data and processed through Multer before being uploaded to Cloudinary.

### Approval workflow

New restaurants are not immediately publicly bookable.

The workflow is:

```text
Owner creates restaurant
        ↓
Pending approval
        ↓
Admin review
     ↙       ↘
Approved    Rejected
   ↓
Publicly available
   ↓
Reservations enabled
```

This provides administrative control over which restaurants become available to diners.

---

## Owner dashboard states

The owner dashboard handles several restaurant states:

### No restaurant

The owner is shown the restaurant registration wizard.

### Pending

The owner can see that their restaurant is awaiting administrative approval.

### Rejected

The owner is informed that the restaurant registration was rejected.

### Approved

The full restaurant management dashboard becomes available.

---

## Restaurant management

Approved owners can update:

* Restaurant information
* Cuisine
* Price range
* Location
* Address
* Chef
* Tags
* Available reservation slots
* Seating capacity
* Restaurant image

---

## Owner booking management

Restaurant owners can view reservations associated with their restaurant.

Booking information includes customer details such as:

* Customer name
* Email
* Phone
* Reservation date
* Reservation time
* Number of guests
* Booking status

Owners can also update booking statuses from their dashboard.

---

# 🛡️ Admin Portal

Administrators have a separate protected administration console.

## Restaurant moderation

Admins can:

* View all restaurant registrations
* Identify pending restaurants
* Approve restaurants
* Reject restaurants
* Review previously processed restaurants

Only approved restaurants are exposed through the public restaurant discovery API.

---

## Platform analytics

The admin dashboard provides system-level statistics including:

* Total users
* Total restaurant owners
* Combined user/owner count
* Total restaurants
* Total bookings
* Latest bookings

The statistics dashboard provides administrators with an overview of the platform's current state.

---

# 🔐 Role-Based Access Control

QuickDine applies authorization on both the client and server.

### Frontend

Protected routes restrict access to appropriate roles:

```text
/dashboard
    → Authenticated users

/owner/dashboard
    → Owners

/admin/dashboard
    → Administrators
```

### Backend

Protected API groups use middleware such as:

```text
protect
adminOnly
ownerOnly
```

This prevents unauthorized users from accessing role-specific API operations even if they attempt to call the endpoints directly.

---

# 🏗️ Architecture

QuickDine follows a client/server architecture:

```text
┌──────────────────────────────┐
│          React Client        │
│                              │
│  React + TypeScript + Vite   │
│  React Router                │
│  Tailwind CSS                │
│  Axios                       │
└──────────────┬───────────────┘
               │
               │ REST API / JSON
               │ JWT
               ▼
┌──────────────────────────────┐
│       Express Server         │
│                              │
│  Node.js + TypeScript        │
│  Authentication              │
│  Authorization               │
│  Business Logic              │
│  REST API                    │
└──────────────┬───────────────┘
               │
       ┌───────┴────────┐
       ▼                ▼
┌─────────────┐   ┌─────────────┐
│  MongoDB    │   │  Cloudinary │
│  /Mongoose  │   │    Images   │
└─────────────┘   └─────────────┘
```

---

# 🧰 Technology Stack

## Frontend

| Technology          | Purpose                                    |
| ------------------- | ------------------------------------------ |
| **React 19**        | UI development                             |
| **Vite**            | Development server and production bundling |
| **TypeScript**      | Static typing                              |
| **Tailwind CSS v4** | Styling                                    |
| **React Router v7** | Client-side routing                        |
| **Axios**           | HTTP/API communication                     |
| **Lucide React**    | Icons                                      |
| **React Hot Toast** | Notifications                              |

## Backend

| Technology     | Purpose                         |
| -------------- | ------------------------------- |
| **Node.js**    | Server runtime                  |
| **Express 5**  | REST API                        |
| **TypeScript** | Static typing                   |
| **MongoDB**    | Database                        |
| **Mongoose**   | ODM and schema management       |
| **JWT**        | Authentication                  |
| **bcrypt**     | Password hashing                |
| **Multer**     | Multipart/image upload handling |
| **Cloudinary** | Restaurant image storage        |
| **Morgan**     | HTTP request logging            |
| **CORS**       | Cross-origin API access         |
| **dotenv**     | Environment configuration       |
| **tsx**        | TypeScript execution            |

## Deployment

* **Vercel** — Frontend deployment
* **Vercel** — Backend deployment
* **MongoDB** — Database
* **Cloudinary** — Image storage

---

# 📁 Project Structure

```text
QuickDine/
│
├── client/                         # React frontend
│   ├── public/                     # Static assets
│   ├── src/
│   │   ├── assets/                 # Frontend assets
│   │   ├── components/
│   │   │   ├── admin/              # Admin-specific components
│   │   │   ├── booking/            # Booking components
│   │   │   ├── home/               # Homepage components
│   │   │   ├── owner/              # Owner-specific components
│   │   │   ├── restaurant/         # Restaurant components
│   │   │   ├── AuthModal.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── ...
│   │   │
│   │   ├── context/
│   │   │   └── AppContext.tsx      # Global authentication/app state
│   │   │
│   │   ├── lib/
│   │   │   └── api.ts              # Axios API client
│   │   │
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── owner/
│   │   │   ├── Home.tsx
│   │   │   ├── Search.tsx
│   │   │   ├── RestaurantDetail.tsx
│   │   │   ├── BookingConfirmation.tsx
│   │   │   └── Dashboard.tsx
│   │   │
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   │
│   ├── package.json
│   ├── vite.config.ts
│   └── vercel.json
│
├── server/                         # Express backend
│   ├── config/
│   │   ├── config.ts               # Environment configuration
│   │   ├── db.ts                   # MongoDB connection
│   │   └── multer.ts               # File upload configuration
│   │
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── restaurantController.ts
│   │   ├── bookingController.ts
│   │   ├── ownerController.ts
│   │   └── adminController.ts
│   │
│   ├── middlewares/
│   │   └── auth.ts                 # JWT/RBAC middleware
│   │
│   ├── models/
│   │   ├── User.model.ts
│   │   ├── Restaurant.ts
│   │   └── Booking.ts
│   │
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── restaurantRoutes.ts
│   │   ├── bookingRoutes.ts
│   │   ├── ownerRoutes.ts
│   │   └── adminRoutes.ts
│   │
│   ├── seed.ts                     # Development/demo database seeder
│   ├── server.ts                   # Express application entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── vercel.json
│
└── README.md
```

---

# 🔌 API Overview

The backend exposes RESTful endpoints under `/api`.

## Authentication

```text
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
```

### Access

* Registration — Public
* Login — Public
* Current user — Authenticated

---

## Restaurants

```text
GET    /api/restaurants
GET    /api/restaurants/featured
GET    /api/restaurants/:slug
GET    /api/restaurants/:id/availability
```

### Capabilities

* Restaurant discovery
* Search
* Filtering
* Sorting
* Featured restaurants
* Restaurant detail retrieval
* Date-specific availability calculation

---

## Bookings

```text
POST   /api/bookings
GET    /api/bookings/my
PUT    /api/bookings/:id/cancel
```

### Access

All booking operations require authentication.

---

## Owner

```text
GET    /api/owner/restaurant
POST   /api/owner/restaurant
PUT    /api/owner/restaurant

GET    /api/owner/bookings
PUT    /api/owner/bookings/:id/status
```

### Access

Owner-protected endpoints.

---

## Admin

```text
GET    /api/admin/restaurants
PUT    /api/admin/restaurants/:id/approve
GET    /api/admin/stats
```

### Access

Administrator-only endpoints.

---

# 🗃️ Data Models

QuickDine currently uses three primary Mongoose models.

## User

```text
User
├── name
├── email
├── password
├── phone
├── role
├── createdAt
└── updatedAt
```

Supported roles:

```text
user
owner
admin
```

Passwords are hashed using bcrypt before storage.

---

## Restaurant

```text
Restaurant
├── name
├── slug
├── description
├── cuisine
├── priceRange
├── rating
├── reviewCount
├── location
├── address
├── image
├── chef
├── tags[]
├── availableSlots[]
├── featured
├── exclusive
├── owner
├── status
├── totalSeats
├── createdAt
└── updatedAt
```

Restaurant statuses:

```text
pending
approved
rejected
```

---

## Booking

```text
Booking
├── user
├── restaurant
├── date
├── time
├── guests
├── occasion
├── specialRequests
├── status
├── bookingId
├── createdAt
└── updatedAt
```

Bookings automatically receive a unique reference ID.

---

# 🔄 Booking & Capacity Logic

QuickDine does not allocate a fixed MongoDB document to every physical restaurant table.

Instead, the current implementation models reservation capacity using:

```text
Restaurant
    ├── totalSeats
    └── availableSlots[]

Booking
    ├── date
    ├── time
    └── guests
```

For a requested date/time:

```text
Available Seats
=
Restaurant Total Seats
-
Confirmed Guests Already Booked
```

A booking is rejected when:

```text
Requested Guests > Available Seats
```

This provides slot-level capacity management without requiring individual table entities.

---

# 🖼️ Image Upload Architecture

Restaurant cover images use a server-side upload pipeline:

```text
React
  │
  │ multipart/form-data
  ▼
Multer
  │
  │ in-memory Buffer
  ▼
Express Controller
  │
  ▼
Cloudinary
  │
  ▼
Secure Image URL
  │
  ▼
MongoDB Restaurant Document
```

Multer currently limits uploaded files to **5 MB**.

Cloudinary stores the actual image while MongoDB stores the resulting secure URL.

---

# 🌱 Seed Data

The backend contains a development seed script for quickly creating demo data.

The seed process:

1. Connects to MongoDB.
2. Clears existing users, restaurants and bookings.
3. Creates:

   * Admin account
   * User account
   * Owner account
4. Creates six sample restaurants.
5. Assigns the seeded owner to the restaurants.
6. Marks the seeded restaurants as approved.
7. Assigns seating capacity to the restaurants.
8. Disconnects from MongoDB.

### Seeded demo accounts

> These credentials are intended for local/demo development only. Do not use them in a production environment.

| Role  | Email               | Password   |
| ----- | ------------------- | ---------- |
| Admin | `admin@example.com` | `admin123` |
| User  | `user@example.com`  | `user123`  |
| Owner | `owner@example.com` | `owner123` |

---

# 🚀 Running Locally

## Prerequisites

Install:

* Node.js 18+
* npm
* MongoDB / MongoDB Atlas account
* Cloudinary account

---

## 1. Clone the repository

```bash
git clone https://github.com/Shaurya-Jha007/QuickDine.git
cd QuickDine
```

---

# 🖥️ Frontend Setup

Move into the frontend:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Create:

```text
client/.env
```

Add:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

## Frontend production build

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

# ⚙️ Backend Setup

Open a second terminal and move into the server:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create:

```text
server/.env
```

Add the required environment variables:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secure_jwt_secret
NODE_ENV=development
CLOUDINARY_URL=your_cloudinary_url
```

Do not commit your `.env` file.

---

## Start the backend in development

```bash
npm run dev
```

The API will normally run at:

```text
http://localhost:5000
```

You can verify the server with:

```text
http://localhost:5000/
```

Expected response:

```json
{
  "message": "Server is Live"
}
```

---

# 🌱 Populate Demo Data

From the `server` directory, run:

```bash
npx tsx seed.ts
```

> ⚠️ The seed script clears the existing `User`, `Restaurant`, and `Booking` collections before inserting the demo data. Do not run it against a production database containing data you want to preserve.

After seeding, you can log in using the demo credentials listed above.

---

# 🔑 Environment Variables

## Client

| Variable       | Description                 |
| -------------- | --------------------------- |
| `VITE_API_URL` | Base URL of the backend API |

Example:

```env
VITE_API_URL=http://localhost:5000/api
```

## Server

| Variable         | Description                     |
| ---------------- | ------------------------------- |
| `MONGODB_URI`    | MongoDB connection string       |
| `PORT`           | Backend server port             |
| `JWT_SECRET`     | Secret used to sign/verify JWTs |
| `NODE_ENV`       | Runtime environment             |
| `CLOUDINARY_URL` | Cloudinary connection URL       |

### Security

Never commit:

```text
.env
.env.local
.env.production
```

or expose:

```text
JWT_SECRET
CLOUDINARY_URL
MONGODB_URI
```

in the frontend.

---

# ☁️ Deployment

QuickDine is structured as two separately deployed applications:

```text
GitHub Repository
       │
       ├── client/
       │      ↓
       │    Vercel
       │      ↓
       │   Frontend
       │
       └── server/
              ↓
            Vercel
              ↓
           REST API
```

### Frontend deployment

Configure:

```env
VITE_API_URL=<deployed-backend-api>/api
```

### Backend deployment

Configure the server-side environment variables in the hosting provider:

```env
MONGODB_URI=...
JWT_SECRET=...
NODE_ENV=production
CLOUDINARY_URL=...
PORT=...
```

Never place backend secrets inside frontend environment variables.

---

# 🧪 Development Workflow

A typical development workflow is:

```text
1. Start MongoDB
        ↓
2. Start Express server
        ↓
3. Start Vite frontend
        ↓
4. Register/login
        ↓
5. Browse restaurants
        ↓
6. Check availability
        ↓
7. Create reservation
        ↓
8. Manage reservation from dashboard
```

For owner/admin functionality, use the corresponding seeded account or create an account with the appropriate role in a development environment.

---

# 🛡️ Security Considerations

QuickDine currently implements several foundational security mechanisms:

* Password hashing with bcrypt
* JWT-based authentication
* Protected backend routes
* Role-based authorization
* Server-side authorization checks
* Password exclusion from serialized user responses
* Environment-based secret configuration
* File-size restriction for image uploads
* Backend validation for required restaurant/booking information
* Ownership checks when owners manage restaurant bookings

For a production-grade system, additional hardening could include:

* Request validation with a dedicated schema-validation library
* Rate limiting
* Helmet/security headers
* More restrictive CORS configuration
* CSRF strategy where applicable
* Centralized error handling
* Structured logging
* Automated testing
* More granular file-type validation
* Database transaction strategies for high-concurrency reservations

---

# 📐 Design & UX

QuickDine's frontend follows a premium restaurant-oriented visual language with:

* Responsive layouts
* Restaurant-focused imagery
* Clean typography
* Responsive search/filter interfaces
* Dedicated dashboards
* Loading states
* Toast-based feedback
* Mobile-friendly layouts
* Role-specific navigation
* Reservation confirmation experience

The application uses Tailwind CSS for the styling system and Lucide React for interface icons.

---

# 📌 Current Application Scope

QuickDine currently focuses on:

* Restaurant discovery
* Restaurant filtering and sorting
* Restaurant details
* Reservation slot availability
* Capacity-based reservations
* Booking management
* Restaurant onboarding
* Restaurant approval workflows
* Owner reservation management
* Admin moderation
* Admin analytics
* JWT authentication
* Role-based access control
* Cloudinary image uploads

The project is intentionally structured so additional restaurant, reservation, and administrative functionality can be added as the application evolves.

---

# 🔮 Potential Future Improvements

Possible future extensions include:

* Individual physical table management
* Waitlist functionality
* Email/SMS reservation notifications
* Calendar integrations
* Restaurant reviews and ratings submitted by users
* Advanced restaurant analytics
* Reservation reminders
* Payment/deposit support
* More granular restaurant staff roles
* Pagination for large restaurant/booking datasets
* Advanced concurrency protection for high-demand slots
* Automated test suites
* API documentation with OpenAPI/Swagger
* Improved centralized validation and error handling

---

# 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

### Recommended workflow

```text
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test the client and server
5. Commit your changes
6. Push the branch
7. Open a Pull Request
```

Example:

```bash
git checkout -b feature/your-feature
git add .
git commit -m "feat: add your feature"
git push origin feature/your-feature
```

---

# 📄 License

This project is currently distributed under the **ISC License** as specified by the server package configuration.

---

# 👨‍💻 Author

**Shaurya Jha**

Full-Stack / MERN Developer

* GitHub: `Shaurya-Jha007`

---

## ⭐ QuickDine at a Glance

| Area              | Implementation                 |
| ----------------- | ------------------------------ |
| Frontend          | React + TypeScript + Vite      |
| Backend           | Node.js + Express + TypeScript |
| Database          | MongoDB + Mongoose             |
| Authentication    | JWT                            |
| Password Security | bcrypt                         |
| Image Storage     | Cloudinary                     |
| File Uploads      | Multer                         |
| Routing           | React Router                   |
| HTTP Client       | Axios                          |
| Styling           | Tailwind CSS                   |
| Notifications     | React Hot Toast                |
| Icons             | Lucide React                   |
| Deployment        | Vercel                         |
| Architecture      | Client / REST API / Database   |

---

## 🌟 Project Highlights

QuickDine demonstrates a complete full-stack workflow covering:

```text
Authentication
      +
Role-Based Authorization
      +
Restaurant Discovery
      +
Search & Filtering
      +
Dynamic Availability
      +
Reservation Management
      +
Restaurant Onboarding
      +
Admin Moderation
      +
Cloud Image Uploads
      +
MongoDB Persistence
      +
Separate Frontend / Backend Deployment
```

The project is designed as a practical demonstration of building and deploying a role-based MERN application with multiple user workflows and real-world reservation logic.
