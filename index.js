import axios from "axios";
import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const GEO_API_URL = "http://api.openweathermap.org/geo/1.0/direct";
const appKey = "d0acf8a9954e244b947fab8044d4acd3";
const WEATHER_API_URL = "http://api.openweathermap.org/data/2.5/weather";

const config = {
  headers: { appid: appKey },
};

let data;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs", { weatherData: data });
});

app.post("/submit", async (req, res) => {
  const cityName = req.body.city;
  try {
    const latLonResult = await axios.get(GEO_API_URL, {
      params: {
        q: cityName,
        limit: "5",
        appid: appKey,
      },
    });
    const lat = latLonResult.data[0].lat;
    const lon = latLonResult.data[0].lon;

    const weatherResult = await axios.get(WEATHER_API_URL, {
      params: {
        lat: lat,
        lon: lon,
        appid: appKey,
        units: "metric",
      },
    });

    data = {
      description: weatherResult.data.weather[0].description,
      temp: Math.floor(weatherResult.data.main.temp),
      feelLike: Math.floor(weatherResult.data.main.feels_like),
      humidity: weatherResult.data.main.humidity,
      windSpeed: weatherResult.data.wind.speed,
      name: weatherResult.data.name,
    };

    res.redirect("/");
  } catch (error) {
    console.log(error.response.data);
  }
});

app.listen(port, () => {
  console.log(`Server Listening at port: ${port}`);
});

function fahrenheitToCelsius(fahrenheit) {
  return ((fahrenheit - 32) * 5) / 9;
}
