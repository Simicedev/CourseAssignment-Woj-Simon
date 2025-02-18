  document.addEventListener("DOMContentLoaded", function () {
    const cartItemsContainer = document.getElementById("cart-items");
    const totalPriceElement = document.getElementById("total-price");
    const checkoutBtn = document.getElementById("checkout-btn");

     function loadCart() {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      cartItemsContainer.innerHTML = "";
      let total = 0;

      if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
        return;
      }

      cart.forEach((item, index) => {
        total += item.price * item.quantity;
        const itemElement = document.createElement("div");
        itemElement.classList.add("cart-item");
        itemElement.innerHTML = `
                        <img src="${item.image}" alt="${item.title}" width="50">
                        <p><strong>${item.title}</strong> - ${item.quantity} x $${item.price}</p>
                        <button class="remove-btn" data-index="${index}">Remove</button>
                    `;
        cartItemsContainer.appendChild(itemElement);
      });

      totalPriceElement.innerHTML = `<strong>Total: </strong> $${total.toFixed(
        2
      )}`;
    }

    cartItemsContainer.addEventListener("click", function (event) {
      if (event.target.classList.contains("remove-btn")) {
        const index = event.target.getAttribute("data-index");
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        loadCart();
      }
    });

    checkoutBtn.addEventListener("click", function () {
      if (confirm("Are you sure you want to place the order?")) {
        localStorage.removeItem("cart");
        alert("Order placed successfully!");
        window.location.href = "index.html";
      }
    });

    loadCart();
  });
