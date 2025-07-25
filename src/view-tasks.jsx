import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { getUserInfo } from './utils/auth';
export function ViewTasks() {
  const [usersWithTasks, setUsersWithTasks] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [username, setUsername] = useState('all');
  const token = localStorage.getItem('token');
  let navigate = useNavigate()
  useEffect(() => {
    fetchTasks();
  }, [startDate, endDate, username]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/tasks/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          start_date: startDate,
          end_date: endDate,
          username: username === 'all' ? '' : username,
        },
      });
      setUsersWithTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Group all tasks by date
  const groupTasksByDate = () => {
    const dateGroups = {};
    usersWithTasks.forEach((user) => {
      user.tasks.forEach((task) => {
        if (!dateGroups[task.date]) {
          dateGroups[task.date] = [];
        }
        dateGroups[task.date].push({
          ...task,
          username: user.username,
        });
      });
    });
    return dateGroups;
  };

  const groupedTasks = groupTasksByDate();
  const hoursRange = Array.from({ length: 12 }, (_, i) => `${i + 1}`);

  return (
    <div className="container py-4">
      <h2 className="mb-4">📆 Task List</h2>
        <button
          onClick={() => navigate('/add-task')}
          className="btn btn-outline-success px-4 shadow-sm m-2 ms-0"
        >
          Add Task
        </button>
        {getUserInfo()?.role === "admin" && (
      <div className="d-flex gap-3 mb-4">
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
          {usersWithTasks.map((user) => (
            <option key={user.id} value={user.username}>
              {user.username}
            </option>
          ))}
        </select>
        <button className="btn btn-primary" onClick={fetchTasks}>
          Search
        </button>
      </div>)}

      {/* Tables by Date */}
      {Object.entries(groupedTasks).map(([date, tasks]) => {
        const users = [...new Set(tasks.map((task) => task.username))];

        return (
          <div key={date} className="mb-4">
            <h5 className="bg-info p-2">Date: {date}</h5>
            <table className="table table-bordered table-striped">
              <thead className="table-success">
                <tr>
                  <th>User</th>
                  {hoursRange.map((hour) => (
                    <th key={hour}>Hour {hour}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user}>
                    <td>{user}</td>
                    {hoursRange.map((hour) => {
                      const task = tasks.find(
                        (t) => t.username === user && t.hours === hour
                      );
                      return <td key={hour}>{task ? task.work_summary : ''}</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
      <div>
        <Link to='/dashboard'>Back to dashboard</Link>
      </div>
    </div>
  );
}
