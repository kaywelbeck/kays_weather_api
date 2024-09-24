import React, { useState } from "react";
import "./SignIN.css";

const SignIN = ({ isOpen, onClose, onLogin }) => {
  const api_base = "http://localhost:3000";
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignIN = async (initialPayload) => {
    try {
      const response = await fetch(`${api_base}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: initialPayload,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData({ email: "", password: "" });
        localStorage.setItem("token", data.token);
        console.log("Local Storage Token:", localStorage.getItem("token"));
        onLogin(); // Call onLogin to update the login state in the parent component
        onClose(); // Close the modal
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { email: formData.email, password: formData.password };
    const payloadString = JSON.stringify(payload);
    handleSignIN(payloadString);
  };

  if (!isOpen) return null;

  return (
    <div className="register-modal">
      <div className="register-content">
        <h2>Please Sign in</h2>
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="form-actions">
            <button type="submit">Sign in</button>
            <button id="close_signin" type="button" onClick={onClose}>
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIN;
