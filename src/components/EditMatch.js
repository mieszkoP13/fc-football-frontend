import React, { useState, useEffect } from 'react'
import { useForm } from "react-hook-form";
import useLocalStorageStatus from "../hooks/useLocalStorageStatus";
import axios from "axios";
import "./EditMatch.css"
const RE_NAME = /^\S.{3,20}$/;

const EditMatch = ({updatePopUpMessage,match}) => {
    let isLoggedIn = useLocalStorageStatus("token");

    const [leagues, setLeagues] = useState([])
    const [teams, setTeams] = useState(undefined)

    const [edit, setEdit] = useState(true)
    const hideEdit = () => setEdit(false)

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
        watch,
      } = useForm({defaultValues: {leagueId: match.name, homeTeamId: match.homeTeamId, awayTeamId: match.awayTeamId, homeTeamScore: match.homeTeamScore, awayTeamScore: match.awayTeamScore,date: match.date, time: match.time}});

    const onSubmit = (data) => {
        hideEdit()
        reset()
        axios
          .put(`https://fcfootball.azurewebsites.net/api/v1/matches/${match.id}`,data)
          .then((res) => {
            updatePopUpMessage("Success. Match has been edited.")
          })
          .catch((err) => {
            updatePopUpMessage("Error. Match hasn't been edited.")
          });
    }

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

    return (
    <>
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
                {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(score => <option value={score}>{score}</option>)}
                </select>
            </div>
            :
            <div className="input-match-wrap">
                <select className="match-select-score"
                {...register("awayTeamScore", {
                    required: true,
                })}>
                {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(score => <option value={score}>{score}</option>)}
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

        {match.goals?.map(goal =>
            <>
            <span className="matches-view-it-txt">{match.homeTeam.players.find(player => player.playerId === goal.playerId)?.lastName} {match.homeTeam.players.find(player => player.playerId === goal.playerId)?.lastName ? goal.time+'`' : null}</span>
            <span className="matches-view-it-txt"></span>
            <span className="matches-view-it-txt">{match.awayTeam.players.find(player => player.playerId === goal.playerId)?.lastName} {match.awayTeam.players.find(player => player.playerId === goal.playerId)?.lastName ? goal.time+'`' : null}</span>
            </>
        )}

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

        </div>
    </form>):(<></>)}
    </>
    )
}

export default EditMatch