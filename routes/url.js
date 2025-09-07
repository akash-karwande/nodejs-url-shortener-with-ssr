const express = require("express");
const {
  handleGenerateShortUrl,
  handleRedirectToUrl,
  handleGetAnalytics,
} = require("../controllers/url");

const router = express.Router();

router.post("/", handleGenerateShortUrl);

router.get("/:shortId", handleRedirectToUrl);

router.get("/analytics/:shortId", handleGetAnalytics);

module.exports = router
