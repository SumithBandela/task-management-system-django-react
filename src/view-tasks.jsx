import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { getUserInfo } from './utils/auth';

export function ViewTasks() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [username, setUsername] = useState('all');
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  
  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/tasks/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          start_date: startDate,
          end_date: endDate,
          username: username === 'all' ? '' : username, // Pass username filter
        },
      });
      setTasks(response.data);
    } catch (error) {
      setError("Unable to fetch tasks. Please login again.");
      console.error(error);
    }
  };

  
  useEffect(() => {
  
    axios.get('http://localhost:8000/api/users/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        setUsers(response.data);  
      })
      .catch(error => {
        console.error('Failed to fetch users:', error);
      });
  }, [token]);

  
  useEffect(() => {
    fetchTasks();
  }, [startDate, endDate, username, token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/tasks/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Task deleted");
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err) {
      alert("Delete failed. Check if you're admin and within office hours.");
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark">📋 Task List</h2>
        <button
          onClick={() => navigate('/add-task')}
          className="btn btn-outline-success px-4 shadow-sm"
        >
          Add Task
        </button>
      </div>

      {error && (
        <div className="alert alert-danger text-center">{error}</div>
      )}

      {/* Filter Section */}
      <div className="mb-4">
        <div className="d-flex justify-content-between">
          <div className="d-flex gap-3">
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <select
              className="form-select"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            >
              <option value="all">All Users</option>
              {users.map(user => (
                <option key={user.id} value={user.username}>
                  {user.username}
                </option>
              ))}
            </select>
            <button className="btn btn-primary" onClick={fetchTasks}>
              Search
            </button>
          </div>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center text-muted fs-5">
          <p>No tasks found.</p>
        </div>
      ) : (
        <div className=" p-4">
          <table className="table table-bordered table-hover align-middle text-center">
            <thead className="table-primary">
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Hours</th>
                <th>Work Summary</th>
                <th>Created By</th>
                <th>Created At</th>
                {getUserInfo()?.role === "admin" && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr key={task.id}>
                  <td>{index + 1}</td>
                  <td>{task.date}</td>
                  <td>{task.hours}</td>
                  <td className="text-start">{task.work_summary}</td>
                  <td>{task.created_by}</td>
                  <td>{new Date(task.created_at).toLocaleString()}</td>
                  {getUserInfo()?.role === "admin" && (
                    <td>
                      <button
                        className="btn btn-sm me-2"
                        onClick={() => handleDelete(task.id)}
                      >
                        🗑️
                      </button>
                      <button
                        className="btn btn-sm"
                        onClick={() => navigate(`/edit-task/${task.id}`)}
                      >
                        ✏️
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-3 text-center">
        <Link to="/dashboard">Back to dashboard</Link>
      </div>
    </div>
  );
}
