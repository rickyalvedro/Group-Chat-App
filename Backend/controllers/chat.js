const Chat = require("../models/chat");
const User = require("../models/user");

exports.sendMessage = async (req, res) => {
  try {
    // console.log("User name---->", req.user.name);
    // console.log(req.user);
    // console.log(req.body);
    const { message } = req.body;
    if (!message) {
      return res
        .status(400)
        .json({ success: false, message: "Nothing entered !" });
    }
    const data = await req.user.createChat({ message: message });
    // console.log(data);
    data.dataValues.name = req.user.name;
    return res.status(200).json({ success: true, data: data });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ success: false, error: err });
  }
};

exports.getMessage = async (req, res, next) => {
  try {
    // const message = await req.user.getChats();
    const msgId = req.query.lastMessageId;
    const messages = await Chat.findAll({ include: ["user"] });
    console.log(messages);
    const { email } = req.user;

    let index = 0;

    if (msgId) {
      messages.forEach((chat) => {
        if (chat.id === msgId) {
          index = msgId;
        }
      });
    }
    console.log("Message Index ==>", msgId);
    messasges = messages.slice(index);

    console.log("Message length ===>", messages.length);
    const data = messages.map((chat) => {
      let currentUser;
      if (chat.user.email === email) {
        currentUser = "Same User";
      }
      return {
        message: chat.message,
        name: chat.user.name,
        createdAt: chat.createdAt,
        currentUser: currentUser,
        id: chat.id,
      };
    });
    console.log(`data====>`, data);
    return res.status(200).json({ messages: data, success: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: err, success: false });
  }
};
