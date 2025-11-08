

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <button onClick={() => window.location.reload()} className="btn-primary">
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function AdminApp() {
  const [activeTab, setActiveTab] = React.useState("contacts");
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  // NOTE: Authentication now handled by backend API (session-based, no persistence)
  const [token, setToken] = React.useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://shrayatours.onrender.com/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        // Removed persistent login - no localStorage storage
        setIsAuthenticated(true);
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://shrayatours.onrender.com/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        alert(data.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Change password error:', error);
      alert('Failed to change password. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center" data-name="admin-login" data-file="admin-app.js">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input mb-4"
              placeholder="Enter password"
            />
            <button type="submit" className="btn-primary w-full">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100" data-name="admin-app" data-file="admin-app.js">
      <AdminHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("contacts")}
              className={`px-6 py-4 font-semibold ${activeTab === "contacts" ? "border-b-2 border-[var(--primary-color)] text-[var(--primary-color)]" : "text-gray-600"}`}
            >
              Contact Inquiries
            </button>
            <button
              onClick={() => setActiveTab("destinations")}
              className={`px-6 py-4 font-semibold ${activeTab === "destinations" ? "border-b-2 border-[var(--primary-color)] text-[var(--primary-color)]" : "text-gray-600"}`}
            >
              Destinations
            </button>
            <button
              onClick={() => setActiveTab("vehicles")}
              className={`px-6 py-4 font-semibold ${activeTab === "vehicles" ? "border-b-2 border-[var(--primary-color)] text-[var(--primary-color)]" : "text-gray-600"}`}
            >
              Vehicles
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-6 py-4 font-semibold ${activeTab === "settings" ? "border-b-2 border-[var(--primary-color)] text-[var(--primary-color)]" : "text-gray-600"}`}
            >
              Settings
            </button>
          </div>
        </div>
        {activeTab === "contacts" && <ContactsList />}
        {activeTab === "destinations" && <DestinationsManager />}
        {activeTab === "vehicles" && <VehiclesManager />}
        {activeTab === "settings" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Change Password</h2>
            <form onSubmit={handleChangePassword}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
              <button type="submit" className="btn-primary">
                Change Password
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ErrorBoundary>
    <AdminApp />
  </ErrorBoundary>
);
