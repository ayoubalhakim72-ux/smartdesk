import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "../styles/form.css";

function TicketForm({ mode }) {

    const navigate = useNavigate();
    const { id } = useParams();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priorityid, setPriorityid] = useState("");
    const [categoryid, setCategoryid] = useState("");

    const [priorities, setPriorities] = useState([]);
    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(false);

    useEffect(() => {

        loadDropdowns();

        if (mode === "edit") {
            loadTicket();
        }

    }, []);

    async function loadDropdowns() {

        try {

            const [priorityResponse, categoryResponse] = await Promise.all([
                api.get("/priorities"),
                api.get("/categories")
            ]);

            setPriorities(priorityResponse.data);
            setCategories(categoryResponse.data);

        } catch (error) {

            console.log(error);

        }

    }

    async function loadTicket() {

        try {

            const response = await api.get(`/tickets/${id}`);

            const ticket = response.data;

            setTitle(ticket.title);
            setDescription(ticket.description);
            setPriorityid(ticket.priorityid);
            setCategoryid(ticket.categoryid);

        } catch (error) {

            console.log(error);

        }

    }

    async function handleSubmit(e) {

    e.preventDefault();

    setLoading(true);

    try {

        const data = {
            title,
            description,
            priorityid,
            categoryid
        };

        console.log("Sending data:", data);

        if (mode === "create") {

            const response = await api.post("/tickets", data);

            console.log("Server response:", response.data);

            alert("Ticket created successfully!");

        } else {

            const response = await api.put(`/tickets/${id}`, data);

            console.log("Server response:", response.data);

            alert("Ticket updated successfully!");

        }

        navigate("/tickets");

    } catch (error) {

        console.log(error);

        alert(
            error.response?.data?.message ||
            "Something went wrong."
        );

    } finally {

        setLoading(false);

    }

}

    return (

        <form className="ticket-form" onSubmit={handleSubmit}>

            <h1>

                {mode === "create"
                    ? "Create Ticket"
                    : "Edit Ticket"}

            </h1>

            <div className="form-group">

                <label>Title</label>

                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

            </div>

            <div className="form-group">

                <label>Description</label>

                <textarea
                    rows="6"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />

            </div>

            <div className="form-row">

                <div className="form-group">

                    <label>Category</label>

                    <select
                        value={categoryid}
                        onChange={(e) => setCategoryid(e.target.value)}
                        required
                    >

                        <option value="">Select Category</option>

                        {categories.map(category => (

                            <option
                                key={category.id}
                                value={category.id}
                            >

                                {category.category}

                            </option>

                        ))}

                    </select>

                </div>

                <div className="form-group">

                    <label>Priority</label>

                    <select
                        value={priorityid}
                        onChange={(e) => setPriorityid(e.target.value)}
                        required
                    >

                        <option value="">Select Priority</option>

                        {priorities.map(priority => (

                            <option
                                key={priority.id}
                                value={priority.id}
                            >

                                {priority.priority}

                            </option>

                        ))}

                    </select>

                </div>

            </div>

            <button
                type="submit"
                className="submit-btn"
                disabled={loading}
            >

                {loading
                    ? "Saving..."
                    : mode === "create"
                    ? "Create Ticket"
                    : "Update Ticket"}

            </button>

        </form>

    );

}

export default TicketForm;