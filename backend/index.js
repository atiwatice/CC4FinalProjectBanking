const express = require("express");
const app = express();
const cors = require("cors");

const bodyParser = require("body-parser");
const db = require("./models");

const accountService = require("./services/account");
const tranferringService = require("./services/tranferring");
const userService = require("./services/user");

// import passport && passportjwt module
const passport = require('passport')

//import config passport
require('./config/passport/passport')

// cors policy
app.use(cors());
// parse application/json
app.use(bodyParser.json());true
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

db.sequelize.sync({ alter: false }).then(() => {
  accountService(app, db);
  tranferringService(app, db);
  userService(app, db);

  app.listen(8080, () => {
    console.log("Server is running on port 8080");
  });
});
