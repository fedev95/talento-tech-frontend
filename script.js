const apiURL = 'https://dummyjson.com';
let productsCategories = [];
let products = undefined;

const cartIcon = `
  <svg data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"></path>
  </svg>
`;

const spinnerLoader = `
  <div class="spinner-container py-5 d-flex flex-column">
    <span class="loader"></span>
    <p>Cargando contenido...</p>
  </div>
`;

const mobileCategorySelector = (category) => {
  return `
    <li><a onclick="setActiveCategory('${category.name}'); fetchProductsData('${category.slug}')" class="dropdown-item category-selector" href="#products-container">${category.name}</a></li>
  `
}

const categorySelector = (category) => {
  return `
    <a onclick="setActiveCategory('${category.name}'); fetchProductsData('${category.slug}')" class="category-selector btn btn-custom text-start mb-1" href="#products-container">${category.name}</a>
  `
}

const productCard = (product) => {
  return `
    <article class="product-card bg-white rounded border d-flex flex-column position-relative">
      <button onclick="addToCart(${product.id})" title="Añadir al carrito" class="d-none d-md-block position-absolute top-0 end-0 m-2">${cartIcon}</button>
      <div class="ratio ratio-16x9">
        <img src="${product.thumbnail}" alt="" class="w-100 object-fit-contain">
      </div>
      <div class="d-flex flex-column p-3 h-100">
        <a href="/producto.html?id=${product.id}" class="product-card-link text-decoration-none text-dark fw-bold mb-3">${product.title}</a>
        <p class="fw-bold mb-3 text-accent">$${product.price}</p>
        <button onclick="addToCart(${product.id})" class="d-md-none add-to-cart-mobile z-1">Añadir al carrito</button>
      </div>
    </article>
  `;
}

const fetchCategories = () => {
  fetch(`${apiURL}/products/categories`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }
      return response.json();
    })
    .then(data => {
      productsCategories = data;
      const categoriesList = document.getElementById('categories-list');
      const mobileCategoriesList = document.getElementById('mobile-categories-list');
      productsCategories.forEach(category => {
        mobileCategoriesList.innerHTML += mobileCategorySelector(category);
        categoriesList.innerHTML += categorySelector(category);
      })
    })
    .catch(error => {
      console.error('Error al realizar el fetch:', error);
      document.getElementById('data-container').textContent = 'Error al cargar los datos';
    });
}

function fetchProductsData(category) {
  
  let url = '';
  
  if (category) {
    url = `${apiURL}/products/category/${category}`;
  } else {
    url = `${apiURL}/products`
  }

  const productsGrid = document.getElementById('products-grid');
  productsGrid.innerHTML = spinnerLoader;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }
      return response.json();
    })
    .then(data => {
      products = data.products;
      productsGrid.innerHTML = '';
      products.forEach(item => {
        productsGrid.innerHTML += productCard(item);
      });
    })
    .catch(error => {
      console.error('Error al realizar el fetch:', error);
      document.getElementById('data-container').textContent = 'Error al cargar los datos';
    });
}

function setActiveCategory(categoryName) {
  const categorySelectors = document.querySelectorAll('.category-selector');
  categorySelectors.forEach(elem => {
    if (elem.innerText === categoryName) {
      elem.classList.add('active-category');
    } else {
      elem.classList.remove('active-category');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  fetchCategories();
  fetchProductsData();
});