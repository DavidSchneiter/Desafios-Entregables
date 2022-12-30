const express = require("express");
const { engine } = require("express-handlebars");
const { viewsApi } = require("./src/router/viewsRouter.js");
const { routerApi } = require("./src/router/productsRouter.js");
const randomApi = require("./src/router/randomRouter.js");
const infoApi = require("./src/router/infoRouter.js");
const strategy = require("./src/passport/strategy");
require("dotenv").config();

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
const User = require("./src/models/User.js");
const { default: mongoose } = require("mongoose");
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

// if (cluster.isPrimary) {
//   const lengthCpu = cpus.length;
//   for (let index = 0; index < lengthCpu; index++) {
//     cluster.fork();
//   }
// } else {
//   const server = app.listen(PORT, async () => {
//     console.log(
//       `Servidor de exprees ejecutandose en el puerto (${PORT}) - PID (${process.pid})`
//     );
//     // console.log(args);
//     try {
//       await mongoose.connect(process.env.MONGO_DB_URI, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       });
//       // console.log("Mongo Connect");
//     } catch (err) {
//       console.log("Error" + err);
//     }
//   });

//   server.on("error", (error) => console.log(`Erorr en el servidor ${error}`));
// }

const server = app.listen(PORT, async () => {
  console.log(`Servidor de exprees ejecutandose en el puerto ${PORT}`);
  console.log(args);
  try {
    await mongoose.connect(process.env.MONGO_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Mongo Connect");
  } catch (err) {
    console.log("Error" + err);
  }
});

server.on("error", (error) => console.log(`Erorr en el servidor ${error}`));
