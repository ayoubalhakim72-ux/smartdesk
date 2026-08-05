import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaCommentDots,
  FaEdit,
  FaHistory,
  FaPlus,
  FaReply,
  FaUndo,
  FaUserCheck,
} from "react-icons/fa";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";
import "../styles/ticketActivity.css";

const activityIcons = {
  created: FaPlus,
  updated: FaEdit,
  assigned: FaUserCheck,
  claimed: FaUserCheck,
  comment: FaCommentDots,
  reply: FaReply,
  closed: FaCheckCircle,
  returned: FaUndo,
};

function formatDate(value) {
  if (!value) return "Unknown time";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function displayName(user) {
  if (!user) return "System";

  return user.firstname || user.username || `User #${user.id}`;
}

function TicketActivity() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadActivity() {
      try {
        const response = await api.get(`/tickets/${id}/activity`);

        if (!active) return;

        setTicket(response.data.ticket);
        setActivities(response.data.activities || []);
        setError("");
      } catch (requestError) {
        if (!active) return;

        setError(
          requestError.response?.data?.message ||
            "Failed to load ticket activity.",
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    loadActivity();

    return () => {
      active = false;
    };
  }, [id]);

  return (
    <DashboardLayout>
      <div className="activity-page">
        <div className="activity-page-header">
          <div>
            <div className="activity-title-row">
              <FaHistory />
              <h1>Ticket Activity</h1>
            </div>
            <p>
              Ticket #{id}
              {ticket?.title ? ` — ${ticket.title}` : ""}
            </p>
          </div>

          <button
            type="button"
            className="activity-back-button"
            onClick={() => navigate(`/tickets/${id}`)}
          >
            <FaArrowLeft /> Back to Ticket
          </button>
        </div>

        <section className="activity-card">
          {loading ? (
            <div className="activity-state">Loading ticket activity...</div>
          ) : error ? (
            <div className="activity-state activity-error">{error}</div>
          ) : activities.length === 0 ? (
            <div className="activity-state">
              No activity has been recorded for this ticket.
            </div>
          ) : (
            <div className="activity-timeline">
              {activities.map((activity) => {
                const Icon = activityIcons[activity.type] || FaHistory;

                return (
                  <article
                    className={`activity-entry activity-${activity.type}`}
                    key={activity.id}
                  >
                    <div className="activity-icon">
                      <Icon />
                    </div>

                    <div className="activity-content">
                      <div className="activity-entry-header">
                        <strong>{activity.action}</strong>
                        <time dateTime={activity.date}>
                          {formatDate(activity.date)}
                        </time>
                      </div>

                      <div className="activity-actor">
                        <span>{displayName(activity.user)}</span>
                        {activity.user?.role && (
                          <span className="activity-role">
                            {activity.user.role}
                          </span>
                        )}
                      </div>

                      {activity.details && (
                        <p className="activity-details">{activity.details}</p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}

export default TicketActivity;
