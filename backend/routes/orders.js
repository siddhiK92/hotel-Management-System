const router = require('express').Router();

let orders = [
  { _id: 'o1', orderNumber: '#ORD-2841', tableNumber: 7, items: [{name:'Butter Chicken',price:420,quantity:1,status:'served'},{name:'Garlic Naan',price:80,quantity:2,status:'served'}], status: 'served', channel: 'dine-in', subtotal: 580, tax: 29, discount: 0, total: 609, paymentStatus: 'paid', createdAt: new Date(Date.now()-2*60000) },
  { _id: 'o2', orderNumber: '#ORD-2840', tableNumber: null, items: [{name:'Hyderabadi Biryani',price:380,quantity:1,status:'preparing'},{name:'Mango Lassi',price:120,quantity:1,status:'preparing'}], status: 'preparing', channel: 'swiggy', subtotal: 500, tax: 25, discount: 0, total: 525, paymentStatus: 'pending', createdAt: new Date(Date.now()-8*60000) },
  { _id: 'o3', orderNumber: '#ORD-2839', tableNumber: 12, items: [{name:'Dal Makhani',price:260,quantity:1,status:'served'},{name:'Garlic Naan',price:80,quantity:4,status:'served'}], status: 'billed', channel: 'dine-in', subtotal: 580, tax: 29, discount: 0, total: 609, paymentStatus: 'paid', createdAt: new Date(Date.now()-15*60000) },
  { _id: 'o4', orderNumber: '#ORD-2842', tableNumber: 5, items: [{name:'Paneer Tikka',price:340,quantity:2,status:'preparing'},{name:'Masala Chai',price:60,quantity:2,status:'ready'}], status: 'preparing', channel: 'dine-in', subtotal: 800, tax: 40, discount: 0, total: 840, paymentStatus: 'pending', createdAt: new Date(Date.now()-5*60000) },
  { _id: 'o5', orderNumber: '#ORD-2843', tableNumber: null, items: [{name:'Chicken Tikka Masala',price:440,quantity:1,status:'pending'},{name:'Garlic Naan',price:80,quantity:3,status:'pending'}], status: 'pending', channel: 'zomato', subtotal: 680, tax: 34, discount: 0, total: 714, paymentStatus: 'pending', createdAt: new Date(Date.now()-1*60000) }
];

let nextOrderNum = 2844;

router.get('/', (req, res) => {
  const { status, channel } = req.query;
  let filtered = [...orders];
  if (status) filtered = filtered.filter(o => o.status === status);
  if (channel) filtered = filtered.filter(o => o.channel === channel);
  res.json(filtered.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

router.post('/', (req, res) => {
  const order = {
    _id: 'o' + Date.now(),
    orderNumber: '#ORD-' + nextOrderNum++,
    ...req.body,
    status: 'pending',
    paymentStatus: 'pending',
    createdAt: new Date()
  };
  orders.unshift(order);
  const io = req.app.get('io');
  if (io) io.emit('order:update', order);
  res.status(201).json(order);
});

router.patch('/:id/status', (req, res) => {
  const order = orders.find(o => o._id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Not found' });
  order.status = req.body.status;
  order.updatedAt = new Date();
  const io = req.app.get('io');
  if (io) io.emit('order:update', order);
  res.json(order);
});

router.patch('/:id/payment', (req, res) => {
  const order = orders.find(o => o._id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Not found' });
  order.paymentMethod = req.body.paymentMethod;
  order.paymentStatus = 'paid';
  order.status = 'billed';
  res.json(order);
});

module.exports = router;
