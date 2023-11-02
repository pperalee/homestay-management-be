const path = require("path");
const express = require("express");
const morgan = require("morgan");
const handlebars = require("express-handlebars");
const methodOverride = require("method-override");
const app = express();
const port = 3333;
var cors = require("cors");
const route = require("./routes");
const db = require("./config/db");
const socket = require("socket.io");

// Connect to db
db.connect();

// Template engine
app.engine(
  "hbs",
  handlebars({
    extname: ".hbs",
  })
);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources/views"));

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(morgan("combined"));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(methodOverride("_method"));

// Routes init
route(app);

// app.listen(port);
const server = app.listen(port, () => console.log(`Server started on ${port}`));
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (data) => {
    // console.log("adduser");
    // console.log(`${data.userid}-${data.chatuserid}`);
    // console.log({ sk: socket.id });
    onlineUsers.set(`${data.userid}-${data.chatuserid}`, socket.id);
  });
  // console.log({ online: global.onlineUsers });

  socket.on("sendmessage", (data) => {
    // console.log({ data });
    const toUserSocket = onlineUsers.get(`${data.to}-${data.from}`);
    if (toUserSocket) {
      socket.to(toUserSocket).emit("message", data);
    }
  });
});
