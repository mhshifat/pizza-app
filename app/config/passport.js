const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;
const UserModel = require("../models/user");

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (email, password, done) => {
        try {
          const queryUser = await UserModel.findOne({ email });
          if (!queryUser)
            return done(null, false, { message: "No user with this email" });
          const passMatched = await bcrypt.compare(
            password,
            queryUser.password
          );
          if (!passMatched)
            return done(null, false, { message: "Wrong username or password" });
          return done(null, queryUser, { message: "Logged in successfully" });
        } catch (err) {
          return done(null, false, {
            message: "Something went wrong, please try again later",
          });
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser((userId, done) => {
    UserModel.findById(userId, (err, user) => {
      done(err, user);
    });
  });
};
