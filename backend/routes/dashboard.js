// dashboard.js
const router = require('express').Router();

router.get('/stats', async (req, res) => {
  // Return mock stats for demo
  res.json({
    revenue: { today: 84320, week: 524800, month: 2148000, growth: 12.4 },
    orders: { today: 247, week: 1624, month: 6890, growth: 8.1 },
    tables: { total: 24, occupied: 18, free: 4, reserved: 2 },
    customers: { total: 1284, new: 42, returning: 205 },
    topDishes: [
      { name: 'Butter Chicken', orders: 312, revenue: 124800 },
      { name: 'Paneer Tikka', orders: 287, revenue: 100450 },
      { name: 'Hyderabadi Biryani', orders: 256, revenue: 89600 },
      { name: 'Dal Makhani', orders: 198, revenue: 59400 },
      { name: 'Veg Thali', orders: 175, revenue: 52500 }
    ],
    hourlyRevenue: [
      { hour: '8am', value: 4200 }, { hour: '9am', value: 6800 },
      { hour: '10am', value: 5400 }, { hour: '11am', value: 7200 },
      { hour: '12pm', value: 12400 }, { hour: '1pm', value: 14800 },
      { hour: '2pm', value: 9600 }, { hour: '3pm', value: 5200 },
      { hour: '4pm', value: 4800 }, { hour: '5pm', value: 6400 },
      { hour: '6pm', value: 8200 }, { hour: '7pm', value: 11600 },
      { hour: '8pm', value: 13800 }, { hour: '9pm', value: 9200 }
    ],
    weeklyRevenue: [
      { day: 'Mon', value: 68400 }, { day: 'Tue', value: 72800 },
      { day: 'Wed', value: 65200 }, { day: 'Thu', value: 78400 },
      { day: 'Fri', value: 94600 }, { day: 'Sat', value: 108200 },
      { day: 'Sun', value: 96800 }
    ],
    orderMix: [
      { channel: 'Dine-in', value: 50 },
      { channel: 'Delivery', value: 27 },
      { channel: 'Takeaway', value: 18 },
      { channel: 'QR Order', value: 5 }
    ],
    recentOrders: [
      { id: '#ORD-2841', table: 'T7', items: 'Butter Chicken, Naan ×2', amount: 640, status: 'served', time: '2m ago', channel: 'dine-in' },
      { id: '#ORD-2840', table: 'Swiggy', items: 'Biryani, Raita, Lassi', amount: 480, status: 'preparing', time: '8m ago', channel: 'swiggy' },
      { id: '#ORD-2839', table: 'T12', items: 'Dal Makhani, Roti ×4', amount: 390, status: 'billed', time: '15m ago', channel: 'dine-in' },
      { id: '#ORD-2838', table: 'Zomato', items: 'Chicken Curry, Rice', amount: 550, status: 'served', time: '22m ago', channel: 'zomato' },
      { id: '#ORD-2837', table: 'QR-T3', items: 'Pizza, Coke ×2', amount: 720, status: 'cancelled', time: '30m ago', channel: 'qr' }
    ]
  });
});

module.exports = router;
