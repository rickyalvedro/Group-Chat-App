const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");
const token = localStorage.getItem("token");
const button = document.getElementById("send-btn");

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

window.addEventListener("DOMContentLoaded", async () => {
  const response = await axios.get("http://localhost:3000/chat/getMessage", {
    headers: { Authorization: token },
  });
  console.log("Previous messages", response);
  response.data.messages.forEach((ele) => {
    append(ele.message, "right");
  });
  // console.log(response);
});
