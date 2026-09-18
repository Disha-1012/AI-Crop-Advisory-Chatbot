import { useState } from "react";
import {
  Link,
  useNavigate
} from "react-router-dom";

import axios from "axios";


const API_URL = "http://127.0.0.1:8000";


function Login() {

  const navigate = useNavigate();


  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);


  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");


    if (!email || !password) {

      setError(
        "Please enter your email and password."
      );

      return;
    }


    setLoading(true);


    try {

      const response = await axios.post(
        `${API_URL}/login`,
        {
          email,
          password
        }
      );


      localStorage.setItem(
        "cropcare_token",
        response.data.access_token
      );


      localStorage.setItem(
        "cropcare_email",
        response.data.user.email
      );


      navigate("/");


    } catch (error) {

      console.error(error);


      if (
        error.response &&
        error.response.data &&
        error.response.data.detail
      ) {

        setError(
          error.response.data.detail
        );

      } else {

        setError(
          "Could not connect to CropCare AI server."
        );
      }

    } finally {

      setLoading(false);
    }
  };


  return (

    <main className="auth-page">

      <div className="auth-card">

        <div className="auth-icon">
          🌾
        </div>


        <h2>
          Welcome Back
        </h2>


        <p className="auth-subtitle">
          Login to continue to CropCare AI
        </p>


        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}


        <form onSubmit={handleSubmit}>

          <label>
            Email Address
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
          />


          <label>
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
          />


          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >

            {loading
              ? "Logging in..."
              : "Login →"}

          </button>

        </form>


        <p className="auth-switch">

          Don't have an account?{" "}

          <Link to="/register">
            Create one
          </Link>

        </p>

      </div>

    </main>
  );
}


export default Login;