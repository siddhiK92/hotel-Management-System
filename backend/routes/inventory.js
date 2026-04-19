const router = require('express').Router();

let inventory = [
  { _id: 'i1', name: 'Chicken (Fresh)', category: 'Proteins', unit: 'kg', currentStock: 12, reorderLevel: 5, maxStock: 20, costPerUnit: 320, supplier: 'FreshMeat Co.' },
  { _id: 'i2', name: 'Basmati Rice', category: 'Grains', unit: 'kg', currentStock: 8, reorderLevel: 10, maxStock: 30, costPerUnit: 120, supplier: 'GrainMart' },
  { _id: 'i3', name: 'Paneer', category: 'Dairy', unit: 'kg', currentStock: 4, reorderLevel: 3, maxStock: 10, costPerUnit: 280, supplier: 'DairyFresh' },
  { _id: 'i4', name: 'Tomatoes', category: 'Vegetables', unit: 'kg', currentStock: 15, reorderLevel: 5, maxStock: 20, costPerUnit: 40, supplier: 'VegWorld' },
  { _id: 'i5', name: 'Cooking Oil', category: 'Condiments', unit: 'L', currentStock: 6, reorderLevel: 8, maxStock: 20, costPerUnit: 160, supplier: 'OilMax' },
  { _id: 'i6', name: 'Wheat Flour', category: 'Grains', unit: 'kg', currentStock: 20, reorderLevel: 10, maxStock: 30, costPerUnit: 45, supplier: 'GrainMart' },
  { _id: 'i7', name: 'Onions', category: 'Vegetables', unit: 'kg', currentStock: 18, reorderLevel: 8, maxStock: 25, costPerUnit: 35, supplier: 'VegWorld' },
  { _id: 'i8', name: 'Heavy Cream', category: 'Dairy', unit: 'L', currentStock: 3, reorderLevel: 4, maxStock: 10, costPerUnit: 220, supplier: 'DairyFresh' }
];

router.get('/', (req, res) => res.json(inventory));
router.patch('/:id', (req, res) => {
  const item = inventory.find(i => i._id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  Object.assign(item, req.body, { updatedAt: new Date() });
  res.json(item);
});
router.post('/:id/restock', (req, res) => {
  const item = inventory.find(i => i._id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  item.currentStock += req.body.quantity || item.maxStock - item.currentStock;
  item.lastRestocked = new Date();
  res.json(item);
});

module.exports = router;
