import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Product } from '../../types/product.types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(product.price);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative">
        <Link to={`/products/${product.id}`}>
          <div className="aspect-square overflow-hidden">
            <img 
              src={product.image_url} 
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        </Link>
        {product.stock <= 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold uppercase px-2 py-1 rounded">
            Out of Stock
          </div>
        )}
        {product.stock > 0 && product.stock < 5 && (
          <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold uppercase px-2 py-1 rounded">
            Low Stock
          </div>
        )}
      </div>
      
      <div className="p-4">
        <Link to={`/products/${product.id}`} className="block">
          <h3 className="text-lg font-semibold text-gray-800 mb-1 hover:text-teal-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-500 mb-2">
          {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
        </p>
        
        <div className="flex items-center justify-between mt-3">
          <p className="text-lg font-bold text-gray-900">
            {formattedPrice}
          </p>
          
          <button
            onClick={() => addToCart(product)}
            disabled={product.stock <= 0}
            className={`p-2 rounded-full ${
              product.stock > 0
                ? 'bg-teal-100 text-teal-600 hover:bg-teal-200'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            } transition-colors`}
            aria-label="Add to cart"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;