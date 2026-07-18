import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import FeedPage from "./Pages/Feed";
import PostForm from "./Pages/PostForm";
import Signup from "./Pages/Register";
import Login from "./Pages/Login";
// import UserList from "./Pages/UserList";
import UserProfile from "./Pages/UserProfile";
// import FollowRemote from "./Pages/FollowRemote";
import InboxDebug from "./Pages/InboxDebug";
import FollowersPage from "./Pages/FollowersPage";
import RemoteSearch from "./Pages/RemoteSearch";
import UserOutboxPage from "./Pages/UserOutboxPage";
// import FeedPage from "./Pages/Feed";
import LocalUserSearch from "./Pages/LocalUserSearch";
import Home from "./Pages/home";

import Chatbot from "./components/Chatbot";
import Footer from "./components/Footer";
function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Navbar />

        <main className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/feed" element={<FeedPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/post" element={<PostForm />} />
            <Route path="/profile/:username" element={<UserProfile />} />
            <Route path="/debug-inbox" element={<InboxDebug />} />
            <Route path="/followers/:username" element={<FollowersPage />} />
            <Route path="/remote-search" element={<RemoteSearch />} />
            <Route path="/local-users" element={<LocalUserSearch />} />
            <Route path="/users/:username/outbox" element={< UserOutboxPage />} />
          </Routes>
        </main>
        <Chatbot />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
