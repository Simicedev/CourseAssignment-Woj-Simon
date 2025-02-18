import { apiUrl, currency, ERROR_PRINT } from './library.mjs';

async function fetchWomenProducts(sortOrder = 'asc') {
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

		const womenProducts = products
			.filter(product => product.gender?.toLowerCase() === 'female')
			.sort((a, b) => {
				const priceA = a?.price || 0;
				const priceB = b?.price || 0;

				if (sortOrder === 'asc') {
					return priceA - priceB;
				} else {
					return priceB - priceA;
				}
			});

		const womenProductsHTML = womenProducts
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
                            <button class="add-to-cart" data-product='${JSON.stringify(product)}'>Add to cart</button>
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
		document.getElementById(
			'product-container'
		).innerHTML = `<p class="error-message">${ERROR_PRINT}. Please try again later.</p>`;
	}
}

document.getElementById('women-products-nav').addEventListener('click', event => {
	event.preventDefault();
	fetchWomenProducts();

	const sortDropdown = document.getElementById('sort-options');
	if (sortDropdown) {
		sortDropdown.addEventListener('change', event => {
			const sortOrder = event.target.value;
			fetchWomenProducts(sortOrder);
		});
	}
});
