import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../theme.css";

const EMPTY_MEETING = {
  messy_note: "",
  what_to_do: "",
};

const EMPTY_HUMAN_INPUT = {
  recipient_name: "",
  recipient_email: "",
  sender_name: "",
  subject: "",
  key_points: "",
  tone: "professional",
};

const EMPTY_OUTPUT = {
  outputs: [],
  document_url: null,
  human_input_url: null,
  human_input_subject: null,
  human_input_body: null,
  mail_status: null,
  mail_message: null,
};

// Maps a status/kind string to a stamp color so the badge means
// something at a glance: teal = live/done, amber = waiting on a
// human, coral = failed.
function stampClassFor(value) {
  const v = (value || "").toLowerCase();
  if (["sent", "success", "done", "url"].some((k) => v.includes(k))) return "stamp-teal";
  if (["pending", "wait", "review", "draft"].some((k) => v.includes(k))) return "stamp-amber";
  if (["fail", "error"].some((k) => v.includes(k))) return "stamp-coral";
  return "stamp-mid";
}

function Dashboard() {
  const [meetingData, setMeetingData] = useState(EMPTY_MEETING);
  const [humanInput, setHumanInput] = useState(EMPTY_HUMAN_INPUT);

  const [responseMsg, setResponseMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [loadingRun, setLoadingRun] = useState(false);
  const [loadingMail, setLoadingMail] = useState(false);

  const [outputData, setOutputData] = useState(EMPTY_OUTPUT);
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const handleMeetingChange = (e) => {
    const { name, value } = e.target;
    setMeetingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleHumanChange = (e) => {
    const { name, value } = e.target;
    setHumanInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetAll = () => {
    setMeetingData(EMPTY_MEETING);
    setHumanInput(EMPTY_HUMAN_INPUT);
    setResponseMsg("");
    setIsError(false);
    setOutputData(EMPTY_OUTPUT);
  };

  const handleRunWorkflow = async (e) => {
    e.preventDefault();
    setResponseMsg("");
    setIsError(false);
    setLoadingRun(true);

    try {
      const res = await fetch(`${API_URL}/api/run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input_one: meetingData,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setResponseMsg("Workflow completed successfully.");
        setIsError(false);
        setOutputData({
          outputs: data.outputs || [],
          document_url: data.document_url || null,
          human_input_url: data.human_input_url || null,
          human_input_subject: data.human_input_subject || null,
          human_input_body: data.human_input_body || null,
          mail_status: data.mail_status || null,
          mail_message: data.mail_message || null,
        });
      } else {
        setResponseMsg(data.detail || data.message || "Something went wrong.");
        setIsError(true);
      }
    } catch (err) {
      setResponseMsg("Could not reach the server. Please try again.");
      setIsError(true);
    } finally {
      setLoadingRun(false);
    }
  };

  const handleHumanInput = async (e) => {
    e.preventDefault();
    setResponseMsg("");
    setIsError(false);
    setLoadingMail(true);

    try {
      const res = await fetch(`${API_URL}/api/human-input`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input_one: meetingData,
          human_input: humanInput,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setResponseMsg("Mail compose link created successfully.");
        setIsError(false);
        setOutputData((prev) => ({
          ...prev,
          outputs: data.outputs || [],
          human_input_url: data.human_input_url || null,
          human_input_subject: data.human_input_subject || null,
          human_input_body: data.human_input_body || null,
          mail_status: data.mail_status || null,
          mail_message: data.mail_message || null,
        }));
      } else {
        setResponseMsg(data.detail || data.message || "Something went wrong.");
        setIsError(true);
      }
    } catch (err) {
      setResponseMsg("Could not reach the server. Please try again.");
      setIsError(true);
    } finally {
      setLoadingMail(false);
    }
  };

  const outputSections = outputData.outputs || [];

  return (
    <div className="dashboard-page">
      <header className="masthead">
        <div className="masthead-inner">
          <div className="masthead-brand">
            <span className="masthead-mark">MA</span>
            <div className="masthead-title-block">
              <h1 className="masthead-title">Meeting Agent Console</h1>
              <p className="masthead-subtitle">Capture → compose → human review, before anything sends</p>
            </div>
          </div>

          <div className="masthead-links">
            <Link className="top-link" to="/">Home</Link>
            <Link className="top-link" to="/login">Login</Link>
            <Link className="top-link" to="/signup">Signup</Link>
          </div>
        </div>
      </header>

      <main className="dashboard-container">
        <section className="panel submission-panel">
          <div className="panel-eyebrow">Step 01 — Capture</div>
          <h2 className="panel-title">Meeting input</h2>

          <form className="dashboard-form" onSubmit={handleRunWorkflow}>
            <div className="field-group">
              <label htmlFor="messy_note">Messy notes</label>
              <textarea
                id="messy_note"
                name="messy_note"
                value={meetingData.messy_note}
                onChange={handleMeetingChange}
                placeholder="Paste messy meeting notes here"
                rows="6"
                required
              />
            </div>

            <div className="field-group">
              <label htmlFor="what_to_do">What to do</label>
              <textarea
                id="what_to_do"
                name="what_to_do"
                value={meetingData.what_to_do}
                onChange={handleMeetingChange}
                placeholder="Example: summarize, make plan, and prepare document/mail"
                rows="4"
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loadingRun}>
                {loadingRun ? "Running…" : "Run workflow"}
              </button>

              <button
                type="button"
                className="btn btn-ghost"
                onClick={resetAll}
              >
                Reset
              </button>
            </div>
          </form>

          {responseMsg && (
            <div className={`message ${isError ? "message-error" : "message-success"}`}>
              {responseMsg}
            </div>
          )}
        </section>

        {/*
        <section className="panel submission-panel">
          <div className="panel-eyebrow">Step 02 — Compose</div>
          <h2 className="panel-title">Human input for mail</h2>
          <p className="panel-note">
            This creates the compose link. Subject and body appear below for you to check before sending.
          </p>

          <form className="dashboard-form" onSubmit={handleHumanInput}>
            <div className="grid-2">
              <div className="field-group">
                <label htmlFor="recipient_name">Recipient name</label>
                <input
                  id="recipient_name"
                  name="recipient_name"
                  value={humanInput.recipient_name}
                  onChange={handleHumanChange}
                  placeholder="Teacher / mentor name"
                  required
                />
              </div>

              <div className="field-group">
                <label htmlFor="recipient_email">Recipient email</label>
                <input
                  id="recipient_email"
                  name="recipient_email"
                  type="email"
                  value={humanInput.recipient_email}
                  onChange={handleHumanChange}
                  placeholder="mentor@example.com"
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="field-group">
                <label htmlFor="sender_name">Sender name</label>
                <input
                  id="sender_name"
                  name="sender_name"
                  value={humanInput.sender_name}
                  onChange={handleHumanChange}
                  placeholder="Your name"
                  required
                />
              </div>

              <div className="field-group">
                <label htmlFor="subject">Subject</label>
                <input
                  id="subject"
                  name="subject"
                  value={humanInput.subject}
                  onChange={handleHumanChange}
                  placeholder="Project update"
                  required
                />
              </div>
            </div>

            <div className="field-group">
              <label htmlFor="key_points">Key points</label>
              <textarea
                id="key_points"
                name="key_points"
                value={humanInput.key_points}
                onChange={handleHumanChange}
                placeholder="Write the important points for the email"
                rows="4"
                required
              />
            </div>

            <div className="grid-2">
              <div className="field-group">
                <label htmlFor="tone">Tone</label>
                <select
                  id="tone"
                  name="tone"
                  value={humanInput.tone}
                  onChange={handleHumanChange}
                >
                  <option value="professional">Professional</option>
                  <option value="friendly">Friendly</option>
                  <option value="formal">Formal</option>
                  <option value="simple">Simple</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loadingMail}>
                {loadingMail ? "Creating link…" : "Create mail compose link"}
              </button>
            </div>
          </form>
        </section>
        */}

        <section className="panel report-panel">
          <div className="panel-eyebrow">Step 02 — Review &amp; output</div>
          <h2 className="panel-title">Results</h2>

          <div className="report-grid">
            {outputSections.length > 0 ? (
              outputSections.map((item, index) => (
                <div className="report-card" key={`${item.step}-${index}`}>
                  <div className="report-card-header">
                    <h3>{item.title || item.step}</h3>
                    <span className={`stamp ${stampClassFor(item.kind)}`}>{item.kind}</span>
                  </div>

                  {item.kind === "url" && item.url ? (
                    <a href={item.url} target="_blank" rel="noreferrer" className="link-box">
                      Open link
                    </a>
                  ) : (
                    <pre className="output-text">{String(item.data)}</pre>
                  )}
                </div>
              ))
            ) : (
              <p className="empty-state">No output yet — run the workflow to see results here.</p>
            )}
          </div>

          <div className="mail-preview">
            <h3>Mail preview — awaiting your review</h3>

            {outputData.human_input_url ? (
              <a
                className="link-box"
                href={outputData.human_input_url}
                target="_blank"
                rel="noreferrer"
              >
                Open compose link
              </a>
            ) : (
              <p className="empty-state" style={{ color: "var(--paper-ink)", opacity: 0.6, border: "1px dashed rgba(42,36,22,0.3)" }}>
                No compose link yet
              </p>
            )}

            {outputData.human_input_subject && (
              <div className="preview-block">
                <strong>Subject</strong>
                <p>{outputData.human_input_subject}</p>
              </div>
            )}

            {outputData.human_input_body && (
              <div className="preview-block">
                <strong>Body</strong>
                <pre className="output-text">{outputData.human_input_body}</pre>
              </div>
            )}

            {outputData.document_url && (
              <div className="preview-block">
                <strong>Document</strong>
                <a href={outputData.document_url} target="_blank" rel="noreferrer">
                  Open Cloudinary file
                </a>
              </div>
            )}

            {(outputData.mail_status || outputData.mail_message) && (
              <div className="preview-block">
                <strong>Status</strong>
                <span className={`stamp ${stampClassFor(outputData.mail_status)}`} style={{ marginBottom: 8 }}>
                  {outputData.mail_status || "-"}
                </span>
                <p style={{ marginTop: 8 }}>{outputData.mail_message || ""}</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;