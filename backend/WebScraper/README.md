# WebScraper Service

This service provides web scraping functionality for the college management system.

## Installation

```bash
cd backend/WebScraper
npm install
```

## Usage

### Build
```bash
npm run build
```

### Start
```bash
npm start
```

### Development
```bash
npm run dev
```

## API

### POST /api/scraper/scrape

Scrapes a website and returns title and text content.

**Request Body:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "title": "Example Domain",
  "data": ["Example Domain", "This domain is for use in illustrative examples..."]
}
```

## Environment Variables

Set the following in your `.env` file (similar to other services):
- `PORT` (default 5002)
- `REDIS_URL`
- `RABBITMQ_HOST`
- `RABBITMQ_PORT`
- `RABBITMQ_USERNAME`
- `RABBITMQ_PASSWORD`