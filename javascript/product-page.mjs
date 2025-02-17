import { apiUrl, currency, ERROR_PRINT } from "./library.mjs";

async function fetchProducts() {
  try {
    const container = document.getElementById("product-container");
    container.innerHTML = '<p class="loading">Loading products...</p>';

    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    const products = result?.data;

    if (!Array.isArray(products) || products.length === 0) {
      throw new Error("No products found");
    }

    const productsHTML = products
      .map((product) => {
        if (
          product?.image?.url &&
          product?.image?.alt &&
          product?.title &&
          product?.description &&
          Array.isArray(product?.sizes) &&
          product?.price &&
          product?.gender
        ) {
          const sizesText =
            product.sizes.length > 0
              ? product.sizes.join(", ")
              : "Not available";

          return `
                        <div class="product">
                            <a href ='single-product-page.html'><img src="${product.image.url}" alt="${product.image.alt}"></a>
                            <h2>${product.title}</h2>
                            <p>${product.description}</p>
                            <p><strong>Sizes:</strong> ${sizesText}</p>
                            <p><strong>Price:</strong> ${product.price} ${currency}</p>
                            <p><strong>Gender:</strong> ${product.gender}</p>
							<button>Add to cart</button>
                        </div>
                    `;
        } else {
          console.warn("Incomplete product data", product);
          return "";
        }
      })
      .join("");

    container.innerHTML = productsHTML || "<p>No valid products found.</p>";
  } catch (error) {
    console.error("Error fetching products:", error);
    document.getElementById(
      "product-container"
    ).innerHTML = `<p class="error-message">${ERROR_PRINT}. Please try again later.</p>`;
  }
}

fetchProducts();
