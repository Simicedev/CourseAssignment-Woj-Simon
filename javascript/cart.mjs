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
      basketWrapper.addEventListener("click", toggleCart);
      closeButton.addEventListener("click", toggleCart);
      const prodcts = getItemsFromStorage()
    }
}
function toggleCart() {
  cartTab.classList.toggle("active"); // Adds/removes 'active' class
}

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
export function addItemToCart({ id, imgUrl, price, title }){
    const jacketItem = getItemsFromStorage();
    const findProduct = jacketItem.findIndex((item) => {
      return item.id === id;
    });
    if (findProduct === -1) {
      jacketItem.push({
        id,
        title,
        imgUrl,
        price,
        quantity: 1,
      });
    } else {
      jacketItem[findProduct].quantity++;
    }
}
function getItemsFromStorage() {
  return JSON.parse(window.localStorage.getItem("cart")) ?? [];
}

// function renderItems (jackets = []){
//     refreshElement(cartTab);
//     jackets.forEach(({id, imgUrl, title, quantity, price}) =>{
//         const subTotal = (price * quantity).toFixed(2);

//         const cartTemplate = cartItemsTemplate({
//             id,
//             imgUrl,
//             title,
//             price,
//             quantity,
//             subTotal,
//         });

//         const productItemEl = createHTML(template);
//         const removeBtnEl = productItemEl.querySelector('[data-btn="remove"]');
//         const increaseBtnEl = productItemEl.querySelector(
//           '[data-btn="increaseQuantity"]'
//         );
//         const decreaseBtnEl = productItemEl.querySelector(
//           '[data-btn="decreaseQuantity"]'
//         );

//         removeBtnEl.addEventListener("click", (event) => {
//           removeProductItem(items, event.target.id);
//         });

//         increaseBtnEl.addEventListener("click", (event) => {
//           increaseQuantity(items, event.target.dataset.id);
//         });

//         decreaseBtnEl.addEventListener("click", (event) => {
//           decreaseQuantity(items, event.target.dataset.id);
//         });

//         cartItems.append(productItemEl);

//     })
// }
