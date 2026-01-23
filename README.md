# EquityIQ

EquityIQ is a full‑stack web app with a React + Vite frontend and a Node.js/Express backend. It includes authentication with email OTP, Cloudinary image uploads, and market data powered by Yahoo Finance.

## Project structure

- backend/ — Express API, MongoDB, email, Cloudinary
- frontend/ — React + Vite UI

## Prerequisites

- Node.js 18+
- MongoDB instance
- Cloudinary account
- SMTP credentials for email delivery

## Environment variables (backend)

Create backend/.env with the following:

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
SMTP_FROM=your_from_email
```

## Setup

### Backend

```
cd backend
npm install
npm run dev
```

### Frontend

```
cd frontend
npm install
npm run dev
```

## Build

### Frontend

```
cd frontend
npm run build
npm run preview
```

### Backend

```
cd backend
npm start
```

## License

ISC
