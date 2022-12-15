const Contenedor = require("../clase.js");
const express = require("express");
const passport = require("passport");
const Authenticated = require("../middlewares/middleware.js");
const { Router } = express;

const container = new Contenedor("productos");

const viewsApi = Router();

viewsApi.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/faillogin" }),
  (req, res) => {
    res.redirect("/");
  }
);

viewsApi.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/failregister" }),
  (req, res) => {
    res.redirect("/");
  }
);

viewsApi.get("/failregister", (req, res) => {
  res.render("partials/register-error", {});
});
viewsApi.get("/faillogin", (req, res) => {
  res.render("partials/login-error", {});
});
viewsApi.get("/register", (req, res) => {
  res.render("register");
});
viewsApi.get("/logout", (req, res) => {
  const { username } = req.user;
  req.logout(req.user, (err) => {
    if (err) return err;
    res.redirect("/");
  });
  res.render("logout", { username });
});

viewsApi.get("/login", Authenticated, (req, res) => {
  res.render("login");
});

viewsApi.get("/", Authenticated, (req, res) => {
  res.redirect("/login");
});

// viewsApi.get("/", (req, res) => {
//   if (req.session.count) {
//     req.session.count++;
//   } else {
//     req.session.count = 1;
//   }
//   if (!req.session.user) {
//     res.redirect("/login");
//   }
//   res.render("forms", { user: req.session.user });
// });

// viewsApi.get("/login", (req, res) => {
//   res.render("login", { user: req.session.user });
// });

// viewsApi.post("/login", (req, res) => {
//   const { usuario } = req.body;
//   req.session.user = usuario;
//   console.log(req.session);
//   res.redirect("/");
// });

// viewsApi.get("/logout", (req, res) => {
//   req.session.destroy();
//   res.redirect("/");
// });

viewsApi.post("/productos", async (req, res) => {
  const { title, price, thumbnail } = req.body;

  await container.save({ title, price, thumbnail });

  res.redirect("/");
});

viewsApi.get("/productos", async (req, res) => {
  const productos = await container.getAll();
  res.render("table", { products: productos });
});

module.exports = { viewsApi };
