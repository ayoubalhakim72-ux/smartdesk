import { Routes, Route } from "react-router-dom";

import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Tickets from "./pages/tickets";
import CreateTicket from "./pages/CreateTicket";
import EditTicket from "./pages/editticket";
import Assignmen from "./pages/Assignmen";
import TicketDetails from "./pages/TicketDetails";
import TicketComments from "./pages/TicketComments";
import TicketActivity from "./pages/TicketActivity";
import Users from "./pages/Users";
import CreateUser from "./pages/CreateUser";
import EditUser from "./pages/EditUser";
import Profile from "./pages/Profile";
import Reports from "./pages/Reports";
import ProtectedRoute from "./components/ProtectedRoute";

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
      <Route path="/reports" element={<Reports />} />

      <Route
        path="/users"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <Users />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users/create"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <CreateUser />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users/:id/edit"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <EditUser />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
