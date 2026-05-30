# Vaulto Frontend

React + Vite UI for Vaulto.

This frontend communicates with the backend using cookie-based authentication (`withCredentials: true`). The backend API base path defaults to:

- `http://localhost:3000/api/v1`

## 🚀 Prerequisites

- Node.js (LTS recommended)
- npm

## 📦 Setup

```bash
npm install
```

## 🌍 Environment Variables

Create a `.env` file in `vaulto-frontend/`.

```env
VITE_API_URL=http://localhost:3000/api/v1
```

Authentication relies on browser cookies set by the backend, so keep `withCredentials: true` (already configured in `src/lib/axios.js`).

## 🧑‍💻 Development

```bash
npm run dev
```

## 🏗️ Build

```bash
npm run build
```

## 👀 Preview production build

```bash
npm run preview
```

## 👀 Preview Links

- **Watch Demo:** [View Here](https://drive.google.com/file/d/1_g2SyaP_WNV39AbhTBAQBpEbpffN_zUN/view?usp=sharing)

## 🔁 Quick Start (Backend + Frontend)


1) Backend:
```bash
cd vaulto-backend
npm install
node src/db/migrations/run.js
npm start
```

2) Frontend:
```bash
cd vaulto-frontend
npm install
npm run dev
```

Then open the URL printed by Vite (typically `http://localhost:5173`).

## Notes on Auth

- The frontend auto-calls `POST /auth/refresh` when it receives a 401, using an axios response interceptor (`src/lib/axios.js`).
- If refresh fails, the user is redirected to `/login`.


---

## ❤️ Connect

| Platform | Link |
|-----------|------|
| Email | rajendrabehera8116@gmail.com |
| LinkedIn | https://www.linkedin.com/in/behera-rajendra |
| GitHub | https://github.com/BRajendra10 |

### Source Code

| Repository | Link |
|------------|------|
| Frontend | https://github.com/BRajendra10/vaulto-frontend |
| Backend | https://github.com/BRajendra10/vaulto-backend |

--- 

⭐ If you found this project useful, consider giving it a star.