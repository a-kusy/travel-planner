import React, { useState, useEffect, useRef } from "react";
import AttractionService from "../AttractionService.js";
import Navbar from "../Navbar.js";
import styles from "../Main/styles.module.css"
import { Link } from "react-router-dom";
import axios from "axios";

const AddAttraction = () => {
    const initialAttractionState = {
        id: null,
        name: "",
        tripId: null
    }

    const [attraction, setAttraction] = useState(initialAttractionState);
    const [submitted, setSubmitted] = useState(false);
    const [trips, setTrips] = useState([])
    const [tripId, setTripId] = useState(null)
    const [error, setError] = useState("")

    const saveAttraction = () => {
        if(trips.length !== 0){
        var data = {
            name: attraction.name,
            tripId: tripId,
        };
        
        if(tripId == null){
            data.tripId = trips[0].id   
        }

        AttractionService.create(data)
            .then(res => {
                setAttraction({
                    id: res.data.id,
                    name: res.data.name,
                    tripId: res.data.tripId,
                });

                setSubmitted(true);
                console.log(res.data.message);
                
            })
            .catch(e => {
                console.log(e)
                setError(e.response.data.message)
            });
        }
        else {setError("Najpierw dodaj wycieczkę")}
    };

    const handleInputChange = event => {
        const { name, value } = event.target;
        setAttraction({ ...attraction, [name]: value });
    };

    const newAttraction = () => {
        setAttraction(initialAttractionState);
        setSubmitted(false)
    }

    useEffect(() => {
        retrieveTrips();
    }, []);

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

    return (
        <div>
            <Navbar></Navbar>
            <div className={styles.mainForm}>
                {submitted ? (
                    <div>
                        <h4>Dodano atrakcję</h4>
                        <button className={styles.no_white_btn} onClick={newAttraction}>Dodaj kolejną</button>
                        <Link to="/attractions">
                            <button className={styles.no_white_btn}>Powrót</button>
                        </Link>
                    </div>
                ) : (
                    <div>
                        <form onSubmit={saveAttraction}>
                        <h2>Dodaj atrakcję</h2>
                        <div className="form-group">
                            <label htmlFor="name">Nazwa</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                required
                                value={attraction.name}
                                onChange={handleInputChange}
                                name="name"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="tripId">Wycieczka</label>
                            <select value={tripId} onChange={(e) => setTripId(e.target.value)} className="form-control">
                                {trips.map((trip) => (
                                    <option value={trip.id} key={trip.id}>{trip.name} {trip.date}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <br></br>
                            <button type="submit" className={styles.no_white_btn}>Dodaj</button>
                            <Link to="/attractions">
                                <button className={styles.no_white_btn}>Powrót</button>
                            </Link>
                        </div>
                        </form>
                    </div>
                )}
            </div>
            {error && <div className={styles.error_msg}>{error}</div>}
        </div>
    )
}
export default AddAttraction