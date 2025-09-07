const express = require("express");
const { handleCreateNewUser, handleLoginUser } = require("../controllers/user");

const router = express.Router();

router.post("/signup", handleCreateNewUser);

router.post("/login", handleLoginUser);

router.get("/signup", (req, res) => {
  if (req.cookies.token) {
    return res.redirect("/");
  } else {
    return res.render("signup", {msg:''});
  }
});

router.get("/login", (req, res) => {
  if (req.cookies.token) {
    return res.redirect("/");
  } else {
    return res.render("login", {msg: ''});
  }
});

module.exports = router;
