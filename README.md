# Sahayak - Home Services Booking Platform

Sahayak is a home services booking platform built using **Next.js** and **MongoDB**, allowing users to find and book home services, providers to manage their jobs, and admins to oversee the platform.

## Features

### User Features
- Secure authentication (Login/Signup)
- Search and book home services (Cleaning, Plumbing, etc.)
- Track service status (Pending, Accepted, Completed)
- View booked services and assigned providers
- Leave reviews for completed services

### Provider Features
- View and accept available service requests
- Manage accepted and completed services
- Track earnings and generate PDF invoices
- Receive and respond to user reviews

### Admin Features
- Manage users, service providers, and bookings
- View platform analytics (Total users, providers, earnings)
- Monitor service requests and status
- Moderate user reviews

---

## Tech Stack

- **Frontend:** Next.js (React + SSR)
- **Backend:** Next.js API Routes
- **Database:** MongoDB (Mongoose ORM)
- **Authentication:** NextAuth.js
- **UI Framework:** Tailwind CSS
- **State Management:** React Context API
- **PDF Generation:** jsPDF

---

## Installation & Setup

### 1. Clone the Repository
```sh
git clone https://github.com/your-username/sahayak.git
cd sahayak
```

### 2. Install Dependencies
```sh
npm install
```

### 3. Set Up Environment Variables
Create a `.env.local` file in the root directory and add:
```env
MONGODB_URI=your-mongodb-connection-string
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

### 4. Run the Project
```sh
npm run dev
```
The app will be live at `http://localhost:3000`.

---

## Folder Structure
```
/sahayak
│── /pages
│   ├── index.js       # Homepage
│   ├── /api          # API Routes
│── /components       # Reusable Components
│── /models           # Mongoose Models
│── /utils            # Utility Functions
│── .env.local        # Environment Variables
│── package.json      # Dependencies
│── README.md         # Documentation
```

---

## Future Enhancements
- **Live Tracking** of service providers
- **Chat & Video Consultation** between users and providers
- **Subscription Plans** for premium users
- **AI-Based Service Recommendations**
- **Enhanced Review System with Ratings & Feedback Analytics**

---

## Contributing

Contributions are welcome! Fork the repo, create a branch, and submit a pull request.

---

## License

This project is licensed under the **MIT License**.

