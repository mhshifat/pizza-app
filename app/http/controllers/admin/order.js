const OrderModel = require("../../../models/order");
const moment = require("moment");

module.exports = () => {
  return {
    async orders(req, res) {
      const orders = await OrderModel.find(
        { status: { $ne: "completed" } },
        null,
        {
          sort: { createdAt: -1 },
        }
      )
        .populate("customerId", "-password")
        .exec();

      if (req.xhr) {
        return res.json(orders);
      }
      return res.render("admin/orders", {
        orders,
        moment,
      });
    },
    async updateStatus(req, res) {
      try {
        await OrderModel.updateOne(
          { _id: req.body.orderId },
          { status: req.body.status }
        );
        const eventEmitter = req.app.get("eventEmitter");
        eventEmitter.emit("orderUpdated", {
          id: req.body.orderId,
          status: req.body.status,
        });
        return res.redirect("/admin/orders");
      } catch (err) {
        return res.redirect("/admin/orders");
      }
    },
  };
};
