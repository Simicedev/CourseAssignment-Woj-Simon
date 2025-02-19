import { apiUrl, currency, ERROR_PRINT } from './library.mjs';
import { updateCartUI } from './cart.mjs';

async function fetchMenProducts(sortOrder = 'asc') {
	try {
		const container = document.getElementById('product-container');
		container.innerHTML = '<p class="loading">Loading products...</p>';

		const response = await fetch(apiUrl);
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		const result = await response.json();
		const products = result?.data || [];

		if (products.length === 0) {
			throw new Error('No products found');
		}

		// Sort products by price
		const sortedProducts = products.sort((a, b) => {
			const priceA = a?.price || 0;
			const priceB = b?.price || 0;
			return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
		});

		// Filter male products and build HTML with separate data attributes
		const menProductsHTML = sortedProducts
			.filter(product => product.gender?.toLowerCase() === 'male')
			.map(product => {
				if (
					product?.image?.url &&
					product?.image?.alt &&
					product?.title &&
					product?.description &&
					Array.isArray(product?.sizes) &&
					product?.price
				) {
					const sizesText = product.sizes.length > 0 ? product.sizes.join(', ') : 'Not available';
					return `
            <div class="product">
              <img src="${product.image.url}" alt="${product.image.alt}">
              <h2>${product.title}</h2>
              <p>${product.description}</p>
              <p><strong>Sizes:</strong> ${sizesText}</p>
              <p><strong>Price:</strong> ${product.price} ${currency}</p>
              <p><strong>Gender:</strong> ${product.gender}</p>
              <button class="add-to-cart"
                data-id="${product.id}"
                data-title="${product.title}"
                data-price="${product.price}"
                data-image="${product.image.url}">
                Add to cart
              </button>
            </div>
          `;
				} else {
					console.warn('Incomplete product data', product);
					return '';
				}
			})
			.join('');

		container.innerHTML = menProductsHTML || '<p>No valid men’s products found.</p>';
		attachAddToCartListeners();
	} catch (error) {
		console.error('Error fetching products:', error);
		document.getElementById(
			'product-container'
		).innerHTML = `<p class="error-message">${ERROR_PRINT}. Please try again later.</p>`;
	}
}

function attachAddToCartListeners() {
	const buttons = document.querySelectorAll('.add-to-cart');
	console.log('Attaching event listeners to add-to-cart buttons, count:', buttons.length);
	buttons.forEach(button => {
		button.addEventListener('click', () => {
			// Read product details from individual data attributes.
			const id = button.dataset.id;
			const title = button.dataset.title;
			const price = parseFloat(button.dataset.price);
			const imgUrl = button.dataset.image;
			const product = { id, title, price, imgUrl };
			addToCart(product);
		});
	});
}

function addToCart(product) {
	console.log('Adding product to cart:', product);
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

// Listen for clicks on the "Men" navigation link.
document.getElementById('men-products-nav').addEventListener('click', event => {
	event.preventDefault();
	fetchMenProducts();
	const sortDropdown = document.getElementById('sort-options');
	if (sortDropdown) {
		// Use a one-time assignment to avoid duplicate listeners.
		sortDropdown.onchange = event => {
			const sortOrder = event.target.value;
			fetchMenProducts(sortOrder);
		};
	}
});
