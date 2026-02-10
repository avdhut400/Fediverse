import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import FeedPage from "./Pages/Feed";
import PostForm from "./Pages/PostForm";
import Signup from "./Pages/Register";
import VerifyOtp from "./Pages/VerifyOtp";
import Login from "./Pages/Login";
import UserProfile from "./Pages/UserProfile";
import InboxDebug from "./Pages/InboxDebug";
import FollowersPage from "./Pages/FollowersPage";
import RemoteSearch from "./Pages/RemoteSearch";
import UserOutboxPage from "./Pages/UserOutboxPage";
import LocalUserSearch from "./Pages/LocalUserSearch";
import ForgotPassword from "./Pages/ForgotPassword";
import Home from "./Pages/home";
import Footer from "./components/Footer";
import Settings from "./Pages/Settings";

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
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/login" element={<Login />} />
            <Route path="/post" element={<PostForm />} />
            <Route path="/profile/:username" element={<UserProfile />} />
            <Route path="/debug-inbox" element={<InboxDebug />} />
            <Route path="/followers/:username" element={<FollowersPage />} />
            <Route path="/remote-search" element={<RemoteSearch />} />
            <Route path="/local-users" element={<LocalUserSearch />} />
            <Route
              path="/users/:username/outbox"
              element={<UserOutboxPage />}
            />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
