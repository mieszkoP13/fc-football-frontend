import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom'
import '@fortawesome/fontawesome-free/css/all.min.css'
import axios from "axios";
import useLocalStorageStatus from "../hooks/useLocalStorageStatus";
import useUserRoleStatus from "../hooks/useUserRoleStatus";
import PopUp from "../components/PopUp";
import AddLeague from "../components/AddLeague";
import EditLeague from "../components/EditLeague";
import "./Leagues.css";

const Leagues = (props) => {
    let isLoggedIn = useLocalStorageStatus("token");
    let isUserModerator = useUserRoleStatus("ROLE_MODERATOR")
    
    const [showPopUp, setShowPopUp] = useState(false);
    const [popUpMessage, setPopUpMessage] = useState("")
  
    const [leagues, setLeagues] = useState([])
    const [editLeagueID, setEditLeagueID] = useState(-1)

    const showEditLeague = (e,id) => {
      e.preventDefault()
      e.stopPropagation()
      setEditLeagueID(id)
    }

    useEffect(() => {
        axios
          .get("https://fcfootball.azurewebsites.net/api/v1/leagues")
          .then((res) => {
            setLeagues(res.data)
          })
          .catch((err) => console.log(err));
    },[isLoggedIn,showPopUp,editLeagueID])

    const updatePopUpMessage = (popUpMsg) => {
      setPopUpMessage(popUpMsg)
      setShowPopUp(true);
      setEditLeagueID(-1)
    }

    return (
    <div className="wrap-leagues">
      {isLoggedIn ? (
        <>
            <h1 className="leagues-h1">Available leagues</h1>
            <PopUp show={showPopUp} setShow={setShowPopUp}>
              <h1 className="leagues-popup-h1">Add League info</h1>
              <span>
                {popUpMessage}
              </span>
            </PopUp>
            {isUserModerator ? (<AddLeague updatePopUpMessage={updatePopUpMessage}/>):(<></>)}
            {leagues.map((league, arrayID) => 
              <>
              {editLeagueID === arrayID ? (<EditLeague updatePopUpMessage={updatePopUpMessage} league={league}/>) : (
                <Link className="leagues-it" to={encodeURIComponent(league.name) + '/' + encodeURIComponent(league.season) +"/Teams"} state={ league.id } >
                  <span className="leagues-it-txt">{league.name}</span>
                  <span className="leagues-it-txt">{league.season}</span>
                  <span className="leagues-it-txt">{league.country}</span>
                  {isUserModerator ? (
                  <button className="btn-edit" onClick={e => showEditLeague(e, arrayID)}>
                    <i className="fa-solid fa-pen-to-square"></i>
                  </button>):(<></>)}
              </Link>
              )}
              </>
            )}
        </>
      ) : (
        <span>Content unavailable, log in to grant access.</span>
      )}
    </div>
    );
};

export default Leagues;