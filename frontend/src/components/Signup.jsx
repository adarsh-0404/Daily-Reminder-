import React, { useState } from 'react';

function Signup({ onSwitchToLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/backend/router/index.php?route=register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (data.success) {
                setSuccess('Account created! Please login.');
                setTimeout(onSwitchToLogin, 2000);
            } else {
                setError(data.message || 'Signup failed');
            }
        } catch (err) {
            setError('Network error.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container fade-in">
            <div className="auth-card">
                <h2 className="auth-title">Create account</h2>
                <p className="auth-subtitle">Start organizing your life today.</p>

                {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
                {success && <div style={{ color: 'green', marginBottom: '1rem', fontSize: '0.9rem' }}>{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '1rem' }}>
                        {loading ? 'Creating...' : 'Sign Up'}
                    </button>
                </form>

                <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                    Already have an account?{' '}
                    <button onClick={onSwitchToLogin} style={{ border: 'none', background: 'none', color: 'var(--text-main)', cursor: 'pointer', fontWeight: '700' }}>
                        Log In
                    </button>
                </p>
            </div>
        </div>
    );
}

export default Signup;
