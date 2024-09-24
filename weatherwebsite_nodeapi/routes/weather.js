const Router = require("koa-router");

const axios = require("axios");

const router = new Router();

const fetchWeatherData = async (location) => {
  const response = await axios.get(
    "https://api.openweathermap.org/data/2.5/weather",
    {
      params: {
        q: location,
        appid: process.env.OPENWEATHER_API_KEY,
        units: "metric",
      },
    }
  );
  return response.data;
};

const fetchForecastData = async (location) => {
  const response = await axios.get(
    "https://api.openweathermap.org/data/2.5/forecast",
    {
      params: {
        q: location,
        appid: process.env.OPENWEATHER_API_KEY,
        units: "metric",
      },
    }
  );
  return response.data;
};

router.post("/weather", async (ctx) => {
  const { location } = ctx.request.body;
  const cachedData = await ctx.db("weather_cache").where({ location }).first();

  if (cachedData && new Date() - new Date(cachedData.timestamp) < 3600000) {
    ctx.body = cachedData.data;
  } else {
    try {
      const weatherData = await fetchWeatherData(location);
      if (cachedData) {
        await ctx
          .db("weather_cache")
          .where({ location })
          .update({
            data: JSON.stringify(weatherData),
            timestamp: new Date(),
          });
      } else {
        await ctx.db("weather_cache").insert({
          location,
          data: JSON.stringify(weatherData),
        });
      }
      ctx.body = weatherData;
    } catch (error) {
      ctx.status = error.response.status;
      ctx.body = error.response.data;
    }
  }
});

router.post("/forecast", async (ctx) => {
  const { location } = ctx.request.body;
  const cachedData = await ctx.db("forecast_cache").where({ location }).first();

  if (cachedData && new Date() - new Date(cachedData.timestamp) < 3600000) {
    ctx.body = cachedData.data;
  } else {
    try {
      function extractDailyForecastAtNine(apiResponse) {
        const nineAMForecast = apiResponse?.list.filter((entry) =>
          entry.dt_txt.includes("09:00:00")
        );

        return {
          ...apiResponse,
          list: nineAMForecast,
        };
      }
      const data = await fetchForecastData(location);
      const forecastData = extractDailyForecastAtNine(data);
      if (cachedData) {
        await ctx
          .db("forecast_cache")
          .where({ location })
          .update({
            data: JSON.stringify(forecastData),
            timestamp: new Date(),
          });
      } else {
        await ctx.db("forecast_cache").insert({
          location,
          data: JSON.stringify(forecastData),
        });
      }
      ctx.body = forecastData;
    } catch (error) {
      ctx.status = error.response.status;
      ctx.body = error.response.data;
    }
  }
});

module.exports = router;
