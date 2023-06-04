import React, { useEffect, useState } from "react";
import { useLocation, Link, useParams } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";
import useLoginStatus from "../hooks/useLoginStatus";
import '@fortawesome/fontawesome-free/css/all.min.css'
import EditUser from "../components/EditUser";
import PopUp from "../components/PopUp";
import axios from "axios";
import "./AdminPanel.css";
import useUserRoleStatus from "../hooks/useUserRoleStatus";

const AdminPanel = (props) => {
  let isLoggedIn = useLoginStatus()
  let token = useLocalStorage("token")
  let isUserAdmin = useUserRoleStatus("ROLE_ADMIN")

  const [showPopUpDelete, setShowPopUpDelete] = useState(false);

  const [showPopUp, setShowPopUp] = useState(false);
  const [popUpMessage, setPopUpMessage] = useState("")

  const [users, setUsers] = useState([])
  const [editUserID, setEditUserID] = useState(-1)
  const [deleteUserID, setDeleteUserID] = useState(-1)

  useEffect(() => {
    axios
      .get(`https://fcfootball.azurewebsites.net/api/v1/users/user-roles`)
      .then((resUsers) => {

        resUsers.data.forEach(user => user.isMod = false)

        axios
          .get(`https://fcfootball.azurewebsites.net/api/v1/users/mod-roles`)
          .then((resMods) => {
            
            resMods.data.forEach(user => user.isMod = true)

            setUsers(resUsers.data.concat(resMods.data))
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  },[isLoggedIn,showPopUp,deleteUserID,editUserID])

  const updatePopUpMessage = (popUpMsg) => {
    setPopUpMessage(popUpMsg)
    setShowPopUp(true);
    setEditUserID(-1)
  }

  const showEditUser = (e,id) => {
    e.preventDefault()
    e.stopPropagation()
    setEditUserID(id)
  }

  const showDeleteUser = (e,id) => {
    e.preventDefault()
    e.stopPropagation()
    setDeleteUserID(id)
    setShowPopUpDelete(true)
  }

  const deleteUser = (email) => {
    axios
      .delete(
        `https://fcfootball.azurewebsites.net/api/v1/users/${email}`,
        {
          headers: {
            Authorization: `Bearer ${token[0]}`,
          },
        })
      .then((res) => {
        setDeleteUserID(-1)
      })
      .catch((err) => {
        setDeleteUserID(-1)
      });
  };

  return (
  <div className="wrap-teams">
    {isUserAdmin && isLoggedIn ? (
      <>
        <h1 className="teams-h1">Available teams</h1>
        {showPopUp ? (
        <PopUp setShow={setShowPopUp} defaultBtnText="Ok">
          <h1 className="matches-popup-h1">Edit Match info</h1>
          <span>
            {popUpMessage}
          </span>
        </PopUp>):(<></>)
        }

        {showPopUpDelete ? (
          <PopUp setShow={setShowPopUpDelete} customFunction={()=>deleteUser(deleteUserID)} customFunctionBtnText="Delete" defaultBtnText="Cancel">
            <h1 className="sign-in-err-h1">
              Are you sure you want to delete this user?
            </h1>
            <span>This action is irreversible</span>
          </PopUp>) : (<></>)
        }

        {users.map((user, arrayID) => 
        <>
          {editUserID === arrayID ? (<EditUser updatePopUpMessage={updatePopUpMessage} user={user}/>) : (
          <div className="users-it">
            <span className="users-it-txt">First name: {user.firstName}</span>
            <span className="users-it-txt">Email: {user.email}</span>
            <span className="users-it-txt">Last name: {user.lastName}</span>
            <span className="users-it-txt">Role: {user.isMod ? "Moderator" : "User"}</span>
            <span className="users-it-txt"></span>
            <div className="users-it-txt">
              <button className="btn-edit" onClick={e => showEditUser(e, arrayID)}>
                <i className="fa-solid fa-pen-to-square"></i>
              </button>
              <button className="btn-edit" onClick={e => showDeleteUser(e, user.email)}>
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

export default AdminPanel;