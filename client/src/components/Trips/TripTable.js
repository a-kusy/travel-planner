import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { confirm } from "react-confirm-box";
import TripService from "../TripService.js";
import AttractionService from "../AttractionService.js";
import styles from "../Main/styles.module.css"
import Navbar from "../Navbar.js";
import axios from "axios";

const TripTable = () => {
    const [trips, setTrips] = useState([])
    const [error, setError] = useState("")

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

    const refreshTable = () => {
        retrieveTrips();
    };

    const removeAllTrips = () => {
        let newTrips = trips;
        TripService.removeAll()
            .then((res) => {
                for (let i = 0; i < newTrips.length; i++) {
                    AttractionService.deleteByTripId(newTrips[i].id)
                        .then((res) => {
                            console.log(res.data.message)
                        }).catch((e) => {
                            console.log(e)
                        })
                }
                console.log(res.data);
                setError(res.data.message);
                refreshTable();
            })
            .catch((e) => {
                console.log(e);
                setError(e.response.data.message);
            });
    };

    const deleteTrip = (tripId) => {
        TripService.remove(tripId)
            .then((res) => {
                AttractionService.deleteByTripId(tripId)
                    .then((res) => {
                        console.log(res.data.message)
                    }).catch((e) => {
                        console.log(e)
                    })

                setError(res.data.message);
                window.location.reload()
            })
            .catch((e) => {
                console.log(e)
                setError(e.response.data.message);
            })
    }

    const options = {
        labels: {
            confirmable: "Potwierdź",
            cancellable: "Anuluj"
        }
    }

    const ConfirmDeleteAllTrips = async () => {
        const result = await confirm("Na pewno chcesz usunąć wszystkie wycieczki?", options);
        if (result) {
            removeAllTrips();
            return;
        }
    };

    const ConfirmDeleteTrip = async (tripId) => {
        const result = await confirm("Na pewno chcesz usunąć wycieczkę?", options);
        if (result) {
            deleteTrip(tripId);
            return;
        }
    };


    return (
        <div>
            <Navbar></Navbar>
            <div className={styles.main}>
                <div className="list row">
                    <div className="col-md-12 list">
                        <h4>Twoje wycieczki</h4>
                        <Link to="/addtrip">
                            <button className={styles.no_white_btn}>Dodaj</button>
                        </Link>
                        <Link to="/">
                            <button className={styles.no_white_btn}>Powrót</button>
                        </Link>
                        <table className="table table-striped" style={{ marginTop: 20 }}>
                            <thead>
                                <tr>
                                    <th>Nazwa</th>
                                    <th>Data</th>
                                    <th>Akcja</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trips.map((trip) => (
                                    <tr key={trip.id}>
                                        <td>{trip.name}</td>
                                        <td>{trip.date}</td>
                                        <td>
                                            <Link to={"/trips/" + trip.id}>
                                                <span >
                                                    <i className="fas fa-info action mr-2"></i>
                                                </span>
                                            </Link>
                                            <Link to={"/edittrip/" + trip.id}>
                                                <span >
                                                    <i className="far fa-edit action mr-2"></i>
                                                </span>
                                            </Link>
                                            <span onClick={() => ConfirmDeleteTrip(trip.id)}>
                                                <i className="fa fa-trash action mr-2"></i>
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="col-md-12">
                        <Link to="/addtrip">
                            <button className={styles.no_white_btn}>Dodaj</button>
                        </Link>
                        <button className={styles.no_white_btn} onClick={ConfirmDeleteAllTrips}>Usuń wszystko</button>
                    </div>
                </div>
            </div>
            {error && <div className={styles.error_msg}>{error}</div>}
        </div>
    );
}
export default TripTable
