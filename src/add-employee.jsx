import React from "react";
import { useFormik } from "formik";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function AddEmployee() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      designation: "",
    },
    onSubmit: async (values) => {
      await axios.post("http://127.0.0.1:8000/api/employees/", values,{
          headers: { Authorization: `Bearer ${token}` },
        });
      navigate("/employees");
    },
  });

  return (
    <div className="container mt-5">
      <h3 className="mb-4 text-success">Add New Employee</h3>
      <form onSubmit={formik.handleSubmit} className="shadow p-4 bg-light rounded">
        {["name", "email", "phone", "designation"].map((field) => (
          <div className="mb-3" key={field}>
            <label className="form-label text-capitalize">{field}</label>
            <input
              type="text"
              className="form-control"
              name={field}
              value={formik.values[field]}
              onChange={formik.handleChange}
              required
            />
          </div>
        ))}
        <button type="submit" className="btn btn-success">Save</button>
      </form>
    </div>
  );
};

