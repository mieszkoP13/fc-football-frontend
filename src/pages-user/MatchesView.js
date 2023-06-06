import React, { useState, useEffect } from "react";
import { useLocation, Link, useParams } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css'
import axios from "axios";
import useLoginStatus from "../hooks/useLoginStatus";
import "./MatchesView.css";

const MatchesView = (props) => {
  const location = useLocation();
  let isLoggedIn = useLoginStatus()

  const [teamId] = useState(location.state.team)
  const [leagueId] = useState(location.state.league)

  const [matches, setMatches] = useState([])

  useEffect(() => {
    axios
      .get(`https://fcfootball.azurewebsites.net/api/v1/matches-view/leagues/${leagueId}/teams/${teamId}`)
      .then((res) => {
        setMatches(res.data.content)
      })
      .catch((err) => console.log(err));
  },[isLoggedIn,teamId])

  useEffect(()=>console.log(matches),[matches])

  return (
  <div className="wrap-matches-view">
    {isLoggedIn ? (
      <>
        <h1 className="matches-view-h1">Available Matches</h1>

        {matches.map((match) => 
          <>
            <div className="matches-view-it">
              <span className="matches-view-it-txt"></span>
              <span className="matches-view-it-txt">{match.league.name}</span>
              <span className="matches-view-it-txt"></span>
              <span className="matches-view-it-txt">{match.homeTeam.name}</span>
              <span className="matches-view-it-txt">{match.homeTeamScore}:{match.awayTeamScore}</span>
              <span className="matches-view-it-txt">{match.awayTeam.name}</span>

              {match.goals?.map(goal =>
                <>
                <span className="matches-view-it-txt">{match.homeTeam.players.find(player => player.playerId === goal.playerId)?.lastName} {match.homeTeam.players.find(player => player.playerId === goal.playerId)?.lastName ? goal.time+'`' : null}</span>
                <span className="matches-view-it-txt"></span>
                <span className="matches-view-it-txt">{match.awayTeam.players.find(player => player.playerId === goal.playerId)?.lastName} {match.awayTeam.players.find(player => player.playerId === goal.playerId)?.lastName ? goal.time+'`' : null}</span>
                </>
              )}

              
              <span className="matches-view-it-txt">
                Home team players: <select className="match-view-select-player">
                  {match.homeTeam.players.map(player => <option>{player.firstName} {player.lastName}</option>)}
                </select>
              </span>
              <span className="matches-view-it-txt"></span>
              <span className="matches-view-it-txt">
                Away team players: <select className="match-view-select-player">
                  {match.awayTeam.players.map(player => <option>{player.firstName} {player.lastName}</option>)}
                </select>
              </span>

              <span className="matches-view-it-txt"></span>
              <span className="matches-view-it-txt">{match.date}    {match.time}</span>
              <span className="matches-view-it-txt"></span>
            </div>
          </>
        )}
      </>
    ) : (
      <span className="profile-span">You've been logged out, sign in again or sign up for free!</span>
    )}
  </div>
  );
};

export default MatchesView;