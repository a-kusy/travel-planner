import React, { useState, useEffect } from "react";
import Navbar from "../Navbar.js";
import styles from "../Main/styles.module.css"
import { Link, useParams } from "react-router-dom";
import AttractionService from "../AttractionService.js";
import axios from "axios";

const EditAttraction = () => {
    const [attraction, setAttraction] = useState([]);
    const [trips, setTrips] = useState([])
    const [tripId, setTripId] = useState(null)
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("")
    const { id } = useParams()

    useEffect(() => {
        retrieveAttractions();
        retrieveTrips();
    }, [])

    const retrieveAttractions = () => {
        AttractionService.get(id)
            .then((res) => {
                console.log(res.data);
                setAttraction(res.data);
            })
            .catch((e) => {
                console.log(e);
            });
    }

    const handleInputChange = event => {
        const { name, value } = event.target;
        setAttraction({ ...attraction, [name]: value });
    };

    const editAttraction = () => {
        var data = {
            name: attraction.name,
            tripId: tripId,
        }

        if (tripId == null) {
            data.tripId = trips[0].id
        }

        AttractionService.update(id, data)
            .then(res => {
                setAttraction({
                    id: res.data.id,
                    name: res.data.name,
                    tripId: res.data.tripId,
                })
                setSubmitted(true);
            }).catch(e => {
                console.log(e);
                setError(e.response.data.message);
            });
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

    return (
        <div>
            <Navbar></Navbar>
            <div className={styles.mainForm}>
                {submitted ? (
                    <div>
                        <h4>Zedytowano atrakcję</h4>
                        <Link to="/attractions">
                            <button className={styles.no_white_btn}>Powrót</button>
                        </Link>
                    </div>
                ) : (
                    <div>
                        <h2>Edytuj atrakcję</h2>
                        <form onSubmit={editAttraction}>
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
                                <button type="submit" className={styles.no_white_btn}>Edytuj</button>
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
export default EditAttraction