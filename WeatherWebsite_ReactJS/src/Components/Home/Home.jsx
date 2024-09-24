import { useState, useEffect } from "react";
import "./Home.css";
import { IoNavigate } from "react-icons/io5";
import { FaRegCircle } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { PiListHeartDuotone } from "react-icons/pi";
import { FaUserCircle } from "react-icons/fa";
import { FaRegSmileBeam } from "react-icons/fa";
import AddCity from "../AddCity/AddCity";
import Register from "../Register/Register";
import SignIN from "../SignIN/SignIN";
import ChangePassword from "../ChangePassword/ChangePassword";
const Home = () => {
  const [showFavourite, setShowFavourite] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAddFavoriteModal, setShowAddFavoriteModal] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [registerForm, setRegisterForm] = useState(false);
  const [signInForm, setSignInForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const [forecast, setForecast] = useState([]); // Note the use of []
  const [weather, setWeather] = useState([]); // Note the use of []
  const [temperatureUnit, setTemperatureUnit] = useState("C");
  const [showForecast, setShowForecast] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track if user is logged in
  const [favorites, setFavorites] = useState([]);
  const [username, setUsername] = useState(""); // New state to store username

  const api_base = "http://localhost:3000";
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value); // Update state on input change
  };

  const handleForecastForm = async (initialPayload) => {
    try {
      const response = await fetch(`${api_base}/forecast`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: initialPayload,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("API response data:", data);
        const processedData = processForecastData(data);
        setForecast(processedData);
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };
  const handleWeather = async (initialPayload) => {
    try {
      const response = await fetch(`${api_base}/weather`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: initialPayload,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("API response data:", data);
        setWeather(Array.isArray(data) ? data : [data]);
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };
  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    const payload = {
      location: searchQuery,
    };
    const payloadString = JSON.stringify(payload);
    console.log(payloadString);
    handleForecastForm(payloadString);
    handleWeather(payloadString);
  };
  const handleDefaultLocation = () => {
    const payload = {
      location: "coventry",
    };
    const payloadString = JSON.stringify(payload);
    console.log(payloadString);
    handleForecastForm(payloadString);
    handleWeather(payloadString);
  };

  // fetch fav city
  const handleFetchFavorites = async () => {
    try {
      const response = await fetch(`${api_base}/favorites`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFavorites(data.favorites); // Set the favorites state with the array
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleFavCityClick = (city) => {
    const payload = {
      location: city,
    };
    const payloadString = JSON.stringify(payload);
    console.log(payloadString);
    handleForecastForm(payloadString);
    handleWeather(payloadString);
    setShowFavourite(false);
  };

  // Call handleFetchFavorites when needed, for example, when the component mounts
  useEffect(() => {
    if (localStorage.getItem("token")) {
      handleFetchFavorites();
    }
  }, []);

  // fetch fav city
  useEffect(() => {
    if (showAddFavoriteModal || registerForm || signInForm || changePassword) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    // Cleanup function
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [showAddFavoriteModal, registerForm, signInForm, changePassword]);

  useEffect(() => {
    const payload = {
      location: "coventry",
    };
    const payloadString = JSON.stringify(payload);
    console.log(payloadString);
    handleForecastForm(payloadString);
    handleWeather(payloadString);
  }, []);
  const convertTemperature = (temp, to) => {
    if (to === "F") {
      return Math.round((temp * 9) / 5 + 32);
    } else {
      return Math.round(((temp - 32) * 5) / 9);
    }
  };

  const displayTemperature = (temp) => {
    if (temperatureUnit === "C") {
      return `${temp}°C`;
    } else {
      return `${convertTemperature(temp, "F")}°F`;
    }
  };
  const convertWindSpeed = (speed, to) => {
    if (to === "mph") {
      return Math.round(speed * 2.237 * 10) / 10;
    } else {
      return speed;
    }
  };
  const displayWindSpeed = (speed) => {
    if (temperatureUnit === "C") {
      return `${speed}m/s`;
    } else {
      return `${convertWindSpeed(speed, "mph")}mph`;
    }
  };

  const processForecastData = (data) => {
    return data.list
      .filter((item) => item.dt_txt.endsWith("09:00:00"))
      .slice(0, 5)
      .map((item) => {
        const date = new Date(item.dt_txt);
        const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
        return {
          day: dayName,
          icon: item.weather[0].icon,
          temp: Math.round(item.main.temp),
          temp_min: Math.round(item.main.temp_min),
        };
      });
  };
  const toggleForecast = () => {
    if (!showForecast) {
      // Only fetch forecast data if we're about to show the forecast
      const payload = {
        location: searchQuery || "coventry", // Use the current search query or default to "coventry"
      };
      const payloadString = JSON.stringify(payload);
      // handleForecastForm(payloadString);
    }
    setShowForecast(!showForecast);
  };
  const getCoordinates = async (cityName) => {
    const apiKey = "YOUR_OPENCAGE_API_KEY";
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
      cityName
    )}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        return { lat, lng };
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
    return null;
  };

  // Check the login state on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    const savedUsername = localStorage.getItem("username"); // Retrieve username from localStorage
    setUsername(savedUsername);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setSignInForm(false);
    const savedUsername = localStorage.getItem("username");
    setUsername(savedUsername); // Set username on login
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.alert("Successfully Sign out");
  };

  const toggleShowFavourite = () => {
    setShowFavourite((prevShowFavourite) => !prevShowFavourite);
    handleFetchFavorites();
  };

  // Function to convert a string to Pascal case
  const toPascalCase = (str) => {
    return str
      .toLowerCase()
      .replace(/(^\w|-\w)/g, (match) => match.toUpperCase())
      .replace(/-/g, "");
  };
  let pascalCaseUsername;
  if (username !== null) {
    pascalCaseUsername = toPascalCase(username);
  }
  return (
    <>
      <div className="container_nav">
        <nav className="custom_nav">
          <div className="left">
            <form
              action=""
              className="custom_display"
              onSubmit={handleFormSubmit}
            >
              <input
                type="search"
                name="search"
                id="search"
                placeholder="Enter Your City"
                value={searchQuery}
                onChange={handleInputChange}
              />
              <input type="submit" value="Search" id="search-btn" />
            </form>
          </div>

          <div className="right">
            <div className="met-imp">
              <p
                className="user_icon"
                onClick={handleDefaultLocation}
                style={{ cursor: "pointer" }}
              >
                <IoNavigate color="black" size={25} />
              </p>
              {isLoggedIn && (
                <p
                  id="add-favorite"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => setShowAddFavoriteModal(true)}
                >
                  <span style={{ marginRight: "10px", cursor: "pointer" }}>
                    <FaHeart color="red" size={15} />
                  </span>
                  Add favourite
                </p>
              )}

              <div
                className="user-menu-container"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: "1rem",
                }}
              >
                {isLoggedIn && (
                  <p
                    id="show-favorites"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                    onClick={toggleShowFavourite}
                  >
                    <span style={{ marginRight: "10px", cursor: "pointer" }}>
                      <PiListHeartDuotone color="red" size={20} />
                    </span>
                    Show favourite
                  </p>
                )}

                {showFavourite && (
                  <div className="user-menu">
                    <ul className="custom_ul">
                      {favorites.length === 0 ? (
                        <li className="custom_li">Please Select City</li>
                      ) : (
                        favorites.map((favorite, index) => (
                          <li
                            key={index}
                            className="custom_li"
                            onClick={() => handleFavCityClick(favorite.city)}
                          >
                            {favorite.city}
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                )}
              </div>

              <div className="user-menu-container">
                <p
                  className="user_icon"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <FaUserCircle color="black" size={25} />
                </p>
                {showUserMenu && (
                  <div className="user-menu">
                    <ul className="custom_ul">
                      {!isLoggedIn && (
                        <>
                          <li
                            className="custom_li"
                            onClick={() => {
                              setRegisterForm(true);
                              setShowUserMenu(false);
                            }}
                          >
                            Register
                          </li>
                          <li
                            className="custom_li"
                            onClick={() => {
                              setSignInForm(true);
                              setShowUserMenu(false);
                            }}
                          >
                            Sign in
                          </li>
                        </>
                      )}
                      {isLoggedIn && (
                        <>
                          <li
                            className="custom_li"
                            onClick={() => {
                              handleLogout();
                              setShowUserMenu(false);
                            }}
                          >
                            Sign Out
                          </li>
                          <li
                            className="custom_li"
                            onClick={() => {
                              setChangePassword(true);
                              setShowUserMenu(false);
                            }}
                          >
                            Change Password
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      </div>

      <section id="main">
        <div className="container">
          <div className="details">
            {isLoggedIn && (
              <h1 className="custom_heading">
                Welcome {pascalCaseUsername}{" "}
                <FaRegSmileBeam color="red" size={25} />
              </h1>
            )}
            <div className="met-imp" style={{ marginBottom: "1.7rem" }}>
              <p
                id="metric"
                className={temperatureUnit === "C" ? "active" : ""}
                onClick={() => setTemperatureUnit("C")}
              >
                Metric: °C, m/s
              </p>
              <p
                id="imperial"
                className={temperatureUnit === "F" ? "active" : ""}
                onClick={() => setTemperatureUnit("F")}
              >
                Imperial: °F, mph
              </p>
            </div>

            {weather.length > 0 ? (
              weather.map((item, index) => {
                const cityname = item.name;
                const visibility = item.visibility;
                const countryname = item.sys.country;
                const icon = item.weather[0].icon;
                const description = item.weather[0].description;
                const temprature = Math.round(item.main.temp.toFixed(1));
                const feels_like = item.main.feels_like;
                const pressure = item.main.pressure;
                const humidity = item.main.humidity;
                const temp_max = Math.round(item.main.temp_max.toFixed(1));
                const temp_min = Math.round(item.main.temp_min.toFixed(1));
                const speed = item.wind.speed;
                const deg = item.wind.deg;
                return (
                  <div key={index}>
                    <div className="location">
                      <p id="date-time"></p>
                      <h1 id="city">{`${cityname} ${countryname}`}</h1>
                    </div>
                    <div className="weather">
                      <div
                        className="wthr"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <img
                          src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                          id="weather-icon"
                          alt="weather"
                        />
                        <h1 id="temp">{displayTemperature(temprature)}</h1>
                      </div>
                      <h2 id="desc" className="text_align">
                        {`Feels Like ${displayTemperature(
                          feels_like
                        )}. ${description}`}
                      </h2>
                      <div className="points">
                        <p id="wind">
                          <img
                            id="weather-arrow"
                            src="https://cdn-icons-png.flaticon.com/512/13/13934.png"
                            style={{
                              marginRight: "5px",
                              width: "5%",
                              transform: `rotate(${deg}deg)`,
                            }}
                          />
                          {`${displayWindSpeed(speed)} WNW`}
                        </p>
                        <p id="comp">
                          {" "}
                          <span style={{ marginRight: "7px" }}>
                            <FaRegCircle color="black" size={13} />
                          </span>
                          {`${pressure}hPa`}
                        </p>
                        <p id="humidity">{`Humidity: ${humidity}%`}</p>

                        <p id="min-temp">{`Min Temp: ${displayTemperature(
                          temp_min
                        )}`}</p>
                        <p id="max-temp">{`Max Temp: ${displayTemperature(
                          temp_max
                        )}`}</p>
                        <p id="visibility">{`Visibility: ${
                          visibility / 1000
                        }km`}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <h1 id="city">No Data Available</h1>
            )}
          </div>

          <div style={{ backgroundColor: "antiquewhite" }} className="map">
            {weather.length > 0 ? (
              weather.map((item, index) => {
                const cityname = item.name;
                return (
                  <div
                    key={index}
                    style={{ border: "0", height: "100%", width: "100%" }}
                  >
                    <iframe
                      src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyD0Frl1CeKBgwQbWnkO5-bMujMHNIMn9nQ&q=${cityname}&zoom=15`}
                      style={{ border: "0", height: "100%", width: "100%" }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                );
              })
            ) : (
              <h1 id="city">No Data Available</h1>
            )}
          </div>
        </div>
        <button
          className="btn"
          id="show-forcast"
          style={{ marginTop: "2%", marginLeft: "5%" }}
          onClick={toggleForecast}
        >
          {showForecast ? "Hide Forecast" : "Show Forecast"}
        </button>
      </section>
      {showForecast && (
        <section id="forecast" style={{ marginTop: "3rem" }}>
          <h1
            style={{
              textAlign: "center",
              color: "white",
              fontSize: "26px",
              paddingTop: "5%",
            }}
          >
            5 Days Forecast
          </h1>
          <p
            style={{
              textAlign: "center",
              color: "white",
              fontSize: "12px",
              marginBottom: "2rem",
            }}
          >
            *As per the weather at 9AM
          </p>
          <div id="container">
            {forecast.map((day, index) => (
              <div key={index} style={{ textAlign: "center" }}>
                <h5>{day.day}</h5>
                <img
                  src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                  alt="weather icon"
                />
                <h4>{displayTemperature(day.temp)}</h4>
                <p>{displayTemperature(day.temp_min)}</p>
              </div>
            ))}
          </div>
        </section>
      )}
      <AddCity
        isOpen={showAddFavoriteModal}
        onClose={() => setShowAddFavoriteModal(false)}
      />
      <ChangePassword
        isOpen={changePassword}
        onClose={() => setChangePassword(false)}
      />
      {registerForm && (
        <Register
          isOpen={registerForm}
          onClose={() => setRegisterForm(false)}
        />
      )}
      {signInForm && (
        <SignIN
          isOpen={signInForm}
          onClose={() => setSignInForm(false)}
          onLogin={handleLogin}
        />
      )}
    </>
  );
};

export default Home;
