import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css";

const Landing = () => {
  return (
    <div className="landing-page">

      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-container">

          <div className="logo-section">
            <div className="logo-icon"></div>

            <div>
              <h1 className="logo-title">OverDrive</h1>
              <p className="logo-subtitle">KENYA</p>
            </div>
          </div>

          <div className="nav-buttons">
            <Link to="/login" className="login-btn">
              Log in
            </Link>

            <Link to="/register" className="register-btn">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-section">

        <div className="hero-glow"></div>

        <div className="hero-content">

          <div className="hero-badge">
            AI Powered Vehicle Valuation
          </div>

          <h1 className="hero-title">
            Know Your Car's
            <br />
            <span>True Worth</span>
          </h1>

          <p className="hero-text">
            Kenya’s smartest AI-powered vehicle valuation platform.
            Upload photos and receive instant market pricing,
            damage analysis and expert insights.
          </p>

          <div className="hero-buttons">
            <Link to="/register" className="primary-btn">
              Start Free Valuation
            </Link>

            <Link to="/login" className="secondary-btn">
              Sign In
            </Link>
          </div>

          <p className="hero-small-text">
            Trusted by Kenyan car buyers and sellers
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">

        <div className="features-grid">

          <div className="feature-card">
            <div className="feature-icon"></div>

            <h3>Smart Photo Analysis</h3>

            <p>
              Upload vehicle photos and let AI detect condition,
              damage, repainting and modifications.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon"></div>

            <h3>Real Market Prices</h3>

            <p>
              Accurate valuations powered by Kenyan market
              listings, dealers and auction trends.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon"></div>

            <h3>Expert Insights</h3>

            <p>
              Get repair estimates, selling advice and
              detailed vehicle condition reports.
            </p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        © 2026 OverDrive Kenya — AI Vehicle Valuation Platform
      </footer>

    </div>
  );
};

export default Landing;