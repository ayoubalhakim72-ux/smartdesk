import "../styles/cards.css";

function StatisticCard({ title, value, icon, color }) {

    return (

        <div className="stat-card">

            <div className="icon-area"
                style={{background:color}}
            >

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