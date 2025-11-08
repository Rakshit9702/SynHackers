# VNIT Guest House Booking and Approval Management System

A comprehensive digital portal for VNIT that digitizes and automates the entire Guest House booking and approval workflow. This system ensures end-to-end transparency, from booking requests to approval and payment, while maintaining role-based access for students, faculty advisors, and administrators.

## Features

### 🎓 Student Portal
- Secure login through VNIT student credentials
- View available Guest Houses (Boys', Girls', and General)
- Submit booking requests with dates, purpose, and room selection
- Real-time booking status tracking (Pending, Approved, Rejected, Paid)
- Automatic payment gateway activation upon approval
- Download digital receipts and booking confirmations

### 👨‍🏫 Faculty Advisor Portal
- Secure login using faculty credentials
- View and verify booking requests from students
- Approve or reject requests with remarks
- Trigger payment links upon approval
- Access booking history and status logs

### 👨‍💼 Admin Panel
- View all bookings across all hostels
- Manage room inventory (add, update, delete rooms)
- Monitor faculty approvals, student payments, and room allocations
- Generate analytics reports on guest house utilization and request patterns

## Technology Stack

- **Backend**: Node.js + Express
- **Frontend**: React.js
- **Authentication**: JWT (JSON Web Tokens)
- **Data Storage**: JSON files (No database installation required!)
- **Payment**: Mock payment gateway (easily replaceable with real gateway)

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Setup Steps

1. **Clone or navigate to the project directory**
   ```bash
   cd cursortry
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Initialize default users** (Optional - users are auto-created on first run)
   ```bash
   node server/scripts/initUsers.js
   ```

5. **Start the development servers**

   Option 1: Run both servers simultaneously
   ```bash
   npm run dev
   ```

   Option 2: Run separately
   ```bash
   # Terminal 1 - Backend
   npm run server

   # Terminal 2 - Frontend
   npm run client
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Default Login Credentials

The system comes with pre-configured demo accounts:

| Role | Email | Password |
|------|-------|----------|
| Student | student@vnit.ac.in | student123 |
| Faculty | faculty@vnit.ac.in | faculty123 |
| Admin | admin@vnit.ac.in | admin123 |

## Project Structure

```
cursortry/
├── server/
│   ├── data/              # JSON data files (auto-created)
│   │   ├── users.json
│   │   ├── bookings.json
│   │   ├── rooms.json
│   │   └── payments.json
│   ├── middleware/        # Authentication middleware
│   ├── routes/            # API routes
│   ├── utils/             # Storage utilities
│   ├── scripts/           # Utility scripts
│   └── index.js           # Server entry point
├── client/
│   ├── src/
│   │   ├── components/   # React components
│   │   │   ├── Student/
│   │   │   ├── Faculty/
│   │   │   └── Admin/
│   │   ├── context/       # React context (Auth)
│   │   └── App.js         # Main app component
│   └── public/
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register new user (for setup)

### Student Routes
- `GET /api/student/rooms` - Get available rooms
- `GET /api/student/bookings` - Get student's bookings
- `POST /api/student/bookings` - Create booking request
- `GET /api/student/bookings/:id` - Get booking details

### Faculty Routes
- `GET /api/faculty/bookings/pending` - Get pending bookings
- `GET /api/faculty/bookings` - Get all bookings
- `POST /api/faculty/bookings/:id/approve` - Approve booking
- `POST /api/faculty/bookings/:id/reject` - Reject booking

### Admin Routes
- `GET /api/admin/bookings` - Get all bookings
- `GET /api/admin/rooms` - Get all rooms
- `POST /api/admin/rooms` - Add new room
- `PUT /api/admin/rooms/:id` - Update room
- `DELETE /api/admin/rooms/:id` - Delete room
- `GET /api/admin/analytics` - Get analytics data

### Payment Routes
- `POST /api/payments/initiate` - Initiate payment
- `POST /api/payments/process/:paymentId` - Process payment
- `GET /api/payments/:paymentId` - Get payment details
- `GET /api/payments/:paymentId/receipt` - Get receipt

## Data Storage

The system uses JSON files for data storage (no database required!):
- **users.json**: User accounts (students, faculty, admins)
- **bookings.json**: All booking requests and their status
- **rooms.json**: Room inventory and availability
- **payments.json**: Payment records and transactions

All data files are automatically created in `server/data/` directory on first run.

## Customization

### Adding Real Payment Gateway

Replace the mock payment in `server/routes/payments.js` with your preferred payment gateway (Razorpay, Stripe, etc.):

```javascript
// Example: Razorpay integration
const razorpay = require('razorpay');
// ... implement real payment logic
```

### Adding More Guest Houses

Rooms can be added through the Admin Panel or by editing `server/data/rooms.json` directly.

### Customizing User Roles

Modify the authentication middleware in `server/middleware/auth.js` to add custom roles or permissions.

## Development

### Running in Development Mode
```bash
npm run dev
```

### Running Backend Only
```bash
npm run server
```

### Running Frontend Only
```bash
cd client
npm start
```

## Production Deployment

1. Build the React app:
   ```bash
   cd client
   npm run build
   cd ..
   ```

2. Set environment variables:
   ```bash
   NODE_ENV=production
   PORT=5000
   JWT_SECRET=your_secret_key_here
   ```

3. Start the server:
   ```bash
   npm start
   ```

## Security Notes

- Change the JWT_SECRET in production
- Implement rate limiting for API endpoints
- Add input validation and sanitization
- Use HTTPS in production
- Regularly backup the JSON data files

## Troubleshooting

### Port Already in Use
If port 5000 is in use, change it in `server/index.js` or set `PORT` environment variable.

### Data Not Persisting
Ensure the `server/data/` directory exists and has write permissions.

### CORS Issues
CORS is enabled for development. Adjust CORS settings in `server/index.js` for production.

## License

This project is developed for VNIT (Visvesvaraya National Institute of Technology).

## Support

For issues or questions, please contact the development team.

---

**Note**: This system uses JSON file storage for simplicity and requires no database installation. For production use with high traffic, consider migrating to a proper database system.

