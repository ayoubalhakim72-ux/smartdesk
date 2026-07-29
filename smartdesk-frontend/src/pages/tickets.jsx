import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";
import "../styles/ticket.css";
import { useNavigate } from "react-router-dom";

import {
    FaEdit,
    FaTrash,
    FaEye,
    FaPlus
} from "react-icons/fa";

function Tickets() {

    const navigate = useNavigate();

    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    // Search
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadTickets();
    }, []);

    async function loadTickets() {

        try {

            const response = await api.get(`/tickets?t=${Date.now()}`);

            setTickets(response.data.tickets);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    }

    async function deleteTicket(id) {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this ticket?"
        );

        if (!confirmDelete) return;

        try {

            await api.delete(`/tickets/${id}`);

            alert("Ticket deleted successfully.");

            loadTickets();

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to delete ticket."
            );

        }

    }

    const filteredTickets = tickets.filter(ticket =>
        ticket.title.toLowerCase().includes(search.toLowerCase())
    );

    return (

        <DashboardLayout>

            {/* Header */}

            <div className="page-header">

                <h1>Tickets</h1>

                <button
                    className="create-btn"
                    onClick={() => navigate("/create-ticket")}
                >

                    <FaPlus /> Create Ticket

                </button>

            </div>

            {/* Search & Filters */}

            <div className="filters">

                <input
                    type="text"
                    placeholder="🔍 Search tickets..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select>

                    <option>All Categories</option>

                </select>

                <select>

                    <option>All Statuses</option>

                </select>

            </div>

            {loading ? (

                <h2>Loading...</h2>

            ) : (

                <table className="ticket-table">

                    <thead>

                        <tr>

                            <th>ID</th>

                            <th>Title</th>

                            <th>Category</th>

                            <th>Priority</th>

                            <th>Status</th>

                            <th>Created By</th>

                            <th>Actions</th>

                        </tr>

                    </thead>

                    <tbody>

                        {filteredTickets.map((ticket) => (

                            <tr key={ticket.id}>

                                <td>{ticket.id}</td>

                                <td>{ticket.title}</td>

                                <td>{ticket.category.category}</td>

                                <td>

                                    <span
                                        className={`badge ${ticket.priority.priority.toLowerCase()}`}
                                    >

                                        {ticket.priority.priority}

                                    </span>

                                </td>

                                <td>

                                    <span
                                        className={`badge ${
                                            ticket.status.status === "Open"
                                                ? "open"
                                                : ticket.status.status === "In Progress"
                                                ? "progress"
                                                : ticket.status.status === "Resolved"
                                                ? "resolved"
                                                : "closed"
                                        }`}
                                    >

                                        {ticket.status.status}

                                    </span>

                                </td>

                                <td>{ticket.creator.firstname}</td>

                                <td>

                                    <div className="actions">

                                        <button
                                            className="action-btn view"
                                            title="View"
                                            onClick={() =>
                                                navigate(`/tickets/${ticket.id}`)
                                            }
                                        >

                                            <FaEye />

                                        </button>

                                        <button
                                            className="action-btn edit"
                                            title="Edit"
                                            onClick={() =>
                                                navigate(`/tickets/edit/${ticket.id}`)
                                            }
                                        >

                                            <FaEdit />

                                        </button>

                                        <button
                                            className="action-btn delete"
                                            title="Delete"
                                            onClick={() => deleteTicket(ticket.id)}
                                        >

                                            <FaTrash />

                                        </button>

                                    </div>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            )}

        </DashboardLayout>

    );

}

export default Tickets;