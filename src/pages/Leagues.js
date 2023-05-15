import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom'

import axios from "axios";
import useLoginStatus from "../hooks/useLoginStatus";
import "./Leagues.css";

const Leagues = (props) => {
    let isLoggedIn = useLoginStatus();
    const [leagues, setLeagues] = useState(<></>)

    useEffect(() => {
        axios
          .get("https://fcfootball.azurewebsites.net/api/v1/leagues")
          .then((res) => {
            setLeagues( res.data.map(league => 
              <Link className="leagues-it" to={encodeURIComponent(league.name) + '/' + encodeURIComponent(league.season) +"/Teams"} state={ league.teams } >
                <span className="leagues-it-txt">{league.name}</span>
                <span className="leagues-it-txt">{league.season}</span>
                <span className="leagues-it-txt">{league.country}</span>
              </Link>
            ) )
          })
          .catch((err) => console.log(err));
    },[])

    return (
    <div className="wrap-leagues">
      {isLoggedIn ? (
        <>
            <h1 className="leagues-h1">Available leagues</h1>
            {leagues}
        </>
      ) : (
        <span>Content unavailable, log in to grant access.</span>
      )}
    </div>
    );
};

export default Leagues;