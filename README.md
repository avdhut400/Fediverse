# 🌍 PhotoFlux: Fediverse-Compatible Photo Sharing Platform


PhotoFlux is a decentralized photo-sharing platform built with ActivityPub.
It enables local users and remote users (for example, Mastodon accounts) to follow each other and interact across federated servers.

This project showcases practical federation, distributed social networking, and open interoperability standards.

## 🔥 Features

### Core Platform Features
- Secure user authentication with JWT.
- Photo upload and post management.
- Follow/unfollow relationships.
- Like and comment interactions.
- Personalized feed based on followed accounts.
- User profiles with posts, followers, and following data.

### Fediverse / ActivityPub Features
- WebFinger discovery support.
- Actor JSON endpoints.
- Inbox and Outbox handling.
- Remote follow compatibility.
- HTTP signatures for federation requests.
- Follow/Accept activity flow support.
- Public outbox feed support.

## 📦 Setup

### Prerequisites
- Node.js (recommended: LTS version)
- npm
- MongoDB (local or hosted)
- ngrok (required for remote federation testing)

> ⚠️ **Important (ngrok users)**
> Run `ngrok http 4000` every time you restart the backend.
> Update `BASE_URL` and `DOMAIN` in `backend/.env` after each restart because ngrok generates a new public URL.

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/photoflux.git
cd photoflux
```

### 2. Configure Backend
```bash
cd backend
npm install
cp .env.example .env
```

Update `backend/.env` with your values:
- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `BASE_URL` (your ngrok public URL if federating)
- `DOMAIN` (same public domain/ngrok URL)
- Optional email and cloud storage variables

### 3. Configure Frontend
```bash
cd ../frontend
npm install
cp .env.example .env
```

Set:
- `REACT_APP_API_URL` (for local: `http://localhost:4000`)

### 4. Start ngrok (Required for Federation)
Run this every time the backend restarts:

```bash
ngrok http 4000
```

Then update `BASE_URL` and `DOMAIN` in `backend/.env` with the new ngrok URL.

### 5. Run the Application
Open two terminals:

Terminal 1 (backend):
```bash
cd backend
npm start
```

Terminal 2 (frontend):
```bash
cd frontend
npm start
```

## ⚙️ Usage

### Local Usage
1. Register a new account.
2. Log in and create photo posts.
3. Follow users to personalize your feed.
4. Interact with posts using likes and comments.

### Federation Usage
1. Ensure backend is publicly accessible via ngrok.
2. Confirm `BASE_URL` and `DOMAIN` are updated.
3. Use Mastodon (or another compatible server) to remote-follow a local PhotoFlux user.
4. Validate Follow/Accept activity flow and outbox visibility.

### ActivityPub Endpoints
- `/.well-known/webfinger`
- `/users/:username`
- `/users/:username/inbox`
- `/users/:username/outbox`
- `/users/:username/followers`
- `/users/:username/following`

## 🛠️ Architecture Overview

```text
[React Frontend]
       |
    REST + JWT
       |
[Express Backend] ---- ActivityPub ----> [Remote Fediverse Servers]
       |
    MongoDB
```

## 🔐 Security and Key Management

PhotoFlux uses per-user RSA key pairs for ActivityPub federation.
Keys are generated automatically and stored in MongoDB during user registration.

Important notes:
- Do not run deprecated `genKey.js`.
- Do not use deprecated `utils/keys.js`.
- Key lifecycle is managed by the user model.

For details, see [KEY_MANAGEMENT.md](./KEY_MANAGEMENT.md).

## 🧰 Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- ActivityPub
- HTTP Signatures
- JWT Authentication

### Frontend
- React
- Bootstrap
- Axios

### Tools
- ngrok
- Postman
- Git/GitHub

## 📖 Additional Documentation

- [API_Docs.md](./API_Docs.md)
- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [KEY_MANAGEMENT.md](./KEY_MANAGEMENT.md)

## 🚀 Future Enhancements
- Remote post ingestion into local feed.
- ActivityPub Like and Announce support.
- Improved media federation.
- Moderation and reporting tools.
- Scalable inbox queue processing.

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

Avdhut Magar
