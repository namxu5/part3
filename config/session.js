module.exports = {
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false
};
