import Trip from "./Trip";

function Trips(props){
    const trips = props.trips;
    return(
        <ol>{trips.map((trip) => <Trip key={trip.id} value={trip.id} trip={trip}/>)} </ol>
    )
}
export default Trips