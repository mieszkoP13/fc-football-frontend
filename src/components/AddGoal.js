import React, { useState, useEffect } from 'react'
import { useForm } from "react-hook-form";
import axios from "axios";
import "./EditMatch.css"

const AddGoal = ({updatePopUpMessage,match}) => {
    const [edit, setEdit] = useState(true)
    const hideEdit = () => setEdit(false)

    const [players] = useState(match.homeTeam.players?.concat(match.awayTeam.players)||[])

    const {
        register,
        handleSubmit,
        reset,
    } = useForm();

    const onSubmit = (data) => {
        hideEdit()
        reset()
        data.matchId = match.matchId
        data.isOwn = false

        axios
          .post(`https://fcfootball.azurewebsites.net/api/v1/goals`,data)
          .then((res) => {
            updatePopUpMessage("Success. Goal has been added.")
          })
          .catch((err) => {
            if(err.response.status === 409)
                updatePopUpMessage("Can't save more goals for this team.")
            else
                updatePopUpMessage("Error. Goal hasn't been added.")
          });
    }

    return (
    <>
    {edit ? (
    <form onSubmit={handleSubmit(onSubmit)}>
        <span className="matches-it-txt">
            <div className="input-match-wrap">
                <select className="match-select-player"
                {...register("playerId", {
                    required: true,
                })}>
                {players.map(player => <option value={player.playerId}>{player.lastName}</option>)}
                </select>
            </div> 
            <div className="input-match-wrap">
                <select className="match-select-minute"
                {...register("time", {
                    required: true,
                })}>
                {[...Array(120).keys()].map(minute => <option value={minute}>{minute}</option>)}
                </select>
            </div>
        </span>

        <button className="btn-edit-popup-small" type="submit">
            <i className="fa-solid fa-check"></i>
        </button>
    </form>):(<></>)}
    </>
    )
}

export default AddGoal