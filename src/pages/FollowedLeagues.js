import React, { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom'
import axios from "axios";
import useLoginStatus from "../hooks/useLoginStatus";
import useLocalStorage from "../hooks/useLocalStorage";
import "./FollowedLeagues.css";

const FollowedLeagues = (props) => {
  const effectRan = useRef(false)
  let isLoggedIn = useLoginStatus()
  let token = useLocalStorage("token")
  const [leagues, setLeagues] = useState([])

  useEffect(() => {

    // prevents fetching data twice with strict mode
    if( effectRan.current === false ) {
      axios
        .get("https://fcfootball.azurewebsites.net/api/v1/followed-leagues",{
          headers: {
            Authorization: `Bearer ${token[0]}`,
          },
        })
        .then((res) => {
          res.data.forEach(leagueID => {
            axios
              .get(`https://fcfootball.azurewebsites.net/api/v1/leagues/${leagueID}`)
              .then((res) => {
                setLeagues(leagues => [...leagues,res.data])
              })
              .catch((err) => console.log(err));
          })
        })
        .catch((err) => console.log(err));
    }

    return () => effectRan.current = true
  },[])

  return (
  <div className="wrap-followed-leagues">
    {isLoggedIn ? (
      <>
          <h1 className="followed-leagues-h1">Available leagues</h1>
          {leagues.map(league => 
            <Link className="followed-leagues-it" to={encodeURIComponent(league.name) + '/' + encodeURIComponent(league.season) +"/Teams"} state={ league.id } >
              <span className="followed-leagues-it-txt">{league.name}</span>
              <span className="followed-leagues-it-txt">{league.season}</span>
              <span className="followed-leagues-it-txt">{league.country}</span>
            </Link>
          )}
      </>
    ) : (
      <span className="profile-span">You've been logged out, sign in again or sign up for free!</span>
    )}
  </div>
  );
};

export default FollowedLeagues;