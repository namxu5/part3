const User = require('../models/User');
const bcrypt = require('bcryptjs');

function isJsonRequest(req) {
  const contentType = (req.headers['content-type'] || '').trim().toLowerCase();
  const accept = (req.headers['accept'] || '').trim().toLowerCase();
  return contentType.startsWith('application/json') || accept.includes('application/json');
}

module.exports = {
  showRegister: (req, res) => {
    res.render('register', { title: 'Đăng ký' });
  },
  register: async (req, res) => {
    let { username, password, email, phone } = req.body;
    // Nếu nhận body là string (do gửi JSON sai format), parse lại
    if (typeof req.body === 'string') {
      try {
        const data = JSON.parse(req.body);
        username = data.username;
        password = data.password;
        email = data.email;
        phone = data.phone;
      } catch (e) {}
    }
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, password: hashedPassword, email, phone });
      await user.save();
      if (isJsonRequest(req)) {
        return res.status(200).json({ success: true, message: 'Đăng ký thành công!' });
      }
      res.redirect('/auth/login');
    } catch (err) {
      if (isJsonRequest(req)) {
        return res.status(400).json({ success: false, message: 'Đăng ký thất bại!' });
      }
      res.render('register', { title: 'Đăng ký', error: 'Đăng ký thất bại!' });
    }
  },
  showLogin: (req, res) => {
    res.render('login', { title: 'Đăng nhập' });
  },
  login: async (req, res) => {
    let { username, password } = req.body;
    // Nếu nhận body là string (do gửi JSON sai format), parse lại
    if (typeof req.body === 'string') {
      try {
        const data = JSON.parse(req.body);
        username = data.username;
        password = data.password;
      } catch (e) {}
    }
    try {
      const user = await User.findOne({ username });
      if (!user) {
        if (isJsonRequest(req)) {
          return res.status(401).json({ success: false, message: 'Sai tài khoản hoặc mật khẩu!' });
        }
        return res.render('login', { title: 'Đăng nhập', error: 'Sai tài khoản hoặc mật khẩu!' });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        if (isJsonRequest(req)) {
          return res.status(401).json({ success: false, message: 'Sai tài khoản hoặc mật khẩu!' });
        }
        return res.render('login', { title: 'Đăng nhập', error: 'Sai tài khoản hoặc mật khẩu!' });
      }
      req.session.userId = user._id;
      if (isJsonRequest(req)) {
        return res.status(200).json({ success: true, message: 'Đăng nhập thành công!' });
      }
      res.redirect('/');
    } catch (err) {
      if (isJsonRequest(req)) {
        return res.status(500).json({ success: false, message: 'Đăng nhập thất bại!' });
      }
      res.render('login', { title: 'Đăng nhập', error: 'Đăng nhập thất bại!' });
    }
  },
  showForgot: (req, res) => {
    res.render('forgot', { title: 'Quên mật khẩu' });
  },
  forgot: async (req, res) => {
    let { email } = req.body;
    if (typeof req.body === 'string') {
      try {
        const data = JSON.parse(req.body);
        email = data.email;
      } catch (e) {}
    }
    if (isJsonRequest(req)) {
      // Không gửi email thật, chỉ trả về thông báo mẫu
      return res.status(200).json({ success: true, message: 'Hướng dẫn đã được gửi đến email.' });
    }
    res.render('forgot', { title: 'Quên mật khẩu', message: 'Hướng dẫn đã được gửi đến email.' });
  },
  logout: (req, res) => {
    req.session.destroy(() => {
      res.redirect('/auth/login');
    });
  }
};
