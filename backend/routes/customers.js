// customers.js
const router = require('express').Router();

const customers = [
  { _id: 'c1', name: 'Rahul Sharma', email: 'rahul@gmail.com', phone: '9876543210', loyaltyPoints: 2840, tier: 'gold', totalSpent: 28400, visitCount: 18, lastVisit: new Date(Date.now()-2*60*60000) },
  { _id: 'c2', name: 'Priya Kulkarni', email: 'priya@gmail.com', phone: '9765432109', loyaltyPoints: 6120, tier: 'platinum', totalSpent: 61200, visitCount: 31, lastVisit: new Date(Date.now()-24*60*60000) },
  { _id: 'c3', name: 'Ankit Joshi', email: 'ankit@gmail.com', phone: '9654321098', loyaltyPoints: 920, tier: 'silver', totalSpent: 9200, visitCount: 8, lastVisit: new Date(Date.now()-3*24*60*60000) },
  { _id: 'c4', name: 'Sunita Mehta', email: 'sunita@gmail.com', phone: '9543210987', loyaltyPoints: 340, tier: 'bronze', totalSpent: 3400, visitCount: 4, lastVisit: new Date(Date.now()-7*24*60*60000) },
  { _id: 'c5', name: 'Vikram Desai', email: 'vikram@gmail.com', phone: '9432109876', loyaltyPoints: 4480, tier: 'gold', totalSpent: 44800, visitCount: 22, lastVisit: new Date(Date.now()-14*24*60*60000) }
];

router.get('/', (req, res) => res.json(customers));
router.get('/:id', (req, res) => {
  const c = customers.find(c => c._id === req.params.id);
  c ? res.json(c) : res.status(404).json({ error: 'Not found' });
});

module.exports = router;
