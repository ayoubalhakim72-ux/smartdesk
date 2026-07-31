import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaEdit,
    FaTrash,
    FaEye,
    FaUserPlus,
    FaPlus,
    FaSortAmountDown
} from "react-icons/fa";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";
import "../styles/ticket.css";

function Tickets() {
    const navigate = useNavigate();

    const [tickets, setTickets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [statusId, setStatusId] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [sortNewest, setSortNewest] = useState(false);
    const [ticketView, setTicketView] = useState("default");

    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const role =
        typeof user?.role === "string"
            ? user.role
            : user?.role?.role || user?.role_name || user?.rolename;

    useEffect(() => {
        loadFilterOptions();
    }, []);

    useEffect(() => {
        loadTickets();
    }, [ticketView, categoryId, statusId, selectedDate, sortNewest]);

    async function loadFilterOptions() {
        try {
            const [categoryResponse, statusResponse] = await Promise.all([
                api.get("/categories"),
                api.get("/statuses")
            ]);

            setCategories(categoryResponse.data);
            setStatuses(statusResponse.data);
        } catch (error) {
            console.error("Failed to load ticket filters:", error);
        }
    }

    async function loadTickets() {
        setLoading(true);

        try {
            const response = await api.get("/tickets", {
                params: {
                    t: Date.now(),
                    assigned:
                        ticketView === "unassigned"
                            ? "unassigned"
                            : ticketView === "returned"
                            ? "returned"
                            : undefined,
                    categoryid: categoryId || undefined,
                    statusid: statusId || undefined,
                    date: selectedDate || undefined,
                    sort: sortNewest ? "newest" : undefined
                }
            });

            setTickets(response.data.tickets);
        } catch (error) {
            console.error(error);
            setTickets([]);
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

    async function claimTicket(id) {
        try {
            const response = await api.put(`/tickets/${id}/assign`);
            alert(response.data.message);
            loadTickets();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to claim ticket."
            );
        }
    }

    function clearFilters() {
        setCategoryId("");
        setStatusId("");
        setSelectedDate("");
    }

    const canEditTicket = (ticket) =>
        role === "Admin" ||
        role === "Manager" ||
        role === "IT Support Agent" ||
        (role === "Employee" && ticket.assignedto === null);

    const hasActiveFilters = categoryId || statusId || selectedDate;

    const filteredTickets = tickets.filter((ticket) =>
        ticket.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="page-header">
                <h1>Tickets</h1>

                {(role === "Admin" || role === "Employee") && (
                    <button
                        className="create-btn"
                        onClick={() => navigate("/create-ticket")}
                    >
                        <FaPlus /> Create Ticket
                    </button>
                )}
            </div>

            <div className="filters">
                {(role === "Admin" ||
                    role === "Manager" ||
                    role === "IT Support Agent") && (
                    <div className="ticket-toggle">
                        <button
                            type="button"
                            className={ticketView === "default" ? "active" : ""}
                            onClick={() => setTicketView("default")}
                        >
                            {role === "IT Support Agent"
                                ? "My Tickets"
                                : "All Tickets"}
                        </button>

                        {role !== "Manager" && (
                            <button
                                type="button"
                                className={
                                    ticketView === "unassigned" ? "active" : ""
                                }
                                onClick={() => setTicketView("unassigned")}
                            >
                                Unassigned
                            </button>
                        )}

                        {(role === "Admin" || role === "Manager") && (
                            <button
                                type="button"
                                className={
                                    ticketView === "returned" ? "active" : ""
                                }
                                onClick={() => setTicketView("returned")}
                            >
                                Returned Tickets
                            </button>
                        )}
                    </div>
                )}

                <input
                    type="text"
                    placeholder="Search tickets..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                />

                <select
                    value={categoryId}
                    onChange={(event) => setCategoryId(event.target.value)}
                >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.category}
                        </option>
                    ))}
                </select>

                <select
                    value={statusId}
                    onChange={(event) => setStatusId(event.target.value)}
                >
                    <option value="">All Statuses</option>
                    {statuses.map((status) => (
                        <option key={status.id} value={status.id}>
                            {status.status}
                        </option>
                    ))}
                </select>

                <label className="date-filter">
                    <span>Date</span>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(event) => setSelectedDate(event.target.value)}
                    />
                </label>

                <button
                    type="button"
                    className={`sort-newest-btn ${sortNewest ? "active" : ""}`}
                    onClick={() => setSortNewest((current) => !current)}
                    aria-pressed={sortNewest}
                >
                    <FaSortAmountDown /> Newest to Oldest
                </button>

                {hasActiveFilters && (
                    <button
                        type="button"
                        className="clear-filters-btn"
                        onClick={clearFilters}
                    >
                        Clear filters
                    </button>
                )}
            </div>

            {loading ? (
                <h2>Loading...</h2>
            ) : (
                <div className="ticket-table-wrapper">
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
                            {filteredTickets.length === 0 ? (
                                <tr>
                                    <td className="ticket-empty" colSpan="7">
                                        No tickets match the selected filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredTickets.map((ticket) => (
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
                                                        : ticket.status.status === "Returned"
                                                        ? "returned"
                                                        : "closed"
                                                }`}
                                            >
                                                {ticket.status.status}
                                            </span>
                                        </td>
                                        <td>{ticket.creator.firstname}</td>
                                        <td>
                                            <div className="actions">
                                                {!(
                                                    role === "IT Support Agent" &&
                                                    ticket.assignedto === null
                                                ) && (
                                                    <button
                                                        className="action-btn view"
                                                        title="View"
                                                        onClick={() =>
                                                            navigate(
                                                                `/tickets/${ticket.id}`
                                                            )
                                                        }
                                                    >
                                                        <FaEye />
                                                    </button>
                                                )}

                                                {canEditTicket(ticket) && (
                                                    <button
                                                        className="action-btn edit"
                                                        title="Edit"
                                                        onClick={() =>
                                                            navigate(`/tickets/edit/${ticket.id}`)
                                                        }
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                )}

                                                {role === "Admin" && (
                                                    <button
                                                        className="action-btn delete"
                                                        title="Delete"
                                                        onClick={() => deleteTicket(ticket.id)}
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                )}

                                                {(role === "Admin" ||
                                                    role === "Manager" ||
                                                    role === "IT Support Agent") &&
                                                    (ticket.assignedto === null ||
                                                        ((role === "Admin" ||
                                                            role === "Manager") &&
                                                            ticketView === "returned" &&
                                                            ticket.status.status ===
                                                                "Returned")) && (
                                                        <button
                                                            className="action-btn assign"
                                                            title="Assign"
                                                            onClick={() => {
                                                                if (
                                                                    role ===
                                                                    "IT Support Agent"
                                                                ) {
                                                                    claimTicket(ticket.id);
                                                                } else {
                                                                    navigate(
                                                                        `/tickets/assign/${ticket.id}`
                                                                    );
                                                                }
                                                            }}
                                                        >
                                                            <FaUserPlus />
                                                        </button>
                                                    )}
                                            </div>
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

export default Tickets;
