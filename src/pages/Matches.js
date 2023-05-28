import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css'
import axios from "axios";
import useLocalStorageStatus from "../hooks/useLocalStorageStatus";
import useUserRoleStatus from "../hooks/useUserRoleStatus";
import useLocalStorage from "../hooks/useLocalStorage";
import PopUp from "../components/PopUp";
import AddMatch from "../components/AddMatch";
import EditMatch from "../components/EditMatch";
import "./Matches.css";

const Matches = (props) => {
  const pageSize = 10
    const { pageNo = 0 } = useParams()
    const [pageCount, setPageCount] = useState(1)
    let isLoggedIn = useLocalStorageStatus("token");
    let isUserModerator = useUserRoleStatus("ROLE_MODERATOR")
    let token = useLocalStorage("token")

    const [showPopUpDelete, setShowPopUpDelete] = useState(false);
    
    const [showPopUp, setShowPopUp] = useState(false);
    const [popUpMessage, setPopUpMessage] = useState("")
  
    const [matches, setMatches] = useState([])
    const [editMatchID, setEditMatchID] = useState(-1)
    const [deleteMatchID, setDeleteMatchID] = useState(-1)

    useEffect(() => {
      axios
        .get("https://fcfootball.azurewebsites.net/api/v1/matches?pageSize=1000000000")
        .then((res) => {
          console.log(res.data.numberOfElements/pageSize)
          setPageCount(res.data.numberOfElements/pageSize)
        })
        .catch((err) => console.log(err));

      axios
        .get(`https://fcfootball.azurewebsites.net/api/v1/matches?pageSize=${pageSize}&pageNo=${pageNo}`)
        .then((res) => {
           setMatches(res.data.content)
        })
        .catch((err) => console.log(err));
    },[isLoggedIn,showPopUp,editMatchID,deleteMatchID,pageNo])

    const updatePopUpMessage = (popUpMsg) => {
      setPopUpMessage(popUpMsg)
      setShowPopUp(true);
      setEditMatchID(-1)
    }

    const showEditMatch = (e,id) => {
      e.preventDefault()
      e.stopPropagation()
      setEditMatchID(id)
    }

    const showDeleteMatch = (e,id) => {
      e.preventDefault()
      e.stopPropagation()
      setDeleteMatchID(id)
      setShowPopUpDelete(true)
    }

    const deleteMatch = (id) => {
      axios
        .delete(
          `https://fcfootball.azurewebsites.net/api/v1/matches/${id}`)
        .then((res) => {
          setDeleteMatchID(-1)
        })
        .catch((err) => {
          setDeleteMatchID(-1)
        });
    };

    return (
    <div className="wrap-matches">
      {isLoggedIn ? (
        <>
          <div className="page-nav">
            {pageNo > 0 ? (<Link className="prev-match" to={'/Matches/' + encodeURIComponent( parseInt(pageNo)-1 )}>
              <span>&#8592;</span>
            </Link>) : (<></>)}
            <span className="page-no">{pageNo}</span>
            {pageNo < pageCount-1 ? (
            <Link className="next-match" to={'/Matches/' + encodeURIComponent( parseInt(pageNo)+1 )}>
              <span>&#8594;</span>
            </Link>):(<></>)}
          </div>
          
          <h1 className="matches-h1">Available Matches</h1>
          {showPopUp ? (
          <PopUp setShow={setShowPopUp} defaultBtnText="Ok">
            <h1 className="matches-popup-h1">Add Match info</h1>
            <span>
              {popUpMessage}
            </span>
          </PopUp>):(<></>)
          }
          {isUserModerator ? (<AddMatch updatePopUpMessage={updatePopUpMessage}/>):(<></>)}

          {showPopUpDelete ? (
          <PopUp setShow={setShowPopUpDelete} customFunction={()=>deleteMatch(deleteMatchID)} customFunctionBtnText="Delete" defaultBtnText="Cancel">
            <h1 className="sign-in-err-h1">
              Are you sure you want to delete this match?
            </h1>
            <span>This action is irreversible</span>
          </PopUp>) : (<></>)
          }

          {matches.map((match, arrayID) => 
            <>
            {editMatchID === arrayID ? (<EditMatch updatePopUpMessage={updatePopUpMessage} match={match}/>) : (
              <div className="matches-it">
                <span className="matches-it-txt"></span>
                <span className="matches-it-txt">{match.league.name}</span>
                <span className="matches-it-txt"></span>
                <span className="matches-it-txt">{match.homeTeam.name}</span>
                <span className="matches-it-txt">{match.homeTeamScore}:{match.awayTeamScore}</span>
                <span className="matches-it-txt">{match.awayTeam.name}</span>
                <span className="matches-it-txt"></span>
                <span className="matches-it-txt">{match.date}    {match.time}</span>
                {isUserModerator ? (
                <div className="matches-it-txt">
                  <button className="btn-edit matches-it-txt" onClick={e => showEditMatch(e, arrayID)}>
                    <i className="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button className="btn-edit" onClick={e => showDeleteMatch(e, match.id)}>
                  <i class="fa-solid fa-trash-can"></i>
                  </button>
                </div>):(<></>)}
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