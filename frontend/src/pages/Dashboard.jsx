import { useEffect, useState } from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import axios from "axios";


const API_URL = "http://127.0.0.1:8000";


function Dashboard() {

  const navigate = useNavigate();


  const [user, setUser] = useState(null);

  const [stats, setStats] = useState({
    advisories: 0,
    crops: 0
  });


  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(true);


  useEffect(() => {

    const token =
      localStorage.getItem("cropcare_token");


    if (!token) {

      navigate("/login");

      return;
    }


    const loadDashboard = async () => {

      try {

        const config = {

          headers: {

            Authorization:
              `Bearer ${token}`
          }
        };


        const userResponse =
          await axios.get(
            `${API_URL}/me`,
            config
          );


        setUser(
          userResponse.data.user
        );


        setStats(
          userResponse.data.stats
        );


        const historyResponse =
          await axios.get(
            `${API_URL}/history`,
            config
          );


        setHistory(
          historyResponse.data.history
        );


      } catch (error) {

        console.error(error);


        if (
          error.response &&
          error.response.status === 401
        ) {

          localStorage.removeItem(
            "cropcare_token"
          );

          localStorage.removeItem(
            "cropcare_email"
          );

          navigate("/login");
        }

      } finally {

        setLoading(false);
      }
    };


    loadDashboard();

  }, [navigate]);


  if (loading) {

    return (

      <main className="dashboard-loading">

        <div className="loading-spinner">
          🌱
        </div>

        <p>
          Loading your dashboard...
        </p>

      </main>
    );
  }


  return (

    <main className="dashboard">

      {/* HERO */}

      <section className="dashboard-hero">

        <div className="hero-content">

          <div className="hero-badge">
            🌱 AI for Sustainable Agriculture
          </div>


          <h2>

            Welcome to
            <br />

            <span>
              CropCare AI
            </span>

          </h2>


          <p>

            Get accessible and timely
            crop-management guidance
            powered by artificial intelligence.

          </p>


          <div className="hero-buttons">

            <Link
              to="/chat"
              className="primary-hero-button"
            >
              Ask CropCare AI →
            </Link>


            <a
              href="#recent"
              className="secondary-hero-button"
            >
              View History
            </a>

          </div>

        </div>


        <div className="hero-visual">

        <img
          src="/images/cropcare-hero.jpg"
          alt="Farmer working in a crop field"
          className="hero-image"
        />

        <div className="farmer-card">

          <span>
            🌱
          </span>

          <div>

            <strong>
              Sustainable Farming
            </strong>

            <small>
              Better decisions for every crop
            </small>

          </div>

        </div>

      </div>

      </section>


      {/* USER SECTION */}

      <section className="welcome-section">

        <div>

          <span className="section-label">
            YOUR ACCOUNT
          </span>

          <h3>
            Welcome back!
          </h3>

          <p>
            {user?.email}
          </p>

        </div>


        <Link
          to="/chat"
          className="dashboard-action"
        >
          Start New Advisory
        </Link>

      </section>


      {/* STATISTICS */}

      <section className="stats-grid">

        <div className="stat-card">

          <div className="stat-icon">
            <img
              src="/images/total-advisories.jpg"
              alt="Total advisories"
            />
          </div>

          <div>

            <span>
              Total Advisories
            </span>

            <strong>
              {stats.advisories}
            </strong>

          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon">
            <img
              src="/images/available-crops.jpeg"
              alt="Available crops"
            />
          </div>

          <div>

            <span>
              Available Crops
            </span>

            <strong>
              {stats.crops}
            </strong>

          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon">
            <img
              src="/images/ai-assistant.jpg"
              alt="AI assistant"
            />
          </div>

          <div>

            <span>
              AI Assistant
            </span>

            <strong>
              Active
            </strong>

          </div>

        </div>

      </section>


      {/* FEATURES */}

      <section className="mission-section">

        <div className="section-heading">

          <span>
            CROPCARE AI
          </span>

          <h3>
            Technology that supports
            better farming decisions
          </h3>

          <p>

            Ask questions about irrigation,
            diseases, pests, fertilizers
            and sustainable crop management.

          </p>

        </div>


        <div className="feature-grid">

          <div className="feature-card">

            <div className="feature-icon">
              <img
                src="/images/ai-guidance.jpg"
                alt="AI-powered guidance"
              />
            </div>

            <h4>
              AI-Powered Guidance
            </h4>

            <p>
              Ask crop-related questions
              and receive practical
              AI-generated guidance.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              <img
                src="/images/multiple-crops.jpg"
                alt="Multiple crops"
              />
            </div>

            <h4>
              Multiple Crops
            </h4>

            <p>
              Explore guidance across
              important Indian crops.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              <img
                src="/images/resource-awareness.webp"
                alt="Resource awareness"
              />
            </div>

            <h4>
              Resource Awareness
            </h4>

            <p>
              Encourage responsible use
              of water and agricultural inputs.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              <img
                src="/images/sustainable-farming.jpg"
                alt="Sustainable farming"
              />
            </div>

            <h4>
              Sustainable Farming
            </h4>

            <p>
              Promote environmentally
              responsible farming practices.
            </p>

          </div>

        </div>

      </section>


      {/* HISTORY */}

      <section
        id="recent"
        className="history-section"
      >

        <div className="section-heading">

          <span>
            RECENT ACTIVITY
          </span>

          <h3>
            Your Recent Crop Advisories
          </h3>

        </div>


        {history.length === 0 ? (

          <div className="empty-history">

            <div>
              🌱
            </div>

            <h4>
              No advisories yet
            </h4>

            <p>
              Ask your first crop-related
              question to start building
              your advisory history.
            </p>

            <Link
              to="/chat"
              className="dashboard-action"
            >
              Ask Your First Question →
            </Link>

          </div>

        ) : (

          <div className="history-list">

            {history.map((item) => (

              <div
                className="history-card"
                key={item.id}
              >

                <div className="history-top">

                  <span className="crop-badge">
                    🌱 {item.crop}
                  </span>

                </div>


                <h4>
                  {item.question}
                </h4>


                <p>

                  {item.answer
                    ?.replace(/[#*]/g, "")
                    .slice(0, 180)}

                  {item.answer &&
                  item.answer.length > 180
                    ? "..."
                    : ""}

                </p>

              </div>

            ))}

          </div>

        )}

      </section>


      {/* CTA */}

      <section className="dashboard-cta">

        <div>

          <h3>
            Need advice for another crop?
          </h3>

          <p>
            Select a crop and ask CropCare AI.
          </p>

        </div>


        <Link
          to="/chat"
          className="cta-button"
        >
          Open Crop Advisor
        </Link>

      </section>


    </main>
  );
}


export default Dashboard;
