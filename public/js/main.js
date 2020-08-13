/* const { listen } = require("socket.io"); */

//Select form
const chatForm =      document.querySelector("#chat-form");
const chatMessages =  document.querySelector(".chat-messages");
const usersAll =      document.querySelector("#users");
let color;

//Get username and room
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

//Bring socket io
const socket = io();

//Join the chatroom
socket.emit("joinRoom", { username, room });

//Send user color
socket.emit("color", color);

//Output message to Dom
socket.on("message", (msg) => {
  console.log(msg.username);
  outputMessage(msg);
  //Scroll to latest message
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on("roomUsers", ({ room, users }) => {
  //Output room name and list of users  into DOM
  outputRoom(users[0].room);
  outputUsers(users);
});
//Submit message
chatForm.addEventListener("submit", (event) => {
  event.preventDefault();

  //Get message from form
  let msg = event.target.elements.msg.value;

  //Emit mesage to server
  socket.emit("chatMessage", msg);

  //Clear value of input and focus on it
  event.target.elements.msg.value = " ";
});
setBackgroundColor = (min, max) => {
  //Set up background color for messages
  let minimum = 1;
  let maximum = 4;
  let result;

  result = Math.floor(Math.random() * (maximum - minimum + 1) + minimum);

  switch (result) {
    case 1:
      color = "bg-primary";
      break;
    case 2:
      color = "bg-secondary";
      break;
    case 3:
      color = "bg-success";
      break;
    case 4:
      color = "bg-info";
      break;
  }
  return color;
};
setBackgroundColor(1, 4);
//Message to DOM
outputMessage = (msg) => {
  let div = document.createElement("div");
  console.log(color);
  div.classList.add(`${color}`);
  div.innerHTML = `<p class='meta'>${msg.username}<span> ${msg.date} </span></p>
    <p class='text'>${msg.text}</p>`;
  chatMessages.appendChild(div);
};
//Output room to the DOM
outputRoom = (room) => {
  document.querySelector("#room-name").innerHTML = room;
};
outputUsers = (users) => {
  let allUsers = users.map((user) => user.username + "</br>");
  usersAll.innerHTML = allUsers.join("");
};
