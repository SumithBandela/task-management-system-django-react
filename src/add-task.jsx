import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export function AddTask() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];

  const [date, setDate] = useState(today);
  const [taskFields, setTaskFields] = useState([{ hour: '1', work_summary: '' }]);

  const handleChange = (index, field, value) => {
    const updatedFields = [...taskFields];
    updatedFields[index][field] = value;
    setTaskFields(updatedFields);
  };

  const handleAddMore = () => {
    const usedHours = taskFields.map(task => parseInt(task.hour)).filter(Boolean);
    const availableHours = [...Array(13)].map((_, i) => i + 1).filter(h => !usedHours.includes(h));

    if (availableHours.length === 0) {
      alert('❗ You can only add up to 13 hours.');
      return;
    }

    const nextHour = availableHours[0]; // First available hour
    setTaskFields([...taskFields, { hour: nextHour.toString(), work_summary: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const task of taskFields) {
      if (!task.hour || !task.work_summary) {
        alert('⚠️ Please fill all hour and work summary fields.');
        return;
      }
    }

    try {
      for (const task of taskFields) {
        await axios.post('http://localhost:8000/api/tasks/', {
          date,
          hours: task.hour,
          work_summary: task.work_summary,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      alert('✅ Tasks added successfully!');
      navigate('/tasks');
    } catch (error) {
      console.error(error);
      alert('❌ Failed to add tasks.');
    }
  };

  const usedHours = taskFields.map(task => parseInt(task.hour)).filter(Boolean);

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card p-4 shadow rounded-4" style={{ backgroundColor: '#f9f9f9' }}>
            <h3 className="text-center text-primary mb-4">Add Tasks</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">📅 Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={date}
                  min={today}
                  max={today}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              {taskFields.map((task, index) => (
                <div key={index} className="mb-4 border rounded p-3 bg-light">
                  <div className="row">
                    <div className="col-md-3 mb-2">
                      <label className="form-label">⏱️ Hour</label>
                      <select
                        className="form-control"
                        value={task.hour}
                        onChange={(e) => handleChange(index, 'hour', e.target.value)}
                        required
                      >
                        <option value="">Select hour</option>
                        {[...Array(13)].map((_, i) => (
                          <option
                            key={i + 1}
                            value={i + 1}
                            disabled={usedHours.includes(i + 1) && parseInt(task.hour) !== (i + 1)}
                          >
                            Hour {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-9 mb-2">
                      <label className="form-label">📝 Work Summary</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        placeholder="What did you work on?"
                        value={task.work_summary}
                        onChange={(e) => handleChange(index, 'work_summary', e.target.value)}
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>
              ))}

              <div className="d-flex justify-content-end mb-4">
                <button type="button" className="btn btn-outline-primary" onClick={handleAddMore}>
                  ➕ Add More
                </button>
              </div>

              <div className="d-grid">
                <button type="submit" className="btn btn-primary btn-lg">Add Task</button>
              </div>
            </form>

            <div className="text-center mt-4">
              <button className="btn btn-link text-muted" onClick={() => navigate('/tasks')}>
                Back to Task List
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
