import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Tickets from "./pages/Tickets";
import CreateTicket from "./pages/CreateTicket";
import EditTicket from "./pages/EditTicket";
import Assignmen from "./pages/Assignmen";
import TicketDetails from "./pages/TicketDetails";
import TicketComments from "./pages/TicketComments";
import TicketActivity from "./pages/TicketActivity";

function App() {

    return (

        <Routes>

            <Route path="/" element={<Login />} />

            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/tickets" element={<Tickets />} />

            <Route path="/create-ticket" element={<CreateTicket />} />

            <Route path="/tickets/edit/:id" element={<EditTicket />} />

            <Route path="/tickets/assign/:id" element={<Assignmen />} />

            <Route path="/tickets/:id" element={<TicketDetails />} />

            <Route path="/tickets/:id/comments" element={<TicketComments />} />

            <Route path="/tickets/:id/activity" element={<TicketActivity />} />
            

        </Routes>

    );

}

export default App;