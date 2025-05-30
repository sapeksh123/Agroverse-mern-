# AgroVerse: Agricultural Equipment Rental Platform

AgroVerse is a web-based platform that connects farmers with equipment owners, facilitating the rental of agricultural machinery. This platform helps small-scale farmers access modern equipment without the high costs of ownership.

## Features

- User authentication with role-based access (farmers and equipment owners)
- Equipment listings with details, images, and pricing
- Real-time equipment availability
- Location-based search
- Booking management system
- Secure payment integration
- Communication between renters and owners
- Responsive design for all devices

## Tech Stack

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Deployment**: Vercel

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (local or Atlas connection)

## Installation

1. Clone the repository:
   \`\`\`
   git clone https://github.com/sapeksh123/Agroverse-mern-.git
   cd agroverse
   \`\`\`

2. Install dependencies for both server and client:
   \`\`\`
   npm install
   \`\`\`

3. Create a `.env` file in the server directory based on the `.env.example` file:
   \`\`\`
   cp server/.env.example server/.env
   \`\`\`

4. Update the `.env` file with your MongoDB connection string and JWT secret.

5. Create a `.env` file in the client directory:
   \`\`\`
   REACT_APP_API_URL=http://localhost:5000
   \`\`\`

## Running the Application

1. Start the development server (both frontend and backend):
   \`\`\`
   npm run dev
   \`\`\`

2. The application will be available at:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Project Structure

\`\`\`
agroverse/
├── client/                 # React frontend
│   ├── public/             # Public assets
│   └── src/                # Source files
│       ├── components/     # Reusable components
│       ├── context/        # Context API
│       ├── pages/          # Page components
│       └── utils/          # Utility functions
├── server/                 # Node.js backend
│   ├── middleware/         # Express middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   └── uploads/            # Uploaded files
└── README.md               # Project documentation
\`\`\`

## API Endpoints

### Authentication
- `POST /api/users` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Equipment
- `GET /api/equipment` - Get all equipment
- `GET /api/equipment/:id` - Get equipment by ID
- `POST /api/equipment` - Create new equipment listing
- `PUT /api/equipment/:id` - Update equipment
- `DELETE /api/equipment/:id` - Delete equipment
- `GET /api/equipment/my-equipment` - Get user's equipment

### Bookings
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings/my-bookings` - Get user's bookings
- `GET /api/bookings/:id` - Get booking by ID
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `PUT /api/bookings/:id/approve` - Approve booking
- `PUT /api/bookings/:id/reject` - Reject booking

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Deployment

### Backend
1. Create a MongoDB Atlas cluster
2. Set up environment variables on your hosting platform
3. Deploy the Node.js application

### Frontend
1. Build the React application:
   \`\`\`
   cd client
   npm run build
   \`\`\`
2. Deploy the build folder to a static hosting service

## License

This project is licensed under the MIT License.
#   A g r o v e r s e - m e r n - 
 
 