# Setup Guide

## Quick Start

### 1. Install MongoDB

Make sure MongoDB is installed and running on your system. You can:
- Install MongoDB locally: https://www.mongodb.com/try/download/community
- Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with your credentials:

```
PORT=5000
MONGODB_URI=MONGODB_URI
JWT_SECRET=JWT_Secret
NODE_ENV=development
```

**Note:** See `backend/CONFIG.md` for the exact configuration values.

Start the backend:
```bash
npm run dev
```

### 3. Frontend Setup

Open a new terminal:
```bash
cd frontend
npm install
```

Start the frontend:
```bash
npm start
```

### 4. Access the App

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## First Time Setup

1. Register a new account at http://localhost:3000/register
2. Login with your credentials
3. Start tracking your fitness journey!

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running: `mongod` (or start MongoDB service)
- Check your MONGODB_URI in `.env` file
- For MongoDB Atlas, use the connection string provided

### Port Already in Use
- Change PORT in backend `.env` file
- Or kill the process using the port

### CORS Errors
- Make sure backend is running on port 5000
- Check REACT_APP_API_URL in frontend `.env` (optional, defaults to http://localhost:5000/api)

