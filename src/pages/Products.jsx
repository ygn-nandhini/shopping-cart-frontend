import { useState, useEffect } from 'react';
import api from '../api/axios';
import { getOrCreateCart, addToCart } from '../api/cartApi';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

function Products() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const { userId } = useAuth();
  const { language } = useLanguage();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data);
      } catch (err) {
        setError(
          language === 'en'
            ? 'Failed to load products'
            : 'பொருட்களை ஏற்ற முடியவில்லை'
        );
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (product) => {
    setMessage('');
    setError('');

    try {
      const cart = await getOrCreateCart(userId);
      await addToCart(cart.id, product.id, 1, userId);

      setMessage(
        language === 'en'
          ? `${product.name} added to cart`
          : `${product.name} கார்ட்டில் சேர்க்கப்பட்டது`
      );
    } catch (err) {
      setError(
        language === 'en'
          ? 'Failed to add to cart'
          : 'கார்ட்டில் சேர்க்க முடியவில்லை'
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">

      <div className="max-w-6xl mx-auto">

        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          {language === 'en' ? 'Products' : 'பொருட்கள்'}
        </h2>

        {message && (
          <p className="mb-6 p-3 text-center text-green-700 bg-green-50 border border-green-200 rounded-lg">
            {message}
          </p>
        )}

        {error && (
          <p className="mb-6 p-3 text-center text-red-700 bg-red-50 border border-red-200 rounded-lg">
            {error}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {products.map((product) => {
            const hasDiscount = product.discount_percent > 0;

            const finalPrice =
              product.price -
              (product.price * product.discount_percent / 100);

            return (
              <div
                key={product.id}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm
                           hover:shadow-md transition duration-200"
              >

                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {product.name}
                </h3>

                {hasDiscount ? (
                  <div className="mb-2">

                    <span className="text-sm text-gray-400 line-through mr-2">
                      ₹{product.price}
                    </span>

                    <span className="text-lg font-medium text-green-600">
                      ₹{finalPrice.toFixed(2)}
                    </span>

                    <span className="ml-2 text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                      {product.discount_percent}%
                      {language === 'en' ? ' off' : ' தள்ளுபடி'}
                    </span>

                  </div>
                ) : (
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Price' : 'விலை'}: ₹{product.price}
                  </p>
                )}

                <p className="text-sm text-gray-500 mb-5">
                  {language === 'en' ? 'Stock' : 'இருப்பு'}: {product.stock}
                </p>

                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                  className={`w-full py-2.5 rounded-lg font-medium transition duration-200 ${
                    product.stock === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {product.stock === 0
                    ? language === 'en'
                      ? 'Out of Stock'
                      : 'கையிருப்பில் இல்லை'
                    : language === 'en'
                      ? 'Add to Cart'
                      : 'கார்ட்டில் சேர்'}
                </button>

              </div>
            );
          })}

        </div>

      </div>
    </div>
  );
}

export default Products;


