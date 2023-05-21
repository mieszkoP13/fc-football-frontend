import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import axios from "axios";
import "./EditTeam.css"
const RE_NAME = /^\S.{3,20}$/;

const EditTeam = ({updatePopUpMessage, leagueId, team}) => {

    const [edit, setEdit] = useState(true)
    const hideEdit = () => setEdit(false)

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
      } = useForm({defaultValues: {name: team.name}});

    const onSubmit = (data) => {
        hideEdit()
        reset()
        axios
          .put(`https://fcfootball.azurewebsites.net/api/v1/leagues/${leagueId}/teams`,[data])
          .then((res) => {
            updatePopUpMessage("Success. League has been edited.")
          })
          .catch((err) => {
            updatePopUpMessage("Error. League hasn't been edited.")
          });
      }

    return (
    <>
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

export default EditTeam