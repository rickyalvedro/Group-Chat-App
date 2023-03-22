const form = document.getElementById("send-container");
const token = localStorage.getItem("token");

form.addEventListener("click", async (e) => {
  try {
    e.preventDefault();
    const message = e.target.messageInp.value;
    const response = await axios.post(
      "http://localhost:3000/chat/sendMessage",
      { message: message },
      { headers: { Authorization: "token" } }
    );
    console.log(response);
    if (response.status === 200) {
      console.log("message recieved");
    } else {
      throw new Error("Failed to recieve any message");
    }
  } catch (err) {
    console.log(JSON.stringify(err));
    document.body.innerHTML += `<div style='color:red;'>${err.message} </div>`;
  }
});
