
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(express.json({ limit: "10kb" }));

app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || "*"
}));

app.use("/api", rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30
}));

function validateInstagramUrl(value) {
  try {
    const url = new URL(value);

    const validHost = [
      "instagram.com",
      "www.instagram.com"
    ].includes(url.hostname.toLowerCase());

    const validPath =
      /^\/(p|reel|tv)\/[A-Za-z0-9_-]+\/?$/.test(url.pathname);

    return url.protocol === "https:" &&
      validHost && validPath &&
      !url.username && !url.password;
  } catch {
    return false;
  }
}

app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    website: "Mr Black Sreeju Insta V Downloader",
    creator: "Sreeju"
  });
});

app.post("/api/resolve", (req, res) => {
  const { url } = req.body || {};

  if (typeof url !== "string" ||
      !validateInstagramUrl(url)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Instagram URL"
    });
  }

  res.status(501).json({
    success: false,
    message: "Authorized media API connection is required."
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Mr Black Sreeju Backend is running!");
});
