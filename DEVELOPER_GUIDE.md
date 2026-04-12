# BookPool — Developer & System Description

**By Jaiden Lo, Allan Zheng and Cooper Ross**

---

## Overview

BookPool is a full-stack MERN web application (MongoDB, Express, React, Node.js) that functions as a virtual library. Users can list books for borrowing, borrow and return books, join a waiting queue, and participate in per-book discussion threads. The application runs fully containerized using Docker Compose.

---

## Tech Stack

- **Frontend:** React (Vite), HTML5, CSS, JavaScript
- **Backend:** Node.js, Express
- **Database:** MongoDB Atlas
- **Containerization:** Docker Compose
- **Testing:** Vitest

---

## Getting Started

### Prerequisites

- Docker Desktop
- Node.js 18+
- MongoDB Atlas account

### Installation

1. Clone the repo
   ```bash
   git clone https://github.com/JaidenLo/COSC360-Team-22-Project.git
   cd COSC360-Team-22-Project
   git checkout development
   ```

2. Create your `.env` file
   ```bash
   cp .env.example .env
   ```

3. Run with Docker
   ```bash
   docker compose up --build
   ```

### Environment Variables

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/bookpool
PORT=5000
NODE_ENV=development
```

---

## File Structure

```
COSC360-Team-22-Project/
├── client/                  # React frontend (Vite)
│   └── src/
│       ├── pages/           # Route-level views (Home, Threads, Profile, etc.)
│       ├── components/      # Reusable UI components (Nav, Footer, BookCard)
│       └── tests/           # Vitest unit tests
├── server/                  # Express backend
│   ├── controllers/         # Business logic (bookController, threadController, userController)
│   ├── models/              # MongoDB schemas (Book, Thread, User)
│   ├── routes/              # HTTP endpoint mapping
│   └── middleware/          # Input validation (validate.js)
├── docker-compose.yml
└── .env.example
```

---

## How the Application Works

### Authentication
- User state is stored in `localStorage` as a JSON object after login and registration
- `App.jsx` reads this on load and passes it down as a `user` prop
- Two route guards are used:
  - `ProtectedRoute` — any logged in user
  - `AdminRoute` — admin only
- Passwords are hashed with bcrypt before being stored in MongoDB

### Book Borrowing and Queues
- When a user borrows a book, `borrowed` is set to `true` and `borrowedBy` is set to the user's ID
- If a book is already borrowed, users can join a `queue` array on the book document
- When returned, the server shifts the first user from the queue and sets a `reservedFor` object with a 24-hour expiry
- Only the reserved user can borrow the book during that timeframe
- The home page polls every 5 seconds to reflect changes made by other users without a page refresh

### Images
- Profile images and book cover images are stored as base64-encoded strings in MongoDB
- Images are converted to base64 on the frontend and sent as part of the JSON body
- Maximum image size is 2MB per field

### Discussion Threads
- Threads are stored in a separate `Thread` collection, each linked to a `bookId`
- The thread page polls every 5 seconds for new posts
- Every post shows username, date/time, and profile picture
- Users can delete their own posts — admins can delete any post
- If a book is deleted, its threads are also deleted

### Sorting and Filtering
- Books can be filtered by category instantly without clicking Search
- Books can be sorted by newest, hottest (thread count), and availability
- The polling interval pauses when a filter is active to avoid overwriting the user's filtered view

---

## Features Implemented

- User registration and login with bcrypt password hashing
- Profile picture upload at registration and from the profile page
- Book CRUD with image upload and category filtering
- Instant category filter without needing to press Search
- Book search by title and description
- Sort books by newest, hottest (thread count), or available first
- Borrow and return system with a waiting queue and 24-hour reservation
- Per-book discussion threads with 5-second async polling
- Collapsible thread posts (hide/show without page reload)
- Breadcrumb navigation in threads linking back to the book modal
- Inline success and error alerts on AddBook and Threads pages
- Admin dashboard with usage charts (Recharts)
- Admin user search and deletion
- Admin ability to delete any thread post
- Admin ability to edit any book
- Responsive layout (3 columns desktop, 2 tablet, 1 mobile)
- Frontend and server-side input validation
- Docker Compose setup for single-command deployment
- Vitest unit tests for validation logic, home helpers, and thread helpers

---

## Running Tests

Tests must be run locally outside Docker using Vitest.

```bash
cd client
npm install
npx vitest run
```

Tests cover:
- Login and registration validation
- Homepage book ownership and queue membership
- Thread delete permissions, empty post detection, and fetch call mocking

---

## Known Limitations

- Profile pictures and book images are stored as base64 strings in MongoDB — limits image size and may affect performance at scale
- Admins can delete users but cannot temporarily suspend them
- Queue reservation expiry is only cleared on the next borrow attempt, not enforced automatically by the server
- Thread posts do not support editing, only deletion
- Polling pauses when filters are active — live updates will not appear while a category filter is applied
