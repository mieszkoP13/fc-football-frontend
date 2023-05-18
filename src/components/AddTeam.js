import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import axios from "axios";
import "./AddTeam.css"
const RE_NAME = /^\S.{3,20}$/;

const AddTeam = ({updatePopUpMessage, leagueId}) => {

    const [edit, setEdit] = useState(false)
    const showEdit = () => setEdit(true)
    const hideEdit = () => setEdit(false)

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
      } = useForm();

    const onSubmit = (data) => {
        hideEdit()
        reset()
        axios
          .put(`https://fcfootball.azurewebsites.net/api/v1/leagues/${leagueId}/teams`,[data])
          .then((res) => {
            updatePopUpMessage("Success. Team has been added.")
          })
          .catch((err) => {
            updatePopUpMessage("Error. Team hasn't been added.")
          });
    }

    return (
    <>
    <button className="btn-add-team" onClick={showEdit}>Add new team</button>
    {edit ? (
    <form onSubmit={handleSubmit(onSubmit)}>
        <div className="teams-it">

        <div className="input-wrap">
            <input className="team-input"
            {...register("name", {
                required: true,
                pattern: { value: RE_NAME },
            })}
            />
            {errors.name ? (<p className="error-txt">Invalid team name.</p>)
            : (<p className="invisible error-txt">Invalid team name.</p>)}
        </div>

        <button className="btn-edit-popup" type="submit">
            <i className="fa-solid fa-check"></i>
        </button>
        </div>
    </form>):(<></>)}
    </>
    )
}

export default AddTeam