export function htmlRenderToDom(template) {
  const parser = new DOMParser();
  const parsedDocument = parser.parseFromString(template, "text/html");
  return parsedDocument.body.firstChild;
}

export function refreshElement(el) {
  el.innerHTML = "";
}

export const apiUrl = "https://v2.api.noroff.dev/rainy-days";

export const ERROR_PRINT = "Something went wrong";

export const currency = "kr";