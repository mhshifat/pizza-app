const homeController = require("../app/http/controllers/home");
const authController = require("../app/http/controllers/auth");
const cartController = require("../app/http/controllers/customers/cart");

module.exports = (app) => {
  app.get("/", homeController().index);

  app.get("/login", authController().login);
  app.get("/register", authController().register);

  app.get("/cart", cartController().index);
  app.post("/update-cart", cartController().update);
};
