import { useEffect, useState } from 'react';
import axios from 'axios';
import {  useNavigate } from 'react-router-dom';
import { getUserInfo } from './utils/auth';

export function ViewTasks() {
  const [usersWithTasks, setUsersWithTasks] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [username, setUsername] = useState('all');
  const [users, setUsers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];
  const hoursRange = Array.from({ length: 13 }, (_, i) => `${i + 1}`);

  useEffect(() => {
    axios.get('http://localhost:8000/api/users/').then((response) => {
      const filtered = response.data.filter((user) => user.role !== 'admin');
      setUsers(filtered);
    });

    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/tasks/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const filtered = response.data.filter((user) => user.role !== 'admin');
      setUsersWithTasks(filtered);
      setFilteredData(filtered);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const applyFilters = (selectedUser = username, start = startDate, end = endDate) => {
    let result = [...usersWithTasks];

    if (selectedUser !== 'all') {
      result = result.filter((user) => user.username === selectedUser);
    }

    result = result.map((user) => ({
      ...user,
      tasks: user.tasks.filter((task) => {
        return (
          (!start || task.date >= start) &&
          (!end || task.date <= end) &&
          task.date <= today
        );
      }),
    }));

    setFilteredData(result);
  };

  const handleSearchClick = () => {
    applyFilters(username, startDate, endDate);
  };

  const handleUserChange = (e) => {
    const selected = e.target.value;
    setUsername(selected);
    applyFilters(selected, startDate, endDate);
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">📆 Task List</h2>
      {getUserInfo()?.role !=='admin' && (<button onClick={() => navigate('/add-task')} className="btn btn-outline-success px-4 shadow-sm m-2 ms-0">
        Add Task
      </button>)}

      {getUserInfo()?.role === 'admin' && (
        <div className="d-flex gap-3 mb-4">
          <input
            type="date"
            className="form-control"
            value={startDate}
            max={today}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className="form-control"
            value={endDate}
            max={today}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <select className="form-select" value={username} onChange={handleUserChange}>
            <option value="all">All Users</option>
            {users.map((user) => (
              <option key={user.id} value={user.username}>
                {user.username}
              </option>
            ))}
          </select>
          
          <button className="btn btn-primary" onClick={handleSearchClick}>
            Search
          </button>
        </div>
      )}

      {username === 'all' && filteredData.length > 0 && (
        <>
          {(() => {
            const dateGrouped = {};

            filteredData.forEach((user) => {
              user.tasks.forEach((task) => {
                if (task.date <= today) {
                  if (!dateGrouped[task.date]) dateGrouped[task.date] = [];
                  dateGrouped[task.date].push({ ...task, username: user.username });
                }
              });
            });

            const sortedDates = Object.keys(dateGrouped).sort();

            return sortedDates.map((date) => {
              const usersMap = {};
              dateGrouped[date].forEach((task) => {
                if (!usersMap[task.username]) usersMap[task.username] = {};
                usersMap[task.username][task.hours] = task.work_summary;
              });

              return (
                <div key={date} className="mb-5">
                  <h5 className="bg-secondary text-white p-2 rounded " style={{width:'200px'}}>📅 {date}</h5>
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
                      {Object.entries(usersMap).map(([user, hours]) => (
                        <tr key={user}>
                          <td>{user}</td>
                          {hoursRange.map((hour) => (
                            <td key={hour}>{hours[hour] || ''}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            });
          })()}
        </>
      )}

      {username !== 'all' && filteredData.length > 0 && (
        <>
          {filteredData.map((user) => {
            const tasksByDate = {};
            user.tasks.forEach((task) => {
              if (task.date <= today) {
                if (!tasksByDate[task.date]) tasksByDate[task.date] = [];
                tasksByDate[task.date].push(task);
              }
            });

            const sortedDates = Object.keys(tasksByDate).sort();

            return (
              <div key={user.id}>
                <h5 className="bg-secondary text-white p-2 rounded" style={{width:'200px'}}>User: {user.username}</h5>
                <table className="table table-bordered table-striped">
                  <thead className="table-success">
                    <tr>
                      <th>Date</th>
                      {hoursRange.map((hour) => (
                        <th key={hour}>Hour {hour}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sortedDates.map((date) => (
                      <tr key={date}>
                        <td>{date}</td>
                        {hoursRange.map((hour) => {
                          const task = tasksByDate[date].find((t) => t.hours === hour);
                          return <td key={hour}>{task ? task.work_summary : ''}</td>;
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
