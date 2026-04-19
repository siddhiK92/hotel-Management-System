import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, StatusBadge } from '../components/UI';
import { get, post, patch } from '../utils/api';

const CATEGORIES = ['All', 'Starters', 'Mains', 'Breads', 'Beverages', 'Desserts', 'Combos'];
const TAX_RATE = 0.05;

export default function POSPage() {
  const [menu, setMenu] = useState([]);
  const [category, setCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [tableNum, setTableNum] = useState('');
  const [channel, setChannel] = useState('dine-in');
  const [orders, setOrders] = useState([]);
  const [view, setView] = useState('pos'); // 'pos' | 'orders'
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [search, setSearch] = useState('');
  const [payModal, setPayModal] = useState(null);
  const [payMethod, setPayMethod] = useState('upi');

  useEffect(() => {
    Promise.all([get('/menu'), get('/orders')]).then(([m, o]) => { setMenu(m); setOrders(o); }).finally(() => setLoading(false));
  }, []);

  const filtered = menu.filter(i => (category === 'All' || i.category === category) && i.name.toLowerCase().includes(search.toLowerCase()));
  const addToCart = (item) => setCart(c => { const ex = c.find(x => x._id === item._id); return ex ? c.map(x => x._id === item._id ? { ...x, qty: x.qty + 1 } : x) : [...c, { ...item, qty: 1, notes: '' }]; });
  const removeFromCart = (id) => setCart(c => { const ex = c.find(x => x._id === id); return ex?.qty === 1 ? c.filter(x => x._id !== id) : c.map(x => x._id === id ? { ...x, qty: x.qty - 1 } : x); });
  const cartQty = (id) => cart.find(x => x._id === id)?.qty || 0;
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + tax;

  const placeOrder = async () => {
    if (!cart.length) return;
    setPlacingOrder(true);
    try {
      const items = cart.map(i => ({ name: i.name, price: i.price, quantity: i.qty, status: 'pending' }));
      const order = await post('/orders', { tableNumber: parseInt(tableNum) || null, items, channel, subtotal, tax, total });
      setOrders(o => [order, ...o]);
      setCart([]);
      setView('orders');
      alert(` Order ${order.orderNumber} placed successfully!`);
    } catch (e) { alert('Failed to place order: ' + e.message); } finally { setPlacingOrder(false); }
  };

  const updateStatus = async (orderId, status) => {
    try {
      const updated = await patch(`/orders/${orderId}/status`, { status });
      setOrders(o => o.map(x => x._id === updated._id ? updated : x));
    } catch {}
  };

  const processPayment = async () => {
    if (!payModal) return;
    try {
      const updated = await patch(`/orders/${payModal._id}/payment`, { paymentMethod: payMethod });
      setOrders(o => o.map(x => x._id === updated._id ? updated : x));
      setPayModal(null);
      alert(' Payment processed successfully!');
    } catch (e) { alert('Payment failed: ' + e.message); }
  };

  const channelColor = { 'dine-in': '#FF6B35', swiggy: '#FC8019', zomato: '#E23744', qr: '#28A745', takeaway: '#17a2b8', kiosk: '#6f42c1' };
  const channelIcon = { 'dine-in': '', swiggy: 'SW', zomato: '', qr: '', takeaway: '', kiosk: '' };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left: Menu */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Tabs */}
        <div className="flex items-center gap-2 px-4 pt-4 pb-2 border-b flex-shrink-0" style={{ borderColor: '#f0f0f0' }}>
          {['pos','orders'].map(t => (
            <button key={t} onClick={() => setView(t)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize"
              style={view === t ? { background: '#FF6B35', color: '#fff' } : { background: '#f8f9fa', color: '#666' }}>
              {t === 'pos' ? ' New Order' : ` Orders (${orders.length})`}
            </button>
          ))}
        </div>

        {view === 'pos' ? (
          <div className="flex-1 overflow-y-auto p-4">
            {/* Search + Filter */}
            <div className="flex gap-2 mb-3">
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search menu..."
                className="flex-1 px-3 py-2 rounded-xl text-sm"
                style={{ background: '#f8f9fa', border: '1px solid #eee', outline: 'none', color: '#333' }} />
              <select value={channel} onChange={e => setChannel(e.target.value)} className="px-3 py-2 rounded-xl text-sm"
                style={{ background: '#f8f9fa', border: '1px solid #eee', color: '#333', outline: 'none' }}>
                {Object.keys(channelColor).map(c => <option key={c} value={c}>{channelIcon[c]} {c}</option>)}
              </select>
            </div>
            {/* Categories */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setCategory(cat)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex-shrink-0"
                  style={category === cat ? { background: '#FF6B35', color: '#fff' } : { background: '#f8f9fa', color: '#666', border: '1px solid #eee' }}>
                  {cat}
                </button>
              ))}
            </div>
            {/* Menu Grid */}
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
              {filtered.map(item => {
                const qty = cartQty(item._id);
                return (
                  <div key={item._id} className="rounded-xl overflow-hidden card-hover cursor-pointer"
                    style={{ background: '#fff', border: qty > 0 ? '2px solid #FF6B35' : '1px solid #f0f0f0' }}
                    onClick={() => addToCart(item)}>
                    <div className="relative">
                      <img src={item.image} alt={item.name} className="w-full object-cover" style={{ height: '100px' }}
                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=80'; }} />
                      {qty > 0 && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                          style={{ background: '#FF6B35' }}>{qty}</div>
                      )}
                      {item.tags?.includes('bestseller') && (
                        <span className="absolute top-2 left-2 text-xs px-1.5 py-0.5 rounded-full font-medium"
                          style={{ background: '#FFC107', color: '#333' }}> Best</span>
                      )}
                    </div>
                    <div className="p-2.5">
                      <p className="text-xs font-semibold truncate" style={{ color: '#1E1E1E' }}>{item.name}</p>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-sm font-bold" style={{ color: '#FF6B35' }}>₹{item.price}</span>
                        {qty > 0 ? (
                          <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                            <button onClick={() => removeFromCart(item._id)} className="w-5 h-5 rounded-full text-xs font-bold text-white flex items-center justify-center" style={{ background: '#DC3545' }}>-</button>
                            <span className="text-xs font-bold" style={{ color: '#1E1E1E' }}>{qty}</span>
                            <button onClick={() => addToCart(item)} className="w-5 h-5 rounded-full text-xs font-bold text-white flex items-center justify-center" style={{ background: '#28A745' }}>+</button>
                          </div>
                        ) : (
                          <span className="text-xs" style={{ color: '#aaa' }}>{item.preparationTime}m</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {orders.length === 0 ? <p className="text-center py-8 text-gray-400">No orders yet</p> : orders.map(order => (
              <div key={order._id} className="rounded-xl p-4 transition-all" style={{ background: '#fff', border: '1px solid #f0f0f0' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold" style={{ color: '#FF6B35' }}>{order.orderNumber}</span>
                    <StatusBadge status={order.status} />
                    <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: '#f8f9fa', color: channelColor[order.channel] || '#666' }}>
                      {channelIcon[order.channel]} {order.channel}
                    </span>
                  </div>
                  <span className="text-sm font-bold" style={{ color: '#1E1E1E' }}>₹{order.total}</span>
                </div>
                <div className="text-xs mb-2" style={{ color: '#666' }}>
                  {order.items?.map(i => `${i.name} ×${i.quantity}`).join(', ')}
                  {order.tableNumber && <span className="ml-2 text-xs" style={{ color: '#aaa' }}>· Table {order.tableNumber}</span>}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {order.status === 'pending' && <Button size="sm" onClick={() => updateStatus(order._id, 'confirmed')}>Confirm</Button>}
                  {order.status === 'confirmed' && <Button size="sm" onClick={() => updateStatus(order._id, 'preparing')}>Start Cooking</Button>}
                  {order.status === 'preparing' && <Button size="sm" variant="success" onClick={() => updateStatus(order._id, 'ready')}>Mark Ready</Button>}
                  {order.status === 'ready' && <Button size="sm" onClick={() => updateStatus(order._id, 'served')}>Mark Served</Button>}
                  {order.status === 'served' && order.paymentStatus !== 'paid' && <Button size="sm" variant="primary" onClick={() => setPayModal(order)}> Bill & Pay</Button>}
                  {order.paymentStatus === 'paid' && <Badge color="green"> Paid</Badge>}
                  {!['served','billed','cancelled'].includes(order.status) && <Button size="sm" variant="ghost" onClick={() => updateStatus(order._id, 'cancelled')}>Cancel</Button>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right: Bill */}
      {view === 'pos' && (
        <div className="w-72 flex flex-col flex-shrink-0 border-l" style={{ borderColor: '#f0f0f0', background: '#fff' }}>
          <div className="p-4 border-b" style={{ borderColor: '#f0f0f0' }}>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '14px', color: '#1E1E1E' }} style={{ color: '#1E1E1E' }}>Current Bill</h3>
            <div className="flex gap-2 mt-2">
              <input value={tableNum} onChange={e => setTableNum(e.target.value)} placeholder="Table #"
                className="flex-1 px-2 py-1.5 rounded-lg text-xs"
                style={{ background: '#f8f9fa', border: '1px solid #eee', outline: 'none', color: '#333' }} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <span className="text-3xl block mb-2"></span>
                <p className="text-xs" style={{ color: '#aaa' }}>Tap items to add to bill</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item._id} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: '#fafafa' }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: '#1E1E1E' }}>{item.name}</p>
                    <p className="text-xs" style={{ color: '#FF6B35' }}>₹{item.price} × {item.qty}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => removeFromCart(item._id)} className="w-5 h-5 rounded text-xs font-bold flex items-center justify-center" style={{ background: '#f0f0f0', color: '#666' }}>-</button>
                    <span className="text-xs font-bold w-4 text-center" style={{ color: '#333' }}>{item.qty}</span>
                    <button onClick={() => addToCart(item)} className="w-5 h-5 rounded text-xs font-bold flex items-center justify-center" style={{ background: '#f0f0f0', color: '#666' }}>+</button>
                  </div>
                  <span className="text-xs font-semibold w-12 text-right" style={{ color: '#1E1E1E' }}>₹{item.price * item.qty}</span>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-4 border-t space-y-2" style={{ borderColor: '#f0f0f0' }}>
              <div className="flex justify-between text-xs" style={{ color: '#666' }}>
                <span>Subtotal</span><span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-xs" style={{ color: '#666' }}>
                <span>GST (5%)</span><span>₹{tax}</span>
              </div>
              <div className="flex justify-between text-sm font-bold border-t pt-2" style={{ borderColor: '#f0f0f0', color: '#1E1E1E' }}>
                <span>Total</span><span style={{ color: '#FF6B35' }}>₹{total}</span>
              </div>
              <Button className="w-full mt-2" onClick={placeOrder} disabled={placingOrder}>
                {placingOrder ? 'Placing...' : ' Place Order'}
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => setCart([])}>Clear</Button>
            </div>
          )}
        </div>
      )}

      {/* Payment Modal */}
      {payModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="rounded-2xl p-6 w-80 shadow-2xl fade-in" style={{ background: '#fff' }}>
            <h3 className="font-display font-bold text-base mb-1" style={{ color: '#1E1E1E' }}>Process Payment</h3>
            <p className="text-xs mb-4" style={{ color: '#aaa' }}>Order {payModal.orderNumber} · Total ₹{payModal.total}</p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[['upi','','UPI'],['card','','Card'],['cash','','Cash']].map(([v,icon,label]) => (
                <button key={v} onClick={() => setPayMethod(v)}
                  className="py-3 rounded-xl text-xs font-medium transition-all flex flex-col items-center gap-1"
                  style={payMethod === v ? { background: '#fff3ef', color: '#FF6B35', border: '2px solid #FF6B35' } : { background: '#f8f9fa', color: '#666', border: '2px solid transparent' }}>
                  <span className="text-xl">{icon}</span>{label}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={processPayment}>Confirm Payment</Button>
              <Button variant="ghost" className="flex-1" onClick={() => setPayModal(null)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
