import {
  apiUrl,
  currency,
  ERROR_PRINT,
  refreshElement,
  htmlRenderToDom,
} from "./library.mjs";

const cartTab = document.getElementById("cartTab");
const basketWrapper = document.querySelector(".basket-wrapper");
const closeButton = document.getElementById("close");
const cartItems = document.getElementsByClassName('cart-item');
const totalPrice = document.getElementsByClassName('cart-totalPrice');
setup();
function setup(){
    if(
        !cartTab ||
        !basketWrapper ||
        !closeButton ||
        !cartItems ||
        !totalPrice
    ) {
        console.error(ERROR_PRINT);
    } else {
     
    }
}
function toggleCart() {
  cartTab.classList.toggle("active"); // Adds/removes 'active' class
}
 basketWrapper.addEventListener("click", toggleCart);
 closeButton.addEventListener("click", toggleCart);
      

function cartItemsTemplate({
  id, 
  imgUrl = "",
  title = "Unknown",
  price = 0,
  alt = "No Alt provided",
  quantity = 1,
  subTotal = price,
}){
    return `<section>
        <div id="cartTab">
            <h1 id="cartTitle">Shopping cart</h1>
            <div id="listCart">
              <div class="cart-item">
                <div class="cart-image" ><img src="https://static.noroff.dev/api/rainy-days/9-thunderbolt-jacket.jpg" alt=""></div>
              </div>
              <div class="cart-name">NAME</div>
              <div class="cart-totalPrice">139.99 kr</div>
              <div class="cart-quantity">
                <span class="minus">-</span>
                <span>1</span>
                <span class="plus">+</span>
              </div>
            </div>
            <div id="btn">
                <button id="close">CLOSE</button>
                <button id="checkOut"> <a href="checkout-page.html"> CHECKOUT</a></button>
            </div>
        </div>
    </section>`;
}

