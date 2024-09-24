import React, { useState } from "react";
import "./ChangePassword.css";

const ChangePassword = ({ isOpen, onClose }) => {
  const api_base = "http://localhost:3000";
  const [formData, setFormData] = useState({
    confirm_password: "",
    old_password: "",
    new_password: "",
  });

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleChangePassword = async (initialPayload) => {
    try {
      const response = await fetch(`${api_base}/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: initialPayload,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData({
          old_password: "",
          confirm_password: "",
          new_password: "",
        });
        onClose(); // Close the modal
        window.alert(data.message);
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      oldPassword: formData.old_password,
      newPassword: formData.new_password,
      confirmnewPassword: formData.confirm_password,
    };
    const payloadString = JSON.stringify(payload);
    handleChangePassword(payloadString);
    console.log(` i have receive  this token ${token}`);
  };

  if (!isOpen) return null;

  return (
    <div className="register-modal">
      <div className="register-content">
        <h2>Please Change Password</h2>
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="password">Old Password</label>
            <input
              type="password"
              id="old_password"
              name="old_password"
              required
              value={formData.old_password}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="new_password">New Password</label>
            <input
              type="password"
              id="new_password"
              name="new_password"
              required
              value={formData.new_password}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="new_password">Confirm New Password</label>
            <input
              type="password"
              id="confirm_password"
              name="confirm_password"
              required
              value={formData.confirm_password}
              onChange={handleChange}
            />
          </div>
          <div className="form-actions">
            <button type="submit">Change Password</button>
            <button id="close_signin" type="button" onClick={onClose}>
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
