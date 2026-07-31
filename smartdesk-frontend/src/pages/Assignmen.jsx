import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaUserCheck } from "react-icons/fa";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";
import "../styles/ticket.css";

function Assignmen() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [assigningAgentId, setAssigningAgentId] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadAgents() {
            try {
                const response = await api.get("/agents");
                setAgents(response.data.agents);
            } catch (requestError) {
                setError(
                    requestError.response?.data?.message ||
                    "Failed to load IT support agents."
                );
            } finally {
                setLoading(false);
            }
        }

        loadAgents();
    }, []);

    async function assignTicket(agentId) {
        setAssigningAgentId(agentId);
        setError("");

        try {
            const response = await api.put(`/tickets/${id}/assign`, {
                assignedto: agentId,
            });

            alert(response.data.message || "Ticket assigned successfully.");

            // Close the assignment view by returning to the tickets page.
            navigate("/tickets", { replace: true });
        } catch (requestError) {
            setError(
                requestError.response?.data?.message ||
                "Failed to assign the ticket."
            );
            setAssigningAgentId(null);
        }
    }

    return (
        <DashboardLayout>
            <div className="page-header">
                <div>
                    <h1>Assign Ticket #{id}</h1>
                    <p className="assignment-subtitle">
                        Select an IT support agent for this ticket.
                    </p>
                </div>

                <button
                    type="button"
                    className="assignment-back-btn"
                    onClick={() => navigate("/tickets")}
                >
                    <FaArrowLeft /> Back to Tickets
                </button>
            </div>

            {error && <div className="assignment-error">{error}</div>}

            {loading ? (
                <h2 className="assignment-loading">Loading agents...</h2>
            ) : (
                <div className="assignment-table-wrapper">
                    <table className="ticket-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Agent Name</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {agents.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="assignment-empty">
                                        No IT support agents found.
                                    </td>
                                </tr>
                            ) : (
                                agents.map((agent) => (
                                    <tr key={agent.id}>
                                        <td>{agent.id}</td>
                                        <td className="agent-name">
                                            {agent.firstname}
                                        </td>
                                        <td>{agent.username}</td>
                                        <td>{agent.email}</td>
                                        <td>
                                            <button
                                                type="button"
                                                className="assign-agent-btn"
                                                onClick={() => assignTicket(agent.id)}
                                                disabled={assigningAgentId !== null}
                                            >
                                                <FaUserCheck />
                                                {assigningAgentId === agent.id
                                                    ? "Assigning..."
                                                    : "Assign"}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </DashboardLayout>
    );
}

export default Assignmen;
