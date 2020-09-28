const homeController = require("../app/http/controllers/home");
const authController = require("../app/http/controllers/auth");
const cartController = require("../app/http/controllers/customers/cart");
const guestMiddleware = require("../app/http/middlewares/guest");

module.exports = (app) => {
  app.get("/", homeController().index);

  app.get("/login", guestMiddleware, authController().login);
  app.post("/login", authController().postLogin);
  app.get("/register", guestMiddleware, authController().register);
  app.post("/register", authController().postRegister);
  app.post("/logout", authController().logout);

  app.get("/cart", cartController().index);
  app.post("/update-cart", cartController().update);
};
