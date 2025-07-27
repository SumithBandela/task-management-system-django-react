import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserInfo } from './utils/auth';

export function Navbar() {
  const navigate = useNavigate();
  const user = getUserInfo();
  if (!user) return null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm py-4 mb-4">
      <div className="container">
        <Link className="navbar-brand text-primary fw-bold fs-3" to="/dashboard">
          {user.role === 'admin' ? 'Admin Dashboard' : 'User Dashboard'}
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
                <Link className="nav-link text-dark fs-5" to="/users">
                  User Management
                </Link>
              </li>
            )}
            <li className="nav-item">
              <Link className="nav-link text-dark fs-5" to="/tasks">
                Task Management
              </Link>
            </li>
          </ul>

          <div className="d-flex align-items-center">
            <span className="navbar-text me-4 text-dark fs-5 fw-semibold">
              Hello, {user.username}!
            </span>
            <button
              className="btn btn-outline-primary btn-lg px-4"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
