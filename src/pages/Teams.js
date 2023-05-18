import React from "react";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import useLocalStorageStatus from "../hooks/useLocalStorageStatus";
import "./Teams.css";

const Teams = (props) => {
    const location = useLocation();
    const { leagueName, season } = useParams()
    let isLoggedIn = useLocalStorageStatus("token");

    return (
    <div className="wrap-teams">
      {isLoggedIn ? (
        <>
            <h1 className="teams-h1">Available teams</h1>
            {
                location.state.map(team => 
                <div className="teams-it">
                    <span className="teams-it-txt">{team.name}</span>
                </div>)
            }
        </>
      ) : (
        <span>Content unavailable, log in to grant access.</span>
      )}
    </div>
    );
};

export default Teams;