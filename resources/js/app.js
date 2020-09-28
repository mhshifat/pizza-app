import axios from "axios";
import Noty from "noty";
import initAdmin from "./admin";

const addToCartBtns = document.querySelectorAll(".add-to-cart");
const cartCounter = document.querySelector("#cartCounter");
const successAlertMsg = document.querySelector("#success-alert");

addToCartBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    let pizza = btn.dataset.pizza;
    pizza = pizza ? JSON.parse(pizza) : pizza;
    updateCart(pizza);
  });
});

function updateCart(pizza) {
  axios
    .post("/update-cart", pizza)
    .then((res) => {
      cartCounter.innerText = res.data.totalQty;
      new Noty({
        type: "success",
        timeout: 1000,
        progressBar: false,
        text: "Item added to cart",
      }).show();
    })
    .catch((err) => {
      new Noty({
        type: "error",
        timeout: 1000,
        progressBar: false,
        text: "Something went wrong, please try again later",
      }).show();
    });
}

if (successAlertMsg) {
  setTimeout(() => {
    successAlertMsg.remove();
  }, 2000);
}

initAdmin();
