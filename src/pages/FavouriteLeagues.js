import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom'

import axios from "axios";
import useLocalStorageStatus from "../hooks/useLocalStorageStatus";
import "./FavouriteLeagues.css";

const FavouriteLeagues = (props) => {
    let isLoggedIn = useLocalStorageStatus("token");
    const [leagues, setLeagues] = useState(<></>)

    useEffect(() => {
        axios
          .get("https://fcfootball.azurewebsites.net/api/v1/leagues?official=true")
          .then((res) => {
            console.log(res.data)
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

export default FavouriteLeagues;