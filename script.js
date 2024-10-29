const apiURL = 'https://dummyjson.com';
let productsCategories = [];
let products = undefined;
let cartProducts = [];

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
      <button onclick="addToCart(${product.id})" title="Añadir al carrito" class="position-absolute top-0 end-0 m-2">${cartIcon}</button>
      <div class="ratio ratio-16x9">
        <img src="${product.thumbnail}" alt="" class="w-100 object-fit-contain">
      </div>
      <div class="d-flex flex-column p-3">
        <a class="product-card-link text-decoration-none text-dark fw-bold mb-3" href="/producto.html" class="fw-bold">${product.title}</a>
        <p class="fw-bold m-0 text-accent">$${product.price}</p>
      </div>
    </article>
  `;
}

const cartItem = (item) => {
  return `
    <div class="py-2 d-flex align-items-center">
      <div class="cart-product-img-container border rounded">
        <img class="w-100" src="${item.product.thumbnail}" alt="">
      </div>
      <div class="cart-product-details-container ms-2">
        <p class="mb-0 fw-semibold">${item.product.title}</p>
        <p class="mb-0 fw-semibold text-accent">$${item.product.price}</p>
      </div>
      <div class="ms-auto d-flex align-items-center">
        <button id="cart-item-decrease-btn-${item.product.id}" onclick="decreaseItem(${item.product.id})" class="cart-product-control btn btn-dark">&times;</button>
        <p id="cart-product-quantity-${item.product.id}" class="mb-0 mx-2">${item.quantity}</p>
        <button id="cart-item-increment-btn-${item.product.id}" onclick="incrementItem(${item.product.id})" class="cart-product-control btn btn-dark">&plus;</button>
      </div>
    </div>
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

function addToCart(id) {
  const productExist = cartProducts.find((item) => item.product.id === id);
  if (!productExist) {
    const product = products.find(product => product.id === id);
    cartProducts.push({
      product: product,
      quantity: 1
    });
  } else {
    if (productExist.quantity < 10) {
      productExist.quantity++;
    } else {
      alert('Llegaste al máximo de unidades de un mismo artículo.');
    }
  }
  setCartItemCounter();
}

const setCartItemCounter = () => {
  let itemCant = 0;
  const cartCounter = document.getElementById('cart-item-counter');
  if (cartProducts.length < 1) {
    cartCounter.style.display = 'none';
  } else {
    cartProducts.forEach(elem => {
      itemCant += elem.quantity;
    });
    cartCounter.innerText = itemCant;
    cartCounter.style.display = 'flex';
  }
}

const setCartContent = () => {
  const cartContent = document.getElementById('cart-content');
  const cartFooter = document.getElementById('cart-footer');
  const cartTotal = document.getElementById('cart-total');
  if (cartProducts.length > 0) {
    let totalPrice = 0;
    cartFooter.style.display = 'flex';
    cartContent.innerHTML = '';
    cartProducts.forEach(item => {
      totalPrice += item.product.price * item.quantity;
      cartContent.innerHTML += cartItem(item);
    });
    setDecreaseBtn();
    cartTotal.innerText = `Total: $${totalPrice.toFixed(2)}`
  } else {
    cartFooter.style.display = 'none';
    cartContent.innerHTML = `<p>Cuando añadas productos los verás aquí.</p>`;
  }
  setCartItemCounter();
}

const setDecreaseBtn = () => {
  cartProducts.forEach(item => {
    const decreaseBtn = document.getElementById(`cart-item-decrease-btn-${item.product.id}`);
    if (item.quantity > 1) {
      decreaseBtn.innerHTML = `&minus;`;
    } else {
      decreaseBtn.innerHTML = `&times;`;
    }
  });
}

const decreaseItem = (id) => {
  const item = cartProducts.find(item => item.product.id == id);
  if (item.quantity > 1) {
    item.quantity--;
  } else {
    const index = cartProducts.indexOf(item);
    cartProducts.splice(index, 1);
  }
  setCartContent();
}

const incrementItem = (id) => {
  const item = cartProducts.find(item => item.product.id == id);
  const incrementBtn = document.getElementById(`cart-item-increment-btn-${item.product.id}`);
  if (item.quantity < 10) {
    item.quantity++;
  } else {
    incrementBtn.disabled = true;
    alert('Llegaste al máximo de unidades de un mismo artículo.');
  }
  setCartContent();
}

const clearCart = () => {
  cartProducts = [];
  setCartContent();
}

document.addEventListener('DOMContentLoaded', () => {
  setCartItemCounter();
  fetchCategories();
  fetchProductsData();
});