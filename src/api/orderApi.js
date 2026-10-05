import api from './axios';

export const getMyOrders = async (userId) => {
  const response = await api.get('/orders');
  return response.data
    .filter((order) => order.user_id === Number(userId))
    .sort((a, b) => b.id - a.id);
};

export const getOrderItems = async (orderId) => {
  const response = await api.get(`/orders/${orderId}/items`);
  return response.data;
};

export const cancelOrder = async (orderId) => {
  const response = await api.post(`/orders/${orderId}/cancel`);
  return response.data;
};