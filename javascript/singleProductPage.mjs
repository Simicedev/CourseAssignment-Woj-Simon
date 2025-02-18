import {
  apiUrl,
  currency,
  ERROR_PRINT,
  refreshElement,
  htmlRenderToDom,
} from "./library.mjs";

let jacketProducts = [];
const productContainer = document.getElementById("productContainer");


if (!productContainer) {
	console.error('JS is down');
} else {
	getProducts();
}

async function getProducts() {
	refreshElement(productDetails);
	

	try {
		const response = await fetch(apiUrl);
		const { data } = await response.json();
		jacketProducts = data;

		generateProducts(jacketProducts);
	} catch (error) {
		console.error(ERROR_PRINT, error?.message);
	}
}

function productTemplate({
	id,
	title = 'Unknown Item',
	imgUrl,
	imgAl,
	price = 0,
	description = 'Missing description',
	index,
}) {
	return `
    <article class="product-details animate__animated animate__fadeInUp animate__delay-${index}s">
      <div class="product-image">
        <img src="${imgUrl}" alt="${imgAl}" />
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
          <p>
            ${description}
          </p>
        </div>
        <button class="add-to-cart" id="js-add-to-cart-${id}">Add to Cart</button>
      </div>
    </article>
 `;
}

function generateProducts(list = jacketProducts) {
	refreshElement(productDetails);

	if (list.length === 0) {
		console.error('No products available');
		return;
	}

	list.forEach((product, index) => {
		const template = productTemplate({
			id: product.id,
			title: product.title,
			imgUrl: product.image.url,
			imgAl: product.image.alt,
			price: product.price,
			description: product.description,
			index: index + 1,
		});

		const newEl = htmlRenderToDom(template);
		productDetails.append(newEl);
	});
}


