import { Fragment, useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  getMyOrders,
  getOrderItems,
  cancelOrder
} from '../api/orderApi';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [itemsByOrder, setItemsByOrder] = useState({});
  const [openId, setOpenId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const { userId } = useAuth();
  const { language } = useLanguage();

  const loadOrders = async () => {
    try {
      setError('');

      const data = await getMyOrders(userId);
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err.response?.data || err);

      setError(
        language === 'en'
          ? 'Failed to load orders'
          : 'ஆர்டர்களை ஏற்ற முடியவில்லை'
      );
    }
  };

  useEffect(() => {
    if (userId) {
      loadOrders();
    }
  }, [userId]);

  const toggleItems = async (orderId) => {
    if (openId === orderId) {
      setOpenId(null);
      return;
    }

    try {
      setError('');

      if (!itemsByOrder[orderId]) {
        const items = await getOrderItems(orderId);

        setItemsByOrder((prev) => ({
          ...prev,
          [orderId]: items
        }));
      }

      setOpenId(orderId);
    } catch (err) {
      console.error(
        'Failed to load order items:',
        err.response?.data || err
      );

      setError(
        language === 'en'
          ? 'Failed to load order items'
          : 'ஆர்டர் பொருட்களை ஏற்ற முடியவில்லை'
      );
    }
  };

  const handleCancel = async (orderId) => {
    const confirmMessage =
      language === 'en'
        ? `Cancel order #${orderId}?`
        : `ஆர்டர் #${orderId}-ஐ ரத்து செய்ய வேண்டுமா?`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    setMessage('');
    setError('');

    try {
      await cancelOrder(orderId);

      setMessage(
        language === 'en'
          ? `Order #${orderId} cancelled`
          : `ஆர்டர் #${orderId} ரத்து செய்யப்பட்டது`
      );

      await loadOrders();
    } catch (err) {
      console.error(
        'Failed to cancel order:',
        err.response?.data || err
      );

      setError(
        err.response?.data?.detail ||
        (language === 'en'
          ? 'Failed to cancel order'
          : 'ஆர்டரை ரத்து செய்ய முடியவில்லை')
      );
    }
  };

  // Convert backend status into display text
  const getStatusText = (status) => {
    if (language === 'en') {
      return status;
    }

    const statusTranslations = {
      PENDING: 'நிலுவையில்',
      CANCELLED: 'ரத்து செய்யப்பட்டது',
      CONFIRMED: 'உறுதிசெய்யப்பட்டது',
      COMPLETED: 'முடிக்கப்பட்டது',
      DELIVERED: 'வழங்கப்பட்டது'
    };

    return statusTranslations[status] || status;
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-5xl mx-auto">

        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          {language === 'en' ? 'My Orders' : 'என் ஆர்டர்கள்'}
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

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <p className="text-gray-500 text-lg">
              {language === 'en'
                ? 'No orders yet'
                : 'இன்னும் ஆர்டர்கள் இல்லை'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">

              <table className="w-full">
                <thead>
                  <tr className="text-left bg-gray-50 border-b border-gray-200">

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      {language === 'en' ? 'Order ID' : 'ஆர்டர் எண்'}
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      {language === 'en' ? 'Date' : 'தேதி'}
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      {language === 'en' ? 'Total' : 'மொத்தம்'}
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      {language === 'en' ? 'Status' : 'நிலை'}
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      {language === 'en' ? 'Actions' : 'செயல்கள்'}
                    </th>

                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <Fragment key={order.id}>

                      <tr className="border-b border-gray-100 hover:bg-gray-50">

                        <td className="px-6 py-4 font-medium text-gray-800">
                          {order.id}
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {new Date(order.created_at).toLocaleString()}
                        </td>

                        <td className="px-6 py-4 font-medium text-gray-800">
                          ₹{order.total_amount}
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {getStatusText(order.status)}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex gap-2 flex-wrap">

                            <button
                              onClick={() => toggleItems(order.id)}
                              className="px-3 py-1.5 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition duration-200"
                            >
                              {openId === order.id
                                ? language === 'en'
                                  ? 'Hide items'
                                  : 'பொருட்களை மறை'
                                : language === 'en'
                                  ? 'View items'
                                  : 'பொருட்களைப் பார்க்க'}
                            </button>

                            {order.status === 'PENDING' && (
                              <button
                                onClick={() => handleCancel(order.id)}
                                className="px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition duration-200"
                              >
                                {language === 'en'
                                  ? 'Cancel'
                                  : 'ரத்து செய்'}
                              </button>
                            )}

                          </div>
                        </td>

                      </tr>

                      {openId === order.id && (
                        <tr>
                          <td
                            colSpan={5}
                            className="bg-gray-50 px-6 py-4"
                          >
                            <div className="space-y-2">

                              {(itemsByOrder[order.id] || []).map(
                                (item, index) => (
                                  <div
                                    key={index}
                                    className="text-sm text-gray-700"
                                  >
                                    {item.product_name} x{' '}
                                    {item.quantity}{' '}
                                    @ ₹{item.price} = ₹
                                    {item.subtotal}
                                  </div>
                                )
                              )}

                            </div>
                          </td>
                        </tr>
                      )}

                    </Fragment>
                  ))}
                </tbody>
              </table>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;

