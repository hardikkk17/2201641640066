# URL Shortener Microservice

## Architecture
- Express.js microservice
- In-memory data model
- Clean folder structure

## API Endpoints

### POST /shorturls
- Create shortened URL
- Request: { "url": "...", "validity": 30, "shortcode": "abc123" }
- Response: { "shortLink": "...", "expiry": "..." }

### GET /:shortcode
- Redirects to original URL if valid

### GET /shorturls/:shortcode
- Returns stats:
  - clickCount, original URL, creation, expiry, clicks [{timestamp, referrer, location}]

## Logging
- Custom logger middleware logs each request with timestamp, method, URL, status code, duration.

## Error Handling
- Invalid/missing fields, expired/non-existent shortcodes, robust JSON errors.

## Assumptions
- Service runs at `localhost:3000`
- Location field is dummy for demo.

## Scalability
- Modular. Can migrate data to database easily.

