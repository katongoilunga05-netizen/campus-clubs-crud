# Campus Clubs CRUD (Node.js + Express + Supabase)

## 1. Set up Supabase
1. Create a project at https://supabase.com
2. SQL Editor -> New query -> paste `backend/schema.sql` -> Run (creates the table + 10 sample rows).
3. Project Settings -> API: copy the Project URL and the `service_role` key.
4. Put them in `backend/.env` (SUPABASE_URL, SUPABASE_KEY). Never put this key in the frontend or push .env to GitHub.

## 2. Run locally
    cd backend
    npm install
    npm start
Open http://localhost:3000

## Endpoints
| Method | URL | Body (JSON) |
|---|---|---|
| GET | /api/clubs | - |
| GET | /api/clubs/:id | - |
| POST | /api/clubs | {"name":"Hiking Club","description":"Weekend hikes","category":"Community","meeting_day":"Saturday","contact_email":"hike@mu.ac.zm","member_count":12} |
| PUT | /api/clubs/:id | same fields as POST |
| DELETE | /api/clubs/:id | - |

## 3. Deploy the API (Render.com, free)
1. Push the project to GitHub (add `.env` to .gitignore).
2. Render -> New Web Service -> Root Directory `backend`, Build `npm install`, Start `npm start`.
3. Environment variables: SUPABASE_URL, SUPABASE_KEY.
4. Live API: https://<your-app>.onrender.com/api/clubs (the frontend is served at the root URL too).
