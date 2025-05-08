import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowDown, ArrowUp, ShoppingBag } from 'lucide-react';
import ProductGrid from '../components/products/ProductGrid';
import { Product } from '../types/product.types';
import { supabase } from '../lib/supabase';

// Temporary sample data for development
import { sampleProducts } from '../data/sampleProducts';

const HomePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOption, setSortOption] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  
  const category = searchParams.get('category');
  const searchQuery = searchParams.get('search');

  useEffect(() => {
    // This function will fetch products from Supabase once connected
    const fetchProducts = async () => {
      setIsLoading(true);
      
      try {
        // In a real implementation, this would fetch from Supabase
        // For now, we'll use the sample data and apply filtering/sorting in-memory
        let filteredProducts = [...sampleProducts];
        
        // Apply category filter if present
        if (category) {
          filteredProducts = filteredProducts.filter(
            product => product.category.toLowerCase() === category.toLowerCase()
          );
        }
        
        // Apply search filter if present
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filteredProducts = filteredProducts.filter(
            product => 
              product.name.toLowerCase().includes(query) || 
              product.description.toLowerCase().includes(query) ||
              product.category.toLowerCase().includes(query)
          );
        }
        
        // Apply sorting
        switch (sortOption) {
          case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
          case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
          case 'newest':
            filteredProducts.sort(
              (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
            break;
          // 'featured' is default, no specific sorting
          default:
            break;
        }
        
        setProducts(filteredProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [category, searchQuery, sortOption]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      {!category && !searchQuery && (
        <div className="relative rounded-xl overflow-hidden mb-10">
          <div className="absolute inset-0 bg-gradient-to-r from-navy-600/80 to-teal-600/50 z-10"></div>
          <img 
            src="https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
            alt="LuxeMarket Hero" 
            className="w-full h-96 object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 z-20">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Discover Quality Products
            </h1>
            <p className="text-white text-lg md:text-xl mb-6 max-w-lg">
              Shop the latest trends and essentials with free shipping on orders over $50
            </p>
            <button className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 px-6 rounded-full transition-colors w-fit flex items-center">
              <ShoppingBag size={20} className="mr-2" />
              Shop Now
            </button>
          </div>
        </div>
      )}
      
      {/* Header for category or search results */}
      {(category || searchQuery) && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {category 
              ? `${category.charAt(0).toUpperCase() + category.slice(1)}` 
              : `Search results for "${searchQuery}"`}
          </h1>
        </div>
      )}

      {/* Filters and Sorting */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center mb-4 md:mb-0 text-gray-700 hover:text-teal-600 transition-colors"
          >
            {showFilters ? <ArrowUp size={20} className="mr-2" /> : <ArrowDown size={20} className="mr-2" />}
            Filters
          </button>
          
          <div className="flex items-center">
            <label htmlFor="sort" className="text-gray-700 mr-2">Sort by:</label>
            <select
              id="sort"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
        
        {/* Filter Options (toggleable) */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Price Range</h3>
              <div className="flex items-center">
                <input 
                  type="range" 
                  min="0" 
                  max="1000" 
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-sm text-gray-600">$0</span>
                <span className="text-sm text-gray-600">$1000+</span>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Customer Rating</h3>
              <div className="space-y-1">
                {[5, 4, 3, 2, 1].map(rating => (
                  <div key={rating} className="flex items-center">
                    <input 
                      type="checkbox" 
                      id={`rating-${rating}`} 
                      className="mr-2"
                    />
                    <label htmlFor={`rating-${rating}`} className="text-sm text-gray-700">
                      {rating} Stars & Up
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Availability</h3>
              <div className="space-y-1">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="in-stock" 
                    className="mr-2"
                  />
                  <label htmlFor="in-stock" className="text-sm text-gray-700">
                    In Stock
                  </label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="on-sale" 
                    className="mr-2"
                  />
                  <label htmlFor="on-sale" className="text-sm text-gray-700">
                    On Sale
                  </label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="free-shipping" 
                    className="mr-2"
                  />
                  <label htmlFor="free-shipping" className="text-sm text-gray-700">
                    Free Shipping
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Products Grid */}
      <ProductGrid products={products} isLoading={isLoading} />
    </div>
  );
};

export default HomePage;