const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.set("trust proxy", 1);
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");

require("dotenv").config();
require("./config/dbConfig");

const PORT = process.env.PORT;

const movieRoutes = require("./routes/movieRoutes");
const theatreRoutes = require("./routes/theatreRoutes");
const userRoutes = require("./routes/userRoutes");
const showRoutes = require("./routes/showRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
  message:
    "Too many requests from this IP. Please try again after some time",
});

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "x-access-token", "Authorization"],
  })
);

app.use(apiLimiter);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(mongoSanitize());

movieRoutes(app);
theatreRoutes(app);
userRoutes(app);
showRoutes(app);
bookingRoutes(app);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\nServer is running successfully in: ${PORT}`);
  });
}

module.exports = app;



