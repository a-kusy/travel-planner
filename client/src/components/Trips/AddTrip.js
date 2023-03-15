import React, { useState } from "react";
import TripService from "../TripService.js";
import Navbar from "../Navbar.js";
import styles from "../Main/styles.module.css"
import { Link } from "react-router-dom";

const AddTrip = () => {
    const initialTripState = {
        id: null,
        name: "",
        date: "",
        description: "",
        userId: ""
    };

    const [trip, setTrip] = useState(initialTripState);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("")

    const handleInputChange = event => {
        const { name, value } = event.target;
        setTrip({ ...trip, [name]: value });
    };

    const saveTrip = async (e) => {
        e.preventDefault()

        var data = {
            name: trip.name,
            date: trip.date,
            description: trip.description,
            userId: ""
        };

        TripService.create(data)
            .then(res => {
                setTrip({
                    id: res.data.id,
                    name: res.data.name,
                    date: res.data.date,
                    description: res.data.description,
                    userId: res.data.userId
                });

                setSubmitted(true);
            })
            .catch(error => {
                console.log(error)
                setError(error.response.data.message)
            });
    };

    const newTrip = () => {
        setTrip(initialTripState);
        setSubmitted(false);
    };

    return (
        <div >
            <Navbar></Navbar>
            <div className={styles.mainForm}>
                <div className="submit-form">
                    {submitted ? (
                        <div>
                            <h4>Dodano wycieczkę</h4>
                            <button className={styles.no_white_btn} onClick={newTrip}>Dodaj kolejną</button>
                            <Link to="/trips">
                                <button className={styles.no_white_btn}>Powrót</button>
                            </Link>
                        </div>
                    ) : (
                        <div>
                            <form onSubmit={saveTrip}>
                                <h2>Dodaj wycieczkę</h2>
                                <div className="form-group">
                                    <label htmlFor="name">Nazwa</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        required
                                        value={trip.name}
                                        onChange={handleInputChange}
                                        name="name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="date">Data</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="date"
                                        required
                                        value={trip.date}
                                        onChange={handleInputChange}
                                        name="date"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="name">Opis</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="description"
                                        required
                                        value={trip.description}
                                        onChange={handleInputChange}
                                        name="description"
                                    />
                                </div>
                                <div>
                                    <br></br>
                                    <button type="submit" className={styles.no_white_btn}>Dodaj</button>
                                    <Link to="/trips">
                                        <button className={styles.no_white_btn}>Powrót</button>
                                    </Link>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
            {error && <div className={styles.error_msg}>{error}</div>}
        </div>
    );

};
export default AddTrip;