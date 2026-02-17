# Campus Resource Management System (Frontend)

A React-based frontend for the Campus Resource Management System. Interfaces with a Django REST Framework backend to manage Users, Resources, and Bookings.

## Tech Stack

- **React** (Vite)
- **React Router** (Routing)
- **Axios** (API requests)
- **React Toastify** (Notifications)
- **CSS** (Custom styling)

## Setup Instructions

1.  **Clone the repository** (if you haven't already).
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Setup**:
    Ensure `.env` exists with the correct API URL:
    ```
    VITE_API_BASE_URL=http://localhost:8000/api
    ```
4.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:5173`.

## Pages & Features

- **Dashboard**: Overview of total Users, Resources, and Bookings.
- **Users**:
    - List all users with status filtering.
    - Add new users (Student/Staff).
    - Edit and Delete users.
- **Resources**:
    - List all resources (Labs, Classrooms, Event Halls).
    - Add/Edit/Delete resources.
- **Bookings**:
    - List all bookings with status.
    - Create new bookings (handles double-booking conflicts).
    - Approve/Reject pending bookings.

## Error Handling

- **Toast Notifications**: Success and Error messages.
- **Form Validation**: Inline validation errors from backend.
- **Network Errors**: Alerts if backend is unreachable.
