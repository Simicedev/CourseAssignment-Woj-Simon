import { apiUrl, currency, ERROR_PRINT } from './library.mjs';

async function fetchWomenProducts() {
	try {
		const container = document.getElementById('product-container');
		container.innerHTML = '<p class="loading">Loading products...</p>';

		const response = await fetch('https://v2.api.noroff.dev/rainy-days');
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		const result = await response.json();
		const products = result?.data || [];

		if (products.length === 0) {
			throw new Error('No products found');
		}

		const womenProductsHTML = products
			.filter(product => product.gender?.toLowerCase() === 'female')
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
                            <p><strong>Price:</strong> ${product.price}
                ${currency}</p>
                            <p><strong>Gender:</strong> ${product.gender}</p>
                        </div>
                    `;
				} else {
					console.warn('Incomplete product data', product);
					return '';
				}
			})
			.join('');

		container.innerHTML = womenProductsHTML || '<p>No valid women’s products found.</p>';
	} catch (error) {
		console.error('Error fetching products:', error);
		document.getElementById('product-container').innerHTML =
			'<p class="error-message">Failed to load products. Please try again later.</p>';
	}
}

fetchWomenProducts();

const womenNav = document.getElementById('women-products-nav');
if (womenNav) {
	womenNav.addEventListener('click', fetchWomenProducts);
}
