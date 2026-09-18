import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("cropcare_token");
  const email = localStorage.getItem("cropcare_email");

  const handleLogout = () => {
    localStorage.removeItem("cropcare_token");
    localStorage.removeItem("cropcare_email");

    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">

        <Link to="/" className="brand">
          <span className="brand-icon">🌾</span>

          <div>
            <h1>CropCare AI</h1>
            <span>Smart Crop Advisory</span>
          </div>
        </Link>


        <nav className="nav-links">

          <Link to="/">
            Dashboard
          </Link>


          {token ? (
            <>
              <Link to="/chat">
                Crop Advisor
              </Link>

              <span className="user-email">
                {email}
              </span>

              <button
                className="logout-button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="login-button"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="register-button"
              >
                Register
              </Link>
            </>
          )}

        </nav>

      </div>
    </header>
  );
}

export default Navbar;
