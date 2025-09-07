const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv").config();
const { connectToMongoDB } = require("./connection");
const urlRouter = require("./routes/url");
const { homeRouter } = require("./routes/home");
const UserRouter = require("./routes/user");
const { verifyToken } = require("./middlewares/auth");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", path.resolve("./view"));
connectToMongoDB(process.env.MONGODB_URL).then(() =>
  console.log("connected to MongoDb")
);

app.use("/user", UserRouter);
app.use("/url", verifyToken, urlRouter);
app.use("/", verifyToken, homeRouter);


app.listen(8000, () => console.log("server started at 8000"));
