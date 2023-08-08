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
const cartContainer = document.getElementById('js-cart-container');

toggleCart.addEventListener('click', () => {
  cartContainer.classList.toggle('open');
});

// fetching static data
const dataContainer = document.getElementById('data');

fetch('http://localhost:3000/post')
.then(res => res.json())
.then(data => {
    data.map(list => {
      dataContainer.innerHTML += `
        <div class="d-flex flex-colum align-items-start flex-wrap pl-4 pr-4 custom-col-5 pb-5 pb-xl-4">
          <div class="thumbnail mb-4">
              <img src="${list.thumbnail}" alt="img1">
          </div>
          <p class="mb-4">${list.description}</p>
          <div class="col-12 pl-0 pr-0 d-flex align-items-center align-self-end justify-content-start">
              <p class="black mr-3 mr-xl-4 accent-color mb-0">$${list.price}</p>
              ${
                list.oldprice !== undefined
                  ? `<p class="black mr-3 mr-xl-4 mb-0">$${list.oldprice}</p>`
                  : ''
              }
              <a id="${list.id}" class="btn btn--invert btn--sm ml-auto uppercase buy-btn">Buy</a>
          </div>
        </div>`;
    });
});



}, false);






