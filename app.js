var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
var users = {};
var rooms = {};
var problem = {
  result: 0,
  data: {
    competitionId: 102,
    "examinationList|10": [
      {
        result: 0,
        examid: 18,
        "examinationAnswerList|4": [
          {
            answerid: 139,
            isRight: 1,
            examid: 18,
            description: "心、肝、脾、肺、肾",
          },
        ],
        title: "五脏包含：",
        systemTime: 1589182862604,
      },
    ],
    userAnswerLogList: [],
    adversary: {
      unionid: "okNEowIef20TMgUA8X-0_PKED5M0",
      createTime: 1588740103000,
      openid: "olkVH1RIDoC4pohb_d7Jf7tQzsIk",
      nickname: "SWMMMM",
      totalscore: 0,
      updateTime: 1588740103000,
      avatar: "http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJNsZmIvQq7sZyq0u0G7aDpIgHpg80W6loeTqbM3Ys1vsxTgkGjpTm8ue9qkM9lEhAnjZJQGL4h2A/132",
      id: "f9287f9568954c7d96d2484a7fcd30b0",
      hasBindtyj: 0,
      coin: 1000,
      status: 0,
    },
    myTotal: 0,
  },
  description: "操作成功",
  systemTime: 1589182862644,
};
io.of("/pk").on("connection", (socket) => {
  // 加入服务大厅
  socket.join("public");
  // 1.进行匹配
  socket.on("join", function (user) {
    console.log("用户加入：", user);
    user.room = "public";
    //保存用户信息
    users[user.id] = user;
    socket.emit("join", { status: 0 });
    var room = match();
    if (!!room) {
      // 有对战房间
      console.log("有对战房间：", room);
      var u = users[user.id];
      socket.leave(u.room);
      socket.join(room);
      u.status = 2;
      u.room = room;
      rooms[room].player2 = u;
      socket.in(room).emit("join", {
        status: 1,
        room: room,
      });
      socket.emit("join", {
        status: 1,
        room: room,
      });
    } else {
      // 无对战房间，自己创建
      var u = users[user.id];
      socket.leave(u.room);
      socket.join(u.id);
      rooms[u.id] = { roomname: u.id, player1: u, player2: null };
      console.log("所有房间：", rooms);
    }
  });
  // 2.开始比赛
  socket.on("begin", function (data) {
    if (data.status == 1) {
      socket.emit("begin", problem);
    }
  });
});
// 匹配对手
function match() {
  for (var key in rooms) {
    if (rooms[key] && rooms[key].play2 == null) {
      return key;
    }
  }
  return null;
}
// 获取所有用户
function getUsers() {
  var arr = [];
  for (var key in users) {
    arr.push(users[key]);
  }
  return arr;
}
// 获取所有房间
function getRooms() {
  var arr = [];
  for (var key in rooms) {
    arr.push(rooms[key]);
  }
  return arr;
}
http.listen(3000, () => {
  console.log("listening on http://localhost:3000");
});
