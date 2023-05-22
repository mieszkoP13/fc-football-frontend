import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom'
import '@fortawesome/fontawesome-free/css/all.min.css'
import axios from "axios";
import useLocalStorageStatus from "../hooks/useLocalStorageStatus";
import useUserRoleStatus from "../hooks/useUserRoleStatus";
import useLocalStorage from "../hooks/useLocalStorage";
import PopUp from "../components/PopUp";
import AddLeague from "../components/AddLeague";
import EditLeague from "../components/EditLeague";
import "./Leagues.css";

const Leagues = (props) => {
    let isLoggedIn = useLocalStorageStatus("token");
    let isUserModerator = useUserRoleStatus("ROLE_MODERATOR")
    let token = useLocalStorage("token")
    
    const [showPopUp, setShowPopUp] = useState(false);
    const [popUpMessage, setPopUpMessage] = useState("")
  
    const [leagues, setLeagues] = useState([])
    const [followedLeaguesIDs, setFollowedLeaguesIDs] = useState([])
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
    },[isLoggedIn,showPopUp,editLeagueID,followedLeaguesIDs])

    useEffect(() => {
      axios
        .get("https://fcfootball.azurewebsites.net/api/v1/followed-leagues",{
          headers: {
            Authorization: `Bearer ${token[0]}`,
          },
        })
        .then((res) => {
          setFollowedLeaguesIDs(res.data)
        })
        .catch((err) => console.log(err));
    },[])

    const updatePopUpMessage = (popUpMsg) => {
      setPopUpMessage(popUpMsg)
      setShowPopUp(true);
      setEditLeagueID(-1)
    }

    const followLeague = (e, leagueID) => {
      e.preventDefault()
      e.stopPropagation()
      axios
        .put(`https://fcfootball.azurewebsites.net/api/v1/followed-leagues/${leagueID}`, {} ,{
          headers: {
            Authorization: `Bearer ${token[0]}`,
          },
        })
        .then((res) => {
          setFollowedLeaguesIDs(followedLeaguesIDs => [...followedLeaguesIDs, leagueID])
        })
        .catch((err) => console.log(err));
    }

    const unfollowLeague = (e, leagueID) => {
      e.preventDefault()
      e.stopPropagation()
      console.log(token[0])
      axios
        .delete(`https://fcfootball.azurewebsites.net/api/v1/followed-leagues/${leagueID}` ,{
          headers: {
            Authorization: `Bearer ${token[0]}`,
          },
        })
        .then((res) => {
          setFollowedLeaguesIDs(followedLeaguesIDs.filter(id => id !== leagueID))
        })
        .catch((err) => console.log(err));
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
                  <div>
                    {isUserModerator ? (
                    <button className="btn-edit" onClick={e => showEditLeague(e, arrayID)}>
                      <i className="fa-solid fa-pen-to-square"></i>
                    </button>):(<></>)}

                    {!followedLeaguesIDs.includes(league.id) ?
                    (<button className="btn-follow" onClick={e => followLeague(e, league.id)}>
                      <i className="fa-solid fa-thumbs-up"></i>
                    </button>):(
                    <button className="btn-follow" onClick={e => unfollowLeague(e, league.id)}>
                      <i className="fa-solid fa-thumbs-down"></i>
                    </button>)
                    }
                  </div>
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