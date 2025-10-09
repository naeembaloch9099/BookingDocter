# Backend for Docter project

This is a minimal Express + Mongoose backend scaffold for the frontend in this workspace.

Files added:

- `server.js` - entry point
- `config/db.js` - mongoose connection
- `models/User.js`, `models/Appointment.js`
- `controllers/` - auth and appointment controllers
- `routes/` - auth and appointments routes
- `middleware/auth.js` - JWT auth middleware
- `utils/` - email sender, OTP generator and HTML template
- `.env.example` - example environment variables

Packages to install (run in Backend/):

- express
- mongoose
- dotenv
- bcryptjs
- jsonwebtoken
- nodemailer
- morgan
- cookie-parser

Install them manually as you requested, for example:

```
npm i express mongoose dotenv bcryptjs jsonwebtoken nodemailer morgan cookie-parser
```

Then copy `.env.example` to `.env` and update values.

Start the server:

```powershell
node server.js
```
