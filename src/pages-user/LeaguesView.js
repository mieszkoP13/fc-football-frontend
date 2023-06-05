import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from 'react-router-dom'
import '@fortawesome/fontawesome-free/css/all.min.css'
import axios from "axios";
import useLoginStatus from "../hooks/useLoginStatus";
import useLocalStorage from "../hooks/useLocalStorage";
import "./LeaguesView.css";
const COUNTRIES = ["","AFG","ALA","ALB","DZA","ASM","AND","AGO","AIA","ATA","ATG","ARG","ARM","ABW","AUS","AUT","AZE","BHS","BHR","BGD","BRB","BLR","BEL","BLZ","BEN","BMU","BTN","BOL","BES","BIH","BWA","BVT","BRA","IOT","BRN","BGR","BFA","BDI","KHM","CMR","CAN","CPV","CYM","CAF","TCD","CHL","CHN","CXR","CCK","COL","COM","COG","COD","COK","CRI","CIV","HRV","CUB","CUW","CYP","CZE","DNK","DJI","DMA","DOM","ECU","EGY","SLV","GNQ","ERI","EST","ETH","FLK","FRO","FJI","FIN","FRA","GUF","PYF","ATF","GAB","GMB","GEO","DEU","GHA","GIB","GRC","GRL","GRD","GLP","GUM","GTM","GGY","GIN","GNB","GUY","HTI","HMD","VAT","HND","HKG","HUN","ISL","IND","IDN","IRN","IRQ","IRL","IMN","ISR","ITA","JAM","JPN","JEY","JOR","KAZ","KEN","KIR","PRK","KOR","XKX","KWT","KGZ","LAO","LVA","LBN","LSO","LBR","LBY","LIE","LTU","LUX","MAC","MKD","MDG","MWI","MYS","MDV","MLI","MLT","MHL","MTQ","MRT","MUS","MYT","MEX","FSM","MDA","MCO","MNG","MNE","MSR","MAR","MOZ","MMR","NAM","NRU","NPL","NLD","ANT","NCL","NZL","NIC","NER","NGA","NIU","NFK","MNP","NOR","OMN","PAK","PLW","PSE","PAN","PNG","PRY","PER","PHL","PCN","POL","PRT","PRI","QAT","REU","ROM","RUS","RWA","BLM","SHN","KNA","LCA","MAF","SPM","VCT","WSM","SMR","STP","SAU","SEN","SRB","SCG","SYC","SLE","SGP","SXM","SVK","SVN","SLB","SOM","ZAF","SGS","SSD","ESP","LKA","SDN","SUR","SJM","SWZ","SWE","CHE","SYR","TWN","TJK","TZA","THA","TLS","TGO","TKL","TON","TTO","TUN","TUR","TKM","TCA","TUV","UGA","UKR","ARE","GBR","USA","UMI","URY","UZB","VUT","VEN","VNM","VGB","VIR","WLF","ESH","YEM","ZMB","ZWE"]
const SEASONS = ["","1989/90","1990/91","1991/92","1992/93","1993/94","1994/95","1995/96","1996/97","1997/98","1998/99","1999/23","2000/01","2001/02","2002/03","2003/04","2004/05","2005/06","2006/07","2007/08","2008/09","2009/10","2010/11","2011/12","2012/13","2013/14","2014/15","2015/16","2016/17","2017/18","2018/19","2019/20","2020/21","2021/22","2022/23"]

const LeaguesView = (props) => {
  let isLoggedIn = useLoginStatus()
  let token = useLocalStorage("token")

  const {
    register,
    handleSubmit,
  } = useForm();

  const [leagues, setLeagues] = useState([])
  const [followedLeaguesIDs, setFollowedLeaguesIDs] = useState([])

  useEffect(() => {
    axios
      .get("https://fcfootball.azurewebsites.net/api/v1/leagues")
      .then((res) => {
        setLeagues(res.data)
      })
      .catch((err) => console.log(err));
  },[isLoggedIn,followedLeaguesIDs])

  useEffect(() => {
    axios
      .get("https://fcfootball.azurewebsites.net/api/v1/followed-leagues",{
        headers: {
          Authorization: `Bearer ${token[0]}`,
        },
      })
      .then((res) => {
        setFollowedLeaguesIDs(res.data)
      })
      .catch((err) => console.log(err));
  },[])

  const followLeague = (e, leagueID) => {
    e.preventDefault()
    e.stopPropagation()
    axios
      .put(`https://fcfootball.azurewebsites.net/api/v1/followed-leagues/${leagueID}`, {} ,{
        headers: {
          Authorization: `Bearer ${token[0]}`,
        },
      })
      .then((res) => {
        setFollowedLeaguesIDs(followedLeaguesIDs => [...followedLeaguesIDs, leagueID])
      })
      .catch((err) => console.log(err));
  }

  const unfollowLeague = (e, leagueID) => {
    e.preventDefault()
    e.stopPropagation()
    axios
      .delete(`https://fcfootball.azurewebsites.net/api/v1/followed-leagues/${leagueID}` ,{
        headers: {
          Authorization: `Bearer ${token[0]}`,
        },
      })
      .then((res) => {
        setFollowedLeaguesIDs(followedLeaguesIDs.filter(id => id !== leagueID))
      })
      .catch((err) => console.log(err));
  }

  const filter = (data) => {

    console.log(data.name)
    if(data.name) {
      if(data.country) {
        if(data.season) {
          axios
            .get(`https://fcfootball.azurewebsites.net/api/v1/leagues?name=${data.name}&country=${data.country}&season=${data.season}`)
            .then((res) => {
              setLeagues(res.data)
            })
            .catch((err) => console.log(err));
        } else {
          axios
            .get(`https://fcfootball.azurewebsites.net/api/v1/leagues?country=${data.country}&name=${data.name}`)
            .then((res) => {
              setLeagues(res.data)
            })
            .catch((err) => console.log(err));
        }
      } else {
        if(data.season) {
          axios
            .get(`https://fcfootball.azurewebsites.net/api/v1/leagues?season=${data.season}&name=${data.name}`)
            .then((res) => {
              setLeagues(res.data)
            })
            .catch((err) => console.log(err));
        } else {
          axios
            .get(`https://fcfootball.azurewebsites.net/api/v1/leagues?name=${data.name}`)
            .then((res) => {
              setLeagues(res.data)
            })
            .catch((err) => console.log(err));
        }
      }
    } else {
      if(data.country) {
        if(data.season) {
          axios
            .get(`https://fcfootball.azurewebsites.net/api/v1/leagues?country=${data.country}&season=${data.season}`)
            .then((res) => {
              setLeagues(res.data)
            })
            .catch((err) => console.log(err));
        } else {
          axios
            .get(`https://fcfootball.azurewebsites.net/api/v1/leagues?country=${data.country}`)
            .then((res) => {
              setLeagues(res.data)
            })
            .catch((err) => console.log(err));
        }
      } else {
        if(data.season) {
          axios
            .get(`https://fcfootball.azurewebsites.net/api/v1/leagues?season=${data.season}`)
            .then((res) => {
              setLeagues(res.data)
            })
            .catch((err) => console.log(err));
        }
      }
    }
  }

  return (
  <div className="wrap-leagues-view">
    {isLoggedIn ? (
      <>
          <h1 className="leagues-view-h1">Available leagues</h1>

          <form onSubmit={handleSubmit(filter)}>
            <div className="leagues-it">
            <span className="search-text">Search bar: </span>
            <div className="input-wrap">
              <input className="league-input"
              {...register("name")}
              />
            </div>
            <div className="input-league-wrap">
            <select className="league-selectt"
                {...register("season")}>
                {SEASONS.map(season => <option value={season}>{season}</option>)}
                </select>
            </div>
            <div className="input-league-wrap">
                <select className="league-selectt"
                {...register("country")}>
                {COUNTRIES.map(country => <option value={country}>{country}</option>)}
                </select>
            </div>
            <button className="btn-edit-popup" type="submit">
              <i className="fa-solid fa-check"></i>
            </button>
            </div>
          </form>

          {leagues.map((league) => 
            <>
              <Link className="leagues-view-it" to={encodeURIComponent(league.name) + '/' + encodeURIComponent(league.season) +"/TeamsView"} state={ league.id } >
                <span className="leagues-view-it-txt">{league.name}</span>
                <span className="leagues-view-it-txt">{league.season}</span>
                <span className="leagues-view-it-txt">{league.country}</span>
                <div>

                  {!followedLeaguesIDs.includes(league.id) ?
                  (<button className="btn-follow" onClick={e => followLeague(e, league.id)}>
                    <i className="fa-solid fa-thumbs-up"></i>
                  </button>):(
                  <button className="btn-follow" onClick={e => unfollowLeague(e, league.id)}>
                    <i className="fa-solid fa-thumbs-down"></i>
                  </button>)
                  }
                </div>
            </Link>
            </>
          )}
      </>
    ) : (
      <span className="profile-span">You've been logged out, sign in again or sign up for free!</span>
    )}
  </div>
  );
};

export default LeaguesView;