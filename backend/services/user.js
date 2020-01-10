const passport = require("passport");
const jwt = require("jsonwebtoken");
const jwtOptions = require("../config/passport/passport");
const bcrypt = require("bcryptjs");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const BCRYPT_SALT_ROUNDS = 12;
var moment = require("moment");

jwtOptions.secretOrKey = "c0d3c4mp4";

module.exports = (app, db) => {
  app.post("/registerUser", (req, res, next) => {
    passport.authenticate("register", (err, user, info) => {
      if (err) {
        console.error(err);
      }
      if (info !== undefined) {
        console.error(info.message);
        res.status(403).send(info.message);
      } else {
        const data = {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          username: user.username,
          role: "user"
        };
        db.user
          .findOne({ where: { username: req.body.username } })
          .then(user => {
            user
              .update({
                firstname: data.firstname,
                lastname: data.lastname,
                role: data.role
              })
              .then(() => {
                res.status(200).send({ message: "user created" });
              })
              .catch(() => {
                res.status(400).send({ message: "cannot created user" });
              });
          })
          .catch(err => {
            res.status(400).send(err);
          });
      }
    })(req, res, next);
  });

  app.post("/registerAdmin", (req, res, next) => {
    passport.authenticate("register", (err, user, info) => {
      if (err) {
        console.error(err);
      }
      if (info !== undefined) {
        console.error(info.message);
        res.status(403).send(info.message);
      } else {
        const data = {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          username: user.username,
          role: "admin"
        };
        db.user
          .findOne({ where: { username: req.body.username } })
          .then(user => {
            user
              .update({
                firstname: data.firstname,
                lastname: data.lastname,
                role: data.role
              })
              .then(() => {
                res.status(200).send({ message: "user created" });
              })
              .catch(() => {
                res.status(400).send({ message: "cannot created user" });
              });
          })
          .catch(err => {
            res.status(400).send(err);
          });
      }
    })(req, res, next);
  });

  app.post("/loginUser", (req, res, next) => {
    passport.authenticate("login", (err, user, info) => {
      if (err) {
        console.error(err);
      }
      if (info !== undefined) {
        if (info.message === "username or password is incorrect.") {
          console.error(info.message);
          res.status(401).send({ message: info.message });
        } else {
          console.error(info.message);
          res.status(400).send(info.message);
        }
      } else {
        const token = jwt.sign(
          { id: user.id, role: user.role },
          jwtOptions.secretOrKey,
          { expiresIn: 20000000 }
        );
        res.status(200).send({
          auth: true,
          token,
          message: "user found & logged in"
        });
      }
    })(req, res, next);
  });

  app.put(
    "/change-password",
    passport.authenticate("jwt", { session: false }),
    async function(req, res) {
      // Lab 1
      var salt = bcrypt.genSaltSync(BCRYPT_SALT_ROUNDS);
      var hashedPassword = bcrypt.hashSync(req.body.newpassword, salt);
      // try {

      //   let result = await db.user.update(
      //     { password: hashedPassword },
      //     { where: { id: req.user.id } }
      //   );
      //   console.log(hashedPassword)
      //   res.status(201).send(result);
      // } catch (err) {
      //   res.status(400).send({ message: err.message });
      // }
      let password = await db.user.findOne({
        where: { id: req.user.id },
        attributes: ["password"]
      });
      if (!password) {
        res.status(400).send({ message: err.message });
      } else {
        let passwordValue = password.password;
        bcrypt.compare(
          req.body.oldpassword,
          passwordValue,
          async (err, result) => {
            if (result == true) {
              let ResultChangepassword = await db.user.update(
                { password: hashedPassword },
                { where: { id: req.user.id } }
              );
              if (!ResultChangepassword) {
                res.status(400).send({ message: err.message });
              } else {
                res.status(200).send(ResultChangepassword);
              }
            } else {
              res.status(400).send({ message: "old password is wrong" });
            }
          }
        );
      }
    }
  );

  app.get(
    "/userListToday",
    passport.authenticate("jwt", { session: false }),
    async function(req, res) {
      if (req.user.role == "admin") {
        try {
          let todayTime = moment().format('YYYY-MM-DD')

          let userList = await db.user.findAll({
            include: {
              model: db.account,
              include: {
                model: db.tranferring,
                where: Sequelize.where(
                  Sequelize.fn("date", Sequelize.col("updatedAt")),
                  "=",
                  todayTime.toString()
                )
              }
            }
          });
          res.status(200).send(userList);
        } catch (err) {
          res.status(400).send({ message: err.message });
        }
      } else {
        res.status(400).send({ message: "this role is for Admin" });
      }
    }
  );

  app.get(
    "/userList",
    passport.authenticate("jwt", { session: false }),
    async function(req, res) {
      if (req.user.role == "admin") {
        try {
          let userList = await db.user.findAll({
            include: {
              model: db.account,
              include: {
                model: db.tranferring
              }
            }
          });
          res.status(200).send(userList);
        } catch (err) {
          res.status(400).send({ message: err.message });
        }
      } else {
        res.status(400).send({ message: "this role is for Admin" });
      }
    }
  );
};
