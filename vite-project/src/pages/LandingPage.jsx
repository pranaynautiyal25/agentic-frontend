import React from "react";
import { Link } from "react-router-dom";
import "../theme.css";

function LandingPage() {
  return (
    <div className="shell" style={{ alignItems: "flex-start", justifyContent: "center" }}>
      <section className="hero">
        <span className="hero-badge">MEETING AGENT // v1</span>

        <h1 className="hero-title">
          Notes in. Draft out.
          <br />
          You approve before it sends.
        </h1>

        <p className="hero-text">
          Paste in messy meeting notes and the agent structures them, builds a
          document, and drafts a mail. Nothing goes out until you review the
          subject and body yourself.
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
          <div className="line"><span className="arrow">&gt;</span>generating document</div>
          <div className="line wait"><span className="arrow">&gt;</span>awaiting human review<span className="cursor-blink"></span></div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;