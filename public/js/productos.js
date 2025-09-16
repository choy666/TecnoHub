/*  productos.js  –  TecnoHub | Vercel-ready
 *  Dependencia: window.ENDPOINTS (expuesto por /js/config.js)
 *  Se ejecuta en productos.html
 * ---------------------------------------------------------- */

// 🔗 Helper GET (usa ENDPOINTS global)
async function apiGet(path) {
  if (!window.ENDPOINTS?.productos) {
    throw new Error('window.ENDPOINTS no está disponible. Asegúrate de cargar /js/config.js antes que este archivo.');
  }
  const res = await fetch(`${window.ENDPOINTS.productos}${path}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

let productos = [];

// 💰 Formato pesos argentinos
function formatearARS(n) {
  try {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(n || 0);
  } catch {
    return `$${Math.round(n || 0)}`;
  }
}

// 🔒 Escapar HTML
function escapeHTML(s) {
  return (s ?? '').toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// 🎯 Render de radios de categorías
function crearRadiosCategorias(categorias) {
  if (!categorias || categorias.length === 0) return '';
  let html = `<div class="mydict"><div>`;
  html += `
    <label>
      <input type="radio" name="categoria" id="cat-todas" value="">
      <span>Todas</span>
    </label>
  `;
  categorias.forEach((cat, i) => {
    const id = `cat-${i}`;
    html += `
      <label>
        <input type="radio" name="categoria" id="${id}" value="${escapeHTML(cat)}">
        <span>${escapeHTML(cat)}</span>
      </label>
    `;
  });
  html += `</div></div>`;
  return html;
}

// 🚀 Inicialización
document.addEventListener('DOMContentLoaded', init);

async function init() {
  const contenedor = document.getElementById('contenedor-productos');
  const filtroContainer = document.getElementById('filtroCategoriaContainer');
  if (!contenedor) return;

  contenedor.innerHTML = `
    <div class="text-center my-5">
      <div class="spinner-border text-dark" role="status" aria-hidden="true"></div>
      <div class="mt-2">Cargando productos...</div>
    </div>
  `;

  try {
    // 1️⃣ Cargar productos desde backend
    const raw = await apiGet('/');
    productos = raw.map(p => ({
      id: p.id,
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio: p.precio,
      stock: p.stock,
      imagen: p.img,
      categoria: p.categoria,
    }));

    // 2️⃣ Filtrar válidos
    productos = productos.filter(p =>
      p.id && p.nombre && p.descripcion && p.categoria &&
      p.precio > 0 && p.stock > 0 &&
      p.imagen && !p.imagen.includes('placeholder')
    );

    // 3️⃣ Render filtros
    const categorias = [...new Set(productos.map(p => p.categoria).filter(Boolean))].sort();
    if (filtroContainer) {
      filtroContainer.innerHTML = crearRadiosCategorias(categorias);
      filtroContainer.addEventListener('change', render);
    }

    // 4️⃣ Primer render
    render();
  } catch (err) {
    console.error('Error al cargar productos:', err);
    contenedor.innerHTML = `<p class="text-danger text-center my-5">No se pudieron cargar los productos. Intentá más tarde.</p>`;
  }

  // 🖼️ Render catálogo
  function render() {
    const categoria = document.querySelector('input[name="categoria"]:checked')?.value || '';
    let filtrados = productos
      .filter(p => p.stock > 0)
      .filter(p => !categoria || p.categoria === categoria);

    contenedor.innerHTML = '';
    const frag = document.createDocumentFragment();

    filtrados.forEach(p => {
      const col = document.createElement('div');
      col.className = 'col-6 col-md-4 col-lg-3 mb-4';
      col.innerHTML = `
        <div class="card clay-card h-100 text-center p-3">
          <div class="flip-img-container mb-3" role="button" aria-label="Ver detalle">
            <div class="flip-img-inner">
              <div class="flip-img-front">
                <img src="${escapeHTML(p.imagen)}" class="img-fluid rounded" alt="${escapeHTML(p.nombre)}">
              </div>
              <div class="flip-img-back d-flex align-items-center justify-content-center flex-column">
                <p class="small px-2 mb-0">${escapeHTML(p.descripcion || 'Sin descripción disponible.')}</p>
                <p class="small color-page position-absolute top-100 start-50 card-stock">${escapeHTML('Stock: ' + p.stock)}</p>
              </div>
            </div>
          </div>
          <div class="card-body">
            <h5 class="card-title titulo-producto mb-1">${escapeHTML(p.nombre)}</h5>
            <p class="card-text color-page">${formatearARS(p.precio)}</p>
            <a href="#" class="btn btn-outline-dark agregar-carrito"
               data-id="${escapeHTML(p.id)}"
               data-nombre="${escapeHTML(p.nombre)}">
              <i class="bi bi-bag-plus-fill fs-4 color-page icono-agregar"></i>
            </a>
          </div>
        </div>
      `;
      frag.appendChild(col);
    });

    contenedor.appendChild(frag);

    // 🛒 Evento agregar al carrito
    contenedor.querySelectorAll('.agregar-carrito').forEach(btn => {
      btn.addEventListener('click', async e => {
        e.preventDefault();
        const id = btn.dataset.id;
        const nombre = btn.dataset.nombre || 'Producto';

        try {
          const fresh = await apiGet(`/${id}`);
          if (!fresh || fresh.stock <= 0) throw new Error('Sin stock');

          const product = {
            id: fresh.id,
            nombre: fresh.nombre,
            precio: fresh.precio,
            stock: fresh.stock
          };

          document.dispatchEvent(new CustomEvent('cart:add', { detail: product }));
        } catch (err) {
          console.error('Error al agregar producto:', err);
          alert('No se pudo agregar el producto. Intentá nuevamente.');
        }
      });
    });
  }
}

// 🛍️ Activar toast al agregar producto
document.addEventListener('cart:add', e => {
  const producto = e.detail;
  const toast = document.getElementById('toast');

  if (toast) {
    const nombre = producto.nombre || 'Producto';
    toast.textContent = `${nombre} agregado al carrito 🛍️`;
    toast.style.display = 'block';

    setTimeout(() => {
      toast.style.display = 'none';
    }, 2000);
  }
});