// 🔧 Configuración centralizada de endpoints

// Detectar entorno de desarrollo
const isLocal = window.location.hostname === 'localhost' || 
                window.location.hostname === '127.0.0.1' ||
                window.location.hostname.endsWith('.local');

// Configuración de la API
const API_BASE = isLocal
  ? 'http://localhost:3000/api'  // Desarrollo local
  : 'https://tecno-hub.vercel.app/api';  // Producción

// Endpoints específicos
window.ENDPOINTS = {
  productos: `${API_BASE}/productos`,
  usuarios: `${API_BASE}/usuarios`,
  pedidos: `${API_BASE}/pedidos`,
  compras: `${API_BASE}/compra`,
  tickets: `${API_BASE}/tickets`,
};

// Para depuración
console.log('[config.js] Entorno:', isLocal ? 'local' : 'producción');