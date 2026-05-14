// Frontend en mismo origen que la API → URL base vacía
const API = '';

let token       = null;
let userData    = null;
let cart        = [];
let allProducts = [];
let searchTimeout = null;

const $ = id => document.getElementById(id);

/* ── UTILIDADES ── */
function fmt(n) {
  return Number(n).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
}

function toast(msg, type = 'ok') {
  const t = $('toast');
  t.textContent = msg;
  t.className = `show toast-${type}`;
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.className = ''; }, 3200);
}

function setAlert(id, msg, type = 'error') {
  $(id).innerHTML = msg
    ? `<div class="alert alert-${type === 'error' ? 'error' : 'success'}">${msg}</div>`
    : '';
}

async function apiFetch(path, opts = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res  = await fetch(API + path, { ...opts, headers });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ── AUTH ── */
function switchTab(tab) {
  ['login', 'register'].forEach(t => {
    $(`tab-${t}`).classList.toggle('hidden', t !== tab);
  });
  document.querySelectorAll('.auth-tab').forEach((el, i) => {
    el.classList.toggle('active',
      (i === 0 && tab === 'login') || (i === 1 && tab === 'register')
    );
  });
  setAlert('login-alert', '');
  setAlert('register-alert', '');
}

async function doLogin() {
  const email = $('login-email').value.trim();
  const pass  = $('login-pass').value;
  if (!email || !pass) return setAlert('login-alert', 'Completá todos los campos.');
  const { ok, data } = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password: pass })
  });
  if (!ok) return setAlert('login-alert', data.message || 'Error al iniciar sesión.');
  token    = data.token;
  userData = data.user;
  enterApp();
}

async function doRegister() {
  const email = $('reg-email').value.trim();
  const pass  = $('reg-pass').value;
  const pass2 = $('reg-pass2').value;
  if (!email || !pass) return setAlert('register-alert', 'Completá todos los campos.');
  if (pass !== pass2)  return setAlert('register-alert', 'Las contraseñas no coinciden.');
  if (pass.length < 6) return setAlert('register-alert', 'Mínimo 6 caracteres.');
  const { ok, data } = await apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password: pass })
  });
  if (!ok) return setAlert('register-alert', data.message || 'Error al registrarse.');
  setAlert('register-alert', '¡Cuenta creada! Iniciá sesión.', 'success');
  $('reg-email').value = $('reg-pass').value = $('reg-pass2').value = '';
  setTimeout(() => switchTab('login'), 1500);
}

function doLogout() {
  token = userData = null;
  cart = [];
  $('auth-screen').style.display = 'flex';
  $('app-screen').style.display  = 'none';
  $('login-email').value = $('login-pass').value = '';
  setAlert('login-alert', '');
  toast('Sesión cerrada', 'ok');
}

/* ── NAVEGACIÓN ── */
function enterApp() {
  $('auth-screen').style.display = 'none';
  $('app-screen').style.display  = 'flex';
  $('sidebar-email').textContent  = userData.email;
  if (userData.role === 'admin') {
    $('sidebar-badge').classList.remove('hidden');
    $('admin-nav').classList.remove('hidden');
  }
  navigate('products');
  loadProducts();
}

function navigate(page) {
  document.querySelectorAll('.main-content > div').forEach(d => d.classList.add('hidden'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  $(`page-${page}`).classList.remove('hidden');
  const el = document.querySelector(`[data-page="${page}"]`);
  if (el) el.classList.add('active');
  if (page === 'orders')         loadOrders();
  if (page === 'admin-products') loadAdminProducts();
  if (page === 'admin-clients')  loadAdminClients();
  if (page === 'cart')           renderCartPage();
}

/* ── PRODUCTOS ── */
async function loadProducts() {
  $('search-input').value = '';
  $('products-container').innerHTML =
    '<div class="loading-box"><div class="spinner"></div> Cargando…</div>';
  const { ok, data } = await apiFetch('/products');
  if (!ok) {
    $('products-container').innerHTML = '<p style="color:var(--danger)">Error al cargar productos.</p>';
    return;
  }
  allProducts = data;
  renderProducts(allProducts);
}

function renderProducts(list) {
  if (!list.length) {
    $('products-container').innerHTML = `
      <div class="empty-state">
        <div class="big">🔍</div>
        <h3>Sin resultados</h3>
        <p>No encontramos productos que coincidan.</p>
      </div>`;
    return;
  }
  const icons = ['👕','👖','👟','🧥','🎒','🧣','🕶️','👒'];
  $('products-container').innerHTML = `<div class="products-grid">${
    list.map((p, i) => `
      <div class="product-card">
        <div class="product-icon">${icons[i % icons.length]}</div>
        <div class="product-name">${esc(p.name)}</div>
        <div class="product-desc">${esc(p.description || '—')}</div>
        <div class="product-footer">
          <span class="product-price">${fmt(p.price)}</span>
          <span class="${stockChip(p.stock)}">${stockLabel(p.stock)}</span>
        </div>
        <div class="qty-control">
          <button onclick="cartDec('${p.id}')">−</button>
          <span id="qty-${p.id}">${getCartQty(p.id)}</span>
          <button onclick="cartInc(${JSON.stringify(p).replace(/</g,'&lt;')})">+</button>
        </div>
        <button class="btn btn-primary btn-sm btn-full"
          onclick="addToCart(${JSON.stringify(p).replace(/</g,'&lt;')})">
          🛒 Agregar al carrito
        </button>
      </div>`).join('')
  }</div>`;
}

function stockChip(s)  { return s > 10 ? 'chip chip-green' : s > 0 ? 'chip chip-orange' : 'chip chip-red'; }
function stockLabel(s) { return s > 10 ? `Stock: ${s}` : s > 0 ? `⚠️ Últimas ${s} u.` : '❌ Sin stock'; }

function onSearch() {
  clearTimeout(searchTimeout);
  const q = $('search-input').value.trim();
  if (!q) { renderProducts(allProducts); return; }
  searchTimeout = setTimeout(async () => {
    const { ok, data } = await apiFetch(`/products/search?q=${encodeURIComponent(q)}`);
    if (ok) renderProducts(data);
  }, 350);
}

/* ── CARRITO ── */
function getCartQty(id) {
  const item = cart.find(c => c.product.id === id);
  return item ? item.qty : 0;
}

function addToCart(product) {
  if (product.stock <= 0) { toast('Sin stock disponible', 'err'); return; }
  const idx = cart.findIndex(c => c.product.id === product.id);
  if (idx >= 0) {
    if (cart[idx].qty >= product.stock) { toast('Stock máximo alcanzado', 'err'); return; }
    cart[idx].qty++;
  } else {
    cart.push({ product, qty: 1 });
  }
  updateCartUI(product.id);
  toast(`${product.name} agregado 🛒`, 'ok');
}

function cartInc(product) { addToCart(product); }

function cartDec(id) {
  const idx = cart.findIndex(c => c.product.id === id);
  if (idx < 0) return;
  cart[idx].qty--;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  updateCartUI(id);
}

function removeFromCart(id) {
  cart = cart.filter(c => c.product.id !== id);
  updateCartUI(id);
  renderCartPage();
}

function updateCartUI(id) {
  const el = $(`qty-${id}`);
  if (el) el.textContent = getCartQty(id);
  $('nav-cart-count').textContent = cart.reduce((s, c) => s + c.qty, 0);
}

function renderCartPage() {
  const wrap = $('cart-view');
  if (!cart.length) {
    wrap.innerHTML = `
      <div class="empty-state">
        <div class="big">🛒</div>
        <h3>Tu carrito está vacío</h3>
        <p>Agregá productos desde el catálogo.</p>
        <button class="btn btn-primary" style="margin-top:1rem" onclick="navigate('products')">
          Ver productos
        </button>
      </div>`;
    return;
  }
  const total = cart.reduce((s, c) => s + c.product.price * c.qty, 0);
  wrap.innerHTML = `
    <div class="orders-list">
      ${cart.map(c => `
        <div class="order-card">
          <div class="order-head">
            <span class="product-name">${esc(c.product.name)}</span>
            <span class="order-total">${fmt(c.product.price * c.qty)}</span>
          </div>
          <div class="order-items">
            <div class="order-item-row">
              <span>${fmt(c.product.price)} × ${c.qty} u.</span>
              <button class="btn btn-danger btn-sm" onclick="removeFromCart('${c.product.id}')">✕ Quitar</button>
            </div>
            <div style="display:flex;align-items:center;gap:.6rem;margin-top:.4rem">
              <button class="btn btn-outline btn-sm"
                onclick="cartDec('${c.product.id}');renderCartPage()">−</button>
              <span style="font-weight:700">${c.qty}</span>
              <button class="btn btn-outline btn-sm"
                onclick="cartInc(${JSON.stringify(c.product).replace(/</g,'&lt;')});renderCartPage()">+</button>
            </div>
          </div>
        </div>`).join('')}
    </div>
    <div style="margin-top:1.5rem;background:var(--surface);border:1px solid var(--border);
                border-radius:var(--radius);padding:1.4rem">
      <div class="order-head" style="border:none;padding:0;margin-bottom:1rem">
        <span style="font-size:1rem;font-weight:700">Total a pagar</span>
        <span class="order-total">${fmt(total)}</span>
      </div>
      <div id="checkout-alert"></div>
      <button class="btn btn-success btn-full" onclick="checkout()">✅ Confirmar pedido</button>
    </div>`;
}

async function checkout() {
  if (!cart.length) return;
  const items = cart.map(c => ({ product_id: c.product.id, quantity: c.qty }));
  const { ok, data } = await apiFetch('/orders', {
    method: 'POST',
    body: JSON.stringify({ items })
  });
  if (!ok) { setAlert('checkout-alert', data.message || 'Error al crear el pedido.'); return; }
  cart = [];
  $('nav-cart-count').textContent = '0';
  allProducts.forEach(p => { const el = $(`qty-${p.id}`); if (el) el.textContent = 0; });
  toast(`¡Pedido creado! Total: ${fmt(data.total)}`, 'ok');
  navigate('orders');
}

/* ── MIS PEDIDOS ── */
async function loadOrders() {
  $('orders-container').innerHTML =
    '<div class="loading-box"><div class="spinner"></div></div>';
  const { ok, data } = await apiFetch('/orders');
  if (!ok) {
    $('orders-container').innerHTML = `<p style="color:var(--danger)">${data.message || 'Error'}</p>`;
    return;
  }
  if (!data.length) {
    $('orders-container').innerHTML = `
      <div class="empty-state">
        <div class="big">📋</div>
        <h3>Sin pedidos todavía</h3>
        <p>Hacé tu primera compra en el catálogo.</p>
      </div>`;
    return;
  }
  $('orders-container').innerHTML = `<div class="orders-list">${
    data.map(o => {
      const items = typeof o.items === 'string' ? JSON.parse(o.items) : o.items;
      return `
        <div class="order-card">
          <div class="order-head">
            <div>
              <div class="order-id"># ${o.id}</div>
              <div class="order-date">${new Date(o.created_at).toLocaleString('es-AR')}</div>
            </div>
            <span class="order-total">${fmt(o.total)}</span>
          </div>
          <div class="order-items">
            ${items.map(i => `
              <div class="order-item-row">
                <span>${esc(i.name)}</span>
                <span>${i.quantity} × ${fmt(i.price_at_purchase)}</span>
              </div>`).join('')}
          </div>
        </div>`;
    }).join('')
  }</div>`;
}

/* ── ADMIN: PRODUCTOS ── */
async function loadAdminProducts() {
  $('admin-products-container').innerHTML =
    '<div class="loading-box"><div class="spinner"></div></div>';
  const { ok, data } = await apiFetch('/admin/products');
  if (!ok) {
    $('admin-products-container').innerHTML = `<p style="color:var(--danger)">${data.message || 'Error'}</p>`;
    return;
  }
  $('admin-products-container').innerHTML = `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Nombre</th><th>Descripción</th>
            <th>Precio</th><th>Stock</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>${data.map(p => `
          <tr>
            <td class="mono">${p.id.slice(0, 8)}…</td>
            <td><strong>${esc(p.name)}</strong></td>
            <td style="max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
              ${esc(p.description || '—')}
            </td>
            <td>${fmt(p.price)}</td>
            <td><span class="${stockChip(p.stock)}">${p.stock}</span></td>
            <td>
              <button class="btn btn-outline btn-sm"
                onclick='openProductModal(${JSON.stringify(p)})'>✏️ Editar</button>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

/* ── ADMIN: CLIENTES ── */
async function loadAdminClients() {
  $('admin-clients-container').innerHTML =
    '<div class="loading-box"><div class="spinner"></div></div>';
  const { ok, data } = await apiFetch('/admin/clients');
  if (!ok) {
    $('admin-clients-container').innerHTML = `<p style="color:var(--danger)">${data.message || 'Error'}</p>`;
    return;
  }
  $('admin-clients-container').innerHTML = `
    <div class="table-wrap">
      <table>
        <thead><tr><th>ID</th><th>Email</th><th>Rol</th></tr></thead>
        <tbody>${data.map(u => `
          <tr>
            <td class="mono">${u.id.slice(0, 8)}…</td>
            <td>${esc(u.email)}</td>
            <td>
              <span class="chip ${u.role === 'admin' ? 'chip-orange' : 'chip-green'}">${u.role}</span>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

/* ── MODAL PRODUCTO ── */
function openProductModal(product = null) {
  $('modal-product-id').value  = product ? product.id              : '';
  $('modal-title').textContent = product ? 'Editar producto'       : 'Nuevo producto';
  $('modal-name').value        = product ? product.name            : '';
  $('modal-desc').value        = product ? (product.description || '') : '';
  $('modal-price').value       = product ? product.price           : '';
  $('modal-stock').value       = product ? product.stock           : '';
  setAlert('modal-alert', '');
  $('modal-overlay').classList.remove('hidden');
}

function closeModal() {
  $('modal-overlay').classList.add('hidden');
}

async function saveProduct() {
  const id    = $('modal-product-id').value;
  const name  = $('modal-name').value.trim();
  const desc  = $('modal-desc').value.trim();
  const price = parseFloat($('modal-price').value);
  const stock = parseInt($('modal-stock').value);

  if (!name)        return setAlert('modal-alert', 'El nombre es obligatorio.');
  if (isNaN(price)) return setAlert('modal-alert', 'El precio no es válido.');
  if (isNaN(stock)) return setAlert('modal-alert', 'El stock no es válido.');

  const body   = JSON.stringify({ name, description: desc, price, stock });
  const method = id ? 'PUT'               : 'POST';
  const path   = id ? `/admin/products/${id}` : '/admin/products';

  const { ok, data } = await apiFetch(path, { method, body });
  if (!ok) return setAlert('modal-alert', data.message || 'Error al guardar.');

  closeModal();
  toast(id ? 'Producto actualizado ✅' : 'Producto creado ✅', 'ok');
  loadAdminProducts();
}