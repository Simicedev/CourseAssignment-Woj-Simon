import { apiUrl, currency, ERROR_PRINT } from './library.mjs';
import { addToCart } from './cart.mjs';

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

		const sortedProducts = products.sort((a, b) => {
			const priceA = a?.price || 0;
			const priceB = b?.price || 0;

			if (sortOrder === 'asc') {
				return priceA - priceB;
			} else {
				return priceB - priceA;
			}
		});

		const productsHTML = sortedProducts
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
                        <div class="product">
                            <a href ='single-product-page.html'><img src="${product.image.url}" alt="${
						product.image.alt
					}"></a>
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

		container.innerHTML = productsHTML || '<p>No valid products found.</p>';

		
		document.querySelectorAll('.add-to-cart').forEach(button => {
			button.addEventListener('click', () => {
				const product = JSON.parse(button.getAttribute('data-product'));
				addToCart(product);
			});
		});
	} catch (error) {
		console.error('Error fetching products:', error);
		document.getElementById(
			'product-container'
		).innerHTML = `<p class="error-message">${ERROR_PRINT}. Please try again later.</p>`;
	}
}

const sortDropdown = document.getElementById('sort-options');
if (sortDropdown) {
	sortDropdown.addEventListener('change', event => {
		const sortOrder = event.target.value;
		fetchProducts(sortOrder);
	});
}

<<<<<<< HEAD
=======
const cartTab = document.getElementById("cartTab");
const basketWrapper = document.querySelector(".basket-wrapper"); 
const closeButton = document.getElementById("close");


function toggleCart() {
  cartTab.classList.toggle("active"); 
}


basketWrapper.addEventListener("click", toggleCart);

closeButton.addEventListener("click", toggleCart);


>>>>>>> f9cf7ec09740e41ee242167b0deec4ae0fc5ad91
fetchProducts('asc');
