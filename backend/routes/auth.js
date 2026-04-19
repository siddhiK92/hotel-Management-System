const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'hotelms_secret_key_2024';

// Demo users for quick login
const demoUsers = [
  { _id: 'admin1', name: 'Admin User', email: 'admin@hotel.com', password: bcrypt.hashSync('admin123', 10), role: 'admin' },
  { _id: 'staff1', name: 'Staff Member', email: 'staff@hotel.com', password: bcrypt.hashSync('staff123', 10), role: 'staff' },
  { _id: 'kitchen1', name: 'Kitchen Chef', email: 'kitchen@hotel.com', password: bcrypt.hashSync('kitchen123', 10), role: 'kitchen' },
];

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check demo users first
    let user = demoUsers.find(u => u.email === email);
    if (!user) {
      try { user = await User.findOne({ email }); } catch {}
    }
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, name: user.name, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed, role: role || 'customer' });
    await user.save();
    const token = jwt.sign({ id: user._id, name, email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, name, email, role: user.role } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
