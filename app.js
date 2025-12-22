require("dotenv").config();

const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const { userRouter } = require("./src/routes/users/usersRoute");
const { categoryRouter } = require("./src/routes/category/categoryRoute");
const { shopRouter } = require("./src/routes/shop/shopRoute");
const { branchRouter } = require("./src/routes/branch/branchRoute");
const { dealRouter } = require("./src/routes/deal/dealRoute");
const { fileUploadRouter } = require("./src/routes/file-uploader/file-upload-route");
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
app.use("/category", categoryRouter);
app.use("/shop", shopRouter);
app.use("/deal", dealRouter);
app.use("/branch", branchRouter);
app.use("/uploader", fileUploadRouter);


// --- Static Files ---
const staticFilePath = path.join(__dirname, "uploads");
app.use("/uploads", express.static(staticFilePath));

// --- Server Start ---
const APP_PORT = process.env.APP_PORT;
const NODE_ENV = process.env.NODE_ENV || "development";

const server = app
  .listen(APP_PORT, () => {
    console.log(
      `🚀 Server running in ${NODE_ENV} mode at http://localhost:${APP_PORT}`
    );
  })
  .on("error", (err) => {
    console.error("Server failed to start:", err);
    process.exit(1);
  });

// Graceful shutdown for nodemon restarts
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});

// Development Scripts:
// npm run dev		- Run with nodemon in development mode (auto-reload)

// PM2 Production Scripts:
// npm run staging	- Run in staging environment with PM2
// npm start		- Run in production mode with PM2
// npm run restart	- Restart production app
// npm run restart:staging - Restart staging app
// npm run logs		- View PM2 logs in real time
// npm run stop		- Stop the PM2 app
// npm run delete		- Remove the app from PM2
