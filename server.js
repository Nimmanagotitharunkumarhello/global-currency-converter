// ============================================
// CURRENCY CONVERTER BACKEND SERVER
// ============================================
// This server acts as a proxy to keep the API key secure
// The frontend calls this server instead of the API directly

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fetch = require('node-fetch');

// Load environment variables from .env file
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARE
// ============================================

// Enable CORS to allow frontend to make requests
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Serve static files (the index.html)
app.use(express.static('.'));

// ============================================
// API ENDPOINTS
// ============================================

/**
 * GET /api/rates/:baseCurrency
 * Fetches exchange rates for a given base currency
 * 
 * @param {string} baseCurrency - Base currency code (e.g., 'USD')
 * @returns {Object} - Exchange rates object
 */
app.get('/api/rates/:baseCurrency', async (req, res) => {
    try {
        const { baseCurrency } = req.params;

        // Validate base currency
        if (!baseCurrency || typeof baseCurrency !== 'string' || baseCurrency.length !== 3) {
            return res.status(400).json({
                success: false,
                error: 'Invalid base currency code. Must be a 3-letter code (e.g., USD, EUR)'
            });
        }

        // Get API key from environment variables
        const apiKey = process.env.EXCHANGE_RATE_API_KEY;

        // Check if API key is configured
        if (!apiKey) {
            console.error('API key not found in environment variables');
            return res.status(500).json({
                success: false,
                error: 'Server configuration error: API key not set'
            });
        }

        // Build API URL
        // If the API requires a key, add it to the URL or headers
        // Adjust this based on the actual API requirements
        const apiUrl = `https://open.er-api.com/v6/latest/${baseCurrency}`;
        
        // Some APIs require the key in headers, others in URL
        // For exchangerate-api.com, if you have a paid plan, you might need:
        // const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${baseCurrency}`;
        
        // Or if using a different API that requires headers:
        // const headers = { 'apikey': apiKey };

        console.log(`Fetching exchange rates for base currency: ${baseCurrency}`);

        // Fetch exchange rates from the external API
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        // Check if the response is OK
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`API Error: ${response.status} - ${errorText}`);
            return res.status(response.status).json({
                success: false,
                error: `Failed to fetch exchange rates: ${response.statusText}`
            });
        }

        // Parse the response
        const data = await response.json();

        // Check if API returned an error
        if (data.result === 'error') {
            console.error('API returned error:', data['error-type']);
            return res.status(400).json({
                success: false,
                error: data['error-type'] || 'Unknown API error'
            });
        }

        // Check if rates exist
        if (!data.rates) {
            console.error('Invalid API response: rates not found');
            return res.status(500).json({
                success: false,
                error: 'Invalid response from exchange rate API'
            });
        }

        // Return success response with rates
        res.json({
            success: true,
            base: data.base_code || baseCurrency,
            date: data.time_last_update_utc || new Date().toISOString(),
            rates: data.rates
        });

    } catch (error) {
        // Handle any unexpected errors
        console.error('Error in /api/rates endpoint:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error: ' + error.message
        });
    }
});

/**
 * GET /api/health
 * Health check endpoint to verify server is running
 */
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Currency converter API is running',
        timestamp: new Date().toISOString()
    });
});

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler for undefined routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
    console.log('===========================================');
    console.log('Currency Converter Backend Server');
    console.log('===========================================');
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API endpoint: http://localhost:${PORT}/api/rates/:baseCurrency`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
    
    // Check if API key is configured
    if (process.env.EXCHANGE_RATE_API_KEY) {
        console.log('✓ API key is configured');
    } else {
        console.log('⚠ WARNING: API key not found in .env file');
        console.log('  The API may work without a key, or you may need to set EXCHANGE_RATE_API_KEY');
    }
    console.log('===========================================');
});

