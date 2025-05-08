import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, Share2, Star, Truck, Shield, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Product } from '../types/product.types';
import { supabase } from '../lib/supabase';
import ProductGrid from '../components/products/ProductGrid';

// Temporary sample data for development
import { sampleProducts } from '../data/sampleProducts';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [activeImage, setActiveImage] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    // Scroll to top when product page loads
    window.scrollTo(0, 0);
    
    // This function will fetch product from Supabase once connected
    const fetchProduct = async () => {
      setIsLoading(true);
      
      try {
        // In a real implementation, this would fetch from Supabase
        // For now, we'll use the sample data
        const foundProduct = sampleProducts.find(p => p.id === id);
        
        if (foundProduct) {
          setProduct(foundProduct);
          
          // Get related products (same category, excluding this product)
          const related = sampleProducts
            .filter(p => p.category === foundProduct.category && p.id !== id)
            .slice(0, 4);
            
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const formattedPrice = product?.price 
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(product.price)
    : '';

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/2">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
              <div className="h-10 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="h-12 bg-gray-200 rounded w-full mb-4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Link 
          to="/"
          className="inline-flex items-center text-teal-600 hover:text-teal-700"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to shop
        </Link>
      </div>
    );
  }

  // Mock product images for demonstration
  const productImages = [
    product.image_url,
    'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/2536965/pexels-photo-2536965.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/335257/pexels-photo-335257.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-teal-600">Home</Link>
        <span className="mx-2">/</span>
        <Link to={`/?category=${product.category}`} className="hover:text-teal-600">
          {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">{product.name}</span>
      </div>

      {/* Product Details */}
      <div className="flex flex-col lg:flex-row gap-8 mb-12">
        {/* Product Images */}
        <div className="w-full lg:w-1/2">
          <div className="mb-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img 
                src={productImages[activeImage]} 
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {productImages.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`aspect-square rounded border-2 overflow-hidden ${
                  idx === activeImage 
                    ? 'border-teal-500' 
                    : 'border-transparent hover:border-gray-300'
                }`}
              >
                <img 
                  src={img} 
                  alt={`${product.name} view ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full lg:w-1/2">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={18}
                  className={`${star <= 4 ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="ml-2 text-gray-600">4.0 (24 reviews)</span>
          </div>
          
          <div className="text-2xl font-bold text-gray-900 mb-6">
            {formattedPrice}
          </div>
          
          <p className="text-gray-600 mb-6">
            {product.description}
          </p>
          
          {/* Availability */}
          <div className="mb-6">
            <span className={`inline-flex items-center ${
              product.stock > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {product.stock > 0 
                ? `In Stock (${product.stock} available)` 
                : 'Out of Stock'}
            </span>
          </div>
          
          {/* Quantity Selector */}
          <div className="mb-6">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <div className="flex items-center">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="px-3 py-1 border border-gray-300 rounded-l-md bg-gray-100 text-gray-600 hover:bg-gray-200"
                disabled={quantity <= 1}
              >
                -
              </button>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                max={product.stock}
                className="w-16 text-center border-y border-gray-300 py-1"
              />
              <button 
                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                className="px-3 py-1 border border-gray-300 rounded-r-md bg-gray-100 text-gray-600 hover:bg-gray-200"
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className={`flex-1 flex items-center justify-center py-3 px-6 rounded-lg font-medium ${
                product.stock > 0
                  ? 'bg-teal-600 hover:bg-teal-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <ShoppingCart size={20} className="mr-2" />
              Add to Cart
            </button>
            
            <button
              className="flex items-center justify-center py-3 px-6 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              <Heart size={20} className="mr-2" />
              Wishlist
            </button>
            
            <button
              className="sm:flex-none flex items-center justify-center py-3 px-6 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              <Share2 size={20} />
            </button>
          </div>
          
          {/* Shipping & Returns */}
          <div className="border-t border-gray-200 pt-6 space-y-4">
            <div className="flex items-start">
              <Truck className="text-teal-600 mr-3 mt-1" size={20} />
              <div>
                <h4 className="font-medium text-gray-800">Free Shipping</h4>
                <p className="text-sm text-gray-600">Free standard shipping on orders over $50</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Shield className="text-teal-600 mr-3 mt-1" size={20} />
              <div>
                <h4 className="font-medium text-gray-800">30-Day Returns</h4>
                <p className="text-sm text-gray-600">Shop with confidence with our 30-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="mb-12">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('description')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'description'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('specifications')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'specifications'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'reviews'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Reviews (24)
            </button>
          </nav>
        </div>
        
        <div className="py-6">
          {activeTab === 'description' && (
            <div className="prose max-w-none">
              <p className="mb-4">
                {product.description}
              </p>
              <p className="mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam dapibus, nisl eget consequat fringilla, diam ex malesuada odio, sed dignissim quam dui at nisi. Aliquam dapibus pulvinar lacus, eget cursus mauris dapibus id.
              </p>
              <p>
                Proin aliquam tincidunt lorem, non vestibulum sapien. Sed interdum mi sed mi elementum, vel varius felis consequat. Sed convallis, nisl a mattis ullamcorper, nulla nisi molestie orci, quis egestas sapien dolor at lectus.
              </p>
            </div>
          )}
          
          {activeTab === 'specifications' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Category</h3>
                  <p className="mt-1 text-base text-gray-900">{product.category}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Brand</h3>
                  <p className="mt-1 text-base text-gray-900">LuxeMarket</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Material</h3>
                  <p className="mt-1 text-base text-gray-900">Premium Quality</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Weight</h3>
                  <p className="mt-1 text-base text-gray-900">0.5 kg</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Dimensions</h3>
                  <p className="mt-1 text-base text-gray-900">25 × 15 × 5 cm</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Color</h3>
                  <p className="mt-1 text-base text-gray-900">Various</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Warranty</h3>
                  <p className="mt-1 text-base text-gray-900">1 Year Limited Warranty</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Origin</h3>
                  <p className="mt-1 text-base text-gray-900">Imported</p>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'reviews' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Customer Reviews</h3>
                <button className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                  Write a Review
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Sample Reviews */}
                {[1, 2, 3].map((review) => (
                  <div key={review} className="border-b border-gray-200 pb-6">
                    <div className="flex justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">John Doe</h4>
                        <p className="text-sm text-gray-500">April 12, 2025</p>
                      </div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={16}
                            className={`${star <= 4 ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700">
                      Great product! Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam dapibus, nisl eget consequat fringilla, diam ex malesuada odio, sed dignissim quam dui at nisi.
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-center">
                <button className="text-teal-600 hover:text-teal-700 font-medium">
                  Load More Reviews
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-gray-200 pt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Products</h2>
          <ProductGrid products={relatedProducts} />
        </div>
      )}
    </div>
  );
};

export default ProductPage;