const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const redis = require("redis");
const cors = require("cors");
const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
  REDIS_URL,
  REDIS_PORT,
  SESSION_SECRET,
} = require("./config/config");

const RedisStore = require("connect-redis").default;
let redisClient = redis.createClient({
  socket: {
    host: REDIS_URL,
    port: REDIS_PORT,
  },
});
// redisClient.connect().catch(console.error);

const app = express();
app.enable("trust proxy");
app.use(cors());
app.use(
  session({
    store: new RedisStore({ client: redisClient, prefix: "myApp:" }),
    secret: SESSION_SECRET,
    cookie: {
      secure: false,
      resave: false,
      saveUninitialized: false,
      httpOnly: true,
      maxAge: 60000,
    },
  })
);
app.use(express.json());

const connectWithRetry = () => {
  mongoose
    .connect(
      `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`
    )
    .then(() => console.log("database connect"))
    .catch((error) => {
      console.log(error);
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

app.get("/", (req, res) => {
  res.send("<h2>HIII</h>");
  console.log("running");
});

const postRouter = require("./routes/postRoutes");
app.use("/posts", postRouter);
const userRouter = require("./routes/userRoutes");
app.use("/users", userRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server on ${port}`));
