
 import { useEffect, useState } from "react";
import api from "../services/api";

import DashboardLayout from "../layouts/DashboardLayout";
import StatisticCard from "../components/StatisticCard";
import "../styles/dashboard.css";
import {
    FaFolderOpen,
    FaClock,
    FaCheckCircle,
    FaTicketAlt
} from "react-icons/fa";

function Dashboard() {
 console.log("Dashboard loaded");

    const user = JSON.parse(localStorage.getItem("user"));
    

    const [dashboard, setDashboard] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadDashboard();

    }, []);

    async function loadDashboard() {

        try{

            const response = await api.get("/dashboard");
             console.log(response.data);
            setDashboard(response.data);

        }

        catch(error){

            console.log(error);

        }

        finally{

            setLoading(false);

        }

    }

    if(loading){

        return (

            <DashboardLayout>

                <h2>Loading Dashboard...</h2>

            </DashboardLayout>

        );

    }

    return (

        <DashboardLayout>

            <div className="dashboard-page">
                <h1 className="page-title">
                    Welcome Back, {user.firstname || user.name || "User"} 👋
                </h1>

                <p className="page-subtitle">
                    Manage your support tickets efficiently.
                </p>

                <p>
                    Here's what's happening today.
                </p>

           <div className="dashboard-cards">

                <StatisticCard
    title="Open Tickets"
    value={dashboard.statistics.open}
    icon={<FaFolderOpen />}
    color="#2563EB"
/>

                <StatisticCard
                    title="Assigned Tickets"
                    value={dashboard.statistics.assigned}
                    icon={<FaClock />}
                    color="#F59E0B"
                />

                <StatisticCard
                    title="Closed Tickets"
                    value={dashboard.statistics.closed}
                    icon={<FaCheckCircle />}
                    color="#22C55E"
                />

                <StatisticCard
                    title="Total Tickets"
                    value={dashboard.statistics.total}
                    icon={<FaTicketAlt />}
                    color="#7C3AED"
                />

            </div>
           </div>
        </DashboardLayout>

    );

}

export default Dashboard;