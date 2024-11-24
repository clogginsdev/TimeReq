# Timereq

A calendar scheduling application that simplifies the process of requesting and managing time slots on someone's calendar. Built with modern web technologies, Timereq provides a seamless experience for both administrators and users requesting time slots.

## Features

- Easy time slot request system
- Admin dashboard for managing requests
- Email notifications
- Responsive design

## Tech Stack

### Frontend
- Next.js (React framework)
- TailwindCSS for styling
- React components

### Backend
- Node.js
- MongoDB for data storage
- Next.js API routes

## Prerequisites

Before running this application, make sure you have:

- Node.js (v14 or higher)
- MongoDB instance
- Plunk API key
- Environment variables properly configured

## Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_BASE_URL=http://localhost:3000
PLUNK_API_KEY=your_plunk_api_key
NEXT_PUBLIC_FROM_EMAIL=your_from_email
ADMIN_PASSWORD=your_secure_password
```

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd timereq
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. For production:
```bash
npm run build
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

- `/pages` - Next.js pages and API routes
- `/components` - Reusable React components
- `/utils` - Helper functions and utilities
- `/styles` - CSS and Tailwind styles
- `/public` - Static assets

## API Endpoints

- `POST /api/meetings` - Create new meeting requests
- `GET /api/meetings` - Retrieve meeting information
- `GET /api/meetings/getinvite` - Generate meeting invites

## Contributing

Feel free to submit issues and enhancement requests.
