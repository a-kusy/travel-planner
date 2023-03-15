import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import TripService from "../TripService.js";
import styles from "../Main/styles.module.css"
import Navbar from "../Navbar.js";

const  TripDetails = () =>{
    const [trip, setTrip] = useState([])
    const { id } = useParams();

    useEffect(() => {
        retrieveTrips();
    }, []);

    const retrieveTrips = () =>{
        TripService.get(id)
        .then((res) => {
            setTrip(res.data);
        })
        .catch((e) => {
            console.log(e);
        });
    }

    return(
        <div>
            <Navbar></Navbar>
            <div className={styles.mainForm}>
            <h2>Szczegóły wycieczki</h2>
            <h4>{trip.name}</h4>
            <p>Data: {trip.date} <br></br> Opis: {trip.description} <br></br>
            </p>
            <Link to="/">
                <button className={styles.no_white_btn}>Powrót</button>
            </Link>
            </div>
        </div>
    )
}
export default TripDetails