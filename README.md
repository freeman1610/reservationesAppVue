Reservation System Project
This is a space reservation management system built with a Laravel 12 API and a Single Page Application (SPA) in Vue 3.
Architecture
Backend: RESTful API built with Laravel 12.
Frontend: Interactive application built with Vue 3, Vite, Pinia, and Vue Router.
Styling: Bootstrap 5.
1. Backend Setup (Laravel API)
Follow these steps to get the API server up and running.
Prerequisites
PHP >= 8.2
Composer
A database server (MySQL, MariaDB, etc.)
Git
Installation Steps
Clone the Repository
Navigate to your development directory and clone the project.
git clone <laravel-repository-url>
cd <laravel-project-name>


Install Dependencies
Install the PHP dependencies with Composer.
composer install


Configure the Environment
Copy the example .env.example file to create your own configuration file.
cp .env.example .env

Open the .env file and configure your database credentials:
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=reservations_db
DB_USERNAME=root
DB_PASSWORD=


Generate the Application Key
This is a crucial step for Laravel's security.
php artisan key:generate


Run Migrations and Seeders
This command will create the database structure and populate it with test data (users, spaces, and reservations).
php artisan migrate:fresh --seed

Test Credentials:
Admin: admin@example.com / password
User: user@example.com / password
Create the Storage Symlink
This step is essential for uploaded avatars to be publicly accessible.
php artisan storage:link


Start the Server
Your API is now ready to receive requests.
php artisan serve

By default, the API will be available at http://127.0.0.1:8000.
Running Tests
To ensure the entire backend is working correctly, you can run the integration tests. Laravel is configured to use an in-memory SQLite database for testing, which is fast and does not affect your main database.
Ensure you have the SQLite driver for PHP installed.
Run the following command:
php artisan test


2. Frontend Setup (Vue 3 SPA)
Follow these steps to get the user interface up and running.
Prerequisites
Node.js (LTS version recommended)
npm (installs with Node.js)
Installation Steps
Navigate to the Project Directory
Open a new terminal and navigate to your Vue project folder.
cd <vue-project-name>


Install Dependencies
Install all the necessary JavaScript libraries.
npm install


Configure the Environment
Create a .env file in the root of the Vue project and make sure it points to your Laravel API URL.
# .env
VITE_API_BASE_URL=http://127.0.0.1:8000/api


Start the Development Server
This command will compile the application and serve it on a local server with hot-reloading.
npm run dev

Your Vue application will typically be available at http://localhost:5173. Open this URL in your browser to see the login page.
