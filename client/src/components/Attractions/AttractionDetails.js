import React, { useState, useEffect } from "react";
import AttractionService from "../AttractionService";
import { Link, useParams } from "react-router-dom";
import styles from "../Main/styles.module.css"
import Navbar from "../Navbar.js";
import axios from "axios";

const AttractionDetails = () => {
    const [attraction, setAttraction] = useState([]);
    const [trips, setTrips] = useState([])
    const { id } = useParams();

    useEffect(() => {
        retrieveAttractions(); 
        retrieveTrips();
    }, [])

    const retrieveAttractions = () =>{
        AttractionService.get(id)
        .then((res) => {
            setAttraction(res.data);
        })
        .catch((e) => {
            console.log(e);
        });
    }

    const getTrip = (tripId) =>{
        if(trips.length !== 0){
            if(typeof trips.find(t => t.id === tripId) != "undefined" || trips.find(t => t.id === tripId) != null)
            return(
                <p>
                {trips.find(t => t.id === tripId).name + "   "}   
                {trips.find(t => t.id === tripId).date}
                </p>
            )
        }
    }

    const retrieveTrips = async () => {
        const token = localStorage.getItem("token")
        if (token) {
            try {
                const config = {
                    method: 'get',
                    url: 'http://localhost:8080/api/trips',
                    headers: { 'Content-Type': 'application/json', 'x-access-token': token }
                }

                const { data: res } = await axios(config)
                setTrips(res.data)
            } catch (error) {
                if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                    localStorage.removeItem("token")
                    window.location.reload()
                }
            }
        }
    };


    return(
        <div>
            <Navbar></Navbar>
            <div className={styles.mainForm}>
            <h2>Szczegóły atrakcji</h2>
            <h4>{attraction.name}</h4>
            Wycieczka: {getTrip(attraction.tripId)}
            <Link to="/">
                <button className={styles.no_white_btn}>Powrót</button>
            </Link>
            </div>
        </div>
    )

}
export default AttractionDetails