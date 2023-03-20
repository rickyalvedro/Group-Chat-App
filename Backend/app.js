const path = require("path");
const express = require("express");

const app = express();
var cors = require("cors");
const bodyParser = require("body-parser");

const dotenv = require("dotenv");
dotenv.config();

const sequelize = require("./util/database");

const User = require("./models/user");

const userRouter = require("./routes/user");

app.use(cors());
app.use(bodyParser.json());

app.use("/user", userRouter);

sequelize
  .sync({ force: true })
  .then(() => {
    console.log(`listening to the port = 3000`);
    app.listen(3000);
  })
  .catch((err) => console.log(err));
