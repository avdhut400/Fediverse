# 🌍 Photoflux – Fediverse Compatible Photo Sharing Platform

Photoflux is a decentralized, Fediverse-compatible photo sharing social media platform built using the ActivityPub protocol.  
It allows local and remote users (e.g., Mastodon users) to follow, interact, and exchange posts across federated servers.

This project demonstrates real-world implementation of distributed systems, federation, and open social networking standards.

---

## 🔥 Why This Project?

Centralized social networks control user data and content.  
Photoflux explores the future of decentralized social media using:

- Federation instead of central servers  
- Open protocols instead of closed APIs  
- Interoperability across platforms (Mastodon, Pleroma, etc.)

---

> ⚠️ **IMPORTANT**
>
> If you are using **ngrok** for local development, you must run the following command **every time you restart the application**:
>
> ```bash
> ngrok http 4000
> ```
>
> This is required because ngrok generates a new public URL on each restart, which must be updated in your application configuration (e.g., `BASE_URL`).



## 🚀 Key Features

### Core Platform
- User Registration & JWT Authentication  
- Create, view, and manage photo posts  
- Follow / Unfollow users  
- Like and comment on posts  

### Fediverse / ActivityPub Features
- WebFinger implementation  
- Actor JSON endpoints  
- Inbox / Outbox handling  
- Remote Follow support (Mastodon compatible)  
- HTTP Signatures for secure federation  
- Accept / Follow activity handling  
- Public feed via ActivityPub Outbox  

---
<img width="1862" height="903" alt="image" src="https://github.com/user-attachments/assets/1c03124d-13f6-41b9-af15-798321156b15" />
<img width="1901" height="927" alt="Screenshot 2026-07-16 174018" src="https://github.com/user-attachments/assets/0698f286-ec61-4d54-8e0b-7525b4ed8f48" />
<img width="1890" height="905" alt="Screenshot 2026-07-16 174059" src="https://github.com/user-attachments/assets/75c87ea0-49be-4947-93e2-29fb5f1191d3" />
<img width="1887" height="912" alt="Screenshot 2026-07-16 174155" src="https://github.com/user-attachments/assets/75e4e564-e783-4b57-a09d-1d5564ef409a" />
<img width="1853" height="924" alt="Opera Snapshot_2026-07-16_174331_localhost" src="https://github.com/user-attachments/assets/0e9f467c-4ea3-4651-a0c0-3ba744a90530" />

## 🛠️ Tech Stack

### Backend
- Node.js  
- Express.js  
- MongoDB  
- ActivityPub Protocol  
- HTTP Signatures  
- JWT Authentication  

### 4. Frontend Setup

- React  
- Bootstrap  
- Axios  

### Tools
- Ngrok (for federation testing)  
- Postman  
- Git & GitHub  

---
## ⚙️ Project Architecture

```text
[React Frontend]
        |
     REST + JWT
        |
[Express Backend] ---- ActivityPub ----> [Remote Fediverse Servers]
        |
     MongoDB
```

## 📦 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/photoflux.git
cd photoflux
```
### 2. Backend
```bash
cd backend
npm install
```
### 3. Create a `.env` file:

```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret
BASE_URL=https://your-ngrok-url

```
```bash
npm start
```
### Frontend
```bash

cd frontend
npm install
npm run dev
 
```
## Database Schema

The database schema for this project was designed using **dbdiagram.io** and represents the MongoDB collections and their logical relationships.

🔗 **View Database Schema:** https://dbdiagram.io/d/6a630c32c3a90dd98da8747d

---
### ActivityPub Endpoints
WebFinger: /.well-known/webfinger

Actor: /activitypub/users/:username

Inbox: /activitypub/inbox/:username

Outbox: /activitypub/outbox/:username

Followers: /activitypub/followers/:username

Following: /activitypub/following/:username

---
### Tested With

Mastodon remote follow

Remote Accept / Follow flow

Public Outbox feed
---

### Future Enhancements

Full remote post ingestion into local feed

ActivityPub Like & Announce activities

Media federation improvements

Moderation & reporting system

Scalable inbox queue processing
 
---
### Contributing

Contributions are welcome!

Please read CONTRIBUTING.md before submitting pull requests.
 
---
### License

This project is licensed under the MIT License.

---
### Author

Avdhut Magar
---

---
