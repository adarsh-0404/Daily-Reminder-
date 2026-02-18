import React, { useState } from 'react';

function EditReminderModal({ userId, reminder, onClose, onSuccess }) {
    // Extract existing Date from description if present
    const dateRegex = /{{DATE:([^}]+)}}/;
    const match = reminder.message.match(dateRegex);
    const initialDate = match ? match[1] : '';
    const initialDesc = reminder.message.replace(dateRegex, '').trim();

    const [formData, setFormData] = useState({
        title: reminder.title,
        date: initialDate,
        time: reminder.scheduled_time.substring(0, 5), // HH:MM
        notification_type: reminder.notification_type,
        description: initialDesc,
        phone_number: reminder.phone_number
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const datePrefix = formData.date ? `{{DATE:${formData.date}}} ` : '';
        const finalDescription = datePrefix + formData.description;

        try {
            await fetch('/backend/router/index.php?route=reminders', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: reminder.id,
                    user_id: userId,
                    title: formData.title,
                    message: finalDescription,
                    phone_number: formData.phone_number,
                    notification_type: formData.notification_type,
                    scheduled_time: formData.time
                }),
            });
            onSuccess();
        } catch (err) {
            alert('Update failed');
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
            <div className="form-card fade-in" style={{ width: '100%', maxWidth: '500px', margin: '1rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Edit Reminder</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Title</label>
                        <input type="text" className="form-control" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label className="form-label">Date</label>
                            <input type="date" className="form-control" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Time</label>
                            <input type="time" className="form-control" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea className="form-control" rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                        <button type="submit" className="btn btn-primary btn-block">Save</button>
                        <button type="button" className="btn btn-secondary btn-block" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditReminderModal;
