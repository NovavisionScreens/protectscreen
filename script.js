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
  renderPayPalButton(); // Met à jour le bouton PayPal dynamiquement
}

function renderPayPalButton() {
  const paypalContainer = document.getElementById('paypal-button-container');
  if (!paypalContainer) return;

  paypalContainer.innerHTML = '';

  if (cart.length === 0) return;

  paypal.Buttons({
    createOrder: function(data, actions) {
      const items = cart.map(item => ({
        name: item.name,
        unit_amount: {
          value: item.price.toFixed(2),
          currency_code: 'CAD'
        },
        quantity: item.quantity
      }));

      const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

      return actions.order.create({
        purchase_units: [{
          amount: {
            currency_code: "CAD",
            value: total,
            breakdown: {
              item_total: {
                currency_code: "CAD",
                value: total
              }
            }
          },
          items: items
        }]
      });
    },
    onApprove: function(data, actions) {
      return actions.order.capture().then(function(details) {
        alert('Merci ' + details.payer.name.given_name + ' pour votre achat!');
        cart = [];
        updateCart();
      });
    }
  }).render('#paypal-button-container');
}

window.addEventListener('load', updateCart);
