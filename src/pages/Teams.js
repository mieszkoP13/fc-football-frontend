import React, { useEffect, useState } from "react";
import { useLocation, Link, useParams } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";
import useLoginStatus from "../hooks/useLoginStatus";
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
  let isLoggedIn = useLoginStatus()
  let token = useLocalStorage("token")
  let isUserModerator = useUserRoleStatus("ROLE_MODERATOR")

  const [showPopUpDelete, setShowPopUpDelete] = useState(false);

  const [showPopUp, setShowPopUp] = useState(false);
  const [popUpMessage, setPopUpMessage] = useState("")

  const [leagueId] = useState(location.state)

  const [teams, setTeams] = useState([])
  const [editTeamID, setEditTeamID] = useState(-1)
  const [deleteTeamID, setDeleteTeamID] = useState(-1)

  useEffect(() => {
    axios
      .get(`https://fcfootball.azurewebsites.net/api/v1/leagues/${leagueId}`)
      .then((res) => {
        setTeams(res.data.teams)
      })
      .catch((err) => console.log(err));
  },[isLoggedIn,showPopUp,leagueId,deleteTeamID,editTeamID])

  const updatePopUpMessage = (popUpMsg) => {
    setPopUpMessage(popUpMsg)
    setShowPopUp(true);
    setEditTeamID(-1)
  }

  const showEditTeam = (e,id) => {
    e.preventDefault()
    e.stopPropagation()
    setEditTeamID(id)
  }

  const showDeleteTeam = (e,id) => {
    e.preventDefault()
    e.stopPropagation()
    setDeleteTeamID(id)
    setShowPopUpDelete(true)
  }

  const deleteTeam = (id) => {
    axios
      .delete(
        `https://fcfootball.azurewebsites.net/api/v1/teams/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token[0]}`,
          },
        })
      .then((res) => {
        setDeleteTeamID(-1)
      })
      .catch((err) => {
        setDeleteTeamID(-1)
      });
  };

  return (
  <div className="wrap-teams">
    {isLoggedIn ? (
      <>
        <h1 className="teams-h1">Available teams</h1>
        {showPopUp ? (
        <PopUp setShow={setShowPopUp} defaultBtnText="Ok">
          <h1 className="teams-popup-h1">Add Team info</h1>
          <span>
            {popUpMessage}
          </span>
        </PopUp>):(<></>)}
        {isUserModerator ? (<AddTeam updatePopUpMessage={updatePopUpMessage} leagueId={leagueId}/>):(<></>)}

        {showPopUpDelete ? (
          <PopUp setShow={setShowPopUpDelete} customFunction={()=>deleteTeam(deleteTeamID)} customFunctionBtnText="Delete" defaultBtnText="Cancel">
            <h1 className="sign-in-err-h1">
              Are you sure you want to delete this team?
            </h1>
            <span>This action is irreversible</span>
          </PopUp>) : (<></>)
        }

        {teams.map((team, arrayID) => 
        <>
          {editTeamID === arrayID ? (<EditTeam updatePopUpMessage={updatePopUpMessage} leagueId={leagueId} team={team}/>) : (
          <Link className="teams-it" to={encodeURIComponent(team.name) + "/Players"} state={ team.id } >
            <span className="teams-it-txt">{team.name}</span>
            {isUserModerator ? (
            <div>
              <button className="btn-edit" onClick={e => showEditTeam(e, arrayID)}>
                <i className="fa-solid fa-pen-to-square"></i>
              </button>
              <button className="btn-edit" onClick={e => showDeleteTeam(e, team.id)}>
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>):(<></>)}
          </Link>)
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