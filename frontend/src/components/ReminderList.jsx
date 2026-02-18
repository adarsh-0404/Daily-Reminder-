import React, { useEffect, useState } from 'react';
import ReminderCard from './ReminderCard';
import EditReminderModal from './EditReminderModal';

function ReminderList({ userId, refreshTrigger }) {
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingReminder, setEditingReminder] = useState(null);

    const fetchReminders = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/backend/router/index.php?route=reminders&user_id=${userId}`);
            const data = await response.json();
            setReminders(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        fetchReminders();
    };

    useEffect(() => {
        fetchReminders();
    }, [userId, refreshTrigger]);

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            await fetch(`/backend/router/index.php?route=reminders&id=${id}&user_id=${userId}`, {
                method: 'DELETE',
            });
            fetchReminders();
        } catch (err) {
            alert('Failed to delete');
        }
    };

    // Helper function for formatting date/time - assuming it exists elsewhere or needs to be added
    const formatDateTime = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        return date.toLocaleString(); // Adjust format as needed
    };

    return (
        <div className="reminder-list-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3>Your Reminders</h3>
                <button className="icon-button" onClick={fetchReminders} title="Refresh">
                    🔄
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading...</div>
            ) : reminders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px dashed var(--border)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📭</div>
                    <p>No reminders yet.</p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Use the "Quick Reminder" form to add one.</p>
                </div>
            ) : (
                <div className="reminder-grid">
                    {reminders.map(rem => (
                        <ReminderCard
                            key={rem.id}
                            reminder={rem}
                            onDelete={handleDelete}
                            onEdit={() => setEditingReminder(rem)}
                        />
                    ))}
                </div>
            )}

            {editingReminder && (
                <EditReminderModal
                    userId={userId}
                    reminder={editingReminder}
                    onClose={() => setEditingReminder(null)}
                    onSuccess={() => {
                        setEditingReminder(null);
                        fetchReminders();
                    }}
                />
            )}

            <div style={{
                marginTop: '2rem',
                padding: '1rem',
                backgroundColor: '#e3f2fd',
                borderRadius: '8px',
                borderLeft: '4px solid #2196f3',
                fontSize: '0.9rem',
                color: '#0d47a1',
                display: 'flex',
                alignItems: 'start',
                gap: '10px'
            }}>
                <span style={{ fontSize: '1.2rem' }}>ℹ️</span>
                <div>
                    <strong>Note on Notifications:</strong> If you miss a reminder time, simply open this app!
                    We automatically check for any missed notifications from today and send them instantly when you visit.
                    <br /><br />
                    <strong>Twilio Trial:</strong> SMS/WhatsApp only work for verified numbers; use <strong>Email</strong> for unrestricted testing.
                </div>
            </div>

        </div>
    );
}

export default ReminderList;
