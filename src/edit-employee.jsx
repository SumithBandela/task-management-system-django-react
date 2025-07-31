import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export function  EditEmployee(){
  const token = localStorage.getItem('token');
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({
    name: "",
    email: "",
    phone: "",
    designation: "",
    password: "",
  });

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/employees/${id}/`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => setInitialValues(res.data));
  }, [id]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: async (values) => {
      await axios.put(`/api/employees/${id}/`, values);
      navigate("/employees");
    },
  });

  return (
    <div className="container mt-5">
      <h3 className="mb-4 text-primary">Edit Employee</h3>
      <form onSubmit={formik.handleSubmit} className="shadow p-4 bg-light rounded">
        {["name", "email", "phone", "designation", "password"].map((field) => (
          <div className="mb-3" key={field}>
            <label className="form-label text-capitalize">{field}</label>
            <input
              type={field === "password" ? "password" : "text"}
              className="form-control"
              name={field}
              value={formik.values[field]}
              onChange={formik.handleChange}
              required={field !== "password"}
            />
          </div>
        ))}
        <button type="submit" className="btn btn-primary">Update</button>
      </form>
    </div>
  );
};

