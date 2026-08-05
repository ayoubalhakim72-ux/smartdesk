import DashboardLayout from "../layouts/DashboardLayout";
import TicketForm from "../components/TicketForm";

function EditTicket() {
    return (
        <DashboardLayout>
            <TicketForm mode="edit" />
        </DashboardLayout>
    );

}

export default EditTicket;
