import { useState } from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import axios from "axios";


const API_URL = "http://127.0.0.1:8000";


function Register() {

  const navigate = useNavigate();


  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);


  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");


    if (
      !email ||
      !password ||
      !confirmPassword
    ) {

      setError(
        "Please fill in all fields."
      );

      return;
    }


    if (password.length < 6) {

      setError(
        "Password must contain at least 6 characters."
      );

      return;
    }


    if (password !== confirmPassword) {

      setError(
        "Passwords do not match."
      );

      return;
    }


    setLoading(true);


    try {

      const response = await axios.post(
        `${API_URL}/register`,
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
          🌱
        </div>


        <h2>
          Create Your Account
        </h2>


        <p className="auth-subtitle">
          Start using CropCare AI
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
            placeholder="Create a password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
          />


          <label>
            Confirm Password
          </label>

          <input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(event.target.value)
            }
          />


          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >

            {loading
              ? "Creating account..."
              : "Create Account →"}

          </button>

        </form>


        <p className="auth-switch">

          Already have an account?{" "}

          <Link to="/login">
            Login
          </Link>

        </p>

      </div>

    </main>
  );
}


export default Register;