import React, { useState, useEffect } from 'react'
import { useForm } from "react-hook-form";
import axios from "axios";
import "./EditMatch.css"
import "../pages/Matches.css"

const SearchMatch = ({updateMatches}) => {

    const {
        register,
        handleSubmit,
    } = useForm();

    const {
        register: register2,
        handleSubmit: handleSubmit2,
        watch: watch2,
    } = useForm();

    const {
        handleSubmit: handleSubmit3,
    } = useForm();
    
    const [leagues, setLeagues] = useState([])
    const [teams, setTeams] = useState(undefined)
    
    const filterDate = (data) => {
        axios
          .get(`https://fcfootball.azurewebsites.net/api/v1/matches/date/${data.date}`)
          .then((res) => {
            updateMatches(res.data)
          })
          .catch((err) => console.log(err));
    }

    const filterLeagueTeam = (data) => {
    axios
        .get(`https://fcfootball.azurewebsites.net/api/v1/matches/league/${data.leagueId}/team/${data.teamId}`)
        .then((res) => {
          updateMatches(res.data)
        })
        .catch((err) => console.log(err));
    }

    const filterToday = (data) => {
    axios
        .get("https://fcfootball.azurewebsites.net/api/v1/matches/today")
        .then((res) => {
            updateMatches(res.data)
        })
        .catch((err) => console.log(err));
    }

    useEffect(() => {
    axios
        .get("https://fcfootball.azurewebsites.net/api/v1/leagues")
        .then((res) => {
            setLeagues(res.data)
        })
        .catch((err) => console.log(err));
    },[])
    
    useEffect(()=>{
    try {
        setTeams(leagues.filter(league => league.id === parseInt(watch2('leagueId')))[0].teams)
    } catch {}

    },[watch2('leagueId')])

    return (
    <>
        <div className="matches-it">

        <span className="matches-it-txt"></span>
        <span className="matches-it-txt"></span>

        <form onSubmit={handleSubmit(filterDate)}>
        <span className="search-text">Search by date: </span>
        <div className="input-match-wrap">
            <input type="date" min="1989-01-01" max="2023-06-31" className="match-input-date"
            {...register("date")}/>
        </div>
        
        <button className="btn-edit-popup" type="submit">
            <i class="fa-solid fa-magnifying-glass"></i>
        </button>
        </form>

        <span className="matches-it-txt"></span>
        <span className="matches-it-txt"></span>

        <form onSubmit={handleSubmit2(filterLeagueTeam)}>
        <span className="search-text">Search by league and team: </span>
        
        <div className="input-match-wrap">
            <select className="match-select"
            {...register2("leagueId", {
                required: true,
            })}>
            {leagues.map(league => <option value={league.id}>{league.name}</option>)}
            </select>
        </div>

        <span className="matches-it-txt"></span>

        <div className="input-match-wrap">
            <select className="match-select"
            {...register2("teamId", {
                required: true,
            })}>
            {teams ? (teams.map(team => <option value={team.id}>{team.name}</option>)):(<option/>)}
            </select>
        </div>
        
        <button className="btn-edit-popup" type="submit">
            <i class="fa-solid fa-magnifying-glass"></i>
        </button>
        </form>

        <form onSubmit={handleSubmit3(filterToday)}>
        <span className="search-text">Search today: </span>
        
        <button className="btn-edit-popup" type="submit">
            <i class="fa-solid fa-magnifying-glass"></i>
        </button>
        </form>

        <span className="matches-it-txt"></span>
        <span className="matches-it-txt"></span>
        <span className="matches-it-txt"></span>
        <span className="matches-it-txt"></span>

        </div>
    </>
    )
}

export default SearchMatch