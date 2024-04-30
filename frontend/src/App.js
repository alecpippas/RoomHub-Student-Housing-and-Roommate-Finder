import React from "react";
import { Container } from "react-bootstrap";
import Header from "./components/Header";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import SignUpScreen from "./screens/SignUpScreen";
import LoginScreen from "./screens/LoginScreen";
import ListingsScreen from "./screens/ListingsScreen";
import SettingsScreen from "./screens/SettingsScreen";
import UserProfileScreen from "./screens/UserProfileScreen";
import InboxScreen from "./screens/InboxScreen";
import ViewListingScreen from "./screens/ViewListingScreen";
import MessageUserScreen from "./screens/MessageUserScreen"
import FavoritesScreen from "./screens/FavoritesScreen";

export default function App() {
  return (
    <div>
      <Router>
        <Header />
        <Routes>
          <Route exact path="/" element={<HomeScreen />}></Route>
          <Route exact path="/listings" element={<ListingsScreen />}></Route>
          <Route
            exact
            path="/listings/:id"
            element={<ViewListingScreen />}
          ></Route>
          <Route exact path="/signup" element={<SignUpScreen />}></Route>
          <Route exact path="/settings" element={<SettingsScreen />}></Route>
          <Route exact path="/login" element={<LoginScreen />}></Route>
          <Route path="/profile/:id" element={<UserProfileScreen />} />
          <Route path="/favorites/:id" element={<FavoritesScreen />} />
          <Route path="/inbox" element={<InboxScreen />} />
          <Route path="/message/:userId" element={<MessageUserScreen />} />
        </Routes>
      </Router>
    </div>
  );
}
