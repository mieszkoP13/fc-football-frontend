import React, { useEffect, useState } from "react";
import { useLocation, Link, useParams } from "react-router-dom";
import useLoginStatus from "../hooks/useLoginStatus";
import '@fortawesome/fontawesome-free/css/all.min.css'
import axios from "axios";
import "./TeamsView.css";

const TeamsView = (props) => {
  const location = useLocation();
  const { leagueName, season } = useParams()
  let isLoggedIn = useLoginStatus()

  const [leagueId] = useState(location.state)

  const [teams, setTeams] = useState([])

  useEffect(() => {
    axios
      .get(`https://fcfootball.azurewebsites.net/api/v1/leagues-view/${leagueId}`)
      .then((res) => {
        setTeams(res.data)
      })
      .catch((err) => console.log(err));
  },[isLoggedIn,leagueId])

  return (
  <div className="wrap-teams">
    {isLoggedIn ? (
      <>
        <h1 className="teams-h1">Available teams</h1>

        {teams.map((team) => 
        <>
          <Link className="teams-view-it" to={encodeURIComponent(team.teamName) + "/MatchesView"} state={ { team: team.teamId, league: leagueId } } >
            <span className="teams-view-txt">{team.teamName}</span>
            <span className="teams-view-txt">W/D/L: {team.wins}/{team.draws}/{team.losses}</span>
            <span className="teams-view-txt">Goal Difference: {team.goalDifference}</span>
            <span className="teams-view-txt"></span>
            <span className="teams-view-txt">Points: {team.points}</span>
            <span className="teams-view-txt">Goals Against: {team.goalsAgainst}</span>
            <span className="teams-view-txt"></span>
            <span className="teams-view-txt"></span>
            <span className="teams-view-txt">Goals for: {team.goalsFor}</span>
          </Link>
        </>
        )}
      </>
    ) : (
      <span>Content unavailable, log in to grant access.</span>
    )}
  </div>
  );
};

export default TeamsView;