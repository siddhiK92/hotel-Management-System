// tables.js
const router = require('express').Router();

let tables = Array.from({length: 15}, (_, i) => {
  const statuses = ['occupied','occupied','free','reserved','occupied','free','occupied','cleaning','free','occupied','reserved','occupied','free','occupied','cleaning'];
  const pax = [4,2,4,6,3,2,4,0,6,5,4,2,4,4,0];
  const times = [42,18,0,0,55,0,12,0,0,34,0,8,0,71,0];
  return { _id: `t${i+1}`, number: i+1, capacity: i%3===0?6:4, status: statuses[i], currentPax: pax[i], minutesOccupied: times[i], reservedBy: statuses[i]==='reserved'?(i===3?'Sharma, 7:30PM':'Kumar, 8:00PM'):null };
});

router.get('/', (req, res) => res.json(tables));
router.patch('/:id', (req, res) => {
  const t = tables.find(t => t._id === req.params.id);
  if (!t) return res.status(404).json({ error: 'Not found' });
  Object.assign(t, req.body);
  res.json(t);
});

module.exports = router;
