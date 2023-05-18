import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import NavBar from "./components/NavBar";
import Leagues from "./pages/Leagues";
import FavouriteLeagues from "./pages/FavouriteLeagues";
import Teams from "./pages/Teams";

const RouteSwitch = () => {
  return (
    <BrowserRouter>
      <NavBar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Leagues" element={<Leagues />} />
        <Route path="/Leagues/:leagueName/:season/Teams" element={<Teams />} />
        <Route path="/FavouriteLeagues" element={<FavouriteLeagues />} />
        <Route path="/FavouriteLeagues/:leagueName/:season/Teams" element={<Teams />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/SignIn" element={<SignIn/>} />
        <Route path="/users/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RouteSwitch;
