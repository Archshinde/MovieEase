# MoviEase - Movie Show Booking Application

## Introduction
MoviEase is a full-stack MERN application designed to simplify online movie ticket booking. It combines a powerful backend with an engaging and intuitive frontend to deliver a seamless user experience. Whether on desktop or mobile, users can easily browse movies, check showtimes, and book tickets with just a few clicks.

## Key Features
- **User Authentication**: Secure and efficient login and registration process.
- **Movie Listings**: Explore a wide range of movies with detailed information.
- **Show Timings**: Access and choose from available showtimes for each movie.
- **Booking System**: Reserve your seats and confirm ticket bookings effortlessly.
- **Payment Gateway**: Process payments securely via Stripe integration.
- **Responsive Design**: Enjoy a fully optimized experience across all devices.

## Technology Stack
### Frontend
- **React**: Core library for building a responsive and dynamic user interface.
- **Tailwind CSS**: Utility-first CSS framework for sleek and adaptable design.

### Backend
- **Express.js**: Fast, unopinionated framework for building the server-side logic.
- **Node.js**: JavaScript runtime for executing backend code.
- **Stripe**: Integration for secure and reliable payment processing.

## Getting Started
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Somen1228/MoviEase.git
   ```

2. **Install Dependencies**:
   ```bash
   # Backend dependencies
   cd Server
   npm install

   # Frontend dependencies
   cd Client/moviease-app
   npm install
   ```

3. **Environment Setup**:
   - In the `Server` directory, create a `.env` file with the necessary environment variables (e.g., `DATABASE_URI`, `STRIPE_KEY`, `PORT`, `SECRET_KEY`).
   - In the `Client/moviease-app` directory, create a `.env` file with your frontend environment variables (e.g., `VITE_API_URI`).

4. **Run the Application**:
   ```bash
   # Start the backend server
   cd Server
   npm start

   # Start the frontend development server
   cd Client/moviease-app
   npm run dev
   ```

## How to Use
- Sign up or log in to your account. You will need to verify your email during signup.
- Browse through the available movies and select your preferred showtime.
- Book your seats and proceed to payment through Stripe for a secure checkout.
- You can check all your bookings from the menu section from the top right Navbar button.

## Support
If you have any questions or need assistance, feel free to reach out at [somen1228@gmail.com](mailto:somen1228@gmail.com).

Link: https://moviease-app.onrender.com
