const mongoose = require('mongoose');

// User Model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'staff', 'kitchen', 'customer'], default: 'customer' },
  avatar: String,
  createdAt: { type: Date, default: Date.now }
});

// Menu Item Model
const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  image: String,
  available: { type: Boolean, default: true },
  preparationTime: { type: Number, default: 15 },
  calories: Number,
  tags: [String]
});

// Table Model
const tableSchema = new mongoose.Schema({
  number: { type: Number, required: true, unique: true },
  capacity: { type: Number, default: 4 },
  status: { type: String, enum: ['free', 'occupied', 'reserved', 'cleaning'], default: 'free' },
  currentOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  reservedBy: String,
  reservedTime: Date
});

// Order Model
const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  table: { type: mongoose.Schema.Types.ObjectId, ref: 'Table' },
  tableNumber: Number,
  items: [{
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
    name: String,
    price: Number,
    quantity: Number,
    notes: String,
    status: { type: String, enum: ['pending', 'preparing', 'ready', 'served'], default: 'pending' }
  }],
  status: { type: String, enum: ['pending', 'confirmed', 'preparing', 'ready', 'served', 'billed', 'cancelled'], default: 'pending' },
  channel: { type: String, enum: ['dine-in', 'takeaway', 'swiggy', 'zomato', 'qr', 'kiosk'], default: 'dine-in' },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  subtotal: Number,
  tax: Number,
  discount: Number,
  total: Number,
  paymentMethod: { type: String, enum: ['cash', 'card', 'upi', 'loyalty', 'swiggy', 'zomato'] },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Inventory Model
const inventorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: String,
  unit: String,
  currentStock: { type: Number, default: 0 },
  reorderLevel: { type: Number, default: 10 },
  maxStock: Number,
  costPerUnit: Number,
  supplier: String,
  lastRestocked: Date,
  updatedAt: { type: Date, default: Date.now }
});

// Customer Model
const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  phone: { type: String, unique: true, sparse: true },
  loyaltyPoints: { type: Number, default: 0 },
  tier: { type: String, enum: ['bronze', 'silver', 'gold', 'platinum'], default: 'bronze' },
  totalSpent: { type: Number, default: 0 },
  visitCount: { type: Number, default: 0 },
  lastVisit: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = {
  User: mongoose.model('User', userSchema),
  MenuItem: mongoose.model('MenuItem', menuItemSchema),
  Table: mongoose.model('Table', tableSchema),
  Order: mongoose.model('Order', orderSchema),
  Inventory: mongoose.model('Inventory', inventorySchema),
  Customer: mongoose.model('Customer', customerSchema)
};
