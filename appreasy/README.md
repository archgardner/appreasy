# Appreasy - New Zealand Property Intelligence Platform

A production-ready full-stack application providing real-time property intelligence for New Zealand, integrating multiple government datasets including LINZ parcels, sales data, ratings, and zoning information.

## Quick Start

```bash
# Clone or create the project
./setup.sh  # This script creates all files

# Start the application
docker compose up --build

# Or for development
docker compose up --build -d
```

## Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/docs
- **Database**: PostgreSQL on localhost:5432

## First Run Notes

1. The initial startup may take a few minutes to:
   - Build the Docker images
   - Initialize the PostGIS database
   - Set up the schema

2. The ETL system will attempt to load data from LINZ APIs
   - Some endpoints may require API keys for full access
   - Check logs with: `docker compose logs -f backend`

3. For development without Docker:
   ```bash
   # Backend
   cd backend
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   
   # Frontend
   cd frontend
   npm install
   npm run dev
   ```

## Architecture

- **Backend**: FastAPI + PostgreSQL/PostGIS + APScheduler
- **Frontend**: React + TypeScript + Vite + Tailwind + MapLibre GL
- **Data**: LINZ parcels, sales, ratings, zoning (NZ government APIs)
- **Deploy**: Docker Compose with nginx

## Features

- Interactive property map
- Real-time property search
- Sales history and valuations
- Zoning and hazard information
- Automated data updates

## Production Notes

- Change `APP_SECRET` in docker-compose.yml
- Configure proper CORS origins
- Set up SSL termination
- Review rate limiting and authentication
- Configure monitoring and backups

## Troubleshooting

- If LINZ API returns 403/401, you may need API keys
- Check Docker logs: `docker compose logs backend`
- Ensure ports 3000, 8000, 5432 are available
- For M1 Macs, you may need platform-specific images

## Data Sources

- LINZ Property Parcels
- Property Sales Records  
- Rating Valuations
- Zoning Information
- Natural Hazard Layers

The system is designed to be extensible for additional NZ government datasets.
