import { useEffect, useState } from 'react';
import api from '../api/axios';

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [productStock, setProductStock] = useState([]);
  const [orderStatus, setOrderStatus] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [userOrders, setUserOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const summaryResponse = await api.get('/dashboard/summary');
        const ordersResponse = await api.get('/dashboard/recent-orders');
        const stockResponse = await api.get('/dashboard/product-stock');
        const statusResponse = await api.get('/dashboard/order-status');
        const categoryResponse = await api.get(
          '/dashboard/category-products'
        );
        const userOrdersResponse = await api.get(
          '/dashboard/user-orders'
        );
        const orderDetailsResponse = await api.get(
          '/dashboard/order-details'
        );

        setSummary(summaryResponse.data);
        setRecentOrders(ordersResponse.data);
        setProductStock(stockResponse.data);
        setOrderStatus(statusResponse.data);
        setCategoryProducts(categoryResponse.data);
        setUserOrders(userOrdersResponse.data);
        setOrderDetails(orderDetailsResponse.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusClass = (status) => {
    if (status === 'COMPLETED') {
      return 'bg-green-100 text-green-700';
    }

    if (status === 'CANCELLED') {
      return 'bg-red-100 text-red-700';
    }

    return 'bg-yellow-100 text-yellow-700';
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* Dashboard Heading */}
      <h1 className="text-3xl font-bold mb-6">
        Dashboard
      </h1>

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

          <div className="bg-white p-5 rounded-lg shadow">
            <p className="text-gray-500">
              Total Users
            </p>

            <h2 className="text-2xl font-bold mt-2">
              {summary.total_users}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-lg shadow">
            <p className="text-gray-500">
              Total Products
            </p>

            <h2 className="text-2xl font-bold mt-2">
              {summary.total_products}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-lg shadow">
            <p className="text-gray-500">
              Total Orders
            </p>

            <h2 className="text-2xl font-bold mt-2">
              {summary.total_orders}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-lg shadow">
            <p className="text-gray-500">
              Total Order Amount
            </p>

            <h2 className="text-2xl font-bold mt-2">
              ₹{summary.total_order_amount}
            </h2>
          </div>

        </div>
      )}

      {/* ================= RECENT ORDERS ================= */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">

        <h2 className="text-xl font-bold mb-4">
          Recent Orders
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead>
              <tr className="border-b bg-gray-50">

                <th className="py-3 px-4">
                  Order ID
                </th>

                <th className="py-3 px-4">
                  User ID
                </th>

                <th className="py-3 px-4">
                  Amount
                </th>

                <th className="py-3 px-4">
                  Status
                </th>

                <th className="py-3 px-4">
                  Created At
                </th>

              </tr>
            </thead>

            <tbody>

              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="py-3 px-4">
                    {order.id}
                  </td>

                  <td className="py-3 px-4">
                    {order.user_id}
                  </td>

                  <td className="py-3 px-4">
                    ₹{order.total_amount}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    {formatDateTime(order.created_at)}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* ================= PRODUCT STOCK ================= */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">

        <h2 className="text-xl font-bold mb-4">
          Product Stock
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead>
              <tr className="border-b bg-gray-50">

                <th className="py-3 px-4">
                  Product ID
                </th>

                <th className="py-3 px-4">
                  Product Name
                </th>

                <th className="py-3 px-4">
                  Stock
                </th>

              </tr>
            </thead>

            <tbody>

              {productStock.map((product) => (
                <tr
                  key={product.id}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="py-3 px-4">
                    {product.id}
                  </td>

                  <td className="py-3 px-4">
                    {product.name}
                  </td>

                  <td className="py-3 px-4">
                    {product.stock}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* ================= ORDER STATUS ================= */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">

        <h2 className="text-xl font-bold mb-4">
          Order Status
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {orderStatus.map((status) => (
            <div
              key={status.status}
              className="border rounded-lg p-4"
            >

              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(
                  status.status
                )}`}
              >
                {status.status}
              </span>

              <p className="text-2xl font-bold mt-3">
                {status.count}
              </p>

            </div>
          ))}

        </div>

      </div>

      {/* ================= CATEGORY PRODUCTS ================= */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">

        <h2 className="text-xl font-bold mb-4">
          Category-wise Products
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead>
              <tr className="border-b bg-gray-50">

                <th className="py-3 px-4">
                  Category
                </th>

                <th className="py-3 px-4">
                  Product Count
                </th>

              </tr>
            </thead>

            <tbody>

              {categoryProducts.map((category) => (
                <tr
                  key={category.category}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="py-3 px-4">
                    {category.category}
                  </td>

                  <td className="py-3 px-4">
                    {category.product_count}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* ================= USER ORDER SUMMARY ================= */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">

        <h2 className="text-xl font-bold mb-4">
          User Order Summary
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead>
              <tr className="border-b bg-gray-50">

                <th className="py-3 px-4">
                  User ID
                </th>

                <th className="py-3 px-4">
                  Order Count
                </th>

                <th className="py-3 px-4">
                  Total Amount
                </th>

              </tr>
            </thead>

            <tbody>

              {userOrders.map((user) => (
                <tr
                  key={user.user_id}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="py-3 px-4">
                    {user.user_id}
                  </td>

                  <td className="py-3 px-4">
                    {user.order_count}
                  </td>

                  <td className="py-3 px-4">
                    ₹{user.total_amount}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* ================= ORDER DETAILS ================= */}
      <div className="bg-white p-6 rounded-lg shadow">

        <h2 className="text-xl font-bold mb-4">
          Order Details
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead>
              <tr className="border-b bg-gray-50">

                <th className="py-3 px-4">
                  Order ID
                </th>

                <th className="py-3 px-4">
                  User ID
                </th>

                <th className="py-3 px-4">
                  Amount
                </th>

                <th className="py-3 px-4">
                  Status
                </th>

                <th className="py-3 px-4">
                  Created At
                </th>

              </tr>
            </thead>

            <tbody>

              {orderDetails.map((order) => (
                <tr
                  key={order.id}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="py-3 px-4">
                    {order.id}
                  </td>

                  <td className="py-3 px-4">
                    {order.user_id}
                  </td>

                  <td className="py-3 px-4">
                    ₹{order.total_amount}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    {formatDateTime(order.created_at)}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;
