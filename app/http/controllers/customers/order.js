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
        await newOrder.save();
        req.flash("success", "Order placed successfully");
        delete req.session.cart;
        return res.redirect("/customer/orders");
      } catch (err) {
        req.flash("error", "Something went wrong, please try again later");
        return res.redirect("/cart");
      }
    },
  };
};
