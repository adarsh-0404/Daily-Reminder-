import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Signup from './components/Signup';
import ReminderForm from './components/ReminderForm';
import ReminderList from './components/ReminderList';

function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('landing');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentPage('dashboard');
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setCurrentPage('landing');
  };

  if (currentPage === 'landing') {
    return <LandingPage onLogin={() => setCurrentPage('login')} onSignup={() => setCurrentPage('signup')} />;
  }

  if (currentPage === 'login') {
    return <Login onLogin={handleLogin} onSwitchToSignup={() => setCurrentPage('signup')} />;
  }

  if (currentPage === 'signup') {
    return <Signup onSwitchToLogin={() => setCurrentPage('login')} />;
  }

  return (
    <div className="app-container">
      <Header user={user} onLogout={handleLogout} />

      <main className="dashboard-content fade-in">
        <section className="dashboard-left">
          <ReminderForm
            userId={user.id}
            onAdd={() => setRefreshTrigger(prev => prev + 1)}
          />
        </section>

        <section className="dashboard-right">
          <ReminderList
            userId={user.id}
            refreshTrigger={refreshTrigger}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
