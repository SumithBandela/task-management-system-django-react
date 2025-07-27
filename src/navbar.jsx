// components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserInfo } from './utils/auth';
export function Navbar() {
  const navigate = useNavigate();
  const user = getUserInfo();

  if (!user) return null; // Hide if not logged in

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="#">
          {user.role === 'admin' ? 'Admin Panel' : 'User Panel'}
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {user.role === 'admin' && (
              <li className="nav-item">
                <Link className="nav-link" to="/users">User Management</Link>
              </li>
            )}
            <li className="nav-item">
              <Link className="nav-link" to="/tasks">Task Management</Link>
            </li>
          </ul>
          <span className="navbar-text me-3 text-white">
            {user.username}
          </span>
          <button className="btn btn-outline-light" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
