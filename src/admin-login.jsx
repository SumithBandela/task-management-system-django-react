import React from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';

export function AdminLogin() {
  const navigate = useNavigate();

  const loginForm = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async (values) => {
      try {
        const response = await axios.post('http://localhost:8000/api/login/', values);
        localStorage.setItem("token", response.data.access); // Save JWT token
        alert("Login Successful!");
        navigate("/dashboard"); // redirect on success
      } catch (error) {
        alert("Invalid login. Please check your credentials.");
        console.error(error);
      }
    },
  });

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '90vh' }}>
      <div className="card shadow p-4" style={{ maxWidth: '400px', width: '100%', borderRadius: '1rem' }}>
        <h3 className="text-center mb-4 text-primary">🔐 Admin Login</h3>
        
        <form onSubmit={loginForm.handleSubmit}>
          <div className="mb-3">
            <label className="form-label">👤 Username</label>
            <input
              type="text"
              className="form-control"
              name="username"
              onChange={loginForm.handleChange}
              value={loginForm.values.username}
              required
              placeholder="Enter your username"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">🔑 Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              onChange={loginForm.handleChange}
              value={loginForm.values.password}
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            🚀 Login
          </button>
        </form>
      </div>
    </div>
  );
}
