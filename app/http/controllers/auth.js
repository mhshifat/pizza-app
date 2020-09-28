const bcrypt = require("bcryptjs");
const passport = require("passport");
const UserModel = require("../../models/user");

module.exports = () => {
  return {
    login(req, res) {
      res.render("auth/login");
    },
    postLogin(req, res, next) {
      passport.authenticate("local", (err, user, info) => {
        if (err) {
          req.flash("error", info.message);
          return next(err);
        }
        if (!user) {
          req.flash("error", info.message);
          return res.redirect("/login");
        }
        return req.login(user, (err) => {
          if (err) {
            req.flash("error", info.message);
            return next(err);
          }

          return res.redirect("/");
        });
      })(req, res, next);
    },
    register(req, res) {
      res.render("auth/register");
    },
    async postRegister(req, res) {
      try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
          req.flash("error", "All fields are required");
          req.flash("name", name);
          req.flash("email", email);
          return res.redirect("/register");
        }
        const queryUser = await UserModel.exists({ email });
        if (queryUser) {
          req.flash("error", "User already exist");
          req.flash("name", name);
          req.flash("email", email);
          return res.redirect("/register");
        }
        const hashPass = await bcrypt.hash(password, 10);
        const newUser = new UserModel({ name, email, password: hashPass });
        await newUser.save();
        // Login...
        return res.redirect("/");
      } catch (err) {
        req.flash("error", "Something went wrong, please try again later");
        return res.redirect("/register");
      }
    },
    logout(req, res) {
      req.logout();
      return res.redirect("/login");
    },
  };
};
