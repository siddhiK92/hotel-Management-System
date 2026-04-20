// menu.js
const router = require('express').Router();

const menuItems = [
  { _id: 'm1', name: 'Butter Chicken', category: 'Mains', price: 420, description: 'Creamy tomato-based curry with tender chicken', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300&q=80', available: true, preparationTime: 20, tags: ['bestseller', 'non-veg'] },
  { _id: 'm2', name: 'Paneer Tikka', category: 'Starters', price: 340, description: 'Grilled cottage cheese with spices & mint chutney', image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=300&q=80', available: true, preparationTime: 15, tags: ['veg', 'popular'] },
  { _id: 'm3', name: 'Hyderabadi Biryani', category: 'Mains', price: 380, description: 'Aromatic basmati rice with slow-cooked meat & saffron', image: 'https://images.unsplash.com/photo-1563379091339-03246963d71a?w=300&q=80', available: true, preparationTime: 25, tags: ['bestseller', 'non-veg'] },
  { _id: 'm4', name: 'Dal Makhani', category: 'Mains', price: 260, description: 'Slow-cooked black lentils in rich buttery gravy', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&q=80', available: true, preparationTime: 15, tags: ['veg'] },
  { _id: 'm5', name: 'Garlic Naan', category: 'Breads', price: 80, description: 'Soft leavened bread with garlic & butter', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&q=80', available: true, preparationTime: 8, tags: ['veg'] },
  { _id: 'm6', name: 'Mango Lassi', category: 'Beverages', price: 120, description: 'Chilled yogurt drink with fresh Alphonso mangoes', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&q=80', available: true, preparationTime: 5, tags: ['veg', 'cold'] },
  { _id: 'm7', name: 'Gulab Jamun', category: 'Desserts', price: 140, description: 'Soft milk-solid dumplings in rose-flavored syrup', image: 'https://images.unsplash.com/photo-1666190898578-cf5e16c7b756?w=300&q=80', available: true, preparationTime: 5, tags: ['veg', 'sweet'] },
  { _id: 'm8', name: 'Veg Thali', category: 'Combos', price: 320, description: 'Complete meal with dal, sabzi, roti, rice & dessert', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&q=80', available: true, preparationTime: 20, tags: ['veg', 'value'] },
  { _id: 'm9', name: 'Masala Chai', category: 'Beverages', price: 60, description: 'Spiced Indian tea with ginger & cardamom', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&q=80', available: true, preparationTime: 5, tags: ['veg', 'hot'] },
  { _id: 'm10', name: 'Chicken Tikka Masala', category: 'Mains', price: 440, description: 'Marinated chicken in aromatic tomato-cream sauce', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&q=80', available: true, preparationTime: 22, tags: ['non-veg', 'popular'] },
  { _id: 'm11', name: 'Aloo Tikki Chaat', category: 'Starters', price: 180, description: 'Crispy potato patties with chutneys & yogurt', image: 'https://images.unsplash.com/photo-1631515242808-497c3fbd3972?w=300&q=80', available: true, preparationTime: 10, tags: ['veg', 'street food'] },
  { _id: 'm12', name: 'Fish Curry', category: 'Mains', price: 480, description: 'Coastal style fish in tangy coconut curry', image: 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=300&q=80', available: true, preparationTime: 25, tags: ['non-veg'] }
];

router.get('/', (req, res) => res.json(menuItems));
router.get('/categories', (req, res) => {
  const cats = ['All', ...new Set(menuItems.map(i => i.category))];
  res.json(cats);
});
router.get('/:id', (req, res) => {
  const item = menuItems.find(i => i._id === req.params.id);
  item ? res.json(item) : res.status(404).json({ error: 'Not found' });
});

module.exports = router;
