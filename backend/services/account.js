const passport = require("passport");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
var moment = require('moment');

module.exports = (app, db) => {
  //Create account
  app.post(
    "/create-account",
    passport.authenticate("jwt", { session: false }),
    function(req, res) {
      db.account
        .create({
          accountNo: req.body.accountNo,
          accountType: "ออมทรัพท์",
          balance: 0,
          userid: req.body.id
        })
        .then(result => {
          res.status(201).send(result);
        })
        .catch(err => {
          res.status(400).send({ message: err.message });
        });
    }
  );

  app.post(
    "/addMoney",
    passport.authenticate("jwt", { session: false }),
    async function(req, res) {
      try {
        let accountAddto = await db.account.findOne({
          where: { accountNo: req.body.accountNo, userid: req.user.id } //account_transfer_to
        });
        let accountAddfrom = "ATMACCOUNT";
        let inputMoney = req.body.addmoney; //addmoney

        if (inputMoney <= 0) {
          res.status(400).send({ message: "should add money more than 0" });
        } else {
          let balanceNew =
            parseInt(accountAddto.balance) + parseInt(inputMoney);
          let accountAddtoUpdate = await accountAddto.update({
            balance: balanceNew
          });

          let updateStatement = await db.tranferring.create({
            type: "ฝาก",
            amount: inputMoney,
            // detail: req.body.detail,
            accountNo: req.body.accountNo,
            userid: req.user.id,
            from_to: accountAddfrom
          });
          res.status(200).send(updateStatement);
        }
      } catch (err) {
        res.status(400).send({ message: err.message });
      }
    }
  );

  app.delete(
    "/delete-account/:deleteaccount",
    passport.authenticate("jwt", { session: false }),
    async function(req, res) {
      try {
        let targetDelete = await db.account.findOne({
          where: { accountNo: req.params.deleteaccount, userid: req.user.id }
        });
        let targetDeleteUpdate = await targetDelete.destroy({});
        res.status(200).send("Delete success");
      } catch (err) {
        res.status(400).send({ message: err.message });
      }
    }
  );

  app.get(
    "/accountno-list-today",
    passport.authenticate("jwt", { session: false }),
    async function(req, res) {
      try {
        let todayTime = moment().format('YYYY-MM-DD')

        let accountList = await db.account.findAll({
          where: { userid: req.user.id },
          include: {
            model: db.tranferring,
            where: Sequelize.where(Sequelize.fn('date', Sequelize.col('updatedAt')), '=',todayTime.toString())

            // where: {
            //   updatedAt: {
            //     [Op.lt]: new Date(),
            //     [Op.gt]: new Date(new Date() - 24 * 60 * 60 * 1000)
            //   }
            // }
          }
        });
        res.status(200).send(accountList);
      } catch (err) {
        res.status(400).send({ message: err.message });
      }
    }
  );

  app.get(
    "/accountno-list",
    passport.authenticate("jwt", { session: false }),
    async function(req, res) {
      try {
        let accountList = await db.account.findAll({
          where: { userid: req.user.id },
          include: {
            model: db.tranferring
          }
        });
        res.status(200).send(accountList);
      } catch (err) {
        res.status(400).send({ message: err.message });
      }
    }
  );
};
