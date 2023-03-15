import React, { useState, useEffect } from "react";
import { confirm } from "react-confirm-box";
import { Link } from "react-router-dom";
import AttractionService from "../AttractionService";
import styles from "../Main/styles.module.css"
import Navbar from "../Navbar.js";
import axios from "axios";

const AttractionTable = () => {
    const [trips, setTrips] = useState([]);
    const [attractions, setAttractions] = useState([]);
    const [error, setError] = useState("");
    
    useEffect(() => {
        retrieveTrips();
        retrieveAttractions();
    }, [])

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

    const retrieveAttractions = async () => {       
            const token = localStorage.getItem("token")
            if (token) {
                try {
                    const config = {
                        method: 'get',
                        url: 'http://localhost:8080/api/attractions',
                        headers: { 'Content-Type': 'application/json', 'x-access-token': token }
                    }

                    const { data: res } = await axios(config)
                    setAttractions(res.data)
                } catch (error) {
                    if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                        localStorage.removeItem("token")
                        window.location.reload()
                    }
                }
            }
        
    }

    const refreshTable = () => {
        retrieveTrips();
        retrieveAttractions();
    };

    const removeAllAttractions = () => {
        for (let i = 0; i < trips.length; i++) {
        AttractionService.deleteByTripId(trips[i].id)
            .then((res) => {
                setError(res.data.message)
                console.log(res.data);
                refreshTable();
            })
            .catch((e) => {
                console.log(e);
                setError(e.response.data.message);
            });
        }
    };

    const deleteAttraction = (attractionId) => {
        AttractionService.remove(attractionId)
            .then((res) => {
                setError(res.data.message)
                window.location.reload()
            })
            .catch((e) => {
                console.log(e)
                setError(e.response.data.message);
            })
    }

    const getTrip = (tripId) => {
        if (trips.length !== 0) {
            if (typeof trips.find(t => t.id === tripId) !== "undefined") {
                return (
                    trips.find(t => t.id === tripId).name
                )
            }
            else return ""
        }else return ""
    }

    const options = {
        labels: {
            confirmable: "Potwierdź",
            cancellable: "Anuluj"
        }
    }

    const ConfirmDeleteAllAttractions = async () => {
        const result = await confirm("Na pewno chcesz usunąć wszystkie atrakcje?", options);
        if (result) {
           removeAllAttractions();
            return;
        }
    };

    const ConfirmDeleteAttraction = async (attractionId) => {
        const result = await confirm("Na pewno chcesz usunąć atrakcję?", options);
        if (result) {
            deleteAttraction(attractionId);
            return;
        }
    };

    return (
        <div>
            <Navbar></Navbar>
            <div className={styles.main}>
                <div className="list row">
                    <div className="col-md-12 list">
                        <h4>Twoje atrakcje</h4>
                        <Link to="/addattraction">
                            <button className={styles.no_white_btn}>Dodaj</button>
                        </Link>
                        <Link to="/">
                            <button className={styles.no_white_btn}>Powrót</button>
                        </Link>
                        <table className="table table-striped" style={{ marginTop: 20 }}>
                            <thead>
                                <tr>
                                    <th>Nazwa</th>
                                    <th>Wycieczka</th>
                                    <th>Akcja</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attractions.filter(function (a) {
                                    if (getTrip(a.tripId) !== "") { return a }
                                }).map((attraction) => (
                                    <tr key={attraction.id}>
                                        <td>{attraction.name}</td>
                                        <td>{getTrip(attraction.tripId)}
                                        </td>
                                        <td>
                                            <Link to={"/attractions/" + attraction.id}>
                                                <span >
                                                    <i className="fas fa-info action mr-2"></i>
                                                </span>
                                            </Link>
                                            <Link to={"/editattraction/" + attraction.id}>
                                                <span >
                                                    <i className="far fa-edit action mr-2"></i>
                                                </span>
                                            </Link>
                                            <span onClick={() => ConfirmDeleteAttraction(attraction.id)}>
                                                <i className="fas fa-trash action"></i>
                                            </span>
                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    </div>
                    <div className="col-md-12">
                        <Link to="/addattraction">
                            <button className={styles.no_white_btn}>Dodaj</button>
                        </Link>
                        <button className={styles.no_white_btn} onClick={ConfirmDeleteAllAttractions}>Usuń wszystko</button>
                    </div>
                </div>
            </div>
            {error && <div className={styles.error_msg}>{error}</div>}
        </div>
    )
}
export default AttractionTable