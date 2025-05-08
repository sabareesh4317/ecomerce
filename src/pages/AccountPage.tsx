import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { CheckCircle, User, Package, CreditCard, Heart, Settings } from 'lucide-react';

interface Profile {
  username: string;
  full_name: string;
  avatar_url: string;
  email: string;
}

const AccountPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('profile');
  const [showSuccess, setShowSuccess] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { user, signOut } = useAuth();
  
  // Show success message if order=success in query params
  useEffect(() => {
    if (searchParams.get('order') === 'success') {
      setShowSuccess(true);
      
      // Hide success message after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [searchParams]);
  
  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      
      try {
        if (user) {
          // This would be a real Supabase query in production
          // const { data, error } = await supabase
          //   .from('profiles')
          //   .select('username, full_name, avatar_url')
          //   .eq('id', user.id)
          //   .single();
          
          // if (error) throw error;
          
          // Mock profile data for now
          setProfile({
            username: 'johndoe',
            full_name: 'John Doe',
            avatar_url: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            email: user.email || ''
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [user]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Account</h1>
      
      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 text-green-700 rounded-lg p-4 mb-6 flex items-start">
          <CheckCircle className="text-green-500 mt-0.5 mr-3" size={20} />
          <div>
            <h3 className="font-medium">Order Placed Successfully!</h3>
            <p className="text-sm">Thank you for your purchase. You will receive a confirmation email shortly.</p>
          </div>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-1/4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* User Info */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-14 h-14 rounded-full overflow-hidden">
                  <img 
                    src={profile?.avatar_url || 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'} 
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-800">{profile?.full_name || 'User'}</h3>
                  <p className="text-sm text-gray-500">{profile?.email}</p>
                </div>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="p-4">
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center p-3 rounded-lg ${
                      activeTab === 'profile'
                        ? 'bg-teal-50 text-teal-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <User size={18} className="mr-3" />
                    <span>Profile</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`w-full flex items-center p-3 rounded-lg ${
                      activeTab === 'orders'
                        ? 'bg-teal-50 text-teal-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Package size={18} className="mr-3" />
                    <span>Orders</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('payment')}
                    className={`w-full flex items-center p-3 rounded-lg ${
                      activeTab === 'payment'
                        ? 'bg-teal-50 text-teal-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <CreditCard size={18} className="mr-3" />
                    <span>Payment Methods</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('wishlist')}
                    className={`w-full flex items-center p-3 rounded-lg ${
                      activeTab === 'wishlist'
                        ? 'bg-teal-50 text-teal-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Heart size={18} className="mr-3" />
                    <span>Wishlist</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`w-full flex items-center p-3 rounded-lg ${
                      activeTab === 'settings'
                        ? 'bg-teal-50 text-teal-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Settings size={18} className="mr-3" />
                    <span>Settings</span>
                  </button>
                </li>
              </ul>
            </nav>
            
            {/* Sign Out */}
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => signOut()}
                className="w-full text-red-600 hover:text-red-700 font-medium p-3 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="w-full md:w-3/4">
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6">Profile Information</h2>
                
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        id="username"
                        defaultValue={profile?.username}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        defaultValue={profile?.email}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        defaultValue={profile?.full_name.split(' ')[0]}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        defaultValue={profile?.full_name.split(' ')[1]}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Profile Picture
                    </label>
                    <div className="flex items-center">
                      <div className="w-20 h-20 rounded-full overflow-hidden mr-4">
                        <img 
                          src={profile?.avatar_url || 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'} 
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors">
                        Change Photo
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <button className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6">Order History</h2>
                
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {/* Sample order data */}
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #ORD-12345
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          May 12, 2025
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Delivered
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          $125.00
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-teal-600 hover:text-teal-900">
                            View
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #ORD-12346
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          April 28, 2025
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            Shipped
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          $78.50
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-teal-600 hover:text-teal-900">
                            View
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #ORD-12347
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          April 15, 2025
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Delivered
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          $249.99
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-teal-600 hover:text-teal-900">
                            View
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 flex justify-center">
                  <div className="flex">
                    <button className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-l-md text-gray-700 bg-white hover:bg-gray-50">
                      Previous
                    </button>
                    <button className="px-4 py-2 border-t border-b border-gray-300 text-sm font-medium text-gray-700 bg-gray-50">
                      1
                    </button>
                    <button className="px-4 py-2 border-t border-b border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      2
                    </button>
                    <button className="px-4 py-2 border-t border-b border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      3
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-white hover:bg-gray-50">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Payment Methods Tab */}
            {activeTab === 'payment' && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6">Payment Methods</h2>
                
                <div className="space-y-4 mb-6">
                  {/* Sample payment method */}
                  <div className="border border-gray-200 rounded-lg p-4 flex justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-6 bg-blue-100 rounded flex items-center justify-center text-xs font-medium text-blue-800 mr-3">
                        Visa
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">•••• •••• •••• 4242</p>
                        <p className="text-sm text-gray-500">Expires 05/26</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs bg-green-100 text-green-800 py-1 px-2 rounded-full font-medium mr-4">
                        Default
                      </span>
                      <button className="text-gray-500 hover:text-gray-700">
                        Edit
                      </button>
                      <button className="text-red-500 hover:text-red-700 ml-4">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
                
                <button className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                  Add New Payment Method
                </button>
              </div>
            )}
            
            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6">My Wishlist</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Sample wishlist items */}
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="aspect-square">
                        <img 
                          src={`https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2`} 
                          alt="Product"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-gray-800">Product Name</h3>
                        <p className="text-gray-500 mb-3">$99.99</p>
                        <div className="flex space-x-2">
                          <button className="flex-1 bg-teal-600 hover:bg-teal-700 text-white text-sm py-2 rounded transition-colors">
                            Add to Cart
                          </button>
                          <button className="bg-red-50 text-red-500 hover:bg-red-100 p-2 rounded">
                            <Heart size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6">Account Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-800 mb-3">Email Notifications</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="order-updates" 
                          className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                          defaultChecked 
                        />
                        <label htmlFor="order-updates" className="ml-2 text-sm text-gray-700">
                          Order updates
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="promotions" 
                          className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                          defaultChecked 
                        />
                        <label htmlFor="promotions" className="ml-2 text-sm text-gray-700">
                          Promotions and sales
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="product-news" 
                          className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded" 
                        />
                        <label htmlFor="product-news" className="ml-2 text-sm text-gray-700">
                          New product announcements
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-medium text-gray-800 mb-3">Security</h3>
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors text-sm">
                      Change Password
                    </button>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-medium text-gray-800 mb-3">Manage Account</h3>
                    <button className="text-red-600 hover:text-red-700 font-medium transition-colors text-sm">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;