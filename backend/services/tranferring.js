const passport = require("passport");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

module.exports = (app, db) => {
  app.post(
    "/payment",
    passport.authenticate("jwt", { session: false }),
    async function(req, res) {
      try {
        let accountPayfrom = await db.account.findOne({
          where: { accountNo: req.body.accountNo, userid: req.user.id }
        });
        let accountPayTo = `${req.body.payment} ref no.${req.body.refno}`;
        let paymentMoney = parseInt(req.body.paymentMoney);
        let balance = parseInt(accountPayfrom.balance);
        if (paymentMoney > balance) {
          res.status(401).send({ message: "money is not enough" });
        } else {
          let balanceNew = balance - paymentMoney;

          let accountPayfromUpdate = await accountPayfrom.update({
            balance: balanceNew
          });

          let updateStatement = await db.tranferring.create({
            type: "จ่ายเงิน",
            amount: paymentMoney,
            detail: req.body.detail,
            accountNo: req.body.accountNo,
            userid: req.user.id,
            from_to: accountPayTo
          });
          res.status(200).send(updateStatement);
        }
      } catch (err) {
        res.status(400).send({ message: err.message });
      }
    }
  );

  app.post(
    "/tranferTo",
    passport.authenticate("jwt", { session: false }),
    async function(req, res) {
      try {
        let accountTransferTo = await db.account.findOne({
          where: { accountNo: req.body.transferTo }
        });

        if (!accountTransferTo) {
          let accountTransferFrom = await db.account.findOne({
            where: { accountNo: req.body.accountNo, userid: req.user.id }
          });
          let accountPayTo = req.body.transferTo;
          let transferMoney = parseInt(req.body.transferMoney);
          let balance = parseInt(accountTransferFrom.balance);
          if (transferMoney > balance) {
            res.status(401).send({ message: "money is not enough" });
          } else {
            let balanceNew = balance - transferMoney;

            let accountTransferFromUpdate = await accountTransferFrom.update({
              balance: balanceNew
            });

            let updateStatement = await db.tranferring.create({
              type: "โอนเงิน",
              amount: transferMoney,

              accountNo: req.body.accountNo,
              userid: req.user.id,
              from_to: accountPayTo
            });
            res.status(200).send(updateStatement);
          }
        } else {
          let accountTransferFrom = await db.account.findOne({
            where: { accountNo: req.body.accountNo, userid: req.user.id }
          });
          let accountPayTo = req.body.transferTo;
          let transferMoney = parseInt(req.body.transferMoney);

          let balance = parseInt(accountTransferFrom.balance);
          if (transferMoney > balance) {
            res.status(401).send({ message: "money is not enough" });
          } else {
            let balanceNew = balance - transferMoney;
            let balanceNewTo =
              parseInt(accountTransferTo.balance) + transferMoney;
            let accountTranferToUpdate = await accountTransferTo.update({
              balance: balanceNewTo
            });

            let accountTransferFromUpdate = await accountTransferFrom.update({
              balance: balanceNew
            });

            let updateStatement = await db.tranferring.create({
              type: "โอนเงิน",
              amount: transferMoney,
              detail: '',
              accountNo: req.body.accountNo,
              userid: req.user.id,
              from_to: accountPayTo
            });
            
            let updateStatementGetMoney = await db.tranferring.create({
              type: "ได้รับเงินจากการโอน",
              amount: transferMoney,
              detail: '',
              accountNo: accountPayTo,
              userid: req.user.id,
              from_to: req.body.accountNo
            });
            res.status(200).send(updateStatementGetMoney)

          }
        }
      } catch (err) {
        res.status(400).send({ message: err.message });
      }
    }
  );
};
