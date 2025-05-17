# Password Security Analyzer

A modern web application that analyzes password security by checking against common passwords and evaluating password strength.

## Features

- Check if a password is commonly used
- Calculate password strength based on length and character variety
- View MD5 hash of the password
- Store password check history in Supabase
- View recent password check attempts

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js with Express
- **Database**: Supabase

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:

   ```
   cd backend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `rockyou-sample.txt` file with common passwords (a sample is included)

4. Start the server:
   ```
   npm run dev
   ```

The server will run on http://localhost:5000

### Frontend Setup

1. Navigate to the frontend directory:

   ```
   cd frontend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

The application will be available at http://localhost:3000

## Deployment

### Backend Deployment

You can deploy the backend to platforms like Heroku, Render, or Railway:

1. Create an account on your preferred platform
2. Connect your GitHub repository
3. Set up the build command: `npm install`
4. Set up the start command: `npm start`
5. Deploy the application

### Frontend Deployment

You can deploy the frontend to platforms like Netlify or Vercel:

1. Create an account on your preferred platform
2. Connect your GitHub repository
3. Set up the build command: `npm run build`
4. Set the publish directory to `build`
5. Deploy the application

Remember to update the API endpoint in the frontend code to point to your deployed backend URL.

## Supabase Setup

1. Create a table called `password_attempts` with the following columns:

   - `id` (uuid, primary key)
   - `password` (text)
   - `hash` (text)
   - `timestamp` (timestamptz)

2. Set up appropriate security policies for your table

## License

MIT
