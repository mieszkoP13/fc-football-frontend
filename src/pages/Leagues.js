import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom'
import { useForm } from "react-hook-form";
import '@fortawesome/fontawesome-free/css/all.min.css'
import axios from "axios";
import useLoginStatus from "../hooks/useLoginStatus";
import useUserRoleStatus from "../hooks/useUserRoleStatus";
import useLocalStorage from "../hooks/useLocalStorage";
import PopUp from "../components/PopUp";
import AddLeague from "../components/AddLeague";
import EditLeague from "../components/EditLeague";
import "./Leagues.css";
const COUNTRIES = ["","AFG","ALA","ALB","DZA","ASM","AND","AGO","AIA","ATA","ATG","ARG","ARM","ABW","AUS","AUT","AZE","BHS","BHR","BGD","BRB","BLR","BEL","BLZ","BEN","BMU","BTN","BOL","BES","BIH","BWA","BVT","BRA","IOT","BRN","BGR","BFA","BDI","KHM","CMR","CAN","CPV","CYM","CAF","TCD","CHL","CHN","CXR","CCK","COL","COM","COG","COD","COK","CRI","CIV","HRV","CUB","CUW","CYP","CZE","DNK","DJI","DMA","DOM","ECU","EGY","SLV","GNQ","ERI","EST","ETH","FLK","FRO","FJI","FIN","FRA","GUF","PYF","ATF","GAB","GMB","GEO","DEU","GHA","GIB","GRC","GRL","GRD","GLP","GUM","GTM","GGY","GIN","GNB","GUY","HTI","HMD","VAT","HND","HKG","HUN","ISL","IND","IDN","IRN","IRQ","IRL","IMN","ISR","ITA","JAM","JPN","JEY","JOR","KAZ","KEN","KIR","PRK","KOR","XKX","KWT","KGZ","LAO","LVA","LBN","LSO","LBR","LBY","LIE","LTU","LUX","MAC","MKD","MDG","MWI","MYS","MDV","MLI","MLT","MHL","MTQ","MRT","MUS","MYT","MEX","FSM","MDA","MCO","MNG","MNE","MSR","MAR","MOZ","MMR","NAM","NRU","NPL","NLD","ANT","NCL","NZL","NIC","NER","NGA","NIU","NFK","MNP","NOR","OMN","PAK","PLW","PSE","PAN","PNG","PRY","PER","PHL","PCN","POL","PRT","PRI","QAT","REU","ROM","RUS","RWA","BLM","SHN","KNA","LCA","MAF","SPM","VCT","WSM","SMR","STP","SAU","SEN","SRB","SCG","SYC","SLE","SGP","SXM","SVK","SVN","SLB","SOM","ZAF","SGS","SSD","ESP","LKA","SDN","SUR","SJM","SWZ","SWE","CHE","SYR","TWN","TJK","TZA","THA","TLS","TGO","TKL","TON","TTO","TUN","TUR","TKM","TCA","TUV","UGA","UKR","ARE","GBR","USA","UMI","URY","UZB","VUT","VEN","VNM","VGB","VIR","WLF","ESH","YEM","ZMB","ZWE"]
const SEASONS = ["","1989/90","1990/91","1991/92","1992/93","1993/94","1994/95","1995/96","1996/97","1997/98","1998/99","1999/23","2000/01","2001/02","2002/03","2003/04","2004/05","2005/06","2006/07","2007/08","2008/09","2009/10","2010/11","2011/12","2012/13","2013/14","2014/15","2015/16","2016/17","2017/18","2018/19","2019/20","2020/21","2021/22","2022/23"]

const Leagues = (props) => {
  let isLoggedIn = useLoginStatus()
  let isUserModerator = useUserRoleStatus("ROLE_MODERATOR")
  let isUserAdmin = useUserRoleStatus("ROLE_ADMIN")
  let token = useLocalStorage("token")

  const [showPopUpDelete, setShowPopUpDelete] = useState(false);
  
  const [showPopUp, setShowPopUp] = useState(false);
  const [popUpMessage, setPopUpMessage] = useState("")

  const [leagues, setLeagues] = useState([])
  const [followedLeaguesIDs, setFollowedLeaguesIDs] = useState([])
  const [editLeagueID, setEditLeagueID] = useState(-1)
  const [deleteLeagueID, setDeleteLeagueID] = useState(-1)

  const {
    register,
    handleSubmit,
  } = useForm();

  useEffect(() => {
    axios
      .get("https://fcfootball.azurewebsites.net/api/v1/leagues")
      .then((res) => {
        setLeagues(res.data)
      })
      .catch((err) => console.log(err));
  },[isLoggedIn,showPopUp,editLeagueID,deleteLeagueID,followedLeaguesIDs])

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

  const showEditLeague = (e,id) => {
    e.preventDefault()
    e.stopPropagation()
    setEditLeagueID(id)
  }

  const showDeleteLeague = (e,id) => {
    e.preventDefault()
    e.stopPropagation()
    setDeleteLeagueID(id)
    setShowPopUpDelete(true)
  }

  const updatePopUpMessage = (popUpMsg) => {
    setPopUpMessage(popUpMsg)
    setShowPopUp(true);
    setEditLeagueID(-1)
  }

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

  const deleteLeague = (id) => {
    axios
      .delete(
        `https://fcfootball.azurewebsites.net/api/v1/leagues/${id}`)
      .then((res) => {
        setDeleteLeagueID(-1)
      })
      .catch((err) => {
        setDeleteLeagueID(-1)
      });
  };

  const filter = (data) => {
    let url = "https://fcfootball.azurewebsites.net/api/v1/leagues?"

    if(data.name) {
      if(data.country) {
        if(data.season) {
          url += `name=${data.name}&country=${data.country}&season=${data.season}`
        } else {
          url += `country=${data.country}&season=${data.season}`
        }
      } else {
        if(data.season) {
          url += `season=${data.season}&name=${data.name}`
        } else {
          url += `name=${data.name}`
        }
      }
    } else {
      if(data.country) {
        if(data.season) {
          url += `country=${data.country}&season=${data.season}`
        } else {
          url += `country=${data.country}`
        }
      } else {
        if(data.season) {
          url += `season=${data.season}`
        }
      }
    }
    axios
      .get(url)
      .then((res) => {
        setLeagues(res.data)
      })
      .catch((err) => console.log(err));
  }

  return (
  <div className="wrap-leagues">
    {(isUserModerator || isUserAdmin) && isLoggedIn ? (
      <>
          <h1 className="leagues-h1">Available leagues</h1>

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
              <i class="fa-solid fa-magnifying-glass"></i>
            </button>
            </div>
          </form>

          {showPopUp ? (
          <PopUp setShow={setShowPopUp} defaultBtnText="Ok">
            <h1 className="leagues-popup-h1">Add League info</h1>
            <span>
              {popUpMessage}
            </span>
          </PopUp>):(<></>)
          }
          <AddLeague updatePopUpMessage={updatePopUpMessage}/>

          {showPopUpDelete ? (
          <PopUp setShow={setShowPopUpDelete} customFunction={()=>deleteLeague(deleteLeagueID)} customFunctionBtnText="Delete" defaultBtnText="Cancel">
            <h1 className="sign-in-err-h1">
              Are you sure you want to delete this league?
            </h1>
            <span>This action is irreversible</span>
          </PopUp>) : (<></>)
          }

          {leagues.map((league, arrayID) => 
            <>
            {editLeagueID === arrayID ? (<EditLeague updatePopUpMessage={updatePopUpMessage} league={league}/>) : (
              <Link className="leagues-it" to={encodeURIComponent(league.name) + '/' + encodeURIComponent(league.season) +"/Teams"} state={ league.id } >
                <span className="leagues-it-txt">{league.name}</span>
                <span className="leagues-it-txt">{league.season}</span>
                <span className="leagues-it-txt">{league.country}</span>
                <div>
                  
                <button className="btn-edit" onClick={e => showEditLeague(e, arrayID)}>
                  <i className="fa-solid fa-pen-to-square"></i>
                </button>
                <button className="btn-edit" onClick={e => showDeleteLeague(e, league.id)}>
                  <i class="fa-solid fa-trash-can"></i>
                </button>
                
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
            )}
            </>
          )}
      </>
    ) : (
      <span className="profile-span">You've been logged out or you don't have sufficient permission to view this tab, sign in again or sign up for free!</span>
    )}
  </div>
  );
};

export default Leagues;