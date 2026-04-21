# ChatUpp 

A real-time chat application built with **Node.js**, **Express**, **MongoDB**, and **Socket.IO** — featuring JWT-based authentication for both REST and WebSocket connections, persistent message storage, input validation, and full Docker + Compose support.

---

## Features

-  **JWT Authentication (HTTP + WebSocket)**  
  Socket.IO connections are secured via JWT middleware before any event is processed

-  **Real-time Messaging**  
  Bidirectional communication using Socket.IO with instant message broadcasting

-  **Persistent Storage**  
  Messages stored in MongoDB with sender details populated using Mongoose

-  **Dockerized Setup**  
  Multi-service Docker Compose setup (Node.js + MongoDB) with volumes and restart policies

-  **Input Validation**  
  Empty and whitespace messages are rejected server-side before DB write

-  **Health Check Endpoint**  
  `/health` route for monitoring and container readiness

-  **Secure Configuration**  
  Secrets stored in `.env` (excluded from Git and Docker images)

---

## Tech Stack

| Layer | Technology |
|------|----------|
| Runtime | Node.js 18 (Alpine Docker Image) |
| Framework | Express 5 |
| Real-time | Socket.IO 4 |
| Database | MongoDB 6 + Mongoose |
| Authentication | JWT (jsonwebtoken) + bcryptjs |
| Containerization | Docker + Docker Compose |
| Dev Tooling | Nodemon |

---

## Project Structure

```
ChatUpp/
├── config/
│ └── db.js
├── controllers/
│ └── authControllers.js
├── middleware/
│ └── authMiddleware.js
├── models/
│ ├── Message.js
│ └── User.js
├── public/
│ └── index.html
├── routes/
│ ├── authRoutes.js
│ └── messagesRoutes.js
├── .dockerignore
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── index.js
├── .env.example
├── package.json
└── package-lock.json
```

## How It Works

1. User registers or logs in via REST API
2. Server returns a JWT token
3. Token is stored on the client (localStorage)
4. Socket.IO connection sends token during handshake
5. Server verifies JWT before allowing connection
6. Authenticated users can send messages
7. Messages are stored in MongoDB and broadcast to all connected clients

---
## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (optional if using Docker)

---

### 1. Clone the repo

```bash
git clone https://github.com/tanmaymishrab0c9/ChatUpp.git
cd ChatUpp
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/chatapp   # local
# OR
MONGO_URI=mongodb://mongo:27017/chatapp       # Docker

JWT_SECRET=your_secret_key
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

Generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Run locally

```bash
npm install
npm run dev
```

App runs at: `http://localhost:3000`

---

## Run with Docker (Recommended)

Runs the Node.js backend and MongoDB as separate services using Docker Compose.

```bash
docker compose up --build
```

- App → `http://localhost:4000`
- MongoDB → `localhost:27017`

Stop:

```bash
docker compose down
```

---

## API Reference

### Authentication

| Method | Endpoint | Body |
|---|---|---|
| `POST` | `/api/auth/register` | `{ username, email, password }` |
| `POST` | `/api/auth/login` | `{ email, password }` |

### Messages

| Method | Endpoint | Auth |
|---|---|---|
| `GET` | `/api/messages` | Bearer Token |

### Health

| Method | Endpoint |
|---|---|
| `GET` | `/health` |

---

## WebSocket Usage

```js
const socket = io({
  auth: { token: "" }
});
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Server port |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | JWT signing secret |
| `NODE_ENV` | Environment |
| `CLIENT_URL` | Allowed frontend origin |

---

## Security

- Passwords hashed with `bcryptjs`
- JWT verified on every request and socket connection
- Protected routes require valid token
- `.env` excluded from version control

---

## Roadmap

- [ ] Redis caching for messages
- [ ] Private chat (Socket.IO rooms)
- [ ] Typing indicators
- [ ] Rate limiting
- [ ] CI/CD pipeline
- [ ] Cloud deployment

---

## Author

**Tanmay Mishra**
[GitHub](https://github.com/tanmaymishrab0c9) · [LinkedIn](linkedin.com/in/tanmay-mishra-539707221) · [Email](mailto:tanmaymishra747@gmail.com)
