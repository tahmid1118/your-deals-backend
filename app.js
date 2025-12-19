require("dotenv").config();

const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const { userRouter } = require("./src/routes/users/usersRoute");
// --- Middleware ---
app.use(bodyParser.json());
app.use(morgan("combined"));
app.use(cors());

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
    parameterLimit: 10000,
  })
);
app.use(express.json({ limit: "10mb" }));

// --- Routes ---
app.use("/users", userRouter);


// --- Static Files ---
const staticFilePath = path.join(__dirname, "../uploads");
app.use("/uploads", express.static(staticFilePath));

// --- Server Start ---
const APP_PORT = process.env.APP_PORT || 4560; // Default to 4560 if not set
const NODE_ENV = process.env.NODE_ENV || "development";

app
  .listen(APP_PORT, () => {
    console.log(
      `🚀 Server running in ${NODE_ENV} mode at http://localhost:${APP_PORT}`
    );
  })
  .on("error", (err) => {
    console.error("Server failed to start:", err);
    process.exit(1);
  });

// npm run dev	- Run in development mode
// npm run staging	- Run in staging environment
// npm start	- Run in production mode
// npm run restart	- Restart production app
// npm run restart:dev - Restart dev app
// npm run logs	- View logs in real time
// npm run stop	- Stop the app
// npm run delete	- Remove the app from PM2
