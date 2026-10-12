export const USD_TO_INR_RATE = 83.0;

export const formatPrice = (priceInUsd, currency = 'USD') => {
  if (currency === 'INR') {
    const inr = Math.round(priceInUsd * USD_TO_INR_RATE);
    return `₹${inr.toLocaleString('en-IN')}`;
  }
  return `$${Number(priceInUsd).toFixed(2)}`;
};

export const generateOrderId = () => {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `ECO-${randomNum}`;
};

export const calculateCartTotals = (cartItems, currency = 'USD') => {
  const subtotalUSD = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  // Free shipping for orders over $100, otherwise $15.99
  const shippingUSD = subtotalUSD > 100 || subtotalUSD === 0 ? 0 : 15.99;
  
  // Tax is 8.75% of Subtotal
  const taxUSD = subtotalUSD * 0.0875;
  
  const totalUSD = subtotalUSD + shippingUSD + taxUSD;

  // Calculate equivalent in current currency
  const rate = currency === 'INR' ? USD_TO_INR_RATE : 1;

  return {
    subtotalUSD,
    shippingUSD,
    taxUSD,
    totalUSD,
    subtotal: currency === 'INR' ? Math.round(subtotalUSD * rate) : subtotalUSD,
    shipping: currency === 'INR' ? Math.round(shippingUSD * rate) : shippingUSD,
    tax: currency === 'INR' ? Math.round(taxUSD * rate) : taxUSD,
    total: currency === 'INR' ? Math.round(totalUSD * rate) : totalUSD,
    isFreeShipping: subtotalUSD >= 100,
    amountNeededForFreeShippingUSD: Math.max(0, 100 - subtotalUSD)
  };
};

/**
 * Calculates dynamic carbon savings (in kg CO₂e) based on items in the cart or order.
 */
export const calculateCarbonSaved = (cartItems = []) => {
  if (!cartItems || cartItems.length === 0) return 0;
  return cartItems.reduce((total, item) => {
    const unitCarbon = item.carbonSavedPerUnit !== undefined ? Number(item.carbonSavedPerUnit) : 15.0;
    return total + (unitCarbon * (item.quantity || 1));
  }, 0);
};

export const formatCarbonSaved = (kg) => {
  return `${(Math.round(kg * 10) / 10).toFixed(1)} kg CO₂e`;
};
