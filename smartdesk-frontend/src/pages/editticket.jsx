import DashboardLayout from "../layouts/DashboardLayout";
import TicketForm from "../components/TicketForm";

function EditTicket() {

    console.log("EDIT PAGE");

    return (
        <DashboardLayout>
            <TicketForm mode="edit" />
        </DashboardLayout>
    );

}

export default EditTicket;