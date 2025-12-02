# Backend Configuration

## Environment Variables

Create a `.env` file in the `backend` directory with the following content:

```
PORT=5000
MONGODB_URI=mongodb+srv://{db_user}:{db_password}@cluster0.fzzeeap.mongodb.net/fitness-tracker?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=JWT_Secret
NODE_ENV=development
```

**Important:** The `.env` file is already in `.gitignore` and will not be committed to version control.

