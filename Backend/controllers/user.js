const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function isstringinvalid(string) {
  if (string == undefined || string.length === 0) {
    return true;
  } else {
    return false;
  }
}

exports.signup = async (req, res) => {
  console.log(`body ===>`, req.body);
  try {
    const { name, email, phonenumber, password } = req.body;
    if (
      isstringinvalid(name) ||
      isstringinvalid(email) ||
      isstringinvalid(phonenumber) ||
      isstringinvalid(password)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all fields" });
    }
    const alreadyUser = await User.findOne({ where: { email: email } });
    if (alreadyUser) {
      return res.status(400).json({
        success: false,
        message: `User: ${email} already existed, Please Login`,
      });
    }
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      try {
        const user = await User.create({
          name,
          email,
          phonenumber,
          password: hash,
        });

        res.status(200).json({ success: true, user });
      } catch (err) {
        console.log(err);
        return res.staus(400).json({ success: false, error: err });
      }
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: `Something went wrong !` });
  }
};

function generateAccessToken(id, name) {
  return jwt.sign({ userId: id, name: name }, "secretkey");
}

exports.login = async (req, res) => {
  console.log(`body ==>`, req.body);
  try {
    const { email, password } = req.body;
    if (isstringinvalid(email) || isstringinvalid(password)) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all fields" });
    }

    const user = await User.findAll({ where: { email: email } });
    console.log(`user ===>`, user);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: `User : ${email} doesn't exist` });
    }

    bcrypt.compare(password, user[0].password, (err, result) => {
      if (err) {
        console.log(err);
      }
      if (result === true) {
        const token = generateAccessToken(user[0].id, user[0].name);
        console.log(`token ===> ${token}`);
        return res.status(200).json({
          success: true,
          token: token,
          username: user[0].name,
          email: user[0].email,
          message: "Successfully logged in",
        });
      } else {
        return res
          .status(401)
          .json({ success: false, message: "Entered Wrong Password" });
      }
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};
