import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import axios from "axios";
import useLocalStorage from '../hooks/useLocalStorage';
import "./EditUser.css"

const EditUser = ({updatePopUpMessage, user}) => {
  let token = useLocalStorage("token")
  const [edit, setEdit] = useState(true)
  const hideEdit = () => setEdit(false)

  const {
    register,
    handleSubmit,
    reset,
  } = useForm();

  const onSubmit = (data) => {
    hideEdit()
    reset()

    const newRoleBoolean = (data.isMod === 'true')

    if(newRoleBoolean == true && user.isMod == false) {
      axios
      .put(`https://fcfootball.azurewebsites.net/api/v1/users/${user.email}/mod`,{},
      {
        headers: {
          Authorization: `Bearer ${token[0]}`,
        },
      })
      .then((res) => {
        updatePopUpMessage("Success. User has been edited.")
      })
      .catch((err) => {
        updatePopUpMessage("Error. User hasn't been edited.")
      });
    } else if (newRoleBoolean == false && user.isMod == true) {
      axios
      .delete(`https://fcfootball.azurewebsites.net/api/v1/users/${user.email}/mod`,{
        headers: {
          Authorization: `Bearer ${token[0]}`,
        },
      })
      .then((res) => {
        updatePopUpMessage("Success. User has been edited.")
      })
      .catch((err) => {
        updatePopUpMessage("Error. User hasn't been edited.")
      });
    } else {
      updatePopUpMessage("No changes is user detected.")
    }
  }

    return (
    <>
    {edit ? (
    <form onSubmit={handleSubmit(onSubmit)}>
        <div className="users-it">

        <span className="users-it-txt">First name: {user.firstName}</span>
        <span className="users-it-txt">Email: {user.email}</span>

        <span className="users-it-txt">Last name: {user.lastName}</span>
        <div className="input-user-wrap">
        <span className="txt">Role: </span>
        <select className="user-select-role"
          {...register("isMod", {
              required: true,
          })}>
          {["User","Moderator"].map(role => <option value={role === "User" ? false : true}>{role}</option>)}
        </select>
        </div>

        <span className="users-it-txt"></span>
        <div className="users-it-txt">
        <button className="btn-edit-popup" type="submit">
          <i className="fa-solid fa-check"></i>
        </button>
        </div>

        </div>
    </form>):(<></>)}
    </>
    )
}

export default EditUser