let cartProducts = [];

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
  saveCart();
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
  saveCart();
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
  saveCart();
  setCartContent();
}

const clearCart = () => {
  cartProducts = [];
  localStorage.removeItem('cart');
  setCartContent();
}

const saveCart = () => {
  localStorage.setItem('cart', JSON.stringify(cartProducts));
}

const getCart = () => {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cartProducts = JSON.parse(savedCart);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  getCart();
  setCartItemCounter();
});