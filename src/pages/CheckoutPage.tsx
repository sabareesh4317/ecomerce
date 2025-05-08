import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, Check, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const CheckoutPage: React.FC = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    email: user?.email || '',
    phone: ''
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  
  const handleShippingInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePaymentInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const isShippingFormValid = () => {
    return (
      shippingInfo.firstName &&
      shippingInfo.lastName &&
      shippingInfo.address &&
      shippingInfo.city &&
      shippingInfo.state &&
      shippingInfo.zipCode &&
      shippingInfo.email &&
      shippingInfo.phone
    );
  };
  
  const isPaymentFormValid = () => {
    return (
      paymentInfo.cardName &&
      paymentInfo.cardNumber.length === 19 &&
      paymentInfo.expiryDate &&
      paymentInfo.cvv.length === 3
    );
  };
  
  const nextStep = () => {
    if (currentStep === 1 && !isShippingFormValid()) {
      return;
    }
    setCurrentStep(step => step + 1);
  };
  
  const prevStep = () => {
    setCurrentStep(step => step - 1);
  };
  
  const formatCardNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Add space after every 4 digits
    let formatted = '';
    for (let i = 0; i < digits.length && i < 16; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += ' ';
      }
      formatted += digits[i];
    }
    
    return formatted;
  };
  
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    setPaymentInfo(prev => ({ ...prev, cardNumber: formattedValue }));
  };
  
  const formatExpiryDate = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as MM/YY
    if (digits.length <= 2) {
      return digits;
    }
    
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
  };
  
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatExpiryDate(e.target.value);
    setPaymentInfo(prev => ({ ...prev, expiryDate: formattedValue }));
  };

  const placeOrder = async () => {
    if (!isPaymentFormValid()) {
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // In a real application, this would integrate with a payment processor
      // and create an order in the database
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create order in Supabase (mock for now)
      /*
      const { data, error } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id,
          status: 'processing',
          total: totalPrice * 1.1,
          shipping_info: shippingInfo
        })
        .select();
        
      if (error) throw error;
      
      // Create order items
      const orderItems = cart.map(item => ({
        order_id: data[0].id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }));
      
      await supabase.from('order_items').insert(orderItems);
      */
      
      // Clear cart and redirect to success page
      clearCart();
      navigate('/account?order=success');
    } catch (error) {
      console.error('Error processing order:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>
      
      {/* Progress Steps */}
      <div className="flex mb-8">
        <div className="flex-1">
          <div className={`flex items-center justify-center w-8 h-8 mx-auto rounded-full ${
            currentStep >= 1 ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            {currentStep > 1 ? <Check size={18} /> : 1}
          </div>
          <p className={`text-sm text-center mt-2 ${
            currentStep >= 1 ? 'text-teal-600 font-medium' : 'text-gray-500'
          }`}>
            Shipping
          </p>
        </div>
        
        <div className="w-full flex-1 h-0.5 my-4">
          <div className={`h-full ${currentStep >= 2 ? 'bg-teal-600' : 'bg-gray-200'}`}></div>
        </div>
        
        <div className="flex-1">
          <div className={`flex items-center justify-center w-8 h-8 mx-auto rounded-full ${
            currentStep >= 2 ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            {currentStep > 2 ? <Check size={18} /> : 2}
          </div>
          <p className={`text-sm text-center mt-2 ${
            currentStep >= 2 ? 'text-teal-600 font-medium' : 'text-gray-500'
          }`}>
            Payment
          </p>
        </div>
        
        <div className="w-full flex-1 h-0.5 my-4">
          <div className={`h-full ${currentStep >= 3 ? 'bg-teal-600' : 'bg-gray-200'}`}></div>
        </div>
        
        <div className="flex-1">
          <div className={`flex items-center justify-center w-8 h-8 mx-auto rounded-full ${
            currentStep >= 3 ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            3
          </div>
          <p className={`text-sm text-center mt-2 ${
            currentStep >= 3 ? 'text-teal-600 font-medium' : 'text-gray-500'
          }`}>
            Review
          </p>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Step 1: Shipping Information */}
            {currentStep === 1 && (
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-teal-100 rounded-full mr-3">
                    <Truck className="text-teal-600" size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Shipping Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={shippingInfo.firstName}
                      onChange={handleShippingInfoChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={shippingInfo.lastName}
                      onChange={handleShippingInfoChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Address *
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleShippingInfoChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleShippingInfoChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      State/Province *
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={shippingInfo.state}
                      onChange={handleShippingInfoChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP/Postal Code *
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={shippingInfo.zipCode}
                      onChange={handleShippingInfoChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                      Country *
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={shippingInfo.country}
                      onChange={handleShippingInfoChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="AU">Australia</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={shippingInfo.email}
                      onChange={handleShippingInfoChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleShippingInfoChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={nextStep}
                    disabled={!isShippingFormValid()}
                    className={`py-2 px-6 rounded-lg font-medium transition-colors ${
                      isShippingFormValid()
                        ? 'bg-teal-600 hover:bg-teal-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Next: Payment
                  </button>
                </div>
              </div>
            )}
            
            {/* Step 2: Payment Information */}
            {currentStep === 2 && (
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-teal-100 rounded-full mr-3">
                    <CreditCard className="text-teal-600" size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Payment Information</h2>
                </div>
                
                <div className="mb-6">
                  <div className="flex justify-between items-center p-4 mb-4 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="font-medium text-gray-700">Secure Payment Processing</span>
                    <ShieldCheck className="text-teal-600" size={20} />
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                        Name on Card *
                      </label>
                      <input
                        type="text"
                        id="cardName"
                        name="cardName"
                        value={paymentInfo.cardName}
                        onChange={handlePaymentInfoChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={paymentInfo.cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="0000 0000 0000 0000"
                        maxLength={19}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                          Expiration Date (MM/YY) *
                        </label>
                        <input
                          type="text"
                          id="expiryDate"
                          name="expiryDate"
                          value={paymentInfo.expiryDate}
                          onChange={handleExpiryDateChange}
                          placeholder="MM/YY"
                          maxLength={5}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                          CVV *
                        </label>
                        <input
                          type="text"
                          id="cvv"
                          name="cvv"
                          value={paymentInfo.cvv}
                          onChange={handlePaymentInfoChange}
                          placeholder="123"
                          maxLength={3}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-between">
                  <button
                    onClick={prevStep}
                    className="py-2 px-6 rounded-lg border border-gray-300 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  
                  <button
                    onClick={nextStep}
                    disabled={!isPaymentFormValid()}
                    className={`py-2 px-6 rounded-lg font-medium transition-colors ${
                      isPaymentFormValid()
                        ? 'bg-teal-600 hover:bg-teal-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Review Order
                  </button>
                </div>
              </div>
            )}
            
            {/* Step 3: Review */}
            {currentStep === 3 && (
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-teal-100 rounded-full mr-3">
                    <Check className="text-teal-600" size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Review Your Order</h2>
                </div>
                
                <div className="space-y-6">
                  {/* Shipping Information */}
                  <div className="border-b border-gray-200 pb-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-gray-800">Shipping Information</h3>
                      <button 
                        onClick={() => setCurrentStep(1)}
                        className="text-sm text-teal-600 hover:text-teal-700"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="text-gray-600">
                      <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
                      <p>{shippingInfo.address}</p>
                      <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                      <p>{shippingInfo.email}</p>
                      <p>{shippingInfo.phone}</p>
                    </div>
                  </div>
                  
                  {/* Payment Information */}
                  <div className="border-b border-gray-200 pb-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-gray-800">Payment Information</h3>
                      <button 
                        onClick={() => setCurrentStep(2)}
                        className="text-sm text-teal-600 hover:text-teal-700"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="text-gray-600">
                      <p>{paymentInfo.cardName}</p>
                      <p>Card ending in {paymentInfo.cardNumber.slice(-4)}</p>
                      <p>Expires {paymentInfo.expiryDate}</p>
                    </div>
                  </div>
                  
                  {/* Order Items */}
                  <div>
                    <h3 className="font-medium text-gray-800 mb-2">Order Items</h3>
                    <div className="space-y-3">
                      {cart.map(item => (
                        <div key={item.id} className="flex items-center">
                          <img 
                            src={item.image_url} 
                            alt={item.name}
                            className="h-16 w-16 object-cover rounded-md"
                          />
                          <div className="ml-4 flex-1">
                            <p className="text-gray-800 font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                          </div>
                          <p className="font-medium">
                            {formatter.format(item.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-between">
                  <button
                    onClick={prevStep}
                    className="py-2 px-6 rounded-lg border border-gray-300 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  
                  <button
                    onClick={placeOrder}
                    disabled={isProcessing}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center"
                  >
                    {isProcessing ? (
                      <>
                        <span className="mr-2">Processing...</span>
                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      </>
                    ) : (
                      'Place Order'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>
            
            <div className="max-h-64 overflow-y-auto mb-4">
              {cart.map(item => (
                <div key={item.id} className="flex items-center py-3 border-b border-gray-200">
                  <img 
                    src={item.image_url} 
                    alt={item.name}
                    className="h-12 w-12 object-cover rounded-md"
                  />
                  <div className="ml-3 flex-1">
                    <p className="text-sm text-gray-800 font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium">
                    {formatter.format(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatter.format(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (10%)</span>
                <span>{formatter.format(totalPrice * 0.1)}</span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between items-center font-bold text-lg">
                <span>Total</span>
                <span>{formatter.format(totalPrice * 1.1)}</span>
              </div>
            </div>
            
            <div className="text-sm text-gray-500">
              <p className="flex items-center mb-2">
                <ShieldCheck size={16} className="mr-2 text-teal-600" />
                Secure checkout with encryption
              </p>
              <p className="flex items-center">
                <Truck size={16} className="mr-2 text-teal-600" />
                Free shipping on all orders
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;