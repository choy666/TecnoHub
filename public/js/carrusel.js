/*  carrusel.js  –  TecnoHub | Vercel-ready
 *  Dependencia: window.ENDPOINTS (expuesto por /js/config.js)
 *  Se ejecuta únicamente en index.html
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

// Formato pesos argentinos
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

// Inicializar Splide una sola vez
function inicializarCarrusel() {
  const lista = document.getElementById('lista-productos');
  const contenedorCarrusel = document.querySelector('.splide');

  if (!lista || !contenedorCarrusel) return;

  contenedorCarrusel.style.display = 'block';

  return new Splide('.splide', {
    type: 'loop',
    perPage: 3,
    gap: '1rem',
    pagination: false,
    arrows: true,
    drag: true,
    pauseOnFocus: true,
    pauseOnHover: true,
    autoplay: true,
    interval: 3000,
    breakpoints: {
      992: { perPage: 2 },
      768: { perPage: 1 },
      480: { perPage: 1 }
    }
  }).mount();
}

// Render de productos destacados
async function cargarProductosDestacados() {
  const lista = document.getElementById('lista-productos');
  if (!lista) return;

  try {
    lista.innerHTML = `
      <div class="text-center py-5">
        <div class="spinner-border" role="status"></div>
        <p class="mt-2">Cargando productos...</p>
      </div>`;

    const destacados = await apiGet('/destacados');

    if (!destacados?.length) {
      lista.innerHTML = '<div class="alert alert-info">No hay productos destacados disponibles.</div>';
      return;
    }

    lista.innerHTML = ''; // limpia spinner

    destacados.forEach(p => {
      const slide = document.createElement('li');
      slide.className = 'splide__slide';

      const img = p.img?.trim() || '/img/cat1.jpeg';
      const nombre = p.nombre || 'Producto';
      const precio = formatearARS(p.precio);

      slide.innerHTML = `
        <a href="pages/productos.html?id=${p.id}" class="text-decoration-none text-dark">
          <div class="card-producto">
            <img src="${img}" alt="${nombre}" onerror="this.src='/img/cat1.jpeg'">
            <h3>${nombre}</h3>
            <p class="color-page">${precio}</p>
          </div>
        </a>`;
      lista.appendChild(slide);
    });

    inicializarCarrusel();
  } catch (err) {
    console.error('❌ Error al cargar productos destacados:', err);
    lista.innerHTML = `
      <div class="alert alert-danger">
        Error al cargar los productos. Por favor, recarga la página.
      </div>`;
  }
}

// Arranque
document.addEventListener('DOMContentLoaded', cargarProductosDestacados);