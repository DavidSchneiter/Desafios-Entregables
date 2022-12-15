const express = require("express");
const { engine } = require("express-handlebars");
const { routerApi } = require("./router/productsRouter.js");
const { viewsApi } = require("./router/viewsRouter.js");
const strategy = require("./passport/strategy");

const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const User = require("./models/User.js");
const { default: mongoose } = require("mongoose");
const advancedOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const MONGO_DB_URI =
  "mongodb+srv://David28:Capocha98@cluster0.m3mu3cy.mongodb.net/test";

const app = express();

PORT = 8080;

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: MONGO_DB_URI,
      advancedOptions,
      ttl: 10,
      collectionName: "session",
      autoRemove: "native",
    }),
    secret: "foo-secret",
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
app.set("views", "../views");

app.use("/api/productos", routerApi);
app.use("/", viewsApi);

const server = app.listen(PORT, async () => {
  console.log(`Servidor de exprees ejecutandose en el puerto ${PORT}`);
  try {
    await mongoose.connect(MONGO_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Mongo Connect");
  } catch (err) {
    console.log("Error" + err);
  }
});

server.on("error", (error) => console.log(`Erorr en el servidor ${error}`));
