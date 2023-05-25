import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom'
import '@fortawesome/fontawesome-free/css/all.min.css'
import axios from "axios";
import useLocalStorageStatus from "../hooks/useLocalStorageStatus";
import useUserRoleStatus from "../hooks/useUserRoleStatus";
import useLocalStorage from "../hooks/useLocalStorage";
import PopUp from "../components/PopUp";
import AddMatch from "../components/AddMatch";
import EditLeague from "../components/EditLeague";
import "./Matches.css";

const Matches = (props) => {
    let isLoggedIn = useLocalStorageStatus("token");
    let isUserModerator = useUserRoleStatus("ROLE_MODERATOR")
    let token = useLocalStorage("token")
    
    const [showPopUp, setShowPopUp] = useState(false);
    const [popUpMessage, setPopUpMessage] = useState("")
  
    const [matches, setMatches] = useState([])
    const [editMatchID, setEditMatchID] = useState(-1)

    const showEditMatch = (e,id) => {
      e.preventDefault()
      e.stopPropagation()
      setEditMatchID(id)
    }

    useEffect(() => {
      axios
        .get("https://fcfootball.azurewebsites.net/api/v1/matches?pageSize=10")
        .then((res) => {
           setMatches(res.data.content)
        })
        .catch((err) => console.log(err));
    },[isLoggedIn,showPopUp,editMatchID])

    const updatePopUpMessage = (popUpMsg) => {
      setPopUpMessage(popUpMsg)
      setShowPopUp(true);
      setEditMatchID(-1)
    }

    return (
    <div className="wrap-matches">
      {isLoggedIn ? (
        <>
            <h1 className="matches-h1">Available Matches</h1>
            <PopUp show={showPopUp} setShow={setShowPopUp}>
              <h1 className="matches-popup-h1">Add Match info</h1>
              <span>
                {popUpMessage}
              </span>
            </PopUp>
            {isUserModerator ? (<AddMatch updatePopUpMessage={updatePopUpMessage}/>):(<></>)}
            {matches.map((match, arrayID) => 
              <>
              {editMatchID === arrayID ? (<EditLeague updatePopUpMessage={updatePopUpMessage} league={match}/>) : (
                <div className="matches-it">
                  <span className="matches-it-txt"></span>
                  <span className="matches-it-txt">{match.league.name}</span>
                  <span className="matches-it-txt"></span>
                  <span className="matches-it-txt">{match.homeTeam.name}</span>
                  <span className="matches-it-txt">{match.homeTeamScore}:{match.awayTeamScore}</span>
                  <span className="matches-it-txt">{match.awayTeam.name}</span>
                  <span className="matches-it-txt"></span>
                  <span className="matches-it-txt">{match.date}  {match.time}</span>
                  <span className="matches-it-txt"></span>
                    {/* {isUserModerator ? (
                    <button className="btn-edit" onClick={e => showEditMatch(e, arrayID)}>
                      <i className="fa-solid fa-pen-to-square"></i>
                    </button>):(<></>)} */}
                </div>
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

export default Matches;