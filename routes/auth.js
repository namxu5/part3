const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Đăng ký
router.get('/register', authController.showRegister);
router.post('/register', authController.register);

// Đăng nhập
router.get('/login', authController.showLogin);
router.post('/login', authController.login);

// Quên mật khẩu
router.get('/forgot', authController.showForgot);
router.post('/forgot', authController.forgot);

// Đăng xuất
router.get('/logout', authController.logout);

module.exports = router;
