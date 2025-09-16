const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket.controller');

// Crear ticket (checkout completo)
router.post('/', ticketController.crear);

// Listar tickets
router.get('/', ticketController.listar);

// Cobrar ticket (fase 4)
//router.put('/:id/cobrar', ticketController.cobrarTicket);

module.exports = router;