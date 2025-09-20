const Supplier = require('../models/Supplier');
const mongoose = require('mongoose');

module.exports = {
  // Lấy danh sách nhà cung cấp (HTML)
  async list(req, res) {
    try {
      const suppliers = await Supplier.find();
      res.render('suppliers/index', { suppliers, title: 'Danh sách nhà cung cấp' });
    } catch (err) {
      res.status(500).render('suppliers/index', { suppliers: [], title: 'Danh sách nhà cung cấp' });
    }
  },
  
  // API lấy danh sách nhà cung cấp
  async listAPI(req, res) {
    try {
      const suppliers = await Supplier.find();
      res.json({ success: true, suppliers });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Lỗi lấy danh sách nhà cung cấp' });
    }
  },
  // Form chỉnh sửa nhà cung cấp
  async editForm(req, res) {
    try {
      const supplier = await Supplier.findById(req.params.id);
      if (!supplier) return res.status(404).render('suppliers/index', { suppliers: [], title: 'Danh sách nhà cung cấp' });
      res.render('suppliers/form', { supplier, title: 'Chỉnh sửa nhà cung cấp' });
    } catch (err) {
      res.status(500).render('suppliers/index', { suppliers: [], title: 'Danh sách nhà cung cấp' });
    }
  },
  
  // Lấy chi tiết nhà cung cấp
  async detail(req, res) {
    try {
      const id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Id không hợp lệ' });
      }
      const supplier = await Supplier.findById(id);
      if (!supplier) return res.status(404).json({ success: false, message: 'Không tìm thấy nhà cung cấp' });
      res.json({ success: true, supplier });
    } catch (err) {
      console.error('Supplier detail error:', err);
      res.status(500).json({ success: false, message: 'Lỗi lấy chi tiết nhà cung cấp', error: err.message });
    }
  },
  // Thêm nhà cung cấp
  async create(req, res) {
    try {
      const { name, address, phone } = req.body;
      const supplier = await Supplier.create({ name, address, phone });
      
      // Kiểm tra Accept header để phân biệt API và form
      if (req.get('Accept') && req.get('Accept').includes('application/json')) {
        return res.json({ success: true, supplier });
      }
      
      // Form request - redirect về trang danh sách
      res.redirect('/suppliers');
    } catch (err) {
      console.error('Create supplier error:', err);
      if (req.get('Accept') && req.get('Accept').includes('application/json')) {
        return res.status(400).json({ success: false, message: 'Thêm nhà cung cấp thất bại', error: err.message });
      }
      res.redirect('/suppliers');
    }
  },
  // Sửa nhà cung cấp
  async update(req, res) {
    try {
      const { name, address, phone } = req.body;
      const supplier = await Supplier.findByIdAndUpdate(
        req.params.id,
        { name, address, phone },
        { new: true }
      );
      if (!supplier) return res.status(404).json({ success: false, message: 'Không tìm thấy nhà cung cấp' });
      
      // Kiểm tra Accept header để phân biệt API và form
      if (req.get('Accept') && req.get('Accept').includes('application/json')) {
        return res.json({ success: true, supplier });
      }
      
      // Form request - redirect về trang danh sách
      res.redirect('/suppliers');
    } catch (err) {
      console.error('Update supplier error:', err);
      if (req.get('Accept') && req.get('Accept').includes('application/json')) {
        return res.status(400).json({ success: false, message: 'Sửa nhà cung cấp thất bại', error: err.message });
      }
      res.redirect('/suppliers');
    }
  },
  // Xóa nhà cung cấp
  async remove(req, res) {
    try {
      const supplier = await Supplier.findByIdAndDelete(req.params.id);
      if (!supplier) return res.status(404).json({ success: false, message: 'Không tìm thấy nhà cung cấp' });
      
      // Kiểm tra Accept header để phân biệt API và form
      if (req.get('Accept') && req.get('Accept').includes('application/json')) {
        return res.json({ success: true, message: 'Đã xóa nhà cung cấp' });
      }
      
      // Form request - redirect về trang danh sách
      res.redirect('/suppliers');
    } catch (err) {
      console.error('Delete supplier error:', err);
      if (req.get('Accept') && req.get('Accept').includes('application/json')) {
        return res.status(400).json({ success: false, message: 'Xóa nhà cung cấp thất bại', error: err.message });
      }
      res.redirect('/suppliers');
    }
  }
};
