import React from 'react';

function ReminderCard({ reminder, onDelete, onEdit }) {
    // Parse metadata from description
    const parseDescription = (rawDesc) => {
        const dateRegex = /{{DATE:([^}]+)}}/;
        const match = rawDesc.match(dateRegex);
        let date = null;
        let cleanDesc = rawDesc;

        if (match) {
            date = match[1];
            cleanDesc = rawDesc.replace(match[0], '').trim();
        }
        return { date, cleanDesc };
    };

    const { date, cleanDesc } = parseDescription(reminder.message);

    return (
        <div className="reminder-card fade-in">
            {/* Reference Image Layout: Title -> Date -> Line -> Description */}

            <div className="card-title">{reminder.title}</div>

            <div className="card-date">
                {date || 'Today'}
                {/* Optional: Add Time if needed by reference, but reference generally just showed date */}
                {reminder.scheduled_time && ` • ${reminder.scheduled_time.substring(0, 5)}`}
            </div>

            <div className="card-separator"></div>

            <div className="card-body">
                {cleanDesc}
            </div>

            <div className="card-actions">
                <button
                    className="icon-button"
                    onClick={onEdit}
                    title="Edit"
                >
                    ✏️
                </button>
                <button
                    className="icon-button"
                    onClick={() => {
                        if (window.confirm('Delete this reminder?')) {
                            onDelete(reminder.id);
                        }
                    }}
                    title="Delete"
                >
                    🗑️
                </button>
            </div>
        </div>
    );
}

export default ReminderCard;
