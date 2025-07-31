import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export function EmployeeList(){
  const [employees, setEmployees] = useState([]);
  const token = localStorage.getItem("token");

  const fetchEmployees = async () => {
    const res = await axios.get("http://127.0.0.1:8000/api/employees/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setEmployees(res.data);
  };


  const toggleStatus = async (id, action) => {
    await axios.patch(` http://127.0.0.1:8000/api/employees/${id}/${action}/`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchEmployees();
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 text-primary">Employee Management</h2>
      <div className="text-end mb-3">
        <Link to="/employees/add" className="btn btn-success">
          + Add Employee
        </Link>
      </div>
      <table className="table table-bordered shadow-sm">
        <thead className="table-primary">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Designation</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.phone}</td>
              <td>{emp.designation}</td>
              <td>
                <Link to={`/employees/edit/${emp.id}`} className="btn btn-sm btn-primary me-2">
                  Edit
                </Link>
                {emp.is_active ? (
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => toggleStatus(emp.id, "deactivate")}
                  >
                    Deactivate
                  </button>
                ) : (
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => toggleStatus(emp.id, "activate")}
                  >
                    Activate
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

