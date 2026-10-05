import { useState, useEffect } from 'react';
import {
  getCartSummary,
  removeCartItem,
  placeOrder,
} from '../api/cartApi';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

function Cart() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('OTHER');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const { userId } = useAuth();
  const { language } = useLanguage();

  const loadCart = async () => {
    try {
      const data = await getCartSummary(userId);
      setItems(data.items);
      setTotal(data.total_amount);
    } catch (err) {
      setItems([]);
      setTotal(0);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleRemove = async (cartItemId) => {
    setMessage('');
    setError('');

    try {
      await removeCartItem(cartItemId);
      await loadCart();
    } catch (err) {
      setError(
        language === 'en'
          ? 'Failed to remove item'
          : 'பொருளை நீக்க முடியவில்லை'
      );
    }
  };

  const handlePlaceOrder = async () => {
    setMessage('');
    setError('');

    try {
      const order = await placeOrder(userId, paymentMethod);

      setMessage(
        language === 'en'
          ? `Order placed! Order ID: ${order.id}, Total: ₹${order.total_amount}`
          : `ஆர்டர் செய்யப்பட்டது! ஆர்டர் எண்: ${order.id}, மொத்தம்: ₹${order.total_amount}`
      );

      await loadCart();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        (language === 'en'
          ? 'Failed to place order'
          : 'ஆர்டர் செய்ய முடியவில்லை')
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-5xl mx-auto">

        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          {language === 'en' ? 'My Cart' : 'என் கார்ட்'}
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

        {items.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <p className="text-gray-500 text-lg">
              {language === 'en'
                ? 'Cart is empty'
                : 'கார்ட் காலியாக உள்ளது'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">

            {/* Header */}
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200">

              <div className="text-sm font-semibold text-gray-700">
                {language === 'en' ? 'Product' : 'பொருள்'}
              </div>

              <div className="text-sm font-semibold text-gray-700">
                {language === 'en' ? 'Price' : 'விலை'}
              </div>

              <div className="text-sm font-semibold text-gray-700">
                {language === 'en' ? 'Qty' : 'அளவு'}
              </div>

              <div className="text-sm font-semibold text-gray-700">
                {language === 'en' ? 'Subtotal' : 'கூட்டுத்தொகை'}
              </div>

              <div></div>

            </div>

            {/* Cart Items */}
            {items.map((item) => (
              <div
                key={item.cart_item_id}
                className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 items-center px-6 py-4 border-b border-gray-100 hover:bg-gray-50"
              >

                <div className="font-medium text-gray-800">
                  {item.product_name.trim()}
                </div>

                <div className="text-gray-600">
                  {item.discount_percent > 0 ? (
                    <div>
                      <div className="line-through text-gray-400">
                        ₹{item.price}
                      </div>

                      <div className="font-medium text-green-600">
                        ₹{item.discounted_price}
                      </div>

                      <div className="text-sm text-green-600">
                        {item.discount_percent}%
                        {language === 'en'
                          ? ' OFF'
                          : ' தள்ளுபடி'}
                      </div>
                    </div>
                  ) : (
                    <div>
                      ₹{item.price}
                    </div>
                  )}
                </div>

                <div className="text-gray-600">
                  {item.quantity}
                </div>

                <div className="font-medium text-gray-800">
                  ₹{item.subtotal}
                </div>

                <div>
                  <button
                    onClick={() => handleRemove(item.cart_item_id)}
                    className="px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition duration-200"
                  >
                    {language === 'en'
                      ? 'Remove'
                      : 'நீக்கு'}
                  </button>
                </div>

              </div>
            ))}

            {/* Offers */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">

              {total >= 3000 && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
                  {language === 'en'
                    ? '🎉 You are eligible for 10% extra discount on orders above ₹3000!'
                    : '🎉 ₹3000-க்கு மேல் ஆர்டர் செய்தால் 10% கூடுதல் தள்ளுபடி கிடைக்கும்!'}
                </div>
              )}

              <div className="mb-4">
                <p className="font-semibold text-gray-700 mb-2">
                  {language === 'en'
                    ? 'Payment Method'
                    : 'பணம் செலுத்தும் முறை'}
                </p>

                <label className="flex items-center gap-2 text-gray-700">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="OTHER"
                    checked={paymentMethod === 'OTHER'}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                  />

                  {language === 'en'
                    ? 'Other'
                    : 'மற்றவை'}
                </label>

                <label className="flex items-center gap-2 mt-2 text-gray-700">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CREDIT_CARD"
                    checked={paymentMethod === 'CREDIT_CARD'}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                  />

                  {language === 'en'
                    ? 'Credit Card'
                    : 'கிரெடிட் கார்டு'}
                </label>
              </div>

              {paymentMethod === 'CREDIT_CARD' && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
                  {language === 'en'
                    ? '💳 Credit Card Offer: 5% extra discount!'
                    : '💳 கிரெடிட் கார்டு ஆஃபர்: 5% கூடுதல் தள்ளுபடி!'}
                </div>
              )}

              {/* Total */}
              <div className="flex flex-col items-end gap-4">

                <h3 className="text-xl font-bold text-gray-800">
                  {language === 'en'
                    ? 'Total'
                    : 'மொத்தம்'}: ₹{total}
                </h3>

                <button
                  onClick={handlePlaceOrder}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition duration-200"
                >
                  {language === 'en'
                    ? 'Place Order'
                    : 'ஆர்டர் செய்யவும்'}
                </button>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default Cart;