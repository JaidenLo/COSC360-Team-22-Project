# COSC360 Team 22 Project

A full-stack web application built with the MERN stack.

## Tech Stack
- **Frontend:** React, HTML5, CSS, JavaScript
- **Backend:** Node.js, Express
- **Database:** MongoDB Atlas
- **Containerization:** Docker

## Getting Started

### Prerequisites
- Docker Desktop
- Node.js 18+
- MongoDB Atlas account

### Installation
1. Clone the repo
   git clone https://github.com/JaidenLo/COSC360-Team-22-Project.git

2. Run with Docker
   docker compose up --build

---

# BookPool User Guide
By Jaiden Lo, Allan Zheng and Cooper Ross

## Overview

BookPool is a virtual library web application where users can share, borrow, and discuss books. This guide walks through the key features of the site and how to test them.

Site URL: http://localhost:5173
Admin credentials: AdminUser1@gmail.com / AdminUser1 (email:password)
Example user credentials: user7@example.com / 12345

## How to get run site

Pull project from github, branch should be development
Have docker open
In root branch of project, run docker compose up --build
Site should boot up and be available at http://localhost:5173

## Walkthrough

When the user first gets on the website, they can access the list of books from a guest view, they cannot borrow or view threads and can only look at their details. The guest user can also search in the bar or by categories.

### Registration
Press the Register button on the top right or go to http://localhost:5173/register
Fill out all the fields, it is optional to upload a profile image.
If you are missing a field, ie password, city, it will return a warning to fill it in.
User's password must be 5 characters or more and include a number
The confirmed password must be the same as the first typed password.
Click Submit & Login and you will automatically be logged in and redirected to your profile.

### Login
If you decide to log out, you can log back in by entering your email and password
Click submit & login to reenter your profile page.

### Browsing & Searching Books
Navigate to http://localhost:5173/home
Books are displayed in a 3-column grid
Use the search bar to search by title or description and press Search
Use the category dropdown to filter by genre, books filter automatically without pressing Search
Use the Sort dropdown to sort by Newest, Hottest (most thread posts), or Available First (not borrowed)
Click Clear to reset all filters

### Viewing a Book and Borrowing
Click on any book card to open the book details
The modal shows the title, category, description, and borrow status
If the book is available, click "Borrow Book" to borrow it
If the book is already borrowed, click Join Queue to join a queue for when it becomes available
Once in the queue, the button changes to Leave Queue, if the book is returned, A pop up will say the book is reserved for 24 hours for you to borrow.
Press escape or click outside the modal to close it

### Return a Book
Navigate to your profile at the top right or http://localhost:5173/profile
Under borrowed books, find the book your borrowed
Click "Return Book"
The book is returned and the next person in queue can borrow it.

### Adding a Book
Navigate to http://localhost:5173/add-book (must be logged in)
Fill in the book's details and optionally add a cover image
Click Add Book, an alert will pop up and redirect you Home

### Discussion Threads
Open any book modal and click View Threads
You are taken to the discussion page for that book
The breadcrumb at the top shows: Home > Book Title > Discussion
Click the book title in the breadcrumb to return to Home with the modal already open
Type a reply in the text area and click Post - a green success alert appears
Each post shows the user's profile picture, username, and timestamp
Click Hide on any post to collapse it without reloading; click Show to expand it again
Users can delete their own posts using the trash icon on the right of each post

### User Profile
Navigate to http://localhost:5173/profile
Your profile displays your username, email, city, profile picture, and About Me section
Click Upload Image to update your profile picture
Click Edit Profile to update your username, email, city, password, or About Me
The profile also shows:
Books you have listed for borrowing
Books you currently have borrowed
Your active thread posts (click any to go to that thread)

## Admin Features

### Admin dashboard
Click the Dashboard tag on the profile page to go to the admin dashboard
The dashboard shows site usage charts including total users, books, threads, and activity over time

### Search users
On the profile page, scroll to the Search Users section
Search by username to find and delete users
You can also just press the Search button to show all users.

### Delete any post
As admin, the trash icon delete button appears on every thread post, not just your own

### Edit or delete any book
As admin, the Edit Book button appears in every book modal

## Unique Features

- Borrowing queue - users join a waiting list for borrowed books and receive a 24-hour reservation window when the book becomes available
- Async polling - the home page and threads page refresh automatically every 5 seconds so changes made by other users appear without a page refresh
- Breadcrumb navigation - clicking the book title in the thread breadcrumb reopens the book modal on the home page
- Collapsible threads - posts can be hidden and shown without reloading the page
- Inline alerts - success and error messages appear directly on the page without pop-ups
- Hot sorting - books can be sorted by number of thread posts to find the most discussed books
- Auto category filter - selecting a category instantly filters books without needing to press Search
- Admin Dashboard - seeing metrics regarding the website

---

# BookPool Developer and System Description
By Jaiden Lo, Allen Zhang, Cooper Ross

## Overview
BookPool is a full-stack MERN web application (MongoDB, Express, React, Node.js) that functions as a virtual library. Users can list books for borrowing, borrow and return books, join a waiting queue, and participate in per-book discussion threads. The application runs fully containerized using Docker Compose.

## File Structure
The project is split into two top-level folders: client and server, with a docker-compose.yml and .env file at the root.

The client folder contains the React frontend built with Vite. All source files live under src/, which is divided into pages/ and components/. Pages are full route-level views such as Home, Threads, Profile, etc.. Components are reusable pieces used across pages, such as Nav, Footer, BookCard. Each page and component has a corresponding CSS file. A tests/ folder contains the Vitest unit test files. App.jsx handles all routing and defines the ProtectedRoute and AdminRoute guards.

The server folder contains the Express backend. Controllers handle the business logic and are split into bookController.js, threadController.js, and userController.js. Models define the MongoDB schemas for Book, Thread, and User. Routes map HTTP endpoints to controller functions. A middleware folder contains validate.js which handles server-side input validation before requests reach the controllers.

## How the Application Works

### Authentication & States
User state is stored in localStorage as a JSON object after login and registration. App.jsx reads this on load and passes it down as a user prop. Two route guards are used. ProtectedRoute (any logged in user) and AdminRoute (admin only). Passwords are hashed with bcrypt before being stored in MongoDB

### Book Borrowing and Queues
When a user borrows a book, the borrowed field is set to true and borrowedBy is set to the user's ID. If a book is already borrowed, other users can join a queue array on the book document. When the book is returned, the server automatically shifts the first user from the queue and sets a reservedFor object with a 24 hour expiry to claim. Only the reserved user can borrow the book during that timeframe. The home page automatically polls every 5 seconds to reflect changes made by other users without a page refresh making it asynchronous.

### Images
User profile images and book cover images are stored as base64-encoded strings directly into MongoDB. On registration, the image is converted to base64 on the frontend and sent as part of the JSON body. Profile images can be updated from the profile page at any time. The maximum image size for each field is 2mb.

### Discussion Threads
Threads are stored in a separate Thread collection, each linked to a bookId. The thread page polls every 5 seconds for new posts. Every new thread shows the username, date/time posted, and profile picture. Users can delete their own posts and admins can delete any post. If a book is deleted, the threads on that are also deleted and no longer show up on your profile.

### Sorting and Filtering
Books can be filtered by category using a dropdown that triggers instantly without clicking the search button. Books can also be sorted by newest, hottest (threads #) and availability. The pollen interval pauses when a filter is active to avoid overwriting a user's filtered view.

### Admin
Admin users have access to the admin dashboard with Recharts charts and can delete users, delete any thread posts, and edit any book. The admin role can be set directly from the database.

## Features Implemented

User registration and login with bcrypt password hashing
Profile picture upload at registration and from the profile page
Book CRUD with image upload and category filtering
Instant category filter without needing to press Search
Book search by title and description
Sort books by newest, hottest (thread count), or available first
Borrow and return system with a waiting queue and 24-hour reservation
Per-book discussion threads with 5-second async polling
Collapsible thread posts (hide/show without page reload)
Breadcrumb navigation in threads linking back to the book modal
Inline success and error alerts on AddBook and Threads pages
Admin dashboard with usage charts (Recharts)
Admin user search and deletion
Admin ability to delete any thread post
Admin ability to edit any book
Responsive layout (3 columns on desktop, 2 on tablet, 1 on mobile)
Frontend and server-side input validation
Docker Compose setup for single-command deployment
Test unit tests for validation logic, home helpers, and thread helpers

## Known Limitations

Profile pictures and book images are stored as base64 strings in MongoDB rather than a dedicated file storage service, which limits image size and may affect performance at scale.
The admin enable/disable user feature is not implemented — admins can delete users but cannot temporarily suspend them.
The borrowing queue reservation expiry is not automatically enforced on the server — expired reservations are only cleared when the next borrow attempt is made.
Thread posts do not support editing, only deletion.
The polling interval pauses when filters are active, meaning live updates will not appear while a category filter is applied.

## Testing
Project uses Vitest for frontend unit testing located at client/src/tests and covers validation of login/registration, Homepage book ownership, queue membership etc, and threads test that test thread delete permissions, empty post detection and fetch call mocking for post and delete operations.

These tests must be ran locally outside of Docker using Vitest.
To run:
Cd client
Npm install
Npx vitest run