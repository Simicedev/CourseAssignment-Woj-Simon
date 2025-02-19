import { currency } from './library.mjs';

function getCart() {
	return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
	localStorage.setItem('cart', JSON.stringify(cart));
}

export function updateCartUI() {
	const cartItemsContainer = document.getElementById('cart-items');
	const totalPriceElement = document.getElementById('total-price');

	if (!cartItemsContainer || !totalPriceElement) {
		console.error('Cart containers not found in the DOM.');
		return;
	}

	const cart = getCart();
	cartItemsContainer.innerHTML = '';

	if (cart.length === 0) {
		cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
		totalPriceElement.textContent = `0 ${currency}`;
		return;
	}

	let total = 0;
	cart.forEach(item => {
		total += item.price * item.quantity;
		cartItemsContainer.innerHTML += cartItemsTemplate(item);
	});

	totalPriceElement.textContent = `${total.toFixed(2)} ${currency}`;
	attachQuantityChangeListeners();
}

function cartItemsTemplate({ id, imgUrl, title, price, quantity }) {
	return `
    <div class="cart-item" data-id="${id}">
      <div class="cart-image"><img src="${imgUrl}" alt="${title}"></div>
      <div class="cart-name">${title}</div>
      <div class="cart-totalPrice">${(price * quantity).toFixed(2)} ${currency}</div>
      <div class="cart-quantity">
        <button class="minus">-</button>
        <span>${quantity}</span>
        <button class="plus">+</button>
      </div>
    </div>
  `;
}

function attachQuantityChangeListeners() {
	document.querySelectorAll('.cart-item .minus').forEach(button => {
		button.addEventListener('click', event => {
			changeQuantity(event.target.closest('.cart-item'), -1);
		});
	});

	document.querySelectorAll('.cart-item .plus').forEach(button => {
		button.addEventListener('click', event => {
			changeQuantity(event.target.closest('.cart-item'), 1);
		});
	});
}

function changeQuantity(cartItemElement, change) {
	let cart = getCart();
	const id = cartItemElement.dataset.id;
	const item = cart.find(product => product.id === id);

	if (item) {
		item.quantity += change;
		if (item.quantity <= 0) {
			cart = cart.filter(product => product.id !== id);
		}
		saveCart(cart);
		updateCartUI();
	}
}


const cartTab = document.getElementById('cartTab');
const basketWrapper = document.querySelector('.basket-wrapper');
const closeButton = document.getElementById('close');

function toggleCart() {
	cartTab.classList.toggle('active');
	console.log('🛒 Cart toggled:', cartTab.classList.contains('active') ? 'Opened' : 'Closed');
}

if (basketWrapper) basketWrapper.addEventListener('click', toggleCart);
if (closeButton) closeButton.addEventListener('click', toggleCart);


document.addEventListener('DOMContentLoaded', updateCartUI);
