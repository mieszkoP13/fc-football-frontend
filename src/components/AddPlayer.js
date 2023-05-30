import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import axios from "axios";
import "./AddPlayer.css"
const RE_NAME = /^\S.{3,20}$/;
const POSITIONS =["GK","CB","LB","RB","CM","CDM","LW","RW","ST"]

const AddPlayer = ({updatePopUpMessage, teamId}) => {

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
        data.weight = parseInt(data.weight)
        data.height = parseInt(data.height)
        data.strongerFeet = true

        axios
          .post("https://fcfootball.azurewebsites.net/api/v1/players",data)
          .then((res) => {
            axios
            .post("https://fcfootball.azurewebsites.net/api/v1/contracts",{"playerId": res.data.id,"teamId":teamId,"start": data.start,"ends": data.ends})
            .then((res) => {
                updatePopUpMessage("Success. Player has been added.")
            })
            .catch((err) => {
                updatePopUpMessage("Error. Player hasn't been added.")
            });
            
          })
          .catch((err) => {
            updatePopUpMessage("Error. Player hasn't been added.")
          });
    }

    const range = (size, startAt = 0) => {
        return [...Array(size).keys()].map(i => i + startAt);
    }

    return (
    <>
    <button className="btn-add-player" onClick={showEdit}>Add new player</button>
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
        <select className="player-select"
            {...register("position", {
                required: true,
            })}>
            {POSITIONS.map(position => <option value={position}>{position}</option>)}
            </select>
        </div>

        <span className="players-it-txt">
            <div className="input-player-wrap">
                <select className="player-select-height"
                {...register("height", {
                    required: true,
                })}>
                {Array.from(range(100,140)).map(height => <option value={height}>{height}cm</option>)}
                </select>
            </div>
            <div className="input-player-wrap">
                <select className="player-select-weight"
                {...register("weight", {
                    required: true,
                })}>
                {Array.from(range(100,50)).map(weight => <option value={weight}>{weight}kg</option>)}
                </select>
            </div>
        </span>

        <span className="players-it-txt"></span>

        <span className="players-it-txt"></span>
        <div className="input-player-wrap">
            <input type="date" min="1989-01-01" max="2023-06-31" className="player-input-date"
            {...register("birthDate", {
                required: true,
            })}/>
        </div>

        <span className="players-it-txt">Contracted</span>
        <div className="input-player-wrap">
            <input type="date" min="1989-01-01" max="2023-06-31" className="player-input-date"
            {...register("start", {
                required: true,
            })}/>
        </div>
        <div className="input-player-wrap">
            <input type="date" min="1989-01-01" max="2023-06-31" className="player-input-date"
            {...register("ends", {
                required: true,
            })}/>
        </div>
        

        <button className="btn-edit-popup" type="submit">
            <i className="fa-solid fa-check"></i>
        </button>

    </div>
    </form>):(<></>)}
    </>
    )
}

export default AddPlayer