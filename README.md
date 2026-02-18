# 🚗 Nova Transport - Full Stack Ride Hailing Application

A comprehensive, feature-rich Nova Transport ride-hailing app built with React.js and Node.js. This application includes all the essential features of a modern ride-hailing platform.

## ✨ Features

### 🚕 Passenger App
- ✅ User Registration & Authentication
- ✅ **Google OAuth Sign-In**
- ✅ Real-time Ride Booking
- ✅ Multiple Vehicle Types (Economy, Premium, SUV, Bike)
- ✅ Fare Estimation
- ✅ Real-Time Ride Tracking
- ✅ Multiple Payment Methods (Cash, Card, Wallet)
- ✅ Ride History
- ✅ Driver Ratings & Reviews
- ✅ Live Driver Location Updates

### 🚙 Driver App
- ✅ Driver Registration with Vehicle Details
- ✅ Online/Offline Toggle
- ✅ Real-time Ride Requests
- ✅ Accept/Reject Ride Requests
- ✅ Navigation & Route Tracking
- ✅ Earnings Tracker
- ✅ Ride History
- ✅ Passenger Ratings
- ✅ Live Location Broadcasting

### 🎯 Core Features
- ✅ Real-time Communication (Socket.io)
- ✅ JWT Authentication
- ✅ Role-based Access Control
- ✅ Geospatial Queries (MongoDB)
- ✅ Fare Calculation Engine
- ✅ Payment Integration Ready (Stripe)
- ✅ Responsive Design
- ✅ Modern UI/UX with Animations

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI Library
- **React Router** - Navigation
- **Axios** - HTTP Client
- **Socket.io Client** - Real-time Communication
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime
- **Express.js** - Web Framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.io** - Real-time Communication
- **JWT** - Authentication
- **Bcrypt** - Password Hashing
- **Stripe** - Payment Processing (Ready)

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the Repository
```bash
cd /home/minister/Documents/PROJECTS/taxi/uber
```

### 2. Install Backend Dependencies
```bash
cd server
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../client
npm install
```

### 4. Configure Environment Variables

#### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/uber-clone
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 5. Start MongoDB
```bash
# If using local MongoDB
mongod
```

### 6. Run the Application

#### Terminal 1 - Backend
```bash
cd server
npm run dev
```

#### Terminal 2 - Frontend
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 🎮 Usage

### Demo Accounts

You can create new accounts or use these demo credentials:

**Passenger Account:**
- Email: passenger@demo.com
- Password: password123

**Driver Account:**
- Email: driver@demo.com
- Password: password123

### Booking a Ride (Passenger)
1. Register/Login as a passenger
2. Enter pickup and dropoff locations
3. Select vehicle type
4. Choose payment method
5. Get fare estimate
6. Book the ride
7. Wait for driver acceptance
8. Track ride in real-time
9. Rate the driver after completion

### Accepting Rides (Driver)
1. Register/Login as a driver
2. Toggle availability to "Online"
3. Wait for ride requests
4. Accept incoming requests
5. Update ride status (Arrived → Started → Completed)
6. View earnings and ride history

## 📁 Project Structure

```
uber-clone/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React Context (Auth)
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── utils/         # Utility functions
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                # Node.js Backend
│   ├── src/
│   │   ├── config/       # Configuration files
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # Custom middleware
│   │   ├── models/       # MongoDB models
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   └── server.js     # Entry point
│   └── package.json
│
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updateprofile` - Update profile
- `PUT /api/auth/updatepassword` - Update password

### Rides
- `POST /api/rides` - Create ride request
- `GET /api/rides/active` - Get active ride
- `GET /api/rides/history` - Get ride history
- `GET /api/rides/:id` - Get single ride
- `PUT /api/rides/:id/accept` - Accept ride (Driver)
- `PUT /api/rides/:id/status` - Update ride status
- `PUT /api/rides/:id/cancel` - Cancel ride
- `POST /api/rides/:id/rate` - Rate ride
- `POST /api/rides/nearby-drivers` - Find nearby drivers

### Driver
- `PUT /api/drivers/location` - Update driver location
- `PUT /api/drivers/availability` - Toggle availability
- `PUT /api/drivers/profile` - Update driver profile
- `GET /api/drivers/earnings` - Get earnings
- `POST /api/drivers/documents` - Upload documents

## 🔄 Real-time Events (Socket.io)

### Client → Server
- `join` - Join user room
- `updateLocation` - Update driver location
- `newRideRequest` - New ride request
- `sendMessage` - Send chat message

### Server → Client
- `rideAccepted` - Ride accepted by driver
- `rideStatusUpdated` - Ride status changed
- `rideCancelled` - Ride cancelled
- `driverLocationUpdate` - Driver location updated
- `newRideRequest` - New ride request (for drivers)

## 🎨 Design Features

- Modern gradient backgrounds
- Smooth animations and transitions
- Glassmorphism effects
- Responsive design for all devices
- Dark mode ready
- Premium UI components
- Micro-interactions

## 🚀 Deployment

### Backend (Heroku/Railway/DigitalOcean)
1. Set environment variables
2. Deploy using Git or Docker
3. Ensure MongoDB connection

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Set environment variables

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Role-based access control
- Input validation
- CORS configuration
- Helmet.js security headers

## 📝 Future Enhancements

- [ ] Google Maps Integration
- [ ] Stripe Payment Integration
- [ ] Push Notifications
- [ ] Email Notifications
- [ ] Admin Dashboard
- [ ] Ride Scheduling
- [ ] Promo Codes & Discounts
- [ ] Multi-language Support
- [ ] Driver Document Verification
- [ ] In-app Chat
- [ ] SOS/Emergency Button
- [ ] Ride Sharing
- [ ] Analytics Dashboard

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ by the development team

## 🙏 Acknowledgments

- Inspired by Uber's ride-hailing platform
- Icons by Lucide React
- Fonts by Google Fonts

---

**Note:** This is a demo application for educational purposes. For production use, ensure proper security measures, payment gateway integration, and compliance with local regulations.
# Nova Transport
