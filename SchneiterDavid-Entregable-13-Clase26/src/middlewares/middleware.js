const Authenticated = (req, res, next) => {
  if (req.isAuthenticated())
    return res.render("forms", { username: req.user.username });
  next();
};
module.exports = Authenticated;
