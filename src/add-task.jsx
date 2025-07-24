import React from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export function AddTask() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];

  const formik = useFormik({
    initialValues: {
      date:today,
      hours: 0,
      work_summary: '',
    },
    onSubmit: async (values) => {
      console.log(values)
      try {
        await axios.post('http://localhost:8000/api/tasks/', values, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert('✅ Task added successfully!');
        navigate('/tasks');
      } catch (error) {
        if (error.response?.status === 403) {
          alert('❌ Cannot add tasks after office hours.');
        } else {
          alert('⚠️ Failed to add task. Please try again.');
        }
        console.error(error);
      }
    },
  });

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-5 shadow-lg rounded-4" style={{ backgroundColor: '#f9f9f9' }}>
            <h3 className="text-center text-primary mb-4">Add New Task</h3>

            <form onSubmit={formik.handleSubmit}>
              {/* Date Field at Top */}
              <div className="mb-4">
                <label className="form-label text-secondary">📅 Date</label>
                <input
                  type="date"
                  name="date"
                  className="form-control shadow-sm"
                  onChange={formik.handleChange}
                  value={formik.values.date || today} // pre-fill today's date
                  min={today}
                  max={today}
                  required
                  style={{
                    borderRadius: '10px',
                    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                  }}
                />

              </div>

              {/* Hours Dropdown */}
              <div className="mb-4">
                <label className="form-label text-secondary">⏱️ Hours</label>
                <select
                  name="hours"
                  className="form-control shadow-sm"
                  onChange={formik.handleChange}
                  value={formik.values.hours}
                  required
                  style={{
                    borderRadius: '10px',
                    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <option value="">Select hours</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      hour {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              {/* Work Summary at Bottom */}
              <div className="mb-4">
                <label className="form-label text-secondary">📝 Work Summary</label>
                <textarea
                  name="work_summary"
                  className="form-control shadow-sm"
                  rows="5"
                  onChange={formik.handleChange}
                  value={formik.values.work_summary}
                  required
                  placeholder="Describe what you worked on"
                  style={{
                    borderRadius: '10px',
                    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                  }}
                ></textarea>
              </div>

              <div className="d-grid">
                <button type="submit" className="btn btn-primary btn-lg" style={{ borderRadius: '10px' }}>
                  Add Task
                </button>
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
