import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import useLocalStorageStatus from "../hooks/useLocalStorageStatus";
import AddTeam from "../components/AddTeam";
import PopUp from "../components/PopUp";
import axios from "axios";
import "./Teams.css";
import useUserRoleStatus from "../hooks/useUserRoleStatus";

const Teams = (props) => {
    const location = useLocation();
    const { leagueName, season } = useParams()
    let isLoggedIn = useLocalStorageStatus("token");
    let isUserModerator = useUserRoleStatus("ROLE_MODERATOR")

    const [showPopUp, setShowPopUp] = useState(false);
    const [popUpMessage, setPopUpMessage] = useState("")

    const [teams, setTeams] = useState([])
    const [leagueId] = useState(location.state)

    useEffect(() => {
      axios
        .get(`https://fcfootball.azurewebsites.net/api/v1/leagues/${leagueId}`)
        .then((res) => {
          setTeams(res.data.teams)
        })
        .catch((err) => console.log(err));
    },[isLoggedIn,showPopUp,leagueId])

    const updatePopUpMessage = (popUpMsg) => {
      setPopUpMessage(popUpMsg)
      setShowPopUp(true);
    }

    return (
    <div className="wrap-teams">
      {isLoggedIn ? (
        <>
          <PopUp show={showPopUp} setShow={setShowPopUp}>
            <h1 className="teams-popup-h1">Add Team info</h1>
            <span>
              {popUpMessage}
            </span>
          </PopUp>
          <h1 className="teams-h1">Available teams</h1>
          {isUserModerator ? (<AddTeam updatePopUpMessage={updatePopUpMessage} leagueId={leagueId}/>):(<></>)}
          {
            teams.map(team => 
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