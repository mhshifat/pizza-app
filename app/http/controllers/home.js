const MenuModel = require("../../models/menu");

module.exports = () => {
  return {
    async index(req, res) {
      const menus = await MenuModel.find({});

      return res.render("home", {
        pizzas: menus,
      });
    },
  };
};
