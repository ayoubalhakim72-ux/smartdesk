import {
    FaChartLine,
    FaChartPie,
    FaClock,
    FaUsers
} from "react-icons/fa";
import DashboardLayout from "../layouts/DashboardLayout";
import "../styles/dashboard.css";

const reportAreas = [
    {
        icon: FaChartLine,
        title: "Ticket volume",
        description: "Review how request volume changes over time."
    },
    {
        icon: FaClock,
        title: "Resolution trends",
        description: "Measure response and resolution performance."
    },
    {
        icon: FaUsers,
        title: "Team workload",
        description: "Understand assignment and workload distribution."
    },
    {
        icon: FaChartPie,
        title: "Category insights",
        description: "Compare the most common support categories."
    }
];

function Reports() {
    return (
        <DashboardLayout>
            <div className="reports-page">
                <div className="reports-heading">
                    <span className="page-eyebrow">Service intelligence</span>
                    <h1>Reports</h1>
                    <p>
                        A dedicated space for service trends and performance insights.
                    </p>
                </div>

                <section className="reports-placeholder">
                    <div className="reports-placeholder-icon">
                        <FaChartLine />
                    </div>
                    <span>Reporting workspace</span>
                    <h2>Analytics are ready for the next phase</h2>
                    <p>
                        The reporting interface now matches SmartDesk. Connect report
                        data here when the reporting API is implemented.
                    </p>
                </section>

                <div className="reports-grid">
                    {reportAreas.map(({ icon: Icon, title, description }) => (
                        <article className="report-area-card" key={title}>
                            <span><Icon /></span>
                            <h3>{title}</h3>
                            <p>{description}</p>
                            <small>Coming soon</small>
                        </article>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}

export default Reports;
