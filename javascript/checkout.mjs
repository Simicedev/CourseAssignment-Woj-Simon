import { currency } from "./library.mjs";

document.addEventListener("DOMContentLoaded", function () {
  const cartItemsContainer = document.getElementById("cart-items");
  const totalPriceElement = document.getElementById("cart-total");
  const checkoutForm = document.getElementById("checkout-form");

  function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
  }

  function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function loadCart() {
    const cart = getCart();
    cartItemsContainer.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
      totalPriceElement.textContent = `0 ${currency}`;
      return;
    }

    cart.forEach((item, index) => {
      total += item.price * item.quantity;
      const itemElement = document.createElement("div");
      itemElement.classList.add("cart-item");
      itemElement.innerHTML = `
                <div class="cart-product">
                    <img src="${item.imgUrl}" alt="${item.title}" width="50">
                    <p><strong>${item.title}</strong> - ${item.price.toFixed(
        2
      )} ${currency}</p>
                    <div class="quantity-control">
                        <button class="decrease-quantity" data-index="${index}">-</button>
                        <span>${item.quantity}</span>
                        <button class="increase-quantity" data-index="${index}">+</button>
                    </div>
                    <button class="remove-item" data-index="${index}">Remove</button>
                </div>
            `;
      cartItemsContainer.appendChild(itemElement);
    });

    totalPriceElement.textContent = `${total.toFixed(2)} ${currency}`;

    document.querySelectorAll(".increase-quantity").forEach((button) => {
      button.addEventListener("click", function () {
        const index = this.getAttribute("data-index");
        changeQuantity(index, 1);
      });
    });

    document.querySelectorAll(".decrease-quantity").forEach((button) => {
      button.addEventListener("click", function () {
        const index = this.getAttribute("data-index");
        changeQuantity(index, -1);
      });
    });

    document.querySelectorAll(".remove-item").forEach((button) => {
      button.addEventListener("click", function () {
        const index = this.getAttribute("data-index");
        removeItemFromCart(index);
      });
    });
  }

  function changeQuantity(index, change) {
    let cart = getCart();
    if (!cart[index]) return;

    cart[index].quantity += change;

    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }

    saveCart(cart);
    loadCart();
  }

  function removeItemFromCart(index) {
    let cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    loadCart();
  }

  checkoutForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const address = document.getElementById("address").value;
    const payment = document.getElementById("payment").value;
    const cart = getCart();

    if (!name || !email || !address || !payment) {
      alert("Please fill in all required fields.");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    localStorage.setItem("orderName", name);
    localStorage.setItem("orderEmail", email);
    localStorage.setItem("orderAddress", address);
    localStorage.setItem("orderPayment", payment);
    localStorage.setItem("orderCart", JSON.stringify(cart));
    localStorage.removeItem("cart");

    alert("Order placed successfully!");
    window.location.href = "confirmation-page.html";
  });

  loadCart();
});
