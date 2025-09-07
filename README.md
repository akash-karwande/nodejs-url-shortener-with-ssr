# URL Shortener (Node.js + Express + MongoDB + EJS)

## readme generated using oracle code assist with cline

A simple URL shortener with authentication, EJS views, and basic click analytics. Users can sign up, log in, generate short URLs, and view a table of all shortened URLs with click counts.

- Runtime: Node.js + Express 5
- DB: MongoDB via Mongoose
- Views: EJS
- Auth: JWT stored in httpOnly cookie

## Features

- Generate short URLs using shortid
- Redirect from short URL to original URL
- Click analytics (stores timestamp on each visit)
- Authentication with JWT (httpOnly cookie)
- EJS views for login, signup, and home
- Protected routes for home and URL creation

## Quick Start

Prerequisites:
- Node.js (18+ recommended)
- MongoDB instance (local or hosted)
- A `.env` file in `url-shortener/` (see below)

1) Install dependencies
```bash
cd url-shortener
npm install
```

2) Configure environment variables  
Create a `.env` file in `url-shortener/`:
```bash
# Mongo connection string
MONGODB_URL=mongodb://localhost:27017/urlshortener

# JWT secret (note: the variable name is JWT_SCRETE in code)
JWT_SCRETE=change_this_secret
```

3) Start the server
```bash
npm start
```

4) Open in the browser
- App: http://localhost:8000  
- The app listens on port 8000 (hard-coded in index.js).

## Usage Flow

- Sign up at GET /user/signup
- Log in at GET /user/login
  - On successful login, a JWT token is set in an httpOnly cookie (`token`).
- Home page at GET / (protected)
  - Enter a URL in the form to generate a short URL (POST /url).
  - The page shows:
    - The most recently generated short URL (if any)
    - A table of all URLs with their click counts

## API / Routes

Public:
- POST /user/signup  
  Body (form): `name`, `email`, `password`, `role` (optional, defaults to `NORMAL`)

- POST /user/login  
  Body (form): `email`, `password`  
  On success, sets `token` cookie and redirects to `/`.

- GET /user/login  
  Renders login page (redirects to `/` if already logged in).

- GET /user/signup  
  Renders signup page (redirects to `/` if already logged in).

Protected (requires valid `token` cookie):
- GET /  
  Renders `home.ejs` with:
  - `user` (from JWT)
  - `allUrls` (from database)
  - Optional `id` (most recently generated shortId in current request cycle)

- POST /url  
  Body (form or JSON): `url` (the original URL)  
  Creates a short URL and renders `home.ejs` with the newly generated shortId.

- GET /url/:shortId  
  Redirects to the original URL and records a click timestamp.

- GET /url/analytics/:shortId  
  Returns JSON like:
  ```json
  {
    "totalNumberOfClicks": 3,
    "analytics": [
      { "timeStamp": 1725703020000 },
      { "timeStamp": 1725703122000 }
    ]
  }
  ```

Note about route order for analytics:
- In `routes/url.js`, `GET /:shortId` currently appears before `GET /analytics/:shortId`.
- In Express, route matching is order-sensitive. This causes `GET /url/analytics/XYZ` to match `/:shortId` first.
- Fix: move the analytics route before the parametric route:
```js
router.get("/analytics/:shortId", handleGetAnalytics);
router.get("/:shortId", handleRedirectToUrl);
```

## Views

- `view/login.ejs` – Simple login form (email, password)
- `view/signup.ejs` – Signup form (name, email, password, role)
- `view/home.ejs` – Shows:
  - Welcome line with `user.email` and `user.role`
  - A form to create short URLs (POST /url)
  - A table of all URLs with:
    - Short URL (http://localhost:8000/url/<shortId>)
    - Real URL
    - Total clicks
    - Created at timestamp

## Data Models

- URL (`models/url.js`)
  - `shortId` (String, unique, required)
  - `redirectUrl` (String, unique, required)
  - `visitHistory` (Array of `{ timeStamp: Number }`)
  - `createdBy` (ObjectId ref `users`, not currently set in controllers)
  - Timestamps enabled

- User (`models/user.js`)
  - `name` (String, required)
  - `email` (String, required, unique)
  - `role` (String, default `NORMAL`)
  - `password` (String; stored in plain text in this demo)
  - Timestamps enabled

## Environment Variables

Required (in `.env`):
- `MONGODB_URL` – Mongo connection string
- `JWT_SCRETE` – Secret key for signing JWTs (variable name intentionally matches code)

## Project Structure

```
url-shortener/
├─ .env
├─ .gitignore
├─ connection.js
├─ index.js
├─ package.json
├─ controllers/
│  ├─ home.js
│  ├─ url.js
│  └─ user.js
├─ middlewares/
│  └─ auth.js
├─ models/
│  ├─ url.js
│  └─ user.js
├─ routes/
│  ├─ home.js
│  ├─ url.js
│  └─ user.js
└─ view/
   ├─ home.ejs
   ├─ login.ejs
   └─ signup.ejs
```

## Development Notes

- Views directory configured as `./view` in `index.js`:
  ```js
  app.set("view engine", "ejs");
  app.set("views", path.resolve("./view"));
  ```
- Auth middleware reads JWT from `req.cookies.token` and sets `req.user` on success.
- Cookies set with `httpOnly: true` and `sameSite: "lax"`.

## Security and Limitations (Important)

- Passwords are stored in plain text (demo-only). Do not use in production.
- JWT secret env var name is `JWT_SCRETE` (typo preserved to match code). Consider normalizing to `JWT_SECRET` in code and env.
- No rate limiting or input validation; add these for production.
- `redirectUrl` is unique, so attempting to shorten the same URL twice will raise a uniqueness error.
- No logout route; clear the `token` cookie manually if needed.
- Analytics route order issue noted above.

## License

ISC

## Author

Akash Karwande
