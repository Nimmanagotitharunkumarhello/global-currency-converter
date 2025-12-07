# Currency Converter

A clean, responsive currency converter web application with secure API key management through a backend server.

## Features

- 💱 Real-time currency conversion
- 🔒 Secure API key storage (backend handles authentication)
- 📱 Fully responsive design
- ✨ Modern, minimal UI
- ⚡ Fast and lightweight
- 🛡️ Comprehensive error handling

## Project Structure

```
currency-calculation/
├── index.html          # Frontend (HTML + CSS + JavaScript)
├── server.js           # Backend server (Node.js/Express)
├── package.json        # Node.js dependencies
├── .env                # Environment variables (API key) - create this file
├── .env.example        # Example environment file
└── README.md          # This file
```

## Setup Instructions

### 1. Install Dependencies

Make sure you have [Node.js](https://nodejs.org/) installed (version 14 or higher), then run:

```bash
npm install
```

This will install:
- `express` - Web server framework
- `cors` - Enable cross-origin requests
- `dotenv` - Load environment variables
- `node-fetch` - Make HTTP requests to the exchange rate API

### 2. Configure API Key

1. Create a `.env` file in the project root:

```bash
# On Windows (PowerShell)
Copy-Item .env.example .env

# On Mac/Linux
cp .env.example .env
```

2. Open the `.env` file and add your API key:

```env
EXCHANGE_RATE_API_KEY=your_actual_api_key_here
PORT=3000
```

**Note:** 
- If you're using the free tier of `open.er-api.com`, you may not need an API key
- If you're using a paid plan or different API, add your key to the `.env` file
- The `.env` file is already in `.gitignore` to keep your key secure

### 3. Start the Backend Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The server will start on `http://localhost:3000`

### 4. Open the Frontend

1. Open `index.html` in your browser, OR
2. Navigate to `http://localhost:3000` (the server serves the HTML file)

## How It Works

### Frontend (`index.html`)
- User selects currencies and enters amount
- Frontend sends request to backend API: `GET /api/rates/USD`
- Backend securely fetches data using API key
- Backend returns exchange rates to frontend
- Frontend calculates and displays converted amount

### Backend (`server.js`)
- Receives requests from frontend
- Uses API key from `.env` file (never exposed to frontend)
- Fetches exchange rates from external API
- Returns formatted response to frontend
- Handles errors gracefully

## API Endpoints

### `GET /api/rates/:baseCurrency`
Fetches exchange rates for a given base currency.

**Example:**
```
GET http://localhost:3000/api/rates/USD
```

**Response:**
```json
{
  "success": true,
  "base": "USD",
  "date": "2024-01-15T12:00:00Z",
  "rates": {
    "EUR": 0.85,
    "GBP": 0.73,
    "JPY": 110.25,
    ...
  }
}
```

### `GET /api/health`
Health check endpoint to verify server is running.

## Supported Currencies

The converter supports 20+ major currencies including:
- USD, EUR, GBP, JPY, AUD, CAD
- CHF, CNY, INR, SGD, HKD, NZD
- KRW, MXN, BRL, ZAR, RUB, TRY
- AED, SAR, and more

## Error Handling

The application handles:
- ✅ Invalid amount (non-numeric, negative, zero)
- ✅ API failures (network errors, server errors)
- ✅ Unsupported currency codes
- ✅ Missing API key
- ✅ Backend server not running

## Security Notes

- ✅ API key is stored in `.env` file (not in code)
- ✅ `.env` is in `.gitignore` (won't be committed)
- ✅ Backend acts as proxy (key never exposed to frontend)
- ✅ CORS enabled for local development

## Troubleshooting

### "Cannot connect to server"
- Make sure the backend server is running: `npm start`
- Check that the server is on port 3000
- Verify no firewall is blocking the connection

### "API key not found"
- Create a `.env` file in the project root
- Add `EXCHANGE_RATE_API_KEY=your_key` to the file
- Restart the server after adding the key

### "Failed to fetch exchange rates"
- Check your internet connection
- Verify the API key is correct (if required)
- Check the API service status

## Development

### Running in Development Mode

```bash
npm run dev
```

This uses `nodemon` to automatically restart the server when you make changes.

### Modifying the API

If you need to use a different exchange rate API:

1. Update the API URL in `server.js` (line ~50)
2. Adjust the response parsing if the API format differs
3. Update the API key configuration if needed

## License

MIT

## Credits

- Exchange Rate API: [exchangerate-api.com](https://www.exchangerate-api.com/)
- Built with Express.js and vanilla JavaScript

