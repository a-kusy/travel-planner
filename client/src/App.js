import { Route, Routes, Navigate } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";
import Main from "./components/Main"
import Signup from "./components/Signup"
import Login from "./components/Login"
import AddTrip from "./components/Trips/AddTrip"
import TripTable from "./components/Trips/TripTable";
import TripDetails from "./components/Trips/TripDetails";
import EditTrip from "./components/Trips/EditTrip";
import AddAttraction from "./components/Attractions/AddAttraction";
import AttractionTable from "./components/Attractions/AttractionTable";
import AttractionDetails from "./components/Attractions/AttractionDetails";
import EditAttraction from "./components/Attractions/EditAttraction";

function App() {
  const user = localStorage.getItem("token")
  
  return (
    <Routes>
      {user && <Route path="/" exact element={<Main />} />}
      {user && <Route path="/addtrip" exact element={<AddTrip/>}/>}
      {user && <Route path="/trips" exact element={<TripTable/>}/>}
      {user && <Route path="/trips/:id" element={<TripDetails/>}/>}
      {user && <Route path="/edittrip/:id" element={<EditTrip/>}/>}
      {user && <Route path="/addattraction" element={<AddAttraction/>}/>}
      {user && <Route path="/attractions" element={<AttractionTable/>}/>}
      {user && <Route path="/attractions/:id" element={<AttractionDetails/>}/>}
      {user && <Route path="/editattraction/:id" element={<EditAttraction/>}/>}
      <Route path="/signup" exact element={<Signup />} />
      <Route path="/login" exact element={<Login />} />
      <Route path="/" element={<Navigate replace to="/login" />} />
    </Routes>
  )
}
export default App