import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";
import "../styles/dashboardLayout.css";

function DashboardLayout({ children }) {
    return (
        <div className="dashboard-shell">
            <Sidebar />

            <div className="dashboard-main">
                <Navbar />
                <main className="dashboard-content">{children}</main>
            </div>
        </div>
    );
}

export default DashboardLayout;
