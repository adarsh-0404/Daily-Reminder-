import React, { useState } from 'react';

function Login({ onLogin, onSwitchToSignup }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/backend/router/index.php?route=login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (data.success) {
                onLogin(data.user);
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Network error. Check console.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container fade-in">
            <div className="auth-card">
                <h2 className="auth-title">Welcome back</h2>
                <p className="auth-subtitle">Please enter your details to sign in.</p>

                {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

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

                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '1rem' }}>
                        {loading ? 'Logging in...' : 'Sign In'}
                    </button>
                </form>

                <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                    Don't have an account?{' '}
                    <button onClick={onSwitchToSignup} style={{ border: 'none', background: 'none', color: 'var(--text-main)', cursor: 'pointer', fontWeight: '700' }}>
                        Create Account
                    </button>
                </p>
            </div>
        </div>
    );
}

export default Login;
