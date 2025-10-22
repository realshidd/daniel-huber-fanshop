// Fanshop data & cart logic
const products = [
  {
    id: "tee-boniswil",
    title: "Huber Loves Boniswil – T‑Shirt",
    img: "./assets/tee-boniswil.png",
    price: 39.0,
    tag: "Classic"
  },
  {
    id: "laser-mug",
    title: "Laseraugen Tasse",
    img: "./assets/laser-mug.png",
    price: 18.0,
    tag: "Best Seller"
  },
  {
    id: "laser-can",
    title: "HUBER LASER – Dose",
    img: "./assets/laser-can.png",
    price: 4.2,
    tag: "Energy"
  },
  {
    id: "laser-boxers",
    title: "Laseraugen Boxers",
    img: "./assets/laser-boxers.png",
    price: 24.0,
    tag: "Drip"
  },
  {
    id: "cider-bottle",
    title: "Huber Cider – Flasche",
    img: "./assets/cider-bottle.png",
    price: 6.5,
    tag: "Limited"
  }
];

const grid = document.getElementById('productGrid');
products.forEach(p => {
  const card = document.createElement('article');
  card.className = 'card';
  card.innerHTML = `
    <div class="media"><img loading="lazy" src="${p.img}" alt="${p.title}"></div>
    <div class="body">
      <h3>${p.title}</h3>
      <div class="price">
        <span class="badge">${p.tag}</span>
        <strong>CHF ${p.price.toFixed(2)}</strong>
      </div>
      <div style="margin-top:12px; display:flex; gap:10px">
        <button class="btn primary add" data-id="${p.id}">In den Warenkorb</button>
        <button class="btn ghost view" data-id="${p.id}">Details</button>
      </div>
    </div>`;
  grid.appendChild(card);
});

const cart = [];
const cartBtn = document.getElementById('cartBtn');
const cartDrawer = document.getElementById('cartDrawer');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartSubtotal = document.getElementById('cartSubtotal');
const closeCart = document.getElementById('closeCart');

function fmt(amount) { return new Intl.NumberFormat('de-CH', { style: 'currency', currency: 'CHF' }).format(amount); }

function openCart() { cartDrawer.classList.add('open'); cartDrawer.setAttribute('aria-hidden', 'false'); }
function closeCartDrawer() { cartDrawer.classList.remove('open'); cartDrawer.setAttribute('aria-hidden', 'true'); }

cartBtn.addEventListener('click', openCart);
closeCart.addEventListener('click', closeCartDrawer);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeCartDrawer(); });

function renderCart() {
  cartItems.innerHTML = '';
  let sum = 0;
  cart.forEach(item => {
    const row = document.createElement('div');
    row.className = 'cart-item';
    const p = products.find(x => x.id === item.id);
    sum += p.price * item.qty;
    row.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <div>
        <div style="font-weight:700">${p.title}</div>
        <div style="color:#9bb0d0; font-size:14px">CHF ${p.price.toFixed(2)} × 
          <button class="icon-btn dec" data-id="${item.id}" aria-label="Menge verringern">−</button>
          <strong>${item.qty}</strong>
          <button class="icon-btn inc" data-id="${item.id}" aria-label="Menge erhoehen">+</button>
        </div>
      </div>
      <button class="icon-btn rm" data-id="${item.id}" aria-label="Entfernen">✕</button>`;
    cartItems.appendChild(row);
  });
  cartCount.textContent = cart.reduce((a, b) => a + b.qty, 0);
  cartSubtotal.textContent = fmt(sum);
  if (cart.length === 0) {
    cartItems.innerHTML = '<p style="color:#9bb0d0">Leer – goen wir shoppen 😛😛😛😛</p>';
  }
}

document.body.addEventListener('click', (e) => {
  if (e.target.matches('.add')) {
    const id = e.target.dataset.id;
    const found = cart.find(i => i.id === id);
    if (found) found.qty++; else cart.push({ id, qty: 1 });
    renderCart(); openCart();
  }
  if (e.target.matches('.inc')) {
    const id = e.target.dataset.id;
    const it = cart.find(i => i.id === id); if (it) it.qty++;
    renderCart();
  }
  if (e.target.matches('.dec')) {
    const id = e.target.dataset.id;
    const it = cart.find(i => i.id === id); if (it && it.qty > 1) it.qty--; else removeItem(id);
    renderCart();
  }
  if (e.target.matches('.rm')) {
    removeItem(e.target.dataset.id); renderCart();
  }
  if (e.target.matches('.view')) {
    const p = products.find(x => x.id === e.target.dataset.id);
    alert(`${p.title}\n\nQualitaet: tuff.\nBoniswil‑Approved: 100%.\n\nPreis: CHF ${p.price.toFixed(2)}`);
  }
});

function removeItem(id) {
  const idx = cart.findIndex(i => i.id === id);
  if (idx > -1) cart.splice(idx, 1);
}

// Checkout modal
const checkoutBtn = document.getElementById('checkoutBtn');
const modal = document.getElementById('checkoutModal');
const closeModal = document.getElementById('closeModal');
const checkoutForm = document.getElementById('checkoutForm');

checkoutBtn.addEventListener('click', () => { modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); });
closeModal.addEventListener('click', () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); });
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal.click(); });
checkoutForm.addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Besten Dank! Deine Bestellung ist eingegangen. Daniel Huber gruessst – Boniswil bleibt js.');
  modal.classList.remove('open'); closeCartDrawer(); cart.splice(0, cart.length); renderCart();
});

// Year
document.getElementById('year').textContent = new Date().getFullYear();
// Initial
renderCart();
