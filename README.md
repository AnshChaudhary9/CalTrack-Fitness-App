# Fitness Tracking Web App

A comprehensive full-stack fitness tracking application built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

### Core Features
- ✅ **User Authentication** - JWT-based authentication with password hashing
- ✅ **Dashboard** - Personalized stats with motivational quotes
- ✅ **Workout Tracker** - CRUD operations with filtering and sorting
- ✅ **Diet Log** - Track meals with macronutrients and daily summaries
- ✅ **Progress Graphs** - Visualize progress with Recharts
- ✅ **Goals Module** - Set and track fitness goals with progress bars
- ✅ **BMI Calculator** - Calculate and track BMI
- ✅ **Calendar Integration** - View workouts and meals on calendar
- ✅ **Community Leaderboard** - Compare with other users
- ✅ **Calorie Tracker** - Track calories consumed vs burned
- ✅ **Dark Mode** - Toggle between light and dark themes

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

### Frontend
- React 18
- React Router
- Recharts for data visualization
- React Calendar
- Tailwind CSS (via CDN)
- Axios for API calls
- Context API for state management

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fitness-tracker
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory (optional):
```
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the frontend development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Project Structure

```
fitness-tracker/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── workoutController.js
│   │   ├── dietController.js
│   │   ├── goalController.js
│   │   └── leaderboardController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Workout.js
│   │   ├── Diet.js
│   │   └── Goal.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── workoutRoutes.js
│   │   ├── dietRoutes.js
│   │   ├── goalRoutes.js
│   │   └── leaderboardRoutes.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   └── ProtectedRoute.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Workouts.js
│   │   │   ├── Diet.js
│   │   │   ├── Goals.js
│   │   │   ├── Progress.js
│   │   │   ├── BMI.js
│   │   │   ├── Calendar.js
│   │   │   └── Leaderboard.js
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
│
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Workouts
- `GET /api/workouts` - Get all workouts (with filters)
- `GET /api/workouts/:id` - Get single workout
- `POST /api/workouts` - Create workout
- `PUT /api/workouts/:id` - Update workout
- `DELETE /api/workouts/:id` - Delete workout
- `GET /api/workouts/stats` - Get workout statistics

### Diet
- `GET /api/diet` - Get all diet entries (with filters)
- `GET /api/diet/:id` - Get single diet entry
- `POST /api/diet` - Create diet entry
- `PUT /api/diet/:id` - Update diet entry
- `DELETE /api/diet/:id` - Delete diet entry
- `GET /api/diet/summary` - Get daily calorie summary

### Goals
- `GET /api/goals` - Get all goals
- `GET /api/goals/:id` - Get single goal
- `POST /api/goals` - Create goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal

### Leaderboard
- `GET /api/leaderboard/workouts` - Get leaderboard by workouts
- `GET /api/leaderboard/calories` - Get leaderboard by calories

## Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Dashboard**: View your overall stats and motivational quotes
3. **Workouts**: Add, edit, and track your workouts
4. **Diet**: Log your meals and track macronutrients
5. **Goals**: Set fitness goals and track progress
6. **Progress**: View charts and graphs of your progress
7. **BMI**: Calculate and track your BMI
8. **Calendar**: View your workouts and meals on a calendar
9. **Leaderboard**: Compare your progress with other users

## Features in Detail

### Workout Tracker
- Filter by workout type (Cardio, Strength, Yoga, etc.)
- Sort by date or type
- Track duration and calories burned
- Add notes to workouts

### Diet Log
- Log meals by type (Breakfast, Lunch, Dinner, Snack)
- Track calories, protein, carbs, and fats
- View daily summaries
- Filter by date

### Progress Tracking
- Weekly calorie intake chart
- Workouts per week
- Weight vs time graph
- Daily calorie surplus/deficit visualization

### Goals
- Set goals with target values and dates
- Track progress with percentage bars
- Auto-complete when target is reached
- Filter by status (active, completed, cancelled)

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the MIT License.

