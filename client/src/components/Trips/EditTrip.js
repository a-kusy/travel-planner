import React, { useState, useEffect } from "react";
import TripService from "../TripService.js";
import Navbar from "../Navbar.js";
import styles from "../Main/styles.module.css"
import { Link, useParams } from "react-router-dom";

const EditTrip = () => {
    const [trip, setTrip] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("")
    const { id } = useParams()

    const retrieveTrips = () => {
        TripService.get(id)
            .then((res) => {
                setTrip(res.data);
            })
            .catch((e) => {
                console.log(e);
            });
    }

    useEffect(() => {
        retrieveTrips()
    }, [])

    const handleInputChange = event => {
        const { name, value } = event.target;
        setTrip({ ...trip, [name]: value });
    };

    const editTrip = (e) => {
        e.preventDefault()

        var data = {
            name: trip.name,
            date: trip.date,
            description: trip.description
        }

        TripService.update(id, data)
            .then(res => {
                setTrip({
                    id: res.data.id,
                    name: res.data.name,
                    date: res.data.date,
                    description: res.data.description
                });

                setSubmitted(true);
            }).catch(e => {
                console.log(e)
                setError(e.response.data.message)
            });
    }

    return (
        <div>
            <Navbar></Navbar>
            <div className={styles.mainForm}>
                <div className="submit-form">
                    {submitted ? (
                            <div>
                                <h4>Zedytowano wycieczkę</h4>
                                <Link to="/trips">
                                    <button className={styles.no_white_btn}>Powrót</button>
                                </Link>
                            </div>
                        ) : (
                            <div>
                                <form onSubmit={editTrip}>
                                    <h2>Edytuj wycieczkę</h2>
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
                                        <button type="submit" className={styles.no_white_btn}>Edytuj</button>
                                        <Link to="/trips">
                                            <button className={styles.no_white_btn}>Powrót</button>
                                        </Link>
                                    </div>
                                </form>
                            </div>
                        )
                    }
                </div>
            </div>
            {error && <div className={styles.error_msg}>{error}</div>}
        </div>
    )
}
export default EditTrip
