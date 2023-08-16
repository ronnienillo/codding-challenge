document.addEventListener('DOMContentLoaded', () => {

  //svg 
  document.getElementById('svg-icons').innerHTML = SVG_SPRITE;


  // hero
  new Glider(document.querySelector('.glider'), {
    slidesToShow: 1,
    dots: '#dots',
    draggable: false,
    arrows: {
      prev: '.glider-prev',
      next: '.glider-next'
    }
  });

  // Get references to the menu and toggle button
const menu = document.getElementById('js-site-menu-container');
const toggleButton = document.getElementById('js-menu-toggle');
const toggleButtonClose = document.getElementById('js-menu-toggle-close');

// Add a click event listener to the toggle button
toggleButton.addEventListener('click', () => {
  // Toggle the 'open' class on the menu
  menu.classList.toggle('open');
  toggleButton.classList.toggle('open');

});

toggleButtonClose.addEventListener('click', () => {
  // Toggle the 'open' class on the menu
  menu.classList.toggle('open');
  toggleButton.classList.toggle('open');

});


// function for cart preview
const toggleCart = document.getElementById('js-toggle-cart');
const cartBox = document.getElementById('js-cart-box');

toggleCart.addEventListener('click', () => {
  cartBox.classList.toggle('open');
});






// fetching static data
const dataContainer = document.getElementById('data');
const cartContainer = document.getElementById('js-cart-container');
const quantityElement = document.getElementById('quantity');
const cartQTY = document.getElementById('cartQTY');
const totalPriceElement = document.getElementById('total-price');

let totalQuantity = 0;
let totalPrice = 0;
const itemQuantities = {}; // Object to store item quantities

// Function to handle adding an item to the cart
function addToCart(item) {
  // Check if the item is already in the cart
  const existingCartItem = cartContainer.querySelector(`[data-item-id="${item.id}"]`);

  if (existingCartItem) {
    // Item already exists in the cart, increase its quantity
    const quantityElement = existingCartItem.querySelector('.cart-item-qty');
    const currentQuantity = parseInt(quantityElement.textContent);
    const newQuantity = currentQuantity + 1;
    quantityElement.textContent = newQuantity;
    
    // Update itemQuantities object
    itemQuantities[item.id] = newQuantity;
  } else {
    // Create a new cart item element
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.setAttribute('data-item-id', item.id); // Add a data attribute for identification
    cartItem.innerHTML = `
    <div class="row">
      <div class="col-5">
          <img loading="lazy" src="${item.thumbnail}" alt="${item.thumbnail}" />
      </div>
      <div class="col-7">
          ${
            item.bestSeller === true
              ? `<span class="btn btn--xs uppercase btn--rounded mb-2">Best Seller</span>`
              : ''
          }
          <p class="mb-2"><strong>${item.name}</strong></p>
          <p class="mb-0">Size: <span class="uppercase">${item.size}</span></p>
          <p class="mb-0">Color: <span class="capitalize">${item.color}</span></p>
          <p class="mb-2">Qty: <span class="capitalize cart-item-qty">${itemQuantities[item.id] || 1}</span></p>
          <p class="mb-0 black"><strong>$${item.price}</strong></p>
      </div>
    </div>
    <div class="separator mt-4 mb-4"></div>
  `;

  // Append the cart item to the cart container
    cartContainer.appendChild(cartItem);

    // Update itemQuantities object
    itemQuantities[item.id] = 1;
  }

  // Update total quantity and total price
  totalQuantity++;
  totalPrice += item.price;

  // Update UI for quantity and total price
  updateCartInfo();
}

function updateCartInfo() {
  quantityElement.textContent = totalQuantity;
  totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;

  if(totalQuantity >= 1) {
    cartQTY.textContent = totalQuantity;
    cartQTY.classList.add('show');
  }

  if (totalQuantity === 0) {
    cartContainer.innerHTML = '<p class="empty mb-0">Your cart is empty.</p>';
  }
}

fetch('http://localhost:3000/post')
  .then(res => res.json())
  .then(data => {
    data.map(item => {
      const itemContainer = document.createElement('div');
      itemContainer.classList.add(
        'd-flex',
        'flex-colum',
        'align-items-start',
        'flex-wrap',
        'pl-4',
        'pr-4',
        'custom-col-5',
        'pb-5',
        'pb-xl-4'
      );

      itemContainer.innerHTML = `
        <div class="thumbnail mb-4">
          <img src="${item.thumbnail}" alt="img1">
        </div>
        <p class="mb-4">${item.description}</p>
        <div class="col-12 pl-0 pr-0 d-flex align-items-center align-self-end justify-content-start">
          <p class="black mr-3 mr-xl-4 accent-color mb-0">$${item.price}</p>
          ${
            item.oldprice !== undefined
              ? `<p class="black mr-3 mr-xl-4 mb-0">$${item.oldprice}</p>`
              : ''
          }
          <a id="${item.id}" class="btn btn--invert btn--sm ml-auto uppercase buy-btn">Buy</a>
        </div>
      `;

      dataContainer.appendChild(itemContainer);

      // Add click event listener to each "Buy" button
      const buyButton = document.getElementById(item.id);
      buyButton.addEventListener('click', () => {
        addToCart(item); // Add the clicked item to the cart
      });
    });

    // Initial update of cart info
    updateCartInfo();
  });

// Clear cart function (if needed)
function clearCart() {
  cartContainer.innerHTML = '';
  totalQuantity = 0;
  totalPrice = 0;
  updateCartInfo();
}

}, false);






