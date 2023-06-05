import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css'
import axios from "axios";
import useUserRoleStatus from "../hooks/useUserRoleStatus";
import useLoginStatus from "../hooks/useLoginStatus";
import PopUp from "../components/PopUp";
import AddMatch from "../components/AddMatch";
import EditMatch from "../components/EditMatch";
import AddGoal from "../components/AddGoal";
import EditGoal from "../components/EditGoal";
import SearchMatch from "../components/SearchMatches";
import "./Matches.css";

const Matches = (props) => {
  const effectRan = useRef(false)
  const pageSize = 10
  const { pageNo = 0 } = useParams()
  const [pageCount, setPageCount] = useState(1)
  let isUserModerator = useUserRoleStatus("ROLE_MODERATOR")
  let isUserAdmin = useUserRoleStatus("ROLE_ADMIN")
  let isLoggedIn = useLoginStatus()

  const [showPopUpDelete, setShowPopUpDelete] = useState(false);
  
  const [showPopUp, setShowPopUp] = useState(false);
  const [popUpMessage, setPopUpMessage] = useState("")

  const [matches, setMatches] = useState([])
  const [editMatchID, setEditMatchID] = useState(-1)
  const [addGoalMatchID, setAddGoalMatchID] = useState(-1)
  const [editGoalID, setEditGoalID] = useState(-1)
  const [deleteMatchID, setDeleteMatchID] = useState(-1)

  useEffect(() => {
    if( effectRan.current === false ) {
    axios
      .get("https://fcfootball.azurewebsites.net/api/v1/matches?pageSize=10000")
      .then((res) => {
        setPageCount(res.data.numberOfElements/pageSize)
      })
      .catch((err) => console.log(err));

    axios
      .get(`https://fcfootball.azurewebsites.net/api/v1/matches-view/all?pageSize=${pageSize}&pageNo=${pageNo}`)
      .then((res) => {
        setMatches(res.data.content)
      })
      .catch((err) => console.log(err));
    }
    return () => effectRan.current = true
  },[isLoggedIn,showPopUp,editMatchID,editGoalID,deleteMatchID,addGoalMatchID,pageNo])

  const updatePopUpMessage = (popUpMsg) => {
    setPopUpMessage(popUpMsg)
    setShowPopUp(true);
    setEditMatchID(-1)
    setEditGoalID(-1)
    setAddGoalMatchID(-1)
  }

  const showEditMatch = (e,id) => {
    e.preventDefault()
    e.stopPropagation()
    setEditMatchID(id)
  }

  const showAddGoal = (e,id) => {
    e.preventDefault()
    e.stopPropagation()
    setAddGoalMatchID(id)
  }

  const showEditGoal = (e,id) => {
    e.preventDefault()
    e.stopPropagation()
    setEditGoalID(id)
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

  const updateMatches = (matches) => setMatches(matches)

  return (
  <div className="wrap-matches">
    {(isUserModerator || isUserAdmin) && isLoggedIn ? (
      <>
        <div className="page-nav">
          {pageCount-1 ? (<>
            {pageNo > 0 ? (<Link className="prev-match" to={'/Matches/' + encodeURIComponent( parseInt(pageNo)-1 )}>
              <span>&#8592;</span>
            </Link>) : (<></>)}
            <span className="page-no">{pageNo}</span>
            {pageNo < pageCount-1 ? (
            <Link className="next-match" to={'/Matches/' + encodeURIComponent( parseInt(pageNo)+1 )}>
              <span>&#8594;</span>
            </Link>):(<></>)}
          </>) : (<></>)}
        </div>
        
        <h1 className="matches-h1">Available Matches</h1>

        <SearchMatch updateMatches={updateMatches}/>

        {showPopUp ? (
        <PopUp setShow={setShowPopUp} defaultBtnText="Ok">
          <h1 className="matches-popup-h1">Add Match info</h1>
          <span>
            {popUpMessage}
          </span>
        </PopUp>):(<></>)
        }
        <AddMatch updatePopUpMessage={updatePopUpMessage}/>

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

              {match.goals?.map((goal,goalArrayID) =>
                <>
                {editGoalID === goalArrayID ? (
                <>
                <span className="matches-it-txt"></span>
                <EditGoal updatePopUpMessage={updatePopUpMessage} match={match} goal={goal}/>
                <span className="matches-it-txt"></span>
                </>) : (
                <>
                  {match.homeTeam.players.find(player => player.playerId === goal.playerId)?.lastName ? (
                  <div className="matches-it-txt">
                    <span className="matches-it-txt">{match.homeTeam.players.find(player => player.playerId === goal.playerId)?.lastName} {goal.time}'</span>
                    <button className="btn-edit" onClick={e => showEditGoal(e, goalArrayID)}>
                      <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                  </div>
                  ) : (<span className="matches-it-txt"></span>)}
                  
                  <span className="matches-it-txt"></span>

                  {match.awayTeam.players.find(player => player.playerId === goal.playerId)?.lastName ? (
                  <div className="matches-it-txt">
                    <span className="matches-it-txt">{match.awayTeam.players.find(player => player.playerId === goal.playerId)?.lastName} {goal.time}'</span>
                    <button className="btn-edit" onClick={e => showEditGoal(e, goalArrayID)}>
                      <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                  </div>
                  ) : (<span className="matches-it-txt"></span>)}
                </>
                )}
                </>
              )}

              <span className="matches-it-txt"></span>
              {addGoalMatchID === arrayID ? (
              <AddGoal updatePopUpMessage={updatePopUpMessage} match={match}/>):(
              <button className="btn-edit" onClick={e => showAddGoal(e, arrayID)}>
                <i class="fa-solid fa-plus"></i>
              </button>)
              }
              <span className="matches-it-txt"></span>

              <span className="matches-it-txt"></span>
              <span className="matches-it-txt">{match.date}    {match.time}</span>
              
              <div className="matches-it-txt">
                <button className="btn-edit matches-it-txt" onClick={e => showEditMatch(e, arrayID)}>
                  <i className="fa-solid fa-pen-to-square"></i>
                </button>
                <button className="btn-edit" onClick={e => showDeleteMatch(e, match.id)}>
                <i class="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </div>
          )}
          </>
        )}
      </>
    ) : (
      <span className="profile-span">You've been logged out or you don't have sufficient permission to view this tab, sign in again or sign up for free!</span>
    )}
  </div>
  );
};

export default Matches;