import "../styles/cards.css";

function StatisticCard({ title, value, icon, color }) {

    return (

        <div className="stat-card" style={{ "--stat-accent": color }}>

            <div className="icon-area">

                {icon}

            </div>

            <div>

                <p>{title}</p>

                <h2>{value}</h2>

            </div>

        </div>

    );

}

export default StatisticCard;
