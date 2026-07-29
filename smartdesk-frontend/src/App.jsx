import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Tickets from "./pages/Tickets";
import CreateTicket from "./pages/CreateTicket";
import EditTicket from "./pages/EditTicket";

function App() {

    return (

        <Routes>

            <Route path="/" element={<Login />} />

            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/tickets" element={<Tickets />} />

            <Route path="/create-ticket" element={<CreateTicket />} />

            <Route path="/tickets/edit/:id" element={<EditTicket />} />

        </Routes>

    );

}

export default App;