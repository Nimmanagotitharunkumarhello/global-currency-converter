Project Setup Guide
1. Requirements

Before starting, make sure you have:

Node.js (v16 or above)

npm (comes with Node)

An Exchange Rate API key

2. Install Dependencies

Open the project folder in a terminal and run:

npm install


If dependencies are missing, install them manually:

npm install express axios cors dotenv

3. Create .env File

Inside the project root, create a file named:

.env


Add your API key:

API_KEY=your_api_key_here


Make sure .env is added to .gitignore so it stays private.

4. Start the Backend Server

Run:

node server.js


If everything is correct, you should see:

Server running at http://localhost:3000


You can test the backend by opening:

http://localhost:3000/api/rates/USD

5. Open the Frontend

Just open your index.html directly in your browser:

index.html


It will call your backend for exchange rates.

6. Folder Structure (Recommended)
project/
│── server.js
│── index.html
│── styles.css
│── script.js
│── package.json
│── .env
│── .gitignore
│── SETUP.md

7. Deployment Notes

Never expose the API key in frontend code.

The .env file must only live on the backend.

If deploying on Render / Railway / Vercel:

Add API_KEY to their environment variable settings.
