const Product = require('../models/Product');
const Supplier = require('../models/Supplier');

module.exports = {
  // Lấy danh sách sản phẩm (HTML)
  async list(req, res) {
    try {
      const { search, supplier } = req.query;
      let query = {};
      
      // Tìm kiếm theo tên sản phẩm
      if (search) {
        query.name = { $regex: search, $options: 'i' };
      }
      
      // Lọc theo nhà cung cấp
      if (supplier) {
        query.supplier = supplier;
      }
      
      const products = await Product.find(query).populate('supplier');
      const suppliers = await Supplier.find();
      
      res.render('products/index', { 
        products, 
        suppliers,
        search: search || '',
        selectedSupplier: supplier || '',
        title: 'Danh sách sản phẩm' 
      });
    } catch (err) {
      console.error('List products error:', err);
      res.status(500).render('products/index', { 
        products: [], 
        suppliers: [],
        search: '',
        selectedSupplier: '',
        title: 'Danh sách sản phẩm' 
      });
    }
  },
  
  // API lấy danh sách sản phẩm
  async listAPI(req, res) {
    try {
      const products = await Product.find().populate('supplier');
      res.json({ success: true, products });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Lỗi lấy danh sách sản phẩm' });
    }
  },
  // Form chỉnh sửa sản phẩm
  async editForm(req, res) {
    try {
      const product = await Product.findById(req.params.id).populate('supplier');
      const suppliers = await Supplier.find();
      if (!product) return res.status(404).render('products/index', { products: [], title: 'Danh sách sản phẩm' });
      res.render('products/form', { product, suppliers, title: 'Chỉnh sửa sản phẩm' });
    } catch (err) {
      res.status(500).render('products/index', { products: [], title: 'Danh sách sản phẩm' });
    }
  },
  
  // Lấy chi tiết sản phẩm
  async detail(req, res) {
    try {
      const product = await Product.findById(req.params.id).populate('supplier');
      if (!product) return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
      res.json({ success: true, product });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Lỗi lấy chi tiết sản phẩm' });
    }
  },
  // Thêm sản phẩm
  async create(req, res) {
    try {
      const { name, price, quantity, supplier } = req.body;
      const product = await Product.create({ name, price, quantity, supplier });
      // Nếu là route /products/api thì trả về JSON
      if (req.originalUrl.startsWith('/products/api')) {
        return res.json({ success: true, product });
      }
      // Form request - redirect về trang danh sách
      res.redirect('/products');
    } catch (err) {
      console.error('Create product error:', err);
      if (req.originalUrl.startsWith('/products/api')) {
        return res.status(400).json({ success: false, message: 'Thêm sản phẩm thất bại', error: err.message });
      }
      res.redirect('/products');
    }
  },
  // Sửa sản phẩm
  async update(req, res) {
    try {
      const { name, price, quantity, supplier } = req.body;
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        { name, price, quantity, supplier },
        { new: true }
      );
      if (!product) return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
      // Nếu là route /products/api thì trả về JSON
      if (req.originalUrl.startsWith('/products/api')) {
        return res.json({ success: true, product });
      }
      // Form request - redirect về trang danh sách
      res.redirect('/products');
    } catch (err) {
      console.error('Update product error:', err);
      if (req.originalUrl.startsWith('/products/api')) {
        return res.status(400).json({ success: false, message: 'Sửa sản phẩm thất bại', error: err.message });
      }
      res.redirect('/products');
    }
  },
  // Xóa sản phẩm
  async remove(req, res) {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
      // Nếu là route /products/api thì trả về JSON
      if (req.originalUrl.startsWith('/products/api')) {
        return res.json({ success: true, message: 'Đã xóa sản phẩm' });
      }
      // Form request - redirect về trang danh sách
      res.redirect('/products');
    } catch (err) {
      console.error('Delete product error:', err);
      if (req.originalUrl.startsWith('/products/api')) {
        return res.status(400).json({ success: false, message: 'Xóa sản phẩm thất bại', error: err.message });
      }
      res.redirect('/products');
    }
  }
};
