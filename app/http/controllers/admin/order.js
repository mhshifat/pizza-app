const OrderModel = require("../../../models/order");
const moment = require("moment");
const order = require("../../../models/order");

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
  };
};
