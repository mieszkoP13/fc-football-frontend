import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import useLocalStorageStatus from "../hooks/useLocalStorageStatus";
import '@fortawesome/fontawesome-free/css/all.min.css'
import AddTeam from "../components/AddTeam";
import EditTeam from "../components/EditTeam";
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

    const [leagueId] = useState(location.state)

    const [teams, setTeams] = useState([])
    const [editTeamID, setEditTeamID] = useState(-1)

    const showEditTeam = (e,id) => {
      e.preventDefault()
      e.stopPropagation()
      setEditTeamID(id)
    }

    useEffect(() => {
      axios
        .get(`https://fcfootball.azurewebsites.net/api/v1/leagues/${leagueId}`)
        .then((res) => {
          setTeams(res.data.teams)
        })
        .catch((err) => console.log(err));
    },[isLoggedIn,showPopUp,leagueId,editTeamID])

    const updatePopUpMessage = (popUpMsg) => {
      setPopUpMessage(popUpMsg)
      setShowPopUp(true);
      setEditTeamID(-1)
    }

    return (
    <div className="wrap-teams">
      {isLoggedIn ? (
        <>
          {showPopUp ? (
          <PopUp setShow={setShowPopUp} defaultBtnText="Ok">
            <h1 className="teams-popup-h1">Add Team info</h1>
            <span>
              {popUpMessage}
            </span>
          </PopUp>):(<></>)}
          <h1 className="teams-h1">Available teams</h1>
          {isUserModerator ? (<AddTeam updatePopUpMessage={updatePopUpMessage} leagueId={leagueId}/>):(<></>)}
          {teams.map((team, arrayID) => 
          <>
            {editTeamID === arrayID ? (<EditTeam updatePopUpMessage={updatePopUpMessage} leagueId={leagueId} team={team}/>) : (
            <div className="teams-it">
              <span className="teams-it-txt">{team.name}</span>
              {isUserModerator ? (
              <button className="btn-edit" onClick={e => showEditTeam(e, arrayID)}>
                <i className="fa-solid fa-pen-to-square"></i>
              </button>):(<></>)}
            </div>)
            }
          </>
          )}
        </>
      ) : (
        <span>Content unavailable, log in to grant access.</span>
      )}
    </div>
    );
};

export default Teams;