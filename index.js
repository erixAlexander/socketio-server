require("dotenv").config();
const URL = process.env.FRONTEND;
const PORT = process.env.PORT;
const io = require("socket.io")(PORT, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://petmatchlove.netlify.app",
      `${URL}`,
    ],
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (receiverId) => {
  return users.find((user) => user.userId === receiverId);
};

io.on("connection", (socket) => {
  socket.on("addUserToSocketArray", (userId) => {
    addUser(userId, socket.id);
    socket.emit("usersSocketsArray", users);
  });

  socket.on("sendMessage", ({ userId, receiverId, message }) => {
    const user = getUser(receiverId);

    socket.to(user?.socketId).emit("newMessage", {
      userId,
      message,
      notification: true,
    });
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    // socket.emit("usersSocketsArray", users);
  });
});
