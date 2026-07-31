import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    FaHome,
    FaTicketAlt,
    FaPlusCircle,
    FaUsers,
    FaChartBar,
    FaUser,
    FaSignOutAlt
} from "react-icons/fa";

import api from "../services/api";
import "../styles/sidebar.css";


function Sidebar() {

    const location = useLocation();
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));

    const role = user?.role;

    const handleLogout = async () => {

        if (isLoggingOut) {
            return;
        }

        setIsLoggingOut(true);

        try {
            await api.post("/logout");
        }
        catch (error) {
            console.error("Logout request failed:", error);
        }
        finally {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/", { replace: true });
        }

    };

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

            <button
                type="button"
                className="logout-button"
                onClick={handleLogout}
                disabled={isLoggingOut}
            >

                <FaSignOutAlt />

                {isLoggingOut ? "Logging out..." : "Logout"}

            </button>

        </div>

    );

}

export default Sidebar;
