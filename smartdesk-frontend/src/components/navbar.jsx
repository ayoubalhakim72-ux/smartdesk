import "../styles/navbar.css";
import { FaBell, FaUserCircle } from "react-icons/fa";

function Navbar() {

    const user = JSON.parse(localStorage.getItem("user"));

    return (

        <div className="navbar">

            <div>

                <h2>Dashboard</h2>

                <p>Welcome back to SmartDesk</p>

            </div>

            <div className="navbar-right">

                <div className="notification">

                    <FaBell />

                    <span className="notification-badge">0</span>

                </div>

                <div className="user-info">

                    <FaUserCircle className="avatar" />

                    <div>

                        <h4>{user.firstname}</h4>

                        <p>{user.role}</p>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Navbar;