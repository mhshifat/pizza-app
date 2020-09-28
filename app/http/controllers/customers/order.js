const moment = require("moment");
const OrderModel = require("../../../models/order");

module.exports = () => {
  return {
    async index(req, res) {
      const orders = await OrderModel.find({ customerId: req.user._id }, null, {
        sort: { createdAt: -1 },
      });
      res.header(
        "Cache-Control",
        "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
      );
      return res.render("customers/orders", { orders, moment });
    },
    async store(req, res) {
      try {
        const { phone, address } = req.body;
        if (!phone || !address) {
          req.flash("error", "All fields are required");
          return res.redirect("/cart");
        }
        const newOrder = new OrderModel({
          customerId: req.user._id,
          items: req.session.cart.items,
          phone,
          address,
        });
        const order = await newOrder.save();
        req.flash("success", "Order placed successfully");
        delete req.session.cart;
        const eventEmitter = req.app.get("eventEmitter");
        OrderModel.populate(order, { path: "customerId" }, (err, result) => {
          eventEmitter.emit("orderPlaced", result);
        });
        return res.redirect("/customer/orders");
      } catch (err) {
        req.flash("error", "Something went wrong, please try again later");
        return res.redirect("/cart");
      }
    },
    async show(req, res) {
      try {
        if (req.params.id === "favicon.ico") delete req.params.id;
        const order = await OrderModel.findById(req.params.id);
        if (String(req.user._id) === String(order.customerId)) {
          return res.render("customers/order", { order });
        }
        return res.redirect("/");
      } catch (err) {
        return res.redirect("/");
      }
    },
  };
};
