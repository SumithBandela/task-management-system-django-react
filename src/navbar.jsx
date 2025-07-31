import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserInfo } from './utils/auth';
import './navbar.css'
export function Navbar() {
  const navigate = useNavigate();
  const user = getUserInfo();
  if (!user) return null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
<nav className="navbar navbar-expand-lg bg-primary shadow-sm py-3 mb-4 rounded">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-3 text-white brand-gradient" to="/dashboard">
          {user.role === 'admin' ? 'Admin Dashboard' : 'User Dashboard'}
        </Link>

        <button
          className="navbar-toggler bg-white"
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
              <Link className="nav-link text-white fs-5 nav-hover" to="/employees">
                 👥Employee Management
              </Link>
            </li>
            )}
            <li className="nav-item">
              <Link className="nav-link text-white fs-5 nav-hover" to="/tasks">
                ✅ Task Management
              </Link>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-3">
            <span className="navbar-text text-white fs-5 fw-semibold">
              👋 Hello, {user.username}
            </span>
            <button
              className="btn btn-light px-4 rounded-pill fw-semibold"
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
