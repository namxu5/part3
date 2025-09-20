const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const supplierController = require('../controllers/supplierController');

// HTML Routes
router.get('/', supplierController.list);
router.get('/new', (req, res) => res.render('suppliers/form', { supplier: null, title: 'Thêm nhà cung cấp mới' }));
router.get('/:id/edit', supplierController.editForm);

// API Routes
router.post('/api', auth, supplierController.create);
router.put('/api/:id', auth, supplierController.update);
router.delete('/api/:id', auth, supplierController.remove);
router.get('/api', auth, supplierController.listAPI);
router.get('/api/:id', auth, supplierController.detail);

module.exports = router;
