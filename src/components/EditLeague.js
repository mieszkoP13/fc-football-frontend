import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form";
import axios from "axios";
import "./EditLeague.css"
const RE_NAME = /^\S.{3,20}$/;
const COUNTRIES = ["AFG","ALA","ALB","DZA","ASM","AND","AGO","AIA","ATA","ATG","ARG","ARM","ABW","AUS","AUT","AZE","BHS","BHR","BGD","BRB","BLR","BEL","BLZ","BEN","BMU","BTN","BOL","BES","BIH","BWA","BVT","BRA","IOT","BRN","BGR","BFA","BDI","KHM","CMR","CAN","CPV","CYM","CAF","TCD","CHL","CHN","CXR","CCK","COL","COM","COG","COD","COK","CRI","CIV","HRV","CUB","CUW","CYP","CZE","DNK","DJI","DMA","DOM","ECU","EGY","SLV","GNQ","ERI","EST","ETH","FLK","FRO","FJI","FIN","FRA","GUF","PYF","ATF","GAB","GMB","GEO","DEU","GHA","GIB","GRC","GRL","GRD","GLP","GUM","GTM","GGY","GIN","GNB","GUY","HTI","HMD","VAT","HND","HKG","HUN","ISL","IND","IDN","IRN","IRQ","IRL","IMN","ISR","ITA","JAM","JPN","JEY","JOR","KAZ","KEN","KIR","PRK","KOR","XKX","KWT","KGZ","LAO","LVA","LBN","LSO","LBR","LBY","LIE","LTU","LUX","MAC","MKD","MDG","MWI","MYS","MDV","MLI","MLT","MHL","MTQ","MRT","MUS","MYT","MEX","FSM","MDA","MCO","MNG","MNE","MSR","MAR","MOZ","MMR","NAM","NRU","NPL","NLD","ANT","NCL","NZL","NIC","NER","NGA","NIU","NFK","MNP","NOR","OMN","PAK","PLW","PSE","PAN","PNG","PRY","PER","PHL","PCN","POL","PRT","PRI","QAT","REU","ROM","RUS","RWA","BLM","SHN","KNA","LCA","MAF","SPM","VCT","WSM","SMR","STP","SAU","SEN","SRB","SCG","SYC","SLE","SGP","SXM","SVK","SVN","SLB","SOM","ZAF","SGS","SSD","ESP","LKA","SDN","SUR","SJM","SWZ","SWE","CHE","SYR","TWN","TJK","TZA","THA","TLS","TGO","TKL","TON","TTO","TUN","TUR","TKM","TCA","TUV","UGA","UKR","ARE","GBR","USA","UMI","URY","UZB","VUT","VEN","VNM","VGB","VIR","WLF","ESH","YEM","ZMB","ZWE"]
const SEASONS = ["1989/90","1990/91","1991/92","1992/93","1993/94","1994/95","1995/96","1996/97","1997/98","1998/99","1999/23","2000/01","2001/02","2002/03","2003/04","2004/05","2005/06","2006/07","2007/08","2008/09","2009/10","2010/11","2011/12","2012/13","2013/14","2014/15","2015/16","2016/17","2017/18","2018/19","2019/20","2020/21","2021/22","2022/23"]

const EditLeague = ({updatePopUpMessage,league}) => {

    const [edit, setEdit] = useState(true)
    const showEdit = () => setEdit(true)
    const hideEdit = () => setEdit(false)

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
      } = useForm({defaultValues: {name: league.name, country: league.country, season: league.season}});

    const onSubmit = (data) => {
        hideEdit()
        reset()
        axios
          .put(`https://fcfootball.azurewebsites.net/api/v1/leagues/${league.id}`,data)
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
        <div className="leagues-it">

        <div className="input-wrap">
            <input className="league-input"
            {...register("name", {
                required: true,
                pattern: { value: RE_NAME },
            })}
            />
            {errors.name ? (<p className="error-txt">Invalid League name.</p>)
            : (<p className="invisible error-txt">Invalid League name.</p>)}
        </div>
        <div className="input-league-wrap">
        <select className="league-select"
            {...register("season", {
                required: true,
            })}>
            {SEASONS.map(season => <option value={season}>{season}</option>)}
            </select>
        </div>
        <div className="input-league-wrap">
            <select className="league-select"
            {...register("country", {
                required: true,
            })}>
            {COUNTRIES.map(country => <option value={country}>{country}</option>)}
            </select>
        </div>

        <button className="btn-edit-popup" type="submit">
            <i className="fa-solid fa-check"></i>
        </button>
        </div>
    </form>):(<></>)}
    </>
    )
}

export default EditLeague