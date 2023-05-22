import React, { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom'
import axios from "axios";
import useLocalStorageStatus from "../hooks/useLocalStorageStatus";
import useLocalStorage from "../hooks/useLocalStorage";
import "./FollowedLeagues.css";

const FollowedLeagues = (props) => {
    const effectRan = useRef(false)
    let isLoggedIn = useLocalStorageStatus("token");
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
    <div className="wrap-leagues">
      {isLoggedIn ? (
        <>
            <h1 className="leagues-h1">Available leagues</h1>
            {leagues.map(league => 
              <Link className="leagues-it" to={encodeURIComponent(league.name) + '/' + encodeURIComponent(league.season) +"/Teams"} state={ league.id } >
                <span className="leagues-it-txt">{league.name}</span>
                <span className="leagues-it-txt">{league.season}</span>
                <span className="leagues-it-txt">{league.country}</span>
              </Link>
            )}
        </>
      ) : (
        <span>Content unavailable, log in to grant access.</span>
      )}
    </div>
    );
};

export default FollowedLeagues;