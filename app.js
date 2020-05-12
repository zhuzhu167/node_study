var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.of("/pk").on("connection", (socket) => {
  socket.join("room");
  // 拦截器
  socket.use((packet, next) => {
    // if (packet.doge === true) return next();
    // next(new Error('Not a doge error'));
    // console.log(packet);
  });
  socket.on("beforeMatch", (id, msg) => {
    //通知所有用户状态信息
    socket.to(id).emit("my message", msg);
  });
});

http.listen(3000, () => {
  console.log("listening on *:3000");
});
