const apiURL = 'https://dummyjson.com';
let product = undefined;
let id = undefined;

const imageSelector = (imgUrl, index) => {
  return `
    <button onclick="setActiveImage(${index})" class="img-selector border rounded mb-2 me-2 bg-transparent">
      <img src="${imgUrl}">
    </button>
  `;
}

const getQueryParamId = () => {
  const params = new URLSearchParams(window.location.search);
  id = params.get('id');
}

const setPageContent = () => {
  const productImageSelectors = document.getElementById('product-image-selectors');
  const productActiveImage = document.getElementById('product-active-image');
  const productDetailInfo = document.getElementById('product-detail-info');

  product.images.forEach((imgUrl, index) => {
    productImageSelectors.innerHTML += imageSelector(imgUrl, index);
  });
  productActiveImage.src = product.images[0];
  productDetailInfo.innerHTML = `
    <p class="mb-0 text-secondary">${product.category}</p>
    <h2 class="fw-bold">${product.title}</h2>
    <p class="text-secondary">${product.description}</p>
    <h4 class="text-accent fw-bold">$${product.price}</h4>
    <button onclick="addToCart(${product.id})" class="btn btn-dark mt-3">Añadir al carrito</button>
  `;
}

const setActiveImage = (imgIndex) => {
  const productActiveImage = document.getElementById('product-active-image');
  productActiveImage.src = product.images[imgIndex];
}

const getProductById = () => {
  fetch(`${apiURL}/products/${id}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }
      return response.json();
    })
    .then(data => {
      product = data;
      setPageContent();
    })
    .catch(error => {
      console.error('Error al realizar el fetch:', error);
    });
}

document.addEventListener('DOMContentLoaded', () => {
  getQueryParamId();
  getProductById();
});