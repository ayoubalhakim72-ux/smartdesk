import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    FaArrowLeft,
    FaCheckCircle,
    FaComments,
    FaHistory,
    FaUndo
} from "react-icons/fa";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";
import "../styles/ticket.css";

function TicketDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [ticketAction, setTicketAction] = useState("");

    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const role =
        typeof user?.role === "string"
            ? user.role
            : user?.role?.role || user?.role_name || user?.rolename;

    useEffect(() => {
        let isActive = true;

        async function loadTicket() {
            try {
                const response = await api.get(`/tickets/${id}`);

                if (isActive) {
                    setTicket(response.data);
                }
            } catch (requestError) {
                if (isActive) {
                    setError(
                        requestError.response?.data?.message ||
                        "Failed to load ticket details."
                    );
                }
            } finally {
                if (isActive) {
                    setLoading(false);
                }
            }
        }

        loadTicket();

        return () => {
            isActive = false;
        };
    }, [id]);

    function formatDate(value) {
        if (!value) return "Not set";

        const date = new Date(value);

        return Number.isNaN(date.getTime())
            ? value
            : date.toLocaleString();
    }

    function formatUser(user, emptyValue) {
        if (!user) return emptyValue;

        const name = [user.firstname, user.lastname]
            .filter(Boolean)
            .join(" ");

        const account = user.email || user.username;

        if (name && account) return `${name} (${account})`;

        return name || account || `User #${user.id}`;
    }

    function getStatusClass(status) {
        if (status === "Open") return "open";
        if (status === "In Progress") return "progress";
        if (status === "Returned") return "returned";

        return "closed";
    }

    async function updateTicketState(action) {
        const actionLabel = action === "close" ? "close" : "return";
        const confirmed = window.confirm(
            `Are you sure you want to ${actionLabel} this ticket?`
        );

        if (!confirmed) return;

        setTicketAction(action);

        try {
            const response = await api.put(`/tickets/${id}/${action}`);
            alert(response.data.message);
            navigate("/tickets");
        } catch (requestError) {
            alert(
                requestError.response?.data?.message ||
                `Failed to ${actionLabel} ticket.`
            );
        } finally {
            setTicketAction("");
        }
    }

    const canCompleteTicket =
        role === "IT Support Agent" &&
        Number(ticket?.assignedto) === Number(user?.id) &&
        ticket?.status?.status === "In Progress";

    return (
        <DashboardLayout>
            <div className="page-header">
                <div>
                    <h1>Ticket Details</h1>
                    <p className="ticket-details-subtitle">
                        Complete information for ticket #{id}
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

            {loading ? (
                <h2 className="ticket-details-loading">
                    Loading ticket details...
                </h2>
            ) : error ? (
                <div className="ticket-details-error">{error}</div>
            ) : (
                <>
                    <div className="ticket-details-card">
                        <div className="ticket-details-grid">
                            <div className="ticket-detail-item">
                                <span className="ticket-detail-label">
                                    Ticket ID
                                </span>
                                <span className="ticket-detail-value">
                                    #{ticket.id}
                                </span>
                            </div>

                            <div className="ticket-detail-item">
                                <span className="ticket-detail-label">
                                    Status
                                </span>
                                <span
                                    className={`badge ${getStatusClass(
                                        ticket.status?.status
                                    )}`}
                                >
                                    {ticket.status?.status || "Not set"}
                                </span>
                            </div>

                            <div className="ticket-detail-item ticket-detail-full">
                                <span className="ticket-detail-label">
                                    Title
                                </span>
                                <span className="ticket-detail-value ticket-detail-title">
                                    {ticket.title}
                                </span>
                            </div>

                            <div className="ticket-detail-item ticket-detail-full">
                                <span className="ticket-detail-label">
                                    Description
                                </span>
                                <p className="ticket-detail-description">
                                    {ticket.description || "No description provided."}
                                </p>
                            </div>

                            <div className="ticket-detail-item">
                                <span className="ticket-detail-label">
                                    Category
                                </span>
                                <span className="ticket-detail-value">
                                    {ticket.category?.category || "Not set"}
                                </span>
                            </div>

                            <div className="ticket-detail-item">
                                <span className="ticket-detail-label">
                                    Priority
                                </span>
                                <span
                                    className={`badge ${(
                                        ticket.priority?.priority || ""
                                    ).toLowerCase()}`}
                                >
                                    {ticket.priority?.priority || "Not set"}
                                </span>
                            </div>

                            <div className="ticket-detail-item">
                                <span className="ticket-detail-label">
                                    Created By
                                </span>
                                <span className="ticket-detail-value">
                                    {formatUser(ticket.creator, "Unknown user")}
                                </span>
                            </div>

                            <div className="ticket-detail-item">
                                <span className="ticket-detail-label">
                                    Assigned Agent
                                </span>
                                <span className="ticket-detail-value">
                                    {formatUser(
                                        ticket.assigned_user,
                                        "Unassigned"
                                    )}
                                </span>
                            </div>

                            <div className="ticket-detail-item">
                                <span className="ticket-detail-label">
                                    Created At
                                </span>
                                <span className="ticket-detail-value">
                                    {formatDate(ticket.creation_date)}
                                </span>
                            </div>

                            <div className="ticket-detail-item">
                                <span className="ticket-detail-label">
                                    Last Updated
                                </span>
                                <span className="ticket-detail-value">
                                    {formatDate(ticket.update_date)}
                                </span>
                            </div>

                            <div className="ticket-detail-item">
                                <span className="ticket-detail-label">
                                    Closed At
                                </span>
                                <span className="ticket-detail-value">
                                    {formatDate(ticket.closed_date)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="ticket-details-actions">
                        {canCompleteTicket && (
                            <>
                                <button
                                    type="button"
                                    className="ticket-page-btn close-ticket"
                                    onClick={() => updateTicketState("close")}
                                    disabled={ticketAction !== ""}
                                >
                                    <FaCheckCircle />
                                    {ticketAction === "close"
                                        ? "Closing..."
                                        : "Close Ticket"}
                                </button>

                                <button
                                    type="button"
                                    className="ticket-page-btn return-ticket"
                                    onClick={() => updateTicketState("return")}
                                    disabled={ticketAction !== ""}
                                >
                                    <FaUndo />
                                    {ticketAction === "return"
                                        ? "Returning..."
                                        : "Return Ticket"}
                                </button>
                            </>
                        )}

                        <button
                            type="button"
                            className="ticket-page-btn comments"
                            onClick={() =>
                                navigate(`/tickets/${id}/comments`)
                            }
                        >
                            <FaComments /> Comments
                        </button>

                        <button
                            type="button"
                            className="ticket-page-btn activity"
                            onClick={() =>
                                navigate(`/tickets/${id}/activity`)
                            }
                        >
                            <FaHistory /> Activity
                        </button>
                    </div>
                </>
            )}
        </DashboardLayout>
    );
}

export default TicketDetails;
