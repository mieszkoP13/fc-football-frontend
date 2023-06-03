import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom'
import '@fortawesome/fontawesome-free/css/all.min.css'
import axios from "axios";
import useLoginStatus from "../hooks/useLoginStatus";
import useLocalStorage from "../hooks/useLocalStorage";
import "./LeaguesView.css";

const LeaguesView = (props) => {
  let isLoggedIn = useLoginStatus()
  let token = useLocalStorage("token")

  const [leagues, setLeagues] = useState([])
  const [followedLeaguesIDs, setFollowedLeaguesIDs] = useState([])

  useEffect(() => {
    axios
      .get("https://fcfootball.azurewebsites.net/api/v1/leagues")
      .then((res) => {
        setLeagues(res.data)
      })
      .catch((err) => console.log(err));
  },[isLoggedIn,followedLeaguesIDs])

  useEffect(() => {
    axios
      .get("https://fcfootball.azurewebsites.net/api/v1/followed-leagues",{
        headers: {
          Authorization: `Bearer ${token[0]}`,
        },
      })
      .then((res) => {
        setFollowedLeaguesIDs(res.data)
      })
      .catch((err) => console.log(err));
  },[])

  const followLeague = (e, leagueID) => {
    e.preventDefault()
    e.stopPropagation()
    axios
      .put(`https://fcfootball.azurewebsites.net/api/v1/followed-leagues/${leagueID}`, {} ,{
        headers: {
          Authorization: `Bearer ${token[0]}`,
        },
      })
      .then((res) => {
        setFollowedLeaguesIDs(followedLeaguesIDs => [...followedLeaguesIDs, leagueID])
      })
      .catch((err) => console.log(err));
  }

  const unfollowLeague = (e, leagueID) => {
    e.preventDefault()
    e.stopPropagation()
    axios
      .delete(`https://fcfootball.azurewebsites.net/api/v1/followed-leagues/${leagueID}` ,{
        headers: {
          Authorization: `Bearer ${token[0]}`,
        },
      })
      .then((res) => {
        setFollowedLeaguesIDs(followedLeaguesIDs.filter(id => id !== leagueID))
      })
      .catch((err) => console.log(err));
  }

  return (
  <div className="wrap-leagues-view">
    {isLoggedIn ? (
      <>
          <h1 className="leagues-view-h1">Available leagues</h1>
          {leagues.map((league) => 
            <>
              <Link className="leagues-view-it" to={encodeURIComponent(league.name) + '/' + encodeURIComponent(league.season) +"/TeamsView"} state={ league.id } >
                <span className="leagues-view-it-txt">{league.name}</span>
                <span className="leagues-view-it-txt">{league.season}</span>
                <span className="leagues-view-it-txt">{league.country}</span>
                <div>

                  {!followedLeaguesIDs.includes(league.id) ?
                  (<button className="btn-follow" onClick={e => followLeague(e, league.id)}>
                    <i className="fa-solid fa-thumbs-up"></i>
                  </button>):(
                  <button className="btn-follow" onClick={e => unfollowLeague(e, league.id)}>
                    <i className="fa-solid fa-thumbs-down"></i>
                  </button>)
                  }
                </div>
            </Link>
            </>
          )}
      </>
    ) : (
      <span className="profile-span">You've been logged out, sign in again or sign up for free!</span>
    )}
  </div>
  );
};

export default LeaguesView;