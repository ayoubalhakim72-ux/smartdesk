import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function DashboardLayout({ children }) {

    return (

        <div style={{ display: "flex" }}>

            <Sidebar />

            <div
                style={{
                    marginLeft: "260px",
                    width: "100%",
                    background: "#F1F5F9",
                    minHeight: "100vh"
                }}
            >

                <Navbar />

                <div style={{ padding: "35px" }}>

                    {children}

                </div>

            </div>

        </div>

    );

}

export default DashboardLayout;