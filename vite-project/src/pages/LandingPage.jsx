import React from "react";
import { Link } from "react-router-dom";
import "../theme.css";

function LandingPage() {
  return (
    <div className="shell" style={{ alignItems: "flex-start", justifyContent: "center" }}>
      <section className="hero">
        <span className="hero-badge">EASE YOUR MEETING NOTES</span>

        <h1 className="hero-title">
          Notes in. Draft out.
          <br />
          Easy Your Messy Notes
        </h1>

        <p className="hero-text">
          Paste in messy meeting notes and the agent structures them, builds a
          document, and drafts a mail. Review your draft and what not .
        </p>

        <div className="hero-actions">
          <Link className="btn btn-primary" to="/dashboard">
            Open dashboard
          </Link>
          <Link className="btn btn-ghost" to="/login">
            Log in
          </Link>
          <Link className="btn btn-ghost" to="/signup">
            Sign up
          </Link>
        </div>

        <div className="console-panel" aria-hidden="true">
          <div className="line"><span className="arrow">&gt;</span>parsing messy notes...</div>
          <div className="line"><span className="arrow">&gt;</span>structuring summary + action plan</div>
          <div className="line"><span className="arrow">&gt;</span>draft mail</div>
          <div className="line wait"><span className="arrow">&gt;</span>and what not...<span className="cursor-blink"></span></div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;