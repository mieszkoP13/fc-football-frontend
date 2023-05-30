import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import useLocalStorageStatus from "../hooks/useLocalStorageStatus";
import useLocalStorage from "../hooks/useLocalStorage";
import '@fortawesome/fontawesome-free/css/all.min.css'
import AddPlayer from "../components/AddPlayer";
import EditTeam from "../components/EditTeam";
import PopUp from "../components/PopUp";
import axios from "axios";
import "./Players.css";
import useUserRoleStatus from "../hooks/useUserRoleStatus";

const Players = (props) => {
    const location = useLocation();
    const { teamName } = useParams()
    let isLoggedIn = useLocalStorageStatus("token");
    let token = useLocalStorage("token")
    let isUserModerator = useUserRoleStatus("ROLE_MODERATOR")

    const [showPopUpDelete, setShowPopUpDelete] = useState(false);

    const [showPopUp, setShowPopUp] = useState(false);
    const [popUpMessage, setPopUpMessage] = useState("")

    const [teamId] = useState(location.state)

    const [players, setPlayers] = useState([])
    const [editPlayerID, setEditPlayerID] = useState(-1)
    const [deletePlayerID, setDeletePlayerID] = useState(-1)

    useEffect(() => {
      axios
        .get(`https://fcfootball.azurewebsites.net/api/v1/players/teams/${teamId}`)
        .then((res) => {
          setPlayers(res.data)
        })
        .catch((err) => console.log(err));
    },[isLoggedIn,showPopUp,teamId,deletePlayerID,editPlayerID])

    const updatePopUpMessage = (popUpMsg) => {
      setPopUpMessage(popUpMsg)
      setShowPopUp(true);
      setEditPlayerID(-1)
    }

    // const showEditTeam = (e,id) => {
    //   e.preventDefault()
    //   e.stopPropagation()
    //   setEditTeamID(id)
    // }

    // const showDeleteTeam = (e,id) => {
    //   e.preventDefault()
    //   e.stopPropagation()
    //   setDeleteTeamID(id)
    //   setShowPopUpDelete(true)
    // }

    // const deleteTeam = (id) => {
    //   axios
    //     .delete(
    //       `https://fcfootball.azurewebsites.net/api/v1/teams/${id}`,
    //       {
    //         headers: {
    //           Authorization: `Bearer ${token[0]}`,
    //         },
    //       })
    //     .then((res) => {
    //       console.log(res)
    //       setDeleteTeamID(-1)
    //     })
    //     .catch((err) => {
    //       console.log(err)
    //       setDeleteTeamID(-1)
    //     });
    // };

    return (
    <div className="wrap-teams">
      {isLoggedIn ? (
        <>
          <h1 className="teams-h1">Available players</h1>
          {showPopUp ? (
          <PopUp setShow={setShowPopUp} defaultBtnText="Ok">
            <h1 className="teams-popup-h1">Add player info</h1>
            <span>
              {popUpMessage}
            </span>
          </PopUp>):(<></>)}
          {isUserModerator ? (<AddPlayer updatePopUpMessage={updatePopUpMessage} teamId={teamId}/>):(<></>)}

          {/* {showPopUpDelete ? (
            <PopUp setShow={setShowPopUpDelete} customFunction={()=>deleteTeam(deleteTeamID)} customFunctionBtnText="Delete" defaultBtnText="Cancel">
              <h1 className="sign-in-err-h1">
                Are you sure you want to delete this team?
              </h1>
              <span>This action is irreversible</span>
            </PopUp>) : (<></>)
          } */}

          {players.map((player, arrayID) => 
          <>
            {/* {editTeamID === arrayID ? (<EditTeam updatePopUpMessage={updatePopUpMessage} leagueId={leagueId} team={team}/>) : ( */}
            <div className="players-it">
              <span className="players-it-txt">{player.firstName} {player.lastName}</span>
              <span className="players-it-txt">{player.position}</span>
              <span className="players-it-txt">{player.height}cm {player.weight}kg</span>
              <span className="players-it-txt"></span>
              <span className="players-it-txt"></span>
              <span className="players-it-txt">Born: {player.birthDate}</span>
              <span className="players-it-txt">Contracted</span>
              <span className="players-it-txt">From: {player.teamsHistory[0].start}</span>
              <span className="players-it-txt">To: {player.teamsHistory[0].ends}</span>
              {/* {isUserModerator ? (
              <div>
                <button className="btn-edit" onClick={e => showEditTeam(e, arrayID)}>
                  <i className="fa-solid fa-pen-to-square"></i>
                </button>
                <button className="btn-edit" onClick={e => showDeleteTeam(e, team.id)}>
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              </div>):(<></>)} */}
            </div>
            {/* )} */}
          </>
          )}
        </>
      ) : (
        <span>Content unavailable, log in to grant access.</span>
      )}
    </div>
    );
};

export default Players;