const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const methodOverride = require('method-override');
const dotenv = require('dotenv');
const expressLayouts = require('express-ejs-layouts');
dotenv.config();

const app = express();
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');
app.use(express.json()); // Thêm dòng này để nhận JSON
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false
}));

// Routes
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const supplierRoutes = require('./routes/suppliers');
const productRoutes = require('./routes/products');

app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/suppliers', supplierRoutes);
app.use('/products', productRoutes);

// DB connect
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/express_crud_app')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
