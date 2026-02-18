import React from 'react';

function LandingPage({ onLogin, onSignup }) {
    return (
        <div className="landing-page fade-in">
            <div className="landing-card">
                <h1 className="landing-title">Organize your life, simply.</h1>
                <p className="landing-subtitle">
                    The minimalist daily planner designed for focus.
                    Get instant reminders via WhatsApp & SMS.
                </p>

                <div className="btn-group" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '3rem' }}>
                    <button className="btn btn-primary btn-small" onClick={onLogin} style={{ width: '160px' }}>
                        Login
                    </button>
                    <button className="btn btn-secondary btn-small" onClick={onSignup} style={{ width: '160px' }}>
                        Get Started
                    </button>
                </div>

                <div className="features-grid">
                    <div className="feature-item">
                        <span className="feature-icon">💬</span>
                        <div className="feature-head">WhatsApp Integrations</div>
                        <div className="feature-text">Remote notifications sent directly to your phone.</div>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">✨</span>
                        <div className="feature-head">Minimalist Design</div>
                        <div className="feature-text">Distraction-free interface to keep you focused.</div>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">🛡️</span>
                        <div className="feature-head">Secure Data</div>
                        <div className="feature-text">Your schedule is private and encrypted.</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;
