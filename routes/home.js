const express = require("express");
const { handleHomeGetAllURL } = require("../controllers/home");

const homeRouter = express.Router();

homeRouter.get('', handleHomeGetAllURL);

module.exports = {
    homeRouter
}