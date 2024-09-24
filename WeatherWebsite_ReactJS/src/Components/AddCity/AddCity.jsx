import React, { useState } from "react";
import "./AddCity.css";
import { MdLocationCity } from "react-icons/md";
import uk_top_cities from "../../uk_top_cities.json";

const AddCity = ({ isOpen, onClose }) => {
  const api_base = "http://localhost:3000";
  const [cityInput, setCityInput] = useState("");
  const [cityChoose, setCityChoose] = useState([]);
  const [errorMessage, setErrorMessage] = useState(""); // State for error message

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    setCityInput(e.target.value);
  };

  const handleCity = async (initialPayload) => {
    const token = localStorage.getItem("token"); // Retrieve the token from localStorage
    console.log("Token:", token); // Log the token to verify it
    try {
      const response = await fetch(`${api_base}/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add the Authorization header
        },
        body: initialPayload,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("API response data:", data);
        setCityChoose(Array.isArray(data) ? data : [data]);
        setCityInput("");
        window.alert("City added to favorites");
        setErrorMessage(""); // Clear error message on successful submission
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData); // Log the detailed error response
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleAddCity = (e) => {
    e.preventDefault();
    const isValidCity = uk_top_cities.cities.some(
      (city) => city.name.toLowerCase() === cityInput.trim().toLowerCase()
    );

    if (!isValidCity) {
      setErrorMessage("Please select a valid city");
      return;
    }

    console.log("City added:", cityInput);
    const payload = {
      city: cityInput,
    };
    const payloadString = JSON.stringify(payload);
    console.log(payloadString);
    handleCity(payloadString);
  };

  const handleClose = () => {
    setCityInput(""); // Clear the input field
    setErrorMessage(""); // Clear the error message
    onClose(); // Call the onClose prop to close the modal
  };

  console.log(`data for modal is this : ${cityChoose}`);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Add Your Favourite City{" "}
          <span style={{ marginLeft: "0.5rem" }}>
            <MdLocationCity color="black" size={28} />
          </span>{" "}
        </h2>
        <form onSubmit={handleAddCity}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: "1rem",
              paddingBottom: "1rem",
              height: "4rem",
            }}
          >
            <input
              type="text"
              id="search"
              placeholder="Add Your City"
              style={{ height: "100%" }}
              value={cityInput}
              onChange={handleInputChange}
            />
            <button id="search-btn" type="submit" style={{ height: "100%" }}>
              Add
            </button>
          </div>
        </form>
        {errorMessage && (
          <p style={{ color: "red", textAlign: "center" }}>{errorMessage}</p>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
            paddingTop: "1rem",
          }}
        >
          <button className="custom_button" onClick={handleClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCity;
