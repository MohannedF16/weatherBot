const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const request = require('request');
require('dotenv').config();


const PORT = process.env.PORT || 5000;
const API_KEY = process.env.OPENWEATHER_API_KEY;

// Serve static files
const serveFile = (filePath, res) => {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not found');
            return;
        }

        const ext = path.extname(filePath);
        let contentType = 'text/html';
        if (ext === '.js') contentType = 'application/javascript';
        if (ext === '.css') contentType = 'text/css';
        if (ext === '.json') contentType = 'application/json';
        if (ext === '.png') contentType = 'image/png';
        if (ext === '.jpg') contentType = 'image/jpeg';

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
};

const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;
    const city = url.searchParams.get('city');
    const lat = url.searchParams.get('lat');
    const lon = url.searchParams.get('lon');

    // API Routes
    if (pathname === '/api/geo') {
        if (!city) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'City name is required' }));
            return;
        }

        const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=5&appid=${API_KEY}`;

        request(url, (error, response, body) => {
            if (error) {
                console.error('Request error:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Failed to fetch locations' }));
                return;
            }

            console.log('Geo API Status:', response.statusCode);
            console.log('Geo API Body:', body);

            try {
                const data = JSON.parse(body);

                // OpenWeather returns [] for no results
                if (!Array.isArray(data) || data.length === 0) {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'City not found' }));
                    return;
                }

                const locations = data.map(loc => ({
                    name: loc.name,
                    country: loc.country,
                    region: loc.state || 'N/A',
                    lat: loc.lat,
                    lon: loc.lon
                }));

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(locations));

            } catch (e) {
                console.error('JSON parse error:', e.message);
                console.error('Body was:', body);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Failed to parse API response' }));
            }
        });

    } else if (pathname === '/api/weather') {
        if (!lat || !lon) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Latitude and longitude are required' }));
            return;
        }

        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
        
        request(url, (error, response, body) => {
            if (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Failed to fetch weather' }));
                return;
            }

            try {
                const data = JSON.parse(body);

                if (data.cod && data.cod !== 200) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: data.message }));
                    return;
                }

                const weather = {
                    city: data.name,
                    country: data.sys.country,
                    lat: data.coord.lat,
                    lon: data.coord.lon,
                    temperature: data.main.temp,
                    feelsLike: data.main.feels_like,
                    humidity: data.main.humidity,
                    pressure: data.main.pressure,
                    weatherMain: data.weather[0].main,
                    weatherDescription: data.weather[0].description,
                    windSpeed: data.wind.speed,
                    cloudiness: data.clouds.all,
                    sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString(),
                    sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString(),
                    visibility: (data.visibility / 1000).toFixed(2),
                    timezone: data.timezone
                };

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(weather));

            } catch (e) {
                console.error('Parse error in /api/weather:', body);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'API error - check server logs' }));
            }
        });
    }
    else if (pathname === '/api/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'Server is running' }));
    }
    // Serve static files
    else if (pathname === '/' || pathname === '/index.html') {
        serveFile(path.join(__dirname, 'public', 'index.html'), res);
    } else if (pathname.endsWith('.css') || pathname.endsWith('.js') || pathname.endsWith('.json')) {
        serveFile(path.join(__dirname, 'public', pathname), res);
    } else {
        // Fallback to index.html for React routing
        serveFile(path.join(__dirname, 'public', 'index.html'), res);
    }
});

server.listen(PORT, () => {
    console.log(`Weather App running on http://localhost:${PORT}`);
});



