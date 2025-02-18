import { apiUrl, currency, ERROR_PRINT } from './library.mjs';


async function fetchProducts(sortOrder = 'asc') {
	try {
		const container = document.getElementById('product-container');
		container.innerHTML = '<p class="loading">Loading products...</p>';

		const response = await fetch(apiUrl);
		if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

		const result = await response.json();
		const products = result?.data;

		if (!Array.isArray(products) || products.length === 0) throw new Error('No products found');

		const sortedProducts = products.sort((a, b) =>
			sortOrder === 'asc' ? (a.price || 0) - (b.price || 0) : (b.price || 0) - (a.price || 0)
		);
		container.innerHTML = sortedProducts.map(generateProductHTML).join('') || '<p>No valid products found.</p>';

		document.querySelectorAll('.add-to-cart').forEach(button => {
			button.addEventListener('click', event => {
				const productData = event.target.dataset.product;
				if (productData) {
					try {
						const product = JSON.parse(productData);
						if (product.id) {
							addToCart(product);
						} else {
							console.error('Product ID is missing.');
						}
					} catch (error) {
						console.error('Error parsing product data:', error);
					}
				} else {
					console.error('No product data found on the button');
				}
			});
		});
	} catch (error) {
		console.error('Error fetching products:', error);
		document.getElementById(
			'product-container'
		).innerHTML = `<p class="error-message">${ERROR_PRINT}. Please try again later.</p>`;
	}
}

function generateProductHTML(product) {
	if (
		!(
			product?.image?.url &&
			product?.title &&
			product?.description &&
			Array.isArray(product?.sizes) &&
			product?.price &&
			product?.gender &&
			product?.id
		)
	) {
		console.warn('Incomplete product data', product);
		return '';
	}

	const sizesText = product.sizes.length > 0 ? product.sizes.join(', ') : 'Not available';
	return `
        <div class="product">
            <a href='single-product-page.html'>
                <img src="${product.image.url}" alt="${product.image.alt}">
            </a>
            <h2>${product.title}</h2>
            <p>${product.description}</p>
            <p><strong>Sizes:</strong> ${sizesText}</p>
            <p><strong>Price:</strong> ${product.price} ${currency}</p>
            <p><strong>Gender:</strong> ${product.gender}</p>
            <button class="add-to-cart" data-product='${JSON.stringify(product)}'>Add to Cart</button>
        </div>
    `;
}

const sortDropdown = document.getElementById('sort-options');
if (sortDropdown) sortDropdown.addEventListener('change', event => fetchProducts(event.target.value));

const CART_STORAGE_KEY = 'cart';

function getCart() {
	return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
}

function saveCart(cart) {
	localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function addToCart(product) {
	const cart = getCart();
	const existingProduct = cart.find(item => item.id === product.id);

	if (existingProduct) {
		existingProduct.quantity += 1; 
	} else {
		cart.push({ ...product, quantity: 1 }); 
	}

	saveCart(cart); 
	updateCartDisplay(); 
}

function removeFromCart(productId) {
	const cart = getCart().filter(item => item.id !== productId);
	saveCart(cart);
	updateCartDisplay();
}

function updateCartDisplay() {
	const cart = getCart();
	const cartItemsContainer = document.getElementById('listCart');
	if (!cartItemsContainer) return;

	cartItemsContainer.innerHTML =
		cart.length === 0 ? '<p>Your cart is empty.</p>' : cart.map(generateCartItemHTML).join('');

	document.querySelectorAll('.remove-item').forEach(button => {
		button.addEventListener('click', event => {
			removeFromCart(event.target.dataset.id);
		});
	});
}

function generateCartItemHTML(item) {
	return `
        <div class="listCart">
            <div class="listCart-details">
                <img src="${item.image.url}" alt="${item.title}" class="listCart-img"/>
                <h3>${item.title}</h3>
                <p>${item.price} ${currency}</p>
                <p>Quantity: <span class="item-quantity">${item.quantity}</span></p>
            </div>
            <button class="remove-item" data-id="${item.id}">Remove</button>
        </div>
    `;
}

document.getElementById('listCart')?.addEventListener('click', event => {
	if (event.target.classList.contains('remove-item')) removeFromCart(event.target.dataset.id);
});

const cartTab = document.getElementById('cartTab');
const basketWrapper = document.querySelector('.basket-wrapper');
const closeButton = document.getElementById('close');

function toggleCart() {
	cartTab.classList.toggle('active');
}

basketWrapper?.addEventListener('click', toggleCart);
closeButton?.addEventListener('click', toggleCart);

document.addEventListener('DOMContentLoaded', () => {
	updateCartDisplay();
	fetchProducts('asc');
});
