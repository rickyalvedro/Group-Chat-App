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
      return res
        .status(400)
        .json({ success: false, message: `User: ${email} already existed` });
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
        return res.status(200).json({ success: true, user });
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

exports.generateAccessToken = (id, name, ispremiumuser) => {
  return jwt.sign({ userId: id, name: name, ispremiumuser }, "secretkey");
};
