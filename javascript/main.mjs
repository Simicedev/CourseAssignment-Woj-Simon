import {
  htmlRenderToDom,
  refreshElement,
  apiUrl,
  ERROR_PRINT,
  currency,
} from "/javascript/library.mjs";

const containerBox = document.getElementById("productsContainer");
let products = [];

checkJs();

function checkJs() {
  if (!productsContainer) {
    console.error(ERROR_PRINT);
  } else {
  }
}

async function renderProducts() {
  refreshElement();
  try {
    const response = await fetch(apiUrl);
    const { data } = await response.json();
    products = data;

    productPrinter();
  } catch (error) {
    console.error(ERROR_PRINT, error?.message);
  }
}

function productTemplate({
  id,
  index,
  imgUrl,
  imgAl,
  price = 0,
  description = "Missing description",
  title = "Unknown",
}) {
  const productPage = `/productPage.html?id=${id}`;
  return ``;
}

function productPrinter(list = products) {
  refreshElement(productsContainer);

  list.forEach(({ id, title, image, price, description }) => {
    const template = productTemplate({
      id,
      title,
      imgUrl: image.url,
      imgAl: image.alt,
      price,
      description,
    });

    const CreateElement = htmlRenderToDom(template);
    // FIXME: Use data attribute
    const btn = CreateElement.querySelector("button");

    btn.addEventListener("click", () => {
      addToCart({
        id,
        title,
        imgUrl: image.url,
        price,
      });
    });

    productsContainer.append(CreateElement);
  });
}
