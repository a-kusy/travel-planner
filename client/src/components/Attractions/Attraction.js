import { Link } from "react-router-dom";
import React from "react";

const Attraction = (props) => {
    const attraction = props.attraction;
    return(
            <li> <Link to={"/attractions/" + attraction.id}> {attraction.name} </Link></li>
        );
}
export default Attraction