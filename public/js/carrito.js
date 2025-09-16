/*  carrito.js  –  TecnoHub | Vercel-ready
 *  Dependencia: window.ENDPOINTS (expuesto por /js/config.js)
 *  Se ejecuta en index.html y productos.html
 * ---------------------------------------------------------- */

// 🔗 Helper GET (usa ENDPOINTS global)
async function apiGet(path) {
  if (!window.ENDPOINTS?.productos) {
    throw new Error('window.ENDPOINTS no está disponible. Asegúrate de cargar /js/config.js antes que este archivo.');
  }
  const res = await fetch(`${window.ENDPOINTS.productos}${path}`, {
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

// 🔗 Helper POST (usa ENDPOINTS global)
async function apiPost(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

// 🛒 Estado del carrito
const carrito = [];

// 🔍 Referencias DOM (null-safe)
const carritoLista         = document.getElementById('carritoLista');
const carritoTotal         = document.getElementById('carritoTotal');
const contadorCarrito      = document.getElementById('contadorCarrito');
const finalizarBtn         = document.getElementById('finalizarCompraBtn');

// 💰 Formato pesos argentinos
function formatearARS(n) {
  try {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency', currency: 'ARS',
      minimumFractionDigits: 0, maximumFractionDigits: 0
    }).format(n || 0);
  } catch {
    return `$${Math.round(n || 0)}`;
  }
}

// 📦 Cargar carrito desde localStorage
function cargarCarrito() {
  try {
    const guardado = JSON.parse(localStorage.getItem('carrito') || '[]');
    carrito.length = 0;
    Array.prototype.push.apply(carrito, guardado);
    actualizarCarrito();
  } catch (e) {
    console.error('Error al cargar carrito:', e);
    localStorage.removeItem('carrito');
  }
}

// 💾 Guardar carrito en localStorage
function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarContador();
}

// 🖼️ Renderizar vista del carrito
function actualizarCarrito() {
  if (!carritoLista) return;
  carritoLista.innerHTML = '';
  let total = 0;

  carrito.forEach((item, idx) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.innerHTML = `
      <div>
        <h6 class="my-0">${item.nombre}</h6>
        <small class="text-muted">${item.cantidad} × ${formatearARS(item.precio)}</small>
      </div>
      <div class="d-flex align-items-center gap-2">
        <button class="btn btn-sm btn-outline-secondary" onclick="cambiarCantidad(${idx}, ${item.cantidad - 1})">-</button>
        <span class="badge bg-primary rounded-pill">${item.cantidad}</span>
        <button class="btn btn-sm btn-outline-secondary" onclick="cambiarCantidad(${idx}, ${item.cantidad + 1})">+</button>
        <span class="text-nowrap">${formatearARS(subtotal)}</span>
        <button class="btn btn-sm btn-danger" onclick="eliminarDelCarrito(${idx})">×</button>
      </div>`;
    carritoLista.appendChild(li);
  });

  if (carritoTotal) carritoTotal.textContent = formatearARS(total);
  guardarCarrito();
}

// ➕ Agregar producto al carrito
window.agregarAlCarrito = function (producto) {
  const existente = carrito.find(i => i.id === producto.id);
  existente ? existente.cantidad++ : carrito.push({ ...producto, cantidad: 1 });
  actualizarCarrito();

  const toast = new bootstrap.Toast(document.getElementById('toastAgregado'));
  toast.show();
};

// 🔢 Modificar cantidad
window.cambiarCantidad = function (idx, nueva) {
  if (nueva < 1) return eliminarDelCarrito(idx);
  carrito[idx].cantidad = nueva;
  actualizarCarrito();
};

// 🗑️ Eliminar item
window.eliminarDelCarrito = function (idx) {
  carrito.splice(idx, 1);
  actualizarCarrito();
};

// 🔢 Actualizar contador del icono
function actualizarContador() {
  if (!contadorCarrito) return;
  const total = carrito.reduce((t, i) => t + i.cantidad, 0);
  contadorCarrito.textContent = total;
  contadorCarrito.style.display = total > 0 ? 'inline-block' : 'none';
}

// 🚀 Finalizar compra
document.addEventListener('DOMContentLoaded', () => {
  cargarCarrito();

  if (!finalizarBtn) return;
  finalizarBtn.addEventListener('click', async () => {
    if (carrito.length === 0) return;

    try {
      finalizarBtn.disabled = true;
      finalizarBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Procesando...';

      const res = await apiPost(window.ENDPOINTS.compras, {
        items: carrito,
        fecha: new Date().toISOString(),
        estado: 'pendiente'
      });

      carrito.length = 0;
      actualizarCarrito();
      alert(`¡Compra realizada! Pedido #${res.id || '—'}`);
    } catch (err) {
      console.error(err);
      alert('No se pudo procesar la compra. Intentalo nuevamente.');
    } finally {
      finalizarBtn.disabled = false;
      finalizarBtn.textContent = 'Finalizar Compra';
    }
  });
});

// 🌐 Exponer funciones globales (para debug u otros scripts)
window.carrito             = carrito;
window.actualizarCarrito   = actualizarCarrito;
window.actualizarContador  = actualizarContador;