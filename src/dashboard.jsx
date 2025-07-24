import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold text-dark">📋 Task Management Dashboard</h1>
        <p className="text-secondary fs-5">
          Welcome back! Navigate through your tasks with ease.
        </p>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-lg border-0 rounded-4 p-5 bg-light">
            <div className="row g-4">
              <div className="col-md-6 d-grid">
                <button
                  className="btn btn-primary btn-lg rounded-3 shadow-sm"
                  onClick={() => navigate("/tasks")}
                >
                  📝 View Tasks
                </button>
              </div>
              <div className="col-md-6 d-grid">
                <button
                  className="btn btn-danger btn-lg rounded-3 shadow-sm"
                  onClick={handleLogout}
                >
                  🚪 Logout
                </button>
              </div>
            </div>

            <div className="text-center mt-5">
              <div className="alert alert-info small m-0 rounded-3">
                <strong>Note:</strong> After <strong>6 PM</strong>, editing and adding tasks are disabled.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
