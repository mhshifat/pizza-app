import axios from "axios";
import moment from "moment";
import Noty from "noty";
import order from "../../app/models/order";
import initAdmin from "./admin";

const addToCartBtns = document.querySelectorAll(".add-to-cart");
const cartCounter = document.querySelector("#cartCounter");
const successAlertMsg = document.querySelector("#success-alert");
const orderEle = document.querySelector("#hiddenInput");
const statuses = document.querySelectorAll(".status-line");
const socket = io();
let orderInputValue = orderEle ? orderEle.value : null;
if (orderInputValue) {
  orderInputValue = JSON.parse(orderInputValue);
}

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

initAdmin(socket);

const time = document.createElement("small");
function updateStatus(order) {
  statuses.forEach((status) => {
    status.classList.remove("step-completed");
    status.classList.remove("step-active");
  });
  let stepCompleted = true;
  statuses.forEach((status) => {
    const dataProp = status.dataset.status;
    if (stepCompleted) {
      status.classList.add("step-completed");
    }
    if (dataProp === order.status) {
      stepCompleted = false;
      time.innerText = moment(order.updatedAt).format("hh:mm A");
      status.appendChild(time);
      if (status.nextElementSibling) {
        status.nextElementSibling.classList.add("step-active");
      }
    }
  });
}
updateStatus(orderInputValue);

if (orderInputValue) {
  socket.emit("join", `order_${orderInputValue._id}`);
}
const adminAreaPath = window.location.pathname;
if (adminAreaPath.includes("admin")) {
  socket.emit("join", "adminRoom");
}
socket.on("orderUpdated", (data) => {
  const updatedOrder = { ...order };
  updatedOrder.updatedAt = moment().format();
  updatedOrder.status = data.status;
  updateStatus(updatedOrder);
  new Noty({
    type: "success",
    timeout: 1000,
    progressBar: false,
    text: "Order updated",
  }).show();
});
