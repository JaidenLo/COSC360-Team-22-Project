# BookPool User Guide

**By Jaiden Lo, Allan Zheng and Cooper Ross**

---

## Overview

BookPool is a virtual library web application where users can share, borrow, and discuss books.

**Site URL:** http://localhost:5173

| Role  | Email | Password |
|-------|-------|----------|
| Admin | AdminUser1@gmail.com | AdminUser1 |
| User  | user7@example.com | 12345 |

---

## How to Run

1. Pull the project from GitHub — branch should be `development`
2. Open Docker Desktop
3. In the root of the project, run:
   ```bash
   docker compose up --build
   ```
4. Site is available at http://localhost:5173

---

## Walkthrough

### Guest View
When first visiting the site, guests can browse the book list, search by title or category, and view book details. Guests cannot borrow books or view threads.

### Registration
1. Press **Register** on the top right or go to http://localhost:5173/register
2. Fill out all fields — profile image is optional
3. Password must be 5+ characters and include a number
4. Confirmed password must match the first password
5. Click **Submit & Login** — you will be automatically logged in and redirected to your profile

### Login
1. Enter your email and password
2. Click **Submit & Login** to return to your profile

---

## Browsing & Searching Books

- Navigate to http://localhost:5173/home
- Books are displayed in a 3-column grid
- Use the **search bar** to search by title or description and press Search
- Use the **category dropdown** to filter by genre — books filter automatically without pressing Search
- Use the **Sort dropdown** to sort by Newest, Hottest (most thread posts), or Available First
- Click **Clear** to reset all filters

---

## Viewing a Book and Borrowing

1. Click any book card to open the book details modal
2. The modal shows title, category, description, and borrow status
3. If available — click **Borrow Book**
4. If already borrowed — click **Join Queue** to join the waiting list
5. Once in the queue the button changes to **Leave Queue**
6. When the book is returned, a pop-up confirms a 24-hour reservation window for you to borrow
7. Press Escape or click outside the modal to close it

---

## Returning a Book

1. Navigate to your profile at http://localhost:5173/profile
2. Under **Borrowed Books**, find the book you borrowed
3. Click **Return Book**
4. The book is returned and the next person in queue is notified

---

## Adding a Book

1. Navigate to http://localhost:5173/add-book (must be logged in)
2. Fill in the book details and optionally add a cover image
3. Click **Add Book** — an alert will appear and redirect you to Home

---

## Discussion Threads

- Open any book modal and click **View Threads**
- You are taken to the discussion page for that book
- The breadcrumb at the top shows: Home > Book Title > Discussion
- Click the book title in the breadcrumb to return to Home with the modal already open
- Type a reply in the text area and click **Post** — a green success alert appears
- Each post shows the user's profile picture, username, and timestamp
- Click **Hide** on any post to collapse it without reloading — click **Show** to expand
- Users can delete their own posts using the trash icon

---

## User Profile

- Navigate to http://localhost:5173/profile
- Your profile displays username, email, city, profile picture, and About Me section
- Click **Upload Image** to update your profile picture
- Click **Edit Profile** to update username, email, city, password, or About Me
- The profile also shows:
  - Books you have listed for borrowing
  - Books you currently have borrowed
  - Your active thread posts (click any to go to that thread)

---

## Admin Features

### Admin Dashboard
- Click the **Dashboard** tag on the profile page
- The dashboard shows site usage charts including total users, books, threads, and activity over time

### Search Users
- On the profile page, scroll to the **Search Users** section
- Search by username to find and delete users
- Press Search with no input to show all users

### Delete Any Post
- As admin, the trash icon appears on every thread post, not just your own

### Edit or Delete Any Book
- As admin, the **Edit Book** button appears in every book modal

---

## Unique Features

| Feature | Description |
|---------|-------------|
| Borrowing queue | Users join a waiting list and receive a 24-hour reservation when a book becomes available |
| Async polling | Home page and threads refresh every 5 seconds automatically |
| Breadcrumb navigation | Clicking the book title in threads reopens the book modal on the home page |
| Collapsible threads | Posts can be hidden and shown without reloading |
| Inline alerts | Success and error messages appear directly on the page |
| Hot sorting | Sort books by number of thread posts |
| Auto category filter | Selecting a category instantly filters books |
| Admin Dashboard | Charts showing site metrics |
