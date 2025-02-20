import {
  currency,
  htmlRenderToDom,
  refreshElement,
  ERROR_PRINT,
  apiUrl,
} from "./library.mjs";

let jacketProducts = [];
const productContainer = document.getElementById("product-container");

if (!productContainer) {
  console.error("JS is down");
} else {
  getProducts();
}

async function getProducts() {
  refreshElement(productContainer);

  try {
    const response = await fetch(apiUrl);
    const { data } = await response.json();
    jacketProducts = data;

    generateProducts(jacketProducts);
  } catch (error) {
    console.error(ERROR_PRINT, error?.message);
  }
};

function productTemplate({
  id,
  title = "Unknown Item",
  imgUrl,
  imgAl,
  price = 0,
  description = "Missing description",
  index,
}) {
  return `
    <article class="product-details">
      <div class="product-image">
        <img src="${imgUrl}" alt="${imgAl}">
      </div>
      <div class="product-info">
        <h1 class="product-title">${title}</h1>
        <div class="product-rating">
          <span>&#9733;</span>
          <span>&#9733;</span>
          <span>&#9733;</span>
          <span>&#9734;</span>
          <span>&#9734;</span>
          <span>(123 reviews)</span>
        </div>
        <div class="product-price">${price} ${currency}</div>
        <div class="product-description">
          <p>${description}</p>
        </div>
        <button class="add-to-cart" id="js-add-to-cart-${id}">
          Add to Cart
        </button>
      </div>
    </article>
  `;
}
  function generateProducts(list = jacketProducts) {
    refreshElement(productContainer);

    if (list.length === 0) {
      console.error("No products available");
      return;
    }

    // Select the first product or specify an ID
    const product = list[0];

    const template = productTemplate({
      id: product.id,
      title: product.title,
      imgUrl: product.image.url,
      imgAl: product.image.alt,
      price: product.price,
      description: product.description,
    });

    const newEl = htmlRenderToDom(template);
    productContainer.append(newEl);
  };


function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingItem = cart.find((item) => item.id === product.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Product added to cart!");
}
