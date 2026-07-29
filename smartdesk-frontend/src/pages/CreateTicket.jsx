import DashboardLayout from "../layouts/DashboardLayout";
import TicketForm from "../components/TicketForm";

function CreateTicket() {
    return (
        <DashboardLayout>
            <TicketForm mode="create" />
        </DashboardLayout>
    );
}

export default CreateTicket;