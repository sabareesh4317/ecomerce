import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const proceedToCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
    } else {
      navigate('/checkout');
    }
  };

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Shopping Cart</h1>
      
      {cart.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any products to your cart yet.</p>
          <Link 
            to="/"
            className="inline-flex items-center text-white bg-teal-600 hover:bg-teal-700 py-3 px-6 rounded-lg font-medium transition-colors"
          >
            <ArrowLeft size={18} className="mr-2" />
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-4 px-4 text-sm font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="text-center py-4 px-4 text-sm font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="text-right py-4 px-4 text-sm font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="text-right py-4 px-4 text-sm font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="py-4 px-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {cart.map(item => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <img 
                              src={item.image_url} 
                              alt={item.name}
                              className="h-16 w-16 object-cover rounded-md"
                            />
                            <div className="ml-4">
                              <Link 
                                to={`/products/${item.id}`}
                                className="text-gray-800 hover:text-teal-600 font-medium"
                              >
                                {item.name}
                              </Link>
                              <p className="text-sm text-gray-500 mt-1">
                                {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-2 py-1 border border-gray-300 rounded-l-md bg-gray-100 text-gray-600 hover:bg-gray-200"
                            >
                              -
                            </button>
                            <span className="w-10 text-center border-y border-gray-300 py-1">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-2 py-1 border border-gray-300 rounded-r-md bg-gray-100 text-gray-600 hover:bg-gray-200"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          {formatter.format(item.price)}
                        </td>
                        <td className="py-4 px-4 text-right font-medium">
                          {formatter.format(item.price * item.quantity)}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700"
                            aria-label="Remove item"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="px-4 py-4 flex justify-between border-t border-gray-200">
                <button 
                  onClick={() => clearCart()}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Clear Cart
                </button>
                
                <Link 
                  to="/"
                  className="text-teal-600 hover:text-teal-700 flex items-center text-sm font-medium"
                >
                  <ArrowLeft size={16} className="mr-1" />
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
          
          {/* Cart Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>{formatter.format(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>{formatter.format(totalPrice * 0.1)}</span>
                </div>
                <div className="border-t pt-3 mt-3 flex justify-between font-bold text-gray-800">
                  <span>Total</span>
                  <span>{formatter.format(totalPrice * 1.1)}</span>
                </div>
              </div>
              
              <button
                onClick={proceedToCheckout}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
              >
                Proceed to Checkout
                <ArrowRight size={18} className="ml-2" />
              </button>
              
              <div className="mt-6">
                <div className="flex items-center text-gray-500 text-sm mb-2">
                  <span className="flex-1 border-t border-gray-200"></span>
                  <span className="px-3">Accepted Payment Methods</span>
                  <span className="flex-1 border-t border-gray-200"></span>
                </div>
                <div className="flex justify-center space-x-4">
                  {/* Payment Method Icons (simple placeholders) */}
                  <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-xs font-medium text-gray-800">Visa</div>
                  <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-xs font-medium text-gray-800">MC</div>
                  <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-xs font-medium text-gray-800">Amex</div>
                  <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-xs font-medium text-gray-800">PayPal</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 mt-4">
              <h3 className="font-medium text-gray-800 mb-3">Have a coupon?</h3>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-r-lg transition-colors">
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;