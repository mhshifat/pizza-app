const homeController = require("../app/http/controllers/home");
const authController = require("../app/http/controllers/auth");
const cartController = require("../app/http/controllers/customers/cart");
const orderController = require("../app/http/controllers/customers/order");
const adminOrderController = require("../app/http/controllers/admin/order");
const guestMiddleware = require("../app/http/middlewares/guest");
const authMiddleware = require("../app/http/middlewares/auth");
const adminMiddleware = require("../app/http/middlewares/admin");

module.exports = (app) => {
  app.get("/", homeController().index);

  app.get("/login", guestMiddleware, authController().login);
  app.post("/login", authController().postLogin);
  app.get("/register", guestMiddleware, authController().register);
  app.post("/register", authController().postRegister);
  app.post("/logout", authController().logout);

  app.get("/cart", cartController().index);
  app.post("/update-cart", cartController().update);

  app.get("/customer/orders", authMiddleware, orderController().index);
  app.get("/customer/orders/:id", authMiddleware, orderController().show);
  app.post("/orders", authMiddleware, orderController().store);

  app.get("/admin/orders", adminMiddleware, adminOrderController().orders);
  app.post(
    "/admin/order/status",
    adminMiddleware,
    adminOrderController().updateStatus
  );
};
