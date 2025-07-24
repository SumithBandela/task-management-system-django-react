import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export function EditTask() {
  const token = localStorage.getItem('token');
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
    },
    onSubmit: async (values) => {
      try {
        await axios.put(`http://localhost:8000/api/tasks/${id}/`, values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Task updated successfully!');
        navigate('/tasks');
      } catch (err) {
        alert('Update failed. Admin access or office hours may be required.');
        console.error(err);
      }
    },
  });

  useEffect(() => {
    axios.get(`http://localhost:8000/api/tasks/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      formik.setValues({
        title: res.data.title,
        description: res.data.description,
      });
    })
    .catch((err) => setError('Error loading task.'));
  }, [id]);

  return (
    <div className="container py-5">
      <h3 className="text-center text-warning mb-4">✏️ Edit Task</h3>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={formik.handleSubmit} className="card p-4 shadow rounded-4 col-md-6 mx-auto">
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            name="title"
            className="form-control"
            value={formik.values.title}
            onChange={formik.handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-control"
            value={formik.values.description}
            onChange={formik.handleChange}
            rows={4}
            required
          />
        </div>
        <button className="btn btn-warning" type="submit">Update Task</button>
      </form>
    </div>
  );
}
