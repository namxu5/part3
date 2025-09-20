const express = require('express');
const router = express.Router();
const Supplier = require('../models/Supplier');

router.get('/', async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.render('index', { title: 'Trang chủ', suppliers });
  } catch (err) {
    res.render('index', { title: 'Trang chủ', suppliers: [] });
  }
});

module.exports = router;
