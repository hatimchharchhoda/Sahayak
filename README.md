# Sahayak - Home Services Booking Platform

Sahayak is a home services booking platform built using Next.js with the App Router and Prisma. It allows users to find and book home services, providers to manage their jobs, and admins to oversee the platform efficiently.

## Features

### User Features
- Secure authentication (Login/Signup)
- Search and book home services (Cleaning, Plumbing, etc.)
- Track service status (Pending, Accepted, Completed)
- View booked services and assigned providers
- Leave reviews for completed services
- Chatbot assistance for quick queries and support

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

## Tech Stack
- **Frontend:** Next.js (App Router + React Server Components)
- **Backend:** Next.js API Routes
- **Database:** MongoDB with Prisma ORM
- **UI Framework:** Tailwind CSS
- **State Management:** React Context API
- **PDF Generation:** jsPDF
- **Chatbot:** Integrated AI-powered chatbot for user assistance

## Installation & Setup

### 1. Clone the Repository
```sh
git clone https://github.com/prem0617/Sayahak.git
cd Sayahak
```

### 2. Install Dependencies
```sh
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the root directory and add:
```env
DATABASE_URL=your-mongodb-connection-string
NEXT_PUBLIC_SITE_URL=https://sayahak-git-main-prem-0671s-projects.vercel.app/
```

### 4. Run the Project
```sh
npm run dev
```
The app will be live at [http://localhost:3000](http://localhost:3000).

## Folder Structure
```
/sahayak
│── /app             # Next.js App Router Structure
│── /components      # Reusable UI Components
│── /lib             # Utility Functions
│── /prisma          # Prisma Models
│── .env             # Environment Variables
│── package.json     # Dependencies
│── README.md        # Documentation
```

## Future Enhancements
- **Live Tracking** of service providers
- **Chat & Video Consultation** between users and providers
- **Subscription Plans** for premium users
- **AI-Based Service Recommendations**
- **Enhanced Review System** with Ratings & Feedback Analytics

## Contributing
Contributions are welcome! Fork the repo, create a branch, and submit a pull request.

## License
This project is licensed under the MIT License.

---
**Live Website:** [Sahayak](https://sayahak-git-main-prem-0671s-projects.vercel.app/)

