import React, { useState, useEffect } from 'react'
import { useForm } from "react-hook-form";
import useLocalStorageStatus from "../hooks/useLocalStorageStatus";
import axios from "axios";
import "./AddMatch.css"
const RE_NAME = /^\S.{3,20}$/;

const AddMatch = ({updatePopUpMessage}) => {
    let isLoggedIn = useLocalStorageStatus("token");

    const [edit, setEdit] = useState(false)
    const [leagues, setLeagues] = useState([])
    const [teams, setTeams] = useState(undefined)
    const showEdit = () => setEdit(true)
    const hideEdit = () => setEdit(false)

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
        watch,
    } = useForm();

    useEffect(() => {
        axios
          .get("https://fcfootball.azurewebsites.net/api/v1/leagues")
          .then((res) => {
            setLeagues(res.data)
          })
          .catch((err) => console.log(err));
    },[isLoggedIn])

    useEffect(()=>{
        try {
            setTeams(leagues.filter(league => league.id === parseInt(watch('leagueId')))[0].teams)
        } catch {}

    },[watch('leagueId')])

    const onSubmit = (data) => {
        hideEdit()
        reset()
        data.time = `${data.time}:00`

        axios
          .post("https://fcfootball.azurewebsites.net/api/v1/matches",data)
          .then((res) => {
            updatePopUpMessage("Success. Match has been added.")
          })
          .catch((err) => {
            updatePopUpMessage("Error. Match hasn't been added.")
          });
    }

    return (
    <>
    <button className="btn-add-match" onClick={showEdit}>Add new match</button>
    {edit ? (
    <form onSubmit={handleSubmit(onSubmit)}>
        <div className="matches-it">

        <span className="matches-it-txt"></span>
        <span className="matches-it-txt"></span>
        <span className="matches-it-txt"></span>

        <span className="matches-it-txt"></span>
        <div className="input-match-wrap">
        <select className="match-select"
            {...register("leagueId", {
                required: true,
            })}>
            {leagues.map(league => <option value={league.id}>{league.name}</option>)}
            </select>
        </div>
        <span className="matches-it-txt"></span>

        <div className="input-match-wrap">
            <select className="match-select"
            {...register("homeTeamId", {
                required: true,
            })}>
            {teams ? (teams.map(team => <option value={team.id}>{team.name}</option>)):(<option/>)}
            </select>
        </div>

        <span className="matches-it-txt">
            <div className="input-match-wrap">
                <select className="match-select-score"
                {...register("homeTeamScore", {
                    required: true,
                })}>
                {[...Array(15).keys()].map(score => <option value={score}>{score}</option>)}
                </select>
            </div>
            :
            <div className="input-match-wrap">
                <select className="match-select-score"
                {...register("awayTeamScore", {
                    required: true,
                })}>
                {[...Array(15).keys()].map(score => <option value={score}>{score}</option>)}
                </select>
            </div>
        </span>

        <div className="input-match-wrap">
            <select className="match-select"
            {...register("awayTeamId", {
                required: true,
            })}>
            {teams ? (teams.map(team => <option value={team.id}>{team.name}</option>)):(<option/>)}
            </select>
        </div>
        
        <span className="matches-it-txt"></span>
        <div className="input-match-wrap">
            <input type="date" min="1989-01-01" max="2023-06-31" className="match-input-date"
            {...register("date", {
                required: true,
            })}/>
        </div>
        <div className="input-match-wrap">
            <input type="time" className="match-input-time"
            {...register("time", {
                required: true,
            })}/>
        </div>

        

        <button className="btn-edit-popup" type="submit">
            <i className="fa-solid fa-check"></i>
        </button>

        <span className="matches-it-txt"></span>
        <span className="matches-it-txt"></span>
        <span className="matches-it-txt"></span>

        </div>
    </form>):(<></>)}
    </>
    )
}

export default AddMatch