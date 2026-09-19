# 🚀 Render Deployment Guide

This project is configured to run effortlessly both on **Render** (in production) and on **localhost** (during development).

---

## 🌟 Why this setup is awesome for Render
1. **Single Unified Web Service (Free Tier Friendly)**:
   - Express runs on Render's assigned port.
   - It hosts the backend REST API (`/api/auth`, `/api/memories`, `/api/health`).
   - It automatically serves the compiled Angular website for all other routes.
   - **Zero CORS issues** because both frontend and API are served from the same domain (`https://your-portfolio.onrender.com`).
2. **Offline Fallback Storage Included**:
   - The app persists travel memories automatically to `data_fallback.json` even without an external MySQL database.
   - If you add MySQL environment variables later (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`), it will automatically connect to MySQL instead.

---

## 🛠️ Step-by-Step Deployment to Render

### Step 1: Push Code to GitHub
Ensure all your changes are pushed to your GitHub repository:
```bash
git add .
git commit -m "feat: render deployment ready"
git push origin main
```

---

### Step 2: Create Web Service on Render
1. Go to **[dashboard.render.com](https://dashboard.render.com/)** and log in.
2. Click **New +** → **Web Service**.
3. Select **Build and deploy from a Git repository** and connect your GitHub repository (`folio`).
4. Configure the settings:
   - **Name**: `ankit-sagar-portfolio` (or any name you like)
   - **Region**: Any (e.g. `Oregon (US West)` or `Singapore`)
   - **Branch**: `main`
   - **Root Directory**: *(leave blank)*
   - **Runtime**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run start`
   - **Instance Type**: `Free`

---

### Step 3: Add Environment Variables (Optional)
In the **Environment Variables** section on Render, you can configure:

| Key | Suggested Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Production mode |
| `JWT_SECRET` | *(click Generate)* | Secure random key for JWT authentication |
| `ADMIN_EMAIL` | `admin@portfolio.com` | Your admin login email |
| `ADMIN_PASSWORD` | `admin123` | Your admin login password |
| `ADMIN_NAME` | `Ankit Sagar` | Admin user display name |

*(If you have a remote MySQL database like Aiven, PlanetScale, or Render PostgreSQL/MySQL, you can also add `DB_HOST`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME`).*

---

### Step 4: Click "Deploy Web Service"
- Render will automatically run `npm run build` (installing dependencies and compiling Angular), and then run `npm run start`.
- Once deployment finishes, you will see a live URL like:
  ```
  https://ankit-sagar-portfolio.onrender.com
  ```
- Open this URL in your browser:
  - Visit `/` to see your portfolio home page.
  - Visit `/projects/hobbies` to view the 3D travel map.
  - Visit `/openadmin` to log in with your admin credentials.

---

## 💻 Localhost Development (Unchanged)
During local development, nothing changes:
```bash
# Terminal 1 - Backend Server (port 3000)
npm run start:server

# Terminal 2 - Frontend Client (port 4300)
npm run start:client
```
The frontend automatically detects `localhost` and routes all API calls to `http://localhost:3000`.
