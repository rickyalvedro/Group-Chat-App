const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");
const token = localStorage.getItem("token");
const button = document.getElementById("send-btn");

let chatArray = [];
let lastMessageId;

const append = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add("message");
  messageElement.classList.add(position);
  messageContainer.appendChild(messageElement);
};

button.addEventListener("click", async (e) => {
  try {
    e.preventDefault();
    const message = document.getElementById("messageInp").value;
    console.log(message);
    const response = await axios.post(
      "http://localhost:3000/chat/sendMessage",
      { message: message },
      { headers: { Authorization: token } }
    );
    console.log(response);
    if (response.status === 200) {
      // console.log("message recieved");
      append(response.data.data.message, "right");
      messageInput.value = "";
    } else {
      throw new Error("Failed to recieve any message");
    }
  } catch (err) {
    console.log(JSON.stringify(err));
    document.body.innerHTML += `<div style='color:black;'>${err.message} </div>`;
  }
});

// setInterval(function () {
//   location.reload();
// }, 8000);

window.addEventListener("DOMContentLoaded", getDOMPage);
async function getDOMPage() {
  let message = JSON.parse(localStorage.getItem("messages"));

  if (message === null) {
    lastMessageId = 0;
  } else {
    lastMessageId = message[message.length - 1].id;
  }

  const response = await axios.get(
    `http://localhost:3000/chat/getMessage?lastMessageId=${lastMessageId}`,
    {
      headers: { Authorization: token },
    }
  );

  const backendArray = response.data.messages.map((ele) => ele.message);

  if (message) {
    chatArray = message.concat(backendArray);
  } else {
    chatArray = chatArray.concat(backendArray);
  }

  chatArray = chatArray.slice(chatArray.length - 10);

  const localStorageMessages = JSON.stringify(chatArray);
  localStorage.setItem("messages", localStorageMessages);
  console.log("Previous messages", response);
  console.log(`messages ==> `, JSON.parse(localStorage.getItem("messages")));

  chatArray.forEach((ele) => {
    if (ele.currentUser) {
      append(ele.message, "right");
    } else {
      append(ele.message, "left");
    }
  });

  // console.log(response);
}
