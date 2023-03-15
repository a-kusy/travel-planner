import styles from "./styles.module.css"
import axios from 'axios';
import React, { useState } from "react";
import { Link } from "react-router-dom"
import Navbar from "../Navbar";
import Trips from "../Trips/Trips";

const Main = () => {
    const [trips, setTrips] = useState([])

    const handleGetTrips = async (e) => {
        e.preventDefault()
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
    }

    return (
        <div className={styles.main_container}>
            <Navbar></Navbar>
            <div className={styles.main}>
                <h1>Zaplanuj swoją podróż</h1>
                <br></br>
                <Link to="/trips">
                    <button className={styles.no_white_btn}>Wycieczki</button>
                </Link>
                <Link to="/attractions">
                    <button className={styles.no_white_btn}>Atrakcje</button>
                </Link>
                <button className={styles.no_white_btn} onClick={handleGetTrips}>Lista</button>    
                
            </div>
            <div>
                {trips.length > 0 ? <Trips trips={trips} /> : <p></p>}
            </div>
        </div>
    )
}
export default Main