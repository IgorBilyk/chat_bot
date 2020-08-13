const express = require("express");
const app =     express();
const path =    require("path");
const http =    require("http").createServer(app);
//Socket.io
const io =      require("socket.io")(http);
const formatMessage = require("./public/utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./public/utils/users");
const users = require("./public/utils/users");

//Port variable
const port = 3000 || process.env.PORT;

//Set static folder
app.use(express.static(path.join(__dirname, "public")));

const chatbot = "Chatbot Cord";
//Connection to socket
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);
    //Message to user that connects
    socket.emit("message", formatMessage(chatbot, "Welcome to Chatbot"));

    //Nessage to all users
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(chatbot, `${user.username} has joined the chat`)
      );
    //Send user and room information
    io.to(user.room).emit("roomUsers", {
      room: users.room,
      users: getRoomUsers(user.room),
    });
  });

  //Listen for chat message
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  //Message when user disconects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(chatbot, `${user.username} has left the chat`)
      );
      //Send user and room information
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

//Start the server
http.listen(port, () => {
  console.log(`Server is runing on port ${port}`);
});
