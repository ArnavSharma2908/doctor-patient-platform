# Doctor-Patient Platform

A modern web application that connects patients with nearby doctors using real-time location mapping.

## Features

- **Doctor Registration**: Doctors can register with their clinic details and location
- **Patient Search**: Patients can find doctors by location name or map interaction
- **Interactive Map**: Google Maps integration for visual doctor discovery
- **Real-time Updates**: Instant search results and location updates

## Technology Stack

- **Frontend**: React + TypeScript + Vite
- **UI Components**: Shadcn/ui + Tailwind CSS
- **Maps**: Google Maps API
- **Backend**: Node.js + Express + MongoDB
- **Notifications**: Sonner Toast

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   cd server && npm install
   ```

2. **Environment Setup**
   Create `.env` file in root:
   ```
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

3. **Start Development**
   ```bash
   npm run dev  # Starts both client and server
   ```

## Project Structure

```
src/
├── components/         # React components
│   ├── ui/            # Shadcn/ui components
│   ├── GoogleMap.tsx  # Map component
│   └── Navbar.tsx     # Navigation
├── pages/             # Page components
├── lib/               # Utilities and API
└── types/             # TypeScript types

server/                # Backend API
├── models/            # MongoDB models
├── routes/            # API routes
└── server.js          # Express server
```

## API Endpoints

- `POST /api/doctors` - Register a doctor
- `GET /api/doctors/search/:location` - Search doctors by location
- `GET /api/doctors/near/:lat/:lng` - Find nearby doctors

## Deployment

1. Build the application: `npm run build`
2. Configure production environment variables
3. Deploy to your preferred platform (Vercel, Netlify, etc.)

## License

MIT License

# Commands

**Install Dependencies**

```shell
pnpm i
```

**Start Preview**

```shell
pnpm run dev
```

**To build**

```shell
pnpm run build
```
