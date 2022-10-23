const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = [];

// take user id and socket id from user
const addUser = (userId, socketId) => {
  if (!users.some((user) => user.userId === userId)) {
    users.push({ userId, socketId });
  }
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};
// remove a user from the array
const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};
io.on("connection", (socket) => {
  console.log("a user connected");
  console.log("-------------------------");
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });
  console.log(users);

  //send and get message
  socket.on("sendMessage", async ({ senderId, receiverId, text }) => {
    const user =  getUser(receiverId);
    if(user){
      io.to(user.socketId).emit("getMessage", {
        senderId,
        text,
      });
    }
    
  });

  // when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnect");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
