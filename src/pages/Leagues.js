import React, { useState, useEffect } from "react";
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
            console.log(res.data)
            setLeagues( res.data.map(league => 
                <div className="leagues-it">
                    <span className="leagues-it-txt">{league.name}</span>
                    <span className="leagues-it-txt">{league.season}</span>
                </div>
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