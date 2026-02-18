import React from 'react';

function Header({ user, onLogout }) {
    return (
        <header className="dashboard-header">
            <div className="brand">
                <div className="brand-icon">D</div>
                <span>Daily Reminder</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {user?.username}
                </span>
                <button onClick={onLogout} className="btn btn-primary btn-small">
                    Logout
                </button>
            </div>
        </header>
    );
}

export default Header;
