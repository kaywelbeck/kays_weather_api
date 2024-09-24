import React, { useState } from "react";
import "./Register.css";

const Register = ({ isOpen, onClose }) => {
  const api_base = "http://localhost:3000";
  // State to manage form inputs
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRegister = async (initialPayload) => {
    try {
      const response = await fetch(`${api_base}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: initialPayload,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData({
          username: "",
          email: "",
          phone: "",
          password: "",
        });
        window.alert(`${data.message}`);

        // Save username to local storage
        localStorage.setItem("username", formData.username);
        console.log("Username saved in local storage:", formData.username);

        onClose(); // Call the onClose function to close the modal
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission
    console.log(formData); // Log the form data
    const payload = {
      email: formData.email,
      username: formData.username,
      password: formData.password,
      phone: formData.phone,
    };
    const payloadString = JSON.stringify(payload);
    console.log(payloadString);
    handleRegister(payloadString);
  };

  if (!isOpen) return null;

  return (
    <div className="register-modal">
      <div className="register-content">
        <h2>Please Register</h2>
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
            />
          </div>
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
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              value={formData.phone}
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
            <button type="submit">Register</button>
            <button id="close_register" type="button" onClick={onClose}>
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
