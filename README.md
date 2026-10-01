# Dream Journal App

A full-stack web application that allows users to record their dreams and receive AI-powered interpretations using Google Gemini.

## Features

- Record dreams with timestamp
- Get AI interpretations of your dreams
- View all past dreams and their interpretations
- Delete dreams
- SQLite database for persistent storage
- Vanilla JavaScript frontend
- Express backend with RESTful API

## Tech Stack

- **Backend**: Node.js, Express
- **Database**: SQLite (sqlite3 / sqlite)
- **Frontend**: HTML, CSS, Vanilla JavaScript
- **AI**: Google Gemini API (@google/genai)

## Project Structure

```
dream-journal/
├── server.js           # Express server and API routes
├── package.json        # Dependencies and scripts
├── .env               # Environment variables (create this)
├── .env.example       # Example env file
├── dreams.db          # SQLite database (auto-created)
└── public/
    ├── index.html     # Frontend HTML
    ├── styles.css     # Styles
    └── app.js         # Frontend JavaScript
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Google Gemini API key:

```
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.8-flash
PORT=3001
```

Get your API key from: https://aistudio.google.com/

### 3. Run the Application

Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The app will be available at `http://localhost:3001`

## API Endpoints

- `GET /api/dreams` - Get all dreams
- `GET /api/dreams/:id` - Get a specific dream
- `POST /api/dreams` - Create a new dream (requires `dream_text` in body)
- `DELETE /api/dreams/:id` - Delete a dream

## Docker Deployment

### 1. Build and Run with Docker Locally

Build image:
```bash
docker build -t dream-catcher .
```

Run container:
```bash
docker run -d -p 3001:3001 --env-file .env --name dream-catcher dream-catcher
```

Or using Docker Compose:
```bash
docker compose up -d --build
```

### 2. Deploy Docker Container to Render

1. Go to https://render.com and sign in.
2. Click **New +** -> **Web Service**.
3. Connect your repository: `Achindra2003/dream-catcher`.
4. Configure the service:
   - **Name**: `dream-catcher`
   - **Runtime**: **Docker** (Render detects the `Dockerfile` automatically)
   - **Instance Type**: Free
5. Under **Environment Variables**, add:
   - `GEMINI_API_KEY`: *(your Gemini API key)*
   - `GEMINI_MODEL`: `gemini-3.5-flash`
   - `NODE_ENV`: `production`
   - `PORT`: `3001`
6. Click **Deploy Web Service**. Render will automatically build the multi-stage Docker image and launch the container.

### 5. Database Persistence

Note: The SQLite database file will be stored in Render's ephemeral filesystem. For production, consider:
- Using Render's persistent disk feature
- Migrating to PostgreSQL for better persistence
- Backing up data regularly

## Usage

1. Enter your dream in the text area
2. Click "Get Interpretation" to save the dream and receive an AI interpretation
3. View all your dreams below, sorted by most recent
4. Click "Delete" to remove a dream

## License

MIT