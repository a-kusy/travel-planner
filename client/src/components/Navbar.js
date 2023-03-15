import styles from "./Main/styles.module.css"
import axios from 'axios';
import { Link } from "react-router-dom"
import { confirm } from "react-confirm-box"

const Navbar = () => {

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location = "/";
    }

    const handleRemoveAcc = async (e) => {
        e.preventDefault()
        const token = localStorage.getItem("token")
        if (token) {
            try {
                const config = {
                    method: 'get',
                    url: 'http://localhost:8080/api/users/delete',
                    headers: { 'Content-Type': 'application/json', 'x-access-token': token }
                }
                const { data: res } = await axios(config)

                window.location = "/"
                localStorage.removeItem("token")
                console.log(res.message)
            } catch (error) {
                if (
                    error.response && error.response.status >= 400 && error.response.status <= 500
                ) {
                    console.log(error.response.data.message)
                }
            }
        }
    }
    const options = {
        labels: {
            confirmable: "Potwierdź",
            cancellable: "Anuluj"
        }
    }

    const Confirm = async () => {
        const result = await confirm("Na pewno chcesz usunąć konto?", options);
        if (result) {
            handleRemoveAcc();
            return;
        }
    };


    return (
        <nav className={styles.navbar}>
            <Link to="/">
                <h1>Planer podróży <i className="fa fa-earth-americas"></i></h1>
            </Link>
            <div className="nav-right">
                <button className={styles.white_btn} onClick={handleLogout}>Wyloguj się</button>
                <button className={styles.white_btn} onClick={Confirm}>Usuń konto</button>
            </div>
        </nav>
    )
}
export default Navbar;