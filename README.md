# 🌤️ Weather Bot - Unified Application

A simple, lightweight weather application built with Node.js. Enter a city name to get detailed weather information including temperature, humidity, coordinates, and more.

## Features

✅ **City Search** - Search for any city and get location suggestions
✅ **Real-time Weather Data** - Get current weather conditions
✅ **Complete Weather Information**:
  - Temperature and "Feels Like"
  - Humidity and pressure
  - Wind speed and cloudiness
  - Visibility and sunrise/sunset times
  - Exact coordinates (Latitude/Longitude)
  - Timezone information

✅ **Single Unified App** - Everything runs from one Node.js server
✅ **Lightweight** - No dependencies on bulky frameworks

## Project Structure

```
weatherBot/
├── server/
│   ├── index.js           # Main server (handles API + static files)
│   ├── .env               # Environment variables
│   ├── package.json       # Dependencies
│   └── public/
│       └── index.html     # Complete frontend (HTML/CSS/JS)
├── package.json           # Root package
└── README.md
```

## Prerequisites

- **Node.js** (v14 or higher)
- **OpenWeather API Key** (free at https://openweathermap.org/api)

## Setup Instructions

### 1. Get Your OpenWeather API Key

1. Visit https://openweathermap.org/api
2. Sign up for a free account
3. Go to API keys section
4. Copy your API key

### 2. Install Dependencies

```bash
npm install
```

Or navigate to server folder:

```bash
cd server
npm install
```

### 3. Configure Environment Variables

Edit `server/.env`:

```
PORT=5000
OPENWEATHER_API_KEY=your_api_key_here
```

### 4. Start the Application

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The app will be available at: **http://localhost:5000**

## API Endpoints

### Get City Coordinates
```
GET /api/geo?city=London
```

### Get Weather Data
```
GET /api/weather?lat=51.5085&lon=-0.1257
```

## How to Use

1. Enter a city name in the search box
2. Select from the location suggestions
3. View complete weather information

## Technologies Used

- **Node.js** - Server runtime
- **Native HTTP module** - Web server
- **request** - HTTP client library
- **HTML/CSS/JavaScript** - Frontend

## License

ISC

---

**Enjoy your Weather Bot! 🌤️**

