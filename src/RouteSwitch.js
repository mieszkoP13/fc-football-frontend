import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import NavBar from "./components/NavBar";
import Leagues from "./pages/Leagues";
import FollowedLeagues from "./pages/FollowedLeagues";
import Teams from "./pages/Teams";
import Matches from "./pages/Matches";
import Players from "./pages/Players";

import LeaguesView from "./pages-user/LeaguesView";
import TeamsView from "./pages-user/TeamsView";
import MatchesView from "./pages-user/MatchesView";
import AdminPanel from "./pages-admin/AdminPanel";

const RouteSwitch = () => {
  return (
    <BrowserRouter>
      <NavBar/>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/AdminPanel" element={<AdminPanel />} />

        <Route path="/Leagues" element={<Leagues />} />
        <Route path="/Leagues/:leagueName/:season/Teams" element={<Teams />} />
        <Route path="/Leagues/:leagueName/:season/Teams/:teamName/Players" element={<Players />} />
        <Route path="/Matches" element={<Matches />} />
        <Route path="/Matches/:pageNo" element={<Matches />} />

        <Route path="/FollowedLeagues" element={<FollowedLeagues />} />
        <Route path="/FollowedLeagues/:leagueName/:season/TeamsView" element={<TeamsView />} />
        <Route path="/FollowedLeagues/:leagueName/:season/TeamsView/:teamName/MatchesView" element={<MatchesView />} />

        <Route path="/LeaguesView" element={<LeaguesView />} />
        <Route path="/LeaguesView/:leagueName/:season/TeamsView" element={<TeamsView />} />
        <Route path="/LeaguesView/:leagueName/:season/TeamsView/:teamName/MatchesView" element={<MatchesView />} />

        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/SignIn" element={<SignIn/>} />
        <Route path="/users/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RouteSwitch;
