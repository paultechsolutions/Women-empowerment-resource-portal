Project: Women Empowerment Resource Portal

Description: A community platform for resources, courses, events, mentorship and success stories supporting women’s empowerment. Includes an Express + Socket.IO backend, MongoDB (Mongoose) data layer, and a React + TypeScript + Vite frontend with Tailwind UI components.
Features

Authentication: JWT-based access + refresh tokens.
Content: Courses, Events, Resources, Forum, Success Stories.
Realtime: Chat via Socket.IO.
Admin: Admin dashboard for managing content and users.
Integrations: Optional Supabase integration hooks and API client utilities.
Tech Stack

Backend: Node.js, Express, Mongoose, Socket.IO
Frontend: React, TypeScript, Vite, TailwindCSS
DB: MongoDB (local or Atlas)
Deployment: Vercel config available (vercel.json)
Repository layout

Root: workspace config and deployment docs.
backend: Express server, routes, models, scripts/setup-db.js
frontend: Vite React app (source in src)
vercel.json: Vercel routing for static frontend + backend API
Quick start (local)

Install prerequisites:
Backend — install & run:
Frontend — install & run:
Visit the app:
Frontend: http://localhost:8080
API: http://localhost:5000/api
Environment variables

Backend (.env)
PORT — backend port (default 5000)
MONGODB_URI — e.g. mongodb://localhost:27017/women-empowerment
ACCESS_TOKEN_SECRET — JWT access secret
REFRESH_TOKEN_SECRET — JWT refresh secret
Any other DB or third-party keys (e.g., Supabase) used by your controllers
Frontend (.env.local / .env.production)
VITE_API_URL — base API URL (DEV typically proxied to /api or http://localhost:5000)
VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY — if using Supabase
Include these variables locally before starting servers. Example minimal .env:

Database

A provisioning / setup script exists at setup-db.js. Use npm run setup-db from backend to run it (it will attempt to connect to MONGODB_URI).
Build & Production

Build frontend:
Backend can be deployed as a Node server (or serverless functions). A vercel.json is included to route /api/* to the backend and serve the static frontend.
Deployment (Vercel)

Push repo to GitHub (make sure remote and permissions are correct).
Create a Vercel project and connect to the GitHub repo.
In Vercel project settings, add required environment variables (same as .env entries) — especially MONGODB_URI, ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET, and any Supabase keys.
Vercel will use frontend as static build output and route /api/* to the backend via vercel.json.
Troubleshooting

MongoDB SRV DNS errors: If you see querySrv ENOTFOUND for Atlas SRV, either ensure DNS is available or switch to a standard connection string mongodb://host:27017/db.
ESM/CJS issues in backend: Backend expects CommonJS modules (require/module.exports); mixing imports may cause runtime errors. If you see "require is not defined" convert modules to CommonJS or set type: "module" consistently.
Frontend blank page / dev server errors: Run npm run dev in frontend and fix any Vite parse errors (often due to JSX syntax errors). Ensure VITE_API_URL or dev proxy in vite.config.ts points to backend port.
Git push permissions: If pushing to paultechsolutions is denied, push to your own fork and open a Pull Request, or obtain collaborator access.
Contribution

How to contribute: Fork the repo, create a feature branch, and open a Pull Request into main.
Coding style: Follow existing patterns (CommonJS for backend, TypeScript for frontend). Keep commits small and focused.
Contact: Open an issue or PR on GitHub for feature requests or bugs.
Files of interest

server.js — server entry point
models — Mongoose models (e.g., User.js)
src — React app source
vite.config.ts — dev server proxy
vercel.json — deployment routing rules
License

Add a LICENSE file (e.g., MIT) if you want the project to be open-source.
If you’d like, I can:

Generate a ready-to-commit README.md file with this content.
Add example .env.example files in backend and frontend.
Create a simple CONTRIBUTING.md and LICENSE file.

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
