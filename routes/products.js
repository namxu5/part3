const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const productController = require('../controllers/productController');

// HTML Routes
router.get('/', productController.list);
router.get('/new', async (req, res) => {
  const suppliers = await require('../models/Supplier').find();
  res.render('products/form', { product: null, suppliers, title: 'Thêm sản phẩm mới' });
});
router.get('/:id/edit', productController.editForm);

// API Routes
router.post('/api',auth, productController.create);
router.put('/api/:id',auth, productController.update);
router.delete('/api/:id', auth, productController.remove);
router.get('/api', auth, productController.listAPI);
router.get('/api/:id', auth, productController.detail);

module.exports = router;
