let cart = [];

const currencyFormat = new Intl.NumberFormat('fr-CA', {
  style: 'currency',
  currency: 'CAD',
});

function addToCart(productName, price, imagePath) {
  const existingItem = cart.find(item => item.name === productName);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name: productName, price: price, quantity: 1, image: imagePath });
  }

  updateCart();
}

function changeQuantity(index, amount) {
  cart[index].quantity += amount;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  updateCart();
}

function updateCart() {
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');

  cartItems.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    const li = document.createElement('li');
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    li.innerHTML = `
      <img src="${item.image}" alt="${item.name}" style="width:30px; height:auto; margin-right:8px; vertical-align:middle;">
      ${item.name} x${item.quantity} - ${currencyFormat.format(itemTotal)}
    `;

    // Boutons
    const minusBtn = document.createElement('button');
    minusBtn.textContent = '➖';
    minusBtn.onclick = () => changeQuantity(index, -1);

    const plusBtn = document.createElement('button');
    plusBtn.textContent = '➕';
    plusBtn.onclick = () => changeQuantity(index, 1);

    const removeBtn = document.createElement('button');
    removeBtn.textContent = '🗑️';
    removeBtn.onclick = () => {
      cart.splice(index, 1);
      updateCart();
    };

    li.appendChild(minusBtn);
    li.appendChild(plusBtn);
    li.appendChild(removeBtn);

    cartItems.appendChild(li);
  });

  cartTotal.textContent = currencyFormat.format(total);
}


