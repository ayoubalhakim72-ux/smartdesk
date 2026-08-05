import "../styles/navbar.css";
import { FaBell } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const pageDetails = {
    dashboard: ["Dashboard", "Your service desk at a glance"],
    tickets: ["Tickets", "Track and manage support requests"],
    "create-ticket": ["Create Ticket", "Open a new support request"],
    users: ["User Management", "Manage people, roles, and access"],
    profile: ["My Profile", "Manage your account and security"],
    reports: ["Reports", "Review service desk performance"]
};

function Navbar() {
    const location = useLocation();
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : {};
    const section = location.pathname.split("/").filter(Boolean)[0] || "dashboard";
    const [title, subtitle] = pageDetails[section] || pageDetails.dashboard;
    const role =
        typeof user?.role === "string"
            ? user.role
            : user?.role?.role || user?.role_name || user?.rolename || "User";
    const initial = (user?.firstname || user?.username || "U").charAt(0).toUpperCase();

    return (

        <header className="navbar">
            <div className="navbar-heading">
                <span>SmartDesk / {title}</span>
                <h2>{title}</h2>
                <p>{subtitle}</p>
            </div>

            <div className="navbar-right">

                <button type="button" className="notification" aria-label="Notifications">
                    <FaBell />
                    <span className="notification-badge">0</span>
                </button>

                <Link className="user-info" to="/profile">
                    <span className="navbar-avatar">{initial}</span>
                    <div>
                        <h4>{user?.firstname || user?.username || "User"}</h4>
                        <p>{role}</p>
                    </div>
                </Link>

            </div>

        </header>

    );

}

export default Navbar;
