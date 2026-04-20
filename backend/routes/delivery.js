const router = require('express').Router();

const deliveries = [
  { _id: 'd1', platform: 'swiggy', orderId: '#SW-4821', customer: 'Rahul Sharma', address: '12, Baner Road, Pune', distance: 2.4, status: 'on-way', eta: 8, rider: 'Ravi Kumar', riderPhone: '9876543210', amount: 480 },
  { _id: 'd2', platform: 'zomato', orderId: '#ZO-3197', customer: 'Priya Kulkarni', address: 'FC Road, Pune', distance: 3.8, status: 'picked-up', eta: 15, rider: 'Mohan Singh', riderPhone: '9765432109', amount: 550 },
  { _id: 'd3', platform: 'zomato', orderId: '#ZO-3201', customer: 'Ankit Joshi', address: 'Kalyani Nagar, Pune', distance: 5.1, status: 'in-kitchen', eta: 22, rider: null, riderPhone: null, amount: 714 },
  { _id: 'd4', platform: 'swiggy', orderId: '#SW-4825', customer: 'Neha Patil', address: 'Koregaon Park, Pune', distance: 1.8, status: 'delivered', eta: 0, rider: 'Suresh Yadav', riderPhone: '9654321098', amount: 390 }
];

router.get('/', (req, res) => res.json(deliveries));
router.get('/stats', (req, res) => res.json({
  active: deliveries.filter(d => d.status !== 'delivered').length,
  avgTime: 28,
  swiggy: deliveries.filter(d => d.platform === 'swiggy').length,
  zomato: deliveries.filter(d => d.platform === 'zomato').length
}));

module.exports = router;
