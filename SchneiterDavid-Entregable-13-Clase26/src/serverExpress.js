const express = require("express");
const { engine } = require("express-handlebars");
const { viewsApi } = require("./router/viewsRouter");
const { routerApi } = require("./router/productsRouter.js");
const randomApi = require("./router/randomRouter.js");
const infoApi = require("./router/infoRouter.js");
const strategy = require("./passport/strategy");
require("dotenv").config();

const logger = require("./utils/logger");

const cluster = require("cluster");
const cpus = require("os").cpus();

const yargs = require("yargs")(process.argv.slice(2));
const args = yargs
  .alias({
    p: "port",
    m: "modo",
  })
  .default({ modo: "fork" }).argv;

const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const User = require("./models/User.js");
const { default: mongoose } = require("mongoose");
const { response } = require("express");
mongoose.set("strictQuery", true);
const advancedOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const app = express();

PORT = args.port || 8080;

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_DB_URI,
      advancedOptions,
      ttl: 10,
      collectionName: "session",
      autoRemove: "native",
    }),
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 3600 * 24 * 60,
    },
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  "login",
  new localStrategy({ passReqToCallback: true }, strategy.login)
);

passport.use(
  "register",
  new localStrategy({ passReqToCallback: true }, strategy.register)
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "main.hbs",
  })
);

app.set("view engine", "hbs");
app.set("views", "./views");

app.use("/", viewsApi);
app.use("/api/productos", routerApi);
app.use("/api/random", randomApi);
app.use("/info", infoApi);
app.use((req, res, next) => {
  if (res.status(404)) {
    logger.warn(`Page not found, Url:  ${req.url}, metodo: ${req.method}`);
  }

  next();
});

if (args.modo == "CLUSTER" && cluster.isPrimary) {
  const lengthCpu = cpus.length;
  for (let index = 0; index < lengthCpu; index++) {
    cluster.fork();
  }
} else {
  const server = app.listen(PORT, async () => {
    logger.info(`Servidor de exprees ejecutandose en el puerto ${PORT}`);
    try {
      await mongoose.connect(process.env.MONGO_DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      logger.info("Mongo Connect");
    } catch (err) {
      logger.error("Error" + err);
    }
  });

  server.on("error", (error) => logger.error(`Erorr en el servidor ${error}`));
}

// const server = app.listen(PORT, async () => {
//   logger.info(`Servidor de exprees ejecutandose en el puerto ${PORT}`);
//   try {
//     await mongoose.connect(process.env.MONGO_DB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     logger.info("Mongo Connect");
//   } catch (err) {
//     logger.error("Error" + err);
//   }
// });

// server.on("error", (error) => logger.error(`Erorr en el servidor ${error}`));
