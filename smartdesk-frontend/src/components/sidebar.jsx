import { Link, useLocation } from "react-router-dom";
import {
    FaHome,
    FaTicketAlt,
    FaPlusCircle,
    FaUsers,
    FaChartBar,
    FaUser,
    FaSignOutAlt
} from "react-icons/fa";

import "../styles/sidebar.css";


function Sidebar() {

    const location = useLocation();

    const user = JSON.parse(localStorage.getItem("user"));

    const role = user?.role;

    return (

        <div className="sidebar">

            <div className="logo">

                <h2>SmartDesk</h2>

                <p>Ticket System</p>

            </div>

            <ul>

                <li className={location.pathname === "/dashboard" ? "active" : ""}>
                    <Link to="/dashboard">
                        <FaHome />
                        Dashboard
                    </Link>
                </li>

                {(role === "Admin" || role === "Manager") && (

                    <li className={location.pathname === "/tickets" ? "active" : ""}>
                        <Link to="/tickets">
                            <FaTicketAlt />
                            Tickets
                        </Link>
                    </li>

                )}

                {role === "Employee" && (

                    <li className={location.pathname === "/tickets" ? "active" : ""}>
                        <Link to="/tickets">
                            <FaTicketAlt />
                            My Tickets
                        </Link>
                    </li>

                )}

                {role === "IT Support Agent" && (

                    <li className={location.pathname === "/tickets" ? "active" : ""}>
                        <Link to="/tickets">
                            <FaTicketAlt />
                            Assigned Tickets
                        </Link>
                    </li>

                )}

                {(role === "Admin" || role === "Employee") && (

                    <li className={location.pathname === "/create-ticket" ? "active" : ""}>
                        <Link to="/create-ticket">
                            <FaPlusCircle />
                            Create Ticket
                        </Link>
                    </li>

                )}

                {role === "Admin" && (

                    <li className={location.pathname === "/users" ? "active" : ""}>
                        <Link to="/users">
                            <FaUsers />
                            Users
                        </Link>
                    </li>

                )}

                {(role === "Admin" || role === "Manager") && (

                    <li className={location.pathname === "/reports" ? "active" : ""}>
                        <Link to="/reports">
                            <FaChartBar />
                            Reports
                        </Link>
                    </li>

                )}

                <li className={location.pathname === "/profile" ? "active" : ""}>
                    <Link to="/profile">
                        <FaUser />
                        Profile
                    </Link>
                </li>

            </ul>

            <button className="logout-button">

                <FaSignOutAlt />

                Logout

            </button>

        </div>

    );

}

export default Sidebar;