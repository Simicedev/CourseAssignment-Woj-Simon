// product-page.mjs
import { apiUrl, currency, ERROR_PRINT } from './library.mjs';
import { updateCartUI } from './cart.mjs';

async function fetchProducts(sortOrder = 'asc') {
	try {
		const container = document.getElementById('product-container');
		container.innerHTML = '<p class="loading">Loading products...</p>';

		const response = await fetch(apiUrl);
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		const result = await response.json();
		const products = result?.data;

		if (!Array.isArray(products) || products.length === 0) {
			throw new Error('No products found');
		}

		const sortedProducts = products.sort((a, b) => (sortOrder === 'asc' ? a.price - b.price : b.price - a.price));

		container.innerHTML = sortedProducts
			.map(product => {
				if (
					product?.image?.url &&
					product?.image?.alt &&
					product?.title &&
					product?.description &&
					Array.isArray(product?.sizes) &&
					product?.price &&
					product?.gender
				) {
					const sizesText = product.sizes.length > 0 ? product.sizes.join(', ') : 'Not available';

					return `
            <div class="product" data-id="${product.id}" data-price="${product.price}" data-title="${product.title}" data-image="${product.image.url}">
              <a href="single-product-page.html"><img src="${product.image.url}" alt="${product.image.alt}"></a>
              <h2>${product.title}</h2>
              <p>${product.description}</p>
              <p><strong>Sizes:</strong> ${sizesText}</p>
              <p><strong>Price:</strong> ${product.price} ${currency}</p>
              <p><strong>Gender:</strong> ${product.gender}</p>
              <button class="add-to-cart">Add to cart</button>
            </div>
          `;
				} else {
					console.warn('Incomplete product data', product);
					return '';
				}
			})
			.join('');

		attachAddToCartListeners();
	} catch (error) {
		console.error('Error fetching products:', error);
		document.getElementById(
			'product-container'
		).innerHTML = `<p class="error-message">${ERROR_PRINT}. Please try again later.</p>`;
	}
}

function attachAddToCartListeners() {
	document.querySelectorAll('.add-to-cart').forEach(button => {
		button.addEventListener('click', event => {
			const productElement = event.target.closest('.product');
			if (!productElement) return;

			const id = productElement.dataset.id;
			const price = parseFloat(productElement.dataset.price);
			const title = productElement.dataset.title;
			const imgUrl = productElement.dataset.image;

			addToCart({ id, title, price, imgUrl });
		});
	});
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
	updateCartUI();
}

// Sorting dropdown event listener
const sortDropdown = document.getElementById('sort-options');
if (sortDropdown) {
	sortDropdown.addEventListener('change', event => {
		fetchProducts(event.target.value);
	});
}

// Fetch products and update the cart UI on page load
document.addEventListener('DOMContentLoaded', () => {
	fetchProducts('asc');
	updateCartUI();
});
