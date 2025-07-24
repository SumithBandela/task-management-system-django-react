import axios from "axios";
import { useEffect, useState } from "react";

export function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get("http://localhost:8000/api/users/")
      .then((response) => {
        setUsers(response.data);
        console.log(response.data)
      });
  };

  const handleStatusChange = (userId, newStatus) => {
    axios.patch(`http://localhost:8000/api/users/${userId}/`, {
      is_active: newStatus
    })
    .then(() => {
      fetchUsers(); // refresh user list after update
    })
    .catch((error) => {
      console.error("Error updating user status:", error);
    });
  };

  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">User Management Dashboard</h4>
        </div>
        <div className="card-body">
          <table className="table table-bordered table-hover text-center">
            <thead className="thead-dark">
              <tr>
                <th scope="col">Username</th>
                <th scope="col">Account Status</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>
                      <select
                        className={`form-select ${user.is_active ? "border-success" : "border-danger"}`}
                        value={user.is_active ? "active" : "inactive"}
                        onChange={(e) =>
                          handleStatusChange(user.id, e.target.value === "active")
                        }
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
