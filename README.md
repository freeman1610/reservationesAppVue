***

## Vue.js Frontend Project README

```markdown
# Reservations App (Vue Frontend)

This is a Single Page Application (SPA) built with Vue 3 that serves as the user interface for the Reservations API. It uses Vite for the build tooling, Pinia for state management, and Vue Router for navigation.

## Features

* **Responsive UI:** Styled with Bootstrap 5 for a clean and responsive user experience.
* **Role-Based Views:** Dynamically shows and hides UI elements (like admin dashboards) based on user roles.
* **State Management:** Centralized state management with Pinia for a predictable data flow.
* **Component-Based:** Built with reusable Vue components for maintainability.

## Prerequisites

* Node.js (LTS version recommended)
* npm (comes with Node.js)
* The Laravel backend project must be running (https://github.com/freeman1610/reservationesApp).

## Installation & Setup

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/freeman1610/reservationesApp.git
    cd reservationesappvue
    ```

2.  **Install Dependencies**
    Install the required Node.js packages.
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the root of the project. This file will tell your Vue app where to find the Laravel API.
    ```bash
    cp .env.example .env
    ```
    Open the newly created `.env` file and ensure the `VITE_API_BASE_URL` points to your running Laravel backend's API endpoint.
    ```env
    VITE_API_BASE_URL=http://localhost:8000/api
    ```

4.  **Run the Development Server**
    This command starts the Vite development server with hot-reloading enabled.
    ```bash
    npm run dev
    ```

The application will now be running and accessible at `http://localhost:5173` (or another port if 5173 is in use). You can now log in using the credentials from the Laravel backend (`admin@example.com` or `user@example.com`).