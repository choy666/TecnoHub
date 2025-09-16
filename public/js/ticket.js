/*  ticket.js  –  TecnoHub | Vercel-ready
 *  Dependencia: window.ENDPOINTS (expuesto por /js/config.js)
 *  Se ejecuta en ticket.html
 * ---------------------------------------------------------- */

// 📡 Helpers (usan ENDPOINTS global)
async function apiGet(path) {
  if (!window.ENDPOINTS?.tickets) {
    throw new Error('window.ENDPOINTS.tickets no está disponible. Asegúrate de cargar /js/config.js antes que este archivo.');
  }
  const res = await fetch(`${window.ENDPOINTS.tickets}${path}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

async function apiPost(path, body) {
  if (!window.ENDPOINTS?.tickets) {
    throw new Error('window.ENDPOINTS.tickets no está disponible. Asegúrate de cargar /js/config.js antes que este archivo.');
  }
  const res = await fetch(`${window.ENDPOINTS.tickets}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

// 🛒 Carrito local
function cargarCarrito() {
  try { return JSON.parse(localStorage.getItem('carrito')) || []; }
  catch { return []; }
}

function vaciarCarrito() {
  localStorage.removeItem('carrito');
}

// 🔍 Obtener parámetro de URL
function getParam(name) {
  return new URLSearchParams(location.search).get(name);
}

// 📄 Render ticket por ID
async function mostrarTicket(id) {
  const contenedor = document.getElementById('ticket-detalle');
  if (!contenedor) return;
  try {
    const ticket = await apiGet(`/${id}`);
    contenedor.innerHTML = `
      <h2>Ticket #${ticket.id}</h2>
      <p><strong>Cliente:</strong> ${ticket.customer_name || 'Público General'}</p>
      <ul>
        ${ticket.items.map(i => `<li>${i.qty} × ${i.title} — $${i.price * i.qty}</li>`).join('')}
      </ul>
      <p><strong>Total:</strong> $${ticket.total}</p>
    `;
  } catch (err) {
    console.error(err);
    contenedor.innerHTML = `<p class="text-danger">No se pudo cargar el ticket.</p>`;
  }
}

// 📝 Render resumen de carrito para confirmar
function mostrarResumenCarrito() {
  const carrito = cargarCarrito();
  const contenedor = document.getElementById('ticket-resumen');
  const formTicket = document.getElementById('form-ticket');
  if (!contenedor) return;

  if (!carrito.length) {
    contenedor.innerHTML = `<p>No hay productos en el carrito.</p>`;
    if (formTicket) formTicket.style.display = 'none';
    return;
  }

  contenedor.innerHTML = `
    <ul>
      ${carrito.map(i => `<li>${i.cantidad} × ${i.nombre} — $${i.precio * i.cantidad}</li>`).join('')}
    </ul>
    <p><strong>Total:</strong> $${carrito.reduce((s, i) => s + i.precio * i.cantidad, 0)}</p>
  `;
}

// 📤 Enviar ticket al backend
async function enviarTicket(ev) {
  ev.preventDefault();
  const carrito = cargarCarrito();
  if (!carrito.length) return alert('El carrito está vacío.');

  const nombre = document.getElementById('nombreCliente')?.value.trim() || '';
  const email = document.getElementById('emailCliente')?.value.trim() || '';

  try {
    const body = {
      customer: { name: nombre || 'Público General', email },
      items: carrito.map(i => ({ id: i.id, qty: i.cantidad }))
    };
    const ticket = await apiPost('/', body);
    vaciarCarrito();
    window.location.href = `ticket.html?id=${encodeURIComponent(ticket.id)}`;
  } catch (err) {
    console.error(err);
    alert('No se pudo confirmar el pedido.');
  }
}

// 🚀 Inicializar
document.addEventListener('DOMContentLoaded', () => {
  const id = getParam('id');
  if (id) {
    document.getElementById('form-ticket')?.remove();
    document.getElementById('ticket-resumen')?.remove();
    mostrarTicket(id);
  } else {
    mostrarResumenCarrito();
    document.getElementById('form-ticket')?.addEventListener('submit', enviarTicket);
  }
});