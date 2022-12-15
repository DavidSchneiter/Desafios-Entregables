const bcrypt = require("bcrypt");
const User = require("../models/User");

const validatePassword = (user, password) => {
  return bcrypt.compareSync(password, user.password);
};

let createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

const login = (req, username, password, cb) => {
  User.findOne({ username: username }, (err, user) => {
    if (err) return cb(err);
    if (!user) {
      console.log("User Not Found with username " + username);
      return cb(null, false);
    }
    if (!validatePassword(user, password)) {
      console.log("Invalid Password");
      return cb(null, false);
    }
    return cb(null, user);
  });
};

const register = (req, username, password, cb) => {
  User.findOne({ username: username }, function (err, user) {
    if (err) {
      console.log("Error in SignUp: " + err);
      return cb(err);
    }
    if (user) {
      console.log("User already exists");
      return cb(null, false);
    } else {
      const newUser = new User();
      newUser.username = username;
      newUser.password = createHash(password);
      newUser
        .save()
        .then((datos) => cb(null, datos))
        .catch(null, false);
    }
  });
};

// const register = (req, username, password, cb) => {
//   const findOrCreateuser = () => {
//     User.findOne({ username: username }, (err, user) => {
//       if (err) {
//         console.log("Error creating" + err);
//         return cb(err);
//       }
//       if (user) {
//         console.log("User existent");
//         return cb(null, false);
//       } else {
//         let newUser = new User();
//         newUser.username = username;
//         newUser.password = createHash(password);
//         //   newUser.save().then(datos=> cb(null, datos)).catch(null, false)
//         newUser.save((err) => {
//           if (err) {
//             console.log("Error saving:" + err);
//             throw err;
//           }
//           console.log("User registration successfully");
//           return cb(null, newUser);
//         });
//       }
//     });
//   };
//   process.nextTick(findOrCreateuser);
// };

module.exports = { login, register };
