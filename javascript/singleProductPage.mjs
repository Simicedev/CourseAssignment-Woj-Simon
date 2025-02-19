import { currency, htmlRenderToDom, refreshElement } from './library.mjs';

const productContainer = document.getElementById('product-container');

if (!productContainer) {
	console.error('Product container not found.');
} else {
	const productData = localStorage.getItem('selectedProduct');
	if (!productData) {
		productContainer.innerHTML = '<p>No product selected.</p>';
	} else {
		const product = JSON.parse(productData);
		renderProduct(product);
	}
}

function renderProduct(product) {
	const template = `
    <article class="product-details">
      <div class="product-image">
        <img src="${product.image.url}" alt="${product.image.alt}">
      </div>
      <div class="product-info">
        <h1 class="product-title">${product.title}</h1>
        <div class="product-rating">
          <span>&#9733;</span>
          <span>&#9733;</span>
          <span>&#9733;</span>
          <span>&#9734;</span>
          <span>&#9734;</span>
          <span>(123 reviews)</span>
        </div>
        <div class="product-price">${product.price} ${currency}</div>
        <div class="product-description">
          <p>${product.description}</p>
        </div>
        <button class="add-to-cart" id="js-add-to-cart-${product.id}">
          Add to Cart
        </button>
      </div>
    </article>
  `;
	refreshElement(productContainer);
	const newEl = htmlRenderToDom(template);
	productContainer.append(newEl);

	const addToCartBtn = document.getElementById(`js-add-to-cart-${product.id}`);
	if (addToCartBtn) {
		addToCartBtn.addEventListener('click', () => {
			addToCart(product);
		});
	}
}

function addToCart(product) {
	let cart = JSON.parse(localStorage.getItem('cart')) || [];
	const existingItem = cart.find(item => item.id === product.id);
	if (existingItem) {
		existingItem.quantity += 1;
	} else {
		cart.push({ ...product, quantity: 1 });
	}
	localStorage.setItem('cart', JSON.stringify(cart));
	alert('Product added to cart!');
}
