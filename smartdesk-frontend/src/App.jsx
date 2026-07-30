import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Tickets from "./pages/Tickets";
import CreateTicket from "./pages/CreateTicket";
import EditTicket from "./pages/EditTicket";
import Assignmen from "./pages/Assignmen";

function App() {

    return (

        <Routes>

            <Route path="/" element={<Login />} />

            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/tickets" element={<Tickets />} />

            <Route path="/create-ticket" element={<CreateTicket />} />

            <Route path="/tickets/edit/:id" element={<EditTicket />} />

            <Route path="/tickets/assign/:id" element={<Assignmen />} />
            

        </Routes>

    );

}

export default App;