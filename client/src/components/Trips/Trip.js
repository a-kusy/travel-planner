import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import AttractionService from "../AttractionService"
import Attraction from "../Attractions/Attraction"

const Trip = (props) => {
    const trip = props.trip;
    const [attractions, setAttractions] = useState([])
    
    useEffect(() => {
        getAttractionsByTripId(trip.id)
    }, [])

    const getAttractionsByTripId = (tripId) => {
        AttractionService.getByTripId(tripId)
        .then((res) => {
            setAttractions(res.data)
        })
        .catch((e) => {
            console.log(e);
        });
    }

    return(
        
            <li> <Link to={"/trips/" + trip.id}>{trip.name} {trip.date}</Link>
                <ul>
                    {attractions.map((attraction) => <Attraction key={attraction.id} attraction={attraction}/>)}
                </ul>
            </li>
       );
}
export default Trip