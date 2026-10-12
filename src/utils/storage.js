import { DEFAULT_PRODUCTS } from '../data/defaultProducts';

const PRODUCTS_KEY = 'ecoconstruct_pro_products_v3';
const LEGACY_V2_KEY = 'ecoconstruct_pro_products_v2';
const LEGACY_V1_KEY = 'ecoconstruct_pro_products_v1';
const CART_KEY = 'ecoconstruct_pro_cart_v1';
const ORDERS_KEY = 'ecoconstruct_pro_orders_v1';
const CURRENCY_KEY = 'ecoconstruct_pro_currency_v1';

export const loadStoredProducts = () => {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY) || localStorage.getItem(LEGACY_V2_KEY) || localStorage.getItem(LEGACY_V1_KEY);
    if (!raw) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(DEFAULT_PRODUCTS));
      return DEFAULT_PRODUCTS;
    }
    
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(DEFAULT_PRODUCTS));
      return DEFAULT_PRODUCTS;
    }

    // Merge logic: ensure default catalog products receive the latest realistic ratings & reviewsCount
    // while fully preserving any custom products added by the user (identified by isCustom: true or non-default ID).
    const defaultMap = new Map(DEFAULT_PRODUCTS.map(p => [p.id, p]));
    const customItems = parsed.filter(p => !defaultMap.has(p.id) || p.isCustom);
    
    // Ensure default items have updated ratings, reviewsCount, ecoScore and carbon values
    const mergedDefaults = DEFAULT_PRODUCTS.map(def => {
      const existing = parsed.find(p => p.id === def.id);
      return {
        ...def,
        ...(existing?.stock !== undefined ? { stock: existing.stock } : {})
      };
    });

    const finalProducts = [...customItems, ...mergedDefaults];
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(finalProducts));
    return finalProducts;
  } catch (e) {
    console.error('Error loading products from localStorage:', e);
    return DEFAULT_PRODUCTS;
  }
};

export const saveStoredProducts = (products) => {
  try {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  } catch (e) {
    console.error('Error saving products to localStorage:', e);
  }
};

export const loadStoredCart = () => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error loading cart from localStorage:', e);
    return [];
  }
};

export const saveStoredCart = (cart) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (e) {
    console.error('Error saving cart to localStorage:', e);
  }
};

export const loadStoredOrders = () => {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error loading orders from localStorage:', e);
    return [];
  }
};

export const saveStoredOrders = (orders) => {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Error saving orders to localStorage:', e);
  }
};

export const loadStoredCurrency = () => {
  try {
    const raw = localStorage.getItem(CURRENCY_KEY);
    return raw || 'USD';
  } catch (e) {
    return 'USD';
  }
};

export const saveStoredCurrency = (currency) => {
  try {
    localStorage.setItem(CURRENCY_KEY, currency);
  } catch (e) {
    console.error('Error saving currency to localStorage:', e);
  }
};
