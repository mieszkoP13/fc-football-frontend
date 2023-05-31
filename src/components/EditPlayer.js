import React, { useState, useEffect } from 'react'
import { useForm } from "react-hook-form";
import useLocalStorageStatus from "../hooks/useLocalStorageStatus";
import axios from "axios";
import "./EditPlayer.css"
const RE_NAME = /^\S.{3,20}$/;
const POSITIONS =["GK","CB","LB","RB","CM","CDM","LW","RW","ST"]

const EditPlayer = ({updatePopUpMessage,player}) => {
    let isLoggedIn = useLocalStorageStatus("token");

    const [edit, setEdit] = useState(true)
    const hideEdit = () => setEdit(false)

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm({defaultValues: {firstName: player.firstName, lastName: player.lastName, position: player.position, height: player.height, weight: player.weight, start: player.start, ends: player.ends}});

    const onSubmit = (data) => {
        hideEdit()
        reset()
        data.weight = parseInt(data.weight)
        data.height = parseInt(data.height)
        data.strongerFeet = true

        axios
          .put(`https://fcfootball.azurewebsites.net/api/v1/players/${player.id}`,data)
          .then((res) => {
            updatePopUpMessage("Success. Player has been edited.")
          })
          .catch((err) => {
            updatePopUpMessage("Error. Player hasn't been edited.")
          });
    }

    const range = (size, startAt = 0) => [...Array(size).keys()].map(i => i + startAt);

    return (
    <>
    {edit ? (
    <form onSubmit={handleSubmit(onSubmit)}>
    <div className="players-it">

        <div className="input-player-wrap">
            <input className="player-input"
            {...register("firstName", {
                required: true,
                pattern: { value: RE_NAME },
            })}
            />
            {errors.name ? (<p className="error-txt">Invalid first name.</p>)
            : (<p className="invisible error-txt">Invalid first name.</p>)}
        
            <input className="player-input"
            {...register("lastName", {
                required: true,
                pattern: { value: RE_NAME },
            })}
            />
            {errors.name ? (<p className="error-txt">Invalid last name.</p>)
            : (<p className="invisible error-txt">Invalid last name.</p>)}
        </div>

        <div className="input-player-wrap">
        <span className="txt">Position: </span>
        <select className="player-select-position"
            {...register("position", {
                required: true,
            })}>
            {POSITIONS.map(position => <option value={position}>{position}</option>)}
            </select>
        </div>

        <div className="input-player-wrap">
            <select className="player-select-height"
            {...register("height", {
                required: true,
            })}>
            {Array.from(range(100,140)).map(height => <option value={height}>{height}</option>)}
            </select>
            <span className="txt"> cm </span>

            <select className="player-select-weight"
            {...register("weight", {
                required: true,
            })}>
            {Array.from(range(100,50)).map(weight => <option value={weight}>{weight}</option>)}
            </select>
            <span className="txt"> kg</span>
        </div>

        <span className="players-it-txt">Contracted</span>
        <div className="input-player-wrap">
        <span className="txt">From:  </span>
            <input type="date" min="1989-01-01" max="2023-06-31" className="player-input-date"
            {...register("start", {
                required: true,
            })}/>
        </div>
        
        <div className="input-player-wrap">
            <span className="txt">To:  </span>
            <input type="date" min="1989-01-01" max="2023-06-31" className="player-input-date"
            {...register("ends", {
                required: true,
            })}/>
        </div>

        <div className="input-player-wrap">
            <span className="txt">Born:  </span>
            <input type="date" min="1989-01-01" max="2023-06-31" className="player-input-date"
            {...register("birthDate", {
                required: true,
            })}/>
        </div>
        <span className="players-it-txt"></span>

        <button className="btn-edit-popup" type="submit">
            <i className="fa-solid fa-check"></i>
        </button>

    </div>
    </form>):(<></>)}
    </>
    )
}

export default EditPlayer