# Quick Start Guide

## 🚀 Getting Started in 3 Steps

### Step 1: Install Dependencies
```bash
npm install
cd client
npm install
cd ..
```

### Step 2: Start the Application
```bash
npm run dev
```

This will start both the backend (port 5000) and frontend (port 3000) servers.

### Step 3: Login
Open http://localhost:3000 in your browser and use these credentials:

**Student Account:**
- Email: `student@vnit.ac.in`
- Password: `student123`

**Faculty Account:**
- Email: `faculty@vnit.ac.in`
- Password: `faculty123`

**Admin Account:**
- Email: `admin@vnit.ac.in`
- Password: `admin123`

## 📋 Workflow Example

1. **Login as Student** → Create a booking request
2. **Login as Faculty** → Approve the booking
3. **Login as Student** → Complete payment
4. **Login as Admin** → View analytics and manage rooms

## 📁 Data Storage

All data is stored in JSON files in `server/data/`:
- No database installation needed!
- Data persists between server restarts
- Easy to backup (just copy the data folder)

## 🛠️ Troubleshooting

**Port already in use?**
- Change PORT in `server/index.js` or set environment variable

**Can't login?**
- Default users are auto-created on first server start
- Check `server/data/users.json` exists

**Data not saving?**
- Ensure `server/data/` directory has write permissions

## 📝 Notes

- The payment system is a mock/demo. Replace with real payment gateway for production.
- All data is stored locally in JSON files - perfect for development and small deployments.
- For production with high traffic, consider migrating to a database.

