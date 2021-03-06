require("dotenv").config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("express-flash");
const expressLayouts = require("express-ejs-layouts");
const passport = require("passport");
const Emitter = require("events");
const MongoStore = require("connect-mongo")(session);
const initRoutes = require("./routes/web");
const initPassport = require("./app/config/passport");

// Database connection
const url = process.env.MONGODB_URI || "";
mongoose.connect(url, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
});
const connection = mongoose.connection;
connection
  .once("open", () => {
    console.log("Database connected...");
  })
  .catch((err) => {
    console.log("Connection failed...");
  });

const app = express();
const PORT = process.env.PORT || "5000";
const mongoStore = new MongoStore({
  mongooseConnection: connection,
  collection: "sessions",
});
const eventEmitter = new Emitter();

app.use(
  session({
    secret: process.env.COOKIE_SECRET || "",
    resave: false,
    saveUninitialized: false,
    store: mongoStore,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
app.use(flash());
app.use(expressLayouts);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
// Assets...
app.use(express.static("public"));
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.user = req.user;
  next();
});
// Set Template Engine...
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./resources/views"));
app.set("eventEmitter", eventEmitter);
// Routes
initRoutes(app);
// Passport
initPassport(passport);

const server = app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

const io = require("socket.io")(server);

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("join", (orderId) => {
    socket.join(orderId);
  });
});

eventEmitter.on("orderUpdated", (data) => {
  io.to(`order_${data.id}`).emit("orderUpdated", data);
});

eventEmitter.on("orderPlaced", (data) => {
  io.to("adminRoom").emit("orderPlaced", data);
});
