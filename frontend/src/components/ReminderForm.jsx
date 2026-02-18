import React, { useState } from 'react';

function ReminderForm({ userId, onAdd }) {
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        time: '',
        notification_type: 'Email',
        description: '',
        phone_number: '',
        email: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Metadata Injection Logic: Store Date inside Message
        // Backend only accepts 'scheduled_time' (Time only), so we append Date to description.
        const datePrefix = `{{DATE:${formData.date}}} `;
        const finalDescription = datePrefix + formData.description;

        // Create the "Time" string for backend (HH:MM)
        const scheduledTime = formData.time;

        try {
            const response = await fetch('/backend/router/index.php?route=reminders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userId,
                    title: formData.title,
                    message: finalDescription,
                    phone_number: formData.phone_number,
                    email: formData.email,
                    notification_type: formData.notification_type,
                    scheduled_time: scheduledTime // Only accepts HH:MM
                }),
            });

            const data = await response.json();
            if (data.success || data.message) {
                setFormData({ title: '', date: '', time: '', notification_type: 'Email', description: '', phone_number: '', email: '' });
                onAdd(); // Refresh list
            } else {
                alert('Failed to add reminder: ' + (data.error || 'Unknown error'));
            }
        } catch (err) {
            console.error(err);
            alert('Error connecting to server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-card fade-in">
            <h3 className="form-title">
                <span>⚡</span> New Reminder
            </h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Title</label>
                    <input
                        type="text"
                        name="title"
                        className="form-control"
                        placeholder="What do you need to do?"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Channel</label>
                    <select
                        name="notification_type"
                        className="form-control"
                        value={formData.notification_type}
                        onChange={handleChange}
                    >
                        <option value="Email">Email</option>
                        <option value="WhatsApp">WhatsApp</option>
                        <option value="SMS">SMS</option>

                    </select>
                </div>

                {formData.notification_type === 'Email' ? (
                    <div className="form-group fade-in">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            placeholder="user@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                ) : (
                    <div className="form-group fade-in">
                        <label className="form-label">Phone</label>
                        <input
                            type="tel"
                            name="phone_number"
                            className="form-control"
                            placeholder="+91..."
                            value={formData.phone_number}
                            onChange={handleChange}
                            required
                        />
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label className="form-label">Date</label>
                        <input
                            type="date"
                            name="date"
                            className="form-control"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Time</label>
                        <input
                            type="time"
                            name="time"
                            className="form-control"
                            value={formData.time}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>



                <div className="form-group">
                    <label className="form-label">Details</label>
                    <textarea
                        name="description"
                        className="form-control"
                        rows="3"
                        placeholder="Add notes..."
                        value={formData.description}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Scheduling...' : 'Create Reminder'}
                </button>
            </form>
        </div>
    );
}

export default ReminderForm;
