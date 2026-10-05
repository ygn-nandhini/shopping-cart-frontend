import api from './axios';

// User-oda cart-a thedu, illana puthusa create pannu
export const getOrCreateCart = async (userId) => {
  const response = await api.get('/cart');

  const existingCart = response.data.find(
    (cart) => cart.user_id === Number(userId)
  );

  if (existingCart) {
    return existingCart;
  }

  const created = await api.post('/cart', {
    user_id: Number(userId),
  });

  return created.data;
};

// Cart-ku oru product add pannu (already irundha quantity increase)
export const addToCart = async (
  cartId,
  productId,
  quantity = 1,
  userId
) => {
  let existingItem = null;

  try {
    const summary = await getCartSummary(userId);

    existingItem = summary.items.find(
      (i) => i.product_id === productId
    );
  } catch (err) {
    // Cart-la items illa (404), so puthusa add pannalam
  }

  if (existingItem) {
    const response = await api.put(
      `/cart-items/${existingItem.cart_item_id}`,
      {
        quantity: existingItem.quantity + quantity,
      }
    );

    return response.data;
  }

  const response = await api.post('/cart-items', {
    cart_id: cartId,
    product_id: productId,
    quantity: quantity,
  });

  return response.data;
};

// Cart items + total
export const getCartSummary = async (userId) => {
  const response = await api.get('/cart-summary', {
    params: {
      user_id: userId,
    },
  });

  return response.data;
};


export const removeCartItem = async (cartItemId) => {
  const response = await api.delete(
    `/cart-items/${cartItemId}`
  );

  return response.data;
};

export const placeOrder = async (
  userId,
  paymentMethod = 'OTHER'
) => {
  const response = await api.post('/orders', null, {
    params: {
      user_id: userId,
      payment_method: paymentMethod,
    },
  });

  return response.data;
};