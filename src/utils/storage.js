import { DEFAULT_PRODUCTS } from '../data/defaultProducts';

const PRODUCTS_KEY = 'ecoconstruct_pro_products_v3';
const LEGACY_V2_KEY = 'ecoconstruct_pro_products_v2';
const LEGACY_V1_KEY = 'ecoconstruct_pro_products_v1';
const CART_KEY = 'ecoconstruct_pro_cart_v1';
const ORDERS_KEY = 'ecoconstruct_orders';
const LEGACY_ORDERS_KEY = 'ecoconstruct_pro_orders_v1';
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

export const SAMPLE_ORDERS = [
  {
    id: '#ECO-84920',
    date: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    status: 'Shipped & In Transit',
    currentStageIndex: 2,
    carrier: 'Pacific Green EV Freight (Fleet #EV-408)',
    dispatchLocation: 'Cascadia Eco-Distribution Hub, Portland OR',
    destination: '1420 Evergreen Sustainable Way, Portland, OR 97201',
    estimatedDelivery: 'Tomorrow by 2:30 PM (Zero-Emission Fleet)',
    paymentMethod: 'Cash on Delivery (Site Inspection Delivery)',
    shippingMethod: 'Express Zero-Emission Electric Freight',
    shippingAddress: {
      firstName: 'Elena',
      lastName: 'Rostova',
      streetAddress: '1420 Evergreen Sustainable Way',
      city: 'Portland',
      state: 'OR',
      zipCode: '97201',
      phone: '+1 (503) 555-0182',
      email: 'elena.rostova@cascadiagreen.org'
    },
    items: [
      {
        id: 'prod-7',
        title: 'Fly Ash Lightweight AAC Blocks',
        category: 'Masonry & Blocks',
        price: 2.40,
        quantity: 150,
        unit: 'block',
        ecoScore: 92,
        imageUrl: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80',
        carbonSavedPerUnit: 1.8
      },
      {
        id: 'prod-11',
        title: 'Hempcrete Insulating Building Blocks',
        category: 'Insulation',
        price: 8.75,
        quantity: 40,
        unit: 'block',
        ecoScore: 96,
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        carbonSavedPerUnit: 12.0
      }
    ],
    totalUSD: 724.99,
    timeline: [
      {
        stage: 'Order Placed (Confirmed)',
        timestamp: new Date(Date.now() - 48 * 3600 * 1000).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        completed: true,
        current: false,
        detail: 'Order verified & electronic bill of lading issued.'
      },
      {
        stage: 'Processing & Quality Check (Eco-certified inspection)',
        timestamp: new Date(Date.now() - 36 * 3600 * 1000).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        completed: true,
        current: false,
        detail: 'Batch #OR-892 certified. 100% recycled palletizing applied.'
      },
      {
        stage: 'Shipped & In Transit (Carrier assigned with dispatch location)',
        timestamp: new Date(Date.now() - 14 * 3600 * 1000).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        completed: true,
        current: true,
        detail: 'Assigned to Pacific Green EV Freight (Fleet #EV-408). Dispatched from Cascadia Hub.'
      },
      {
        stage: 'Out for Delivery (Estimated delivery window/time)',
        timestamp: 'Estimated Tomorrow, 11:00 AM – 2:30 PM',
        completed: false,
        current: false,
        detail: 'Driver staging at Portland Local Micro-Hub. EV Van #EV-19.'
      },
      {
        stage: 'Delivered',
        timestamp: 'Pending Delivery',
        completed: false,
        current: false,
        detail: 'Awaiting site delivery and inspection sign-off.'
      }
    ]
  },
  {
    id: '#ECO-61048',
    date: new Date(Date.now() - 120 * 3600 * 1000).toISOString(),
    status: 'Delivered',
    currentStageIndex: 4,
    carrier: 'CleanFreight Zero-Emission Courier (Fleet #CF-109)',
    dispatchLocation: 'Seattle Central Green Warehouse',
    destination: '742 Evergreen Eco-Way, Suite 400, Seattle, WA 98101',
    estimatedDelivery: 'Delivered on ' + new Date(Date.now() - 24 * 3600 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    paymentMethod: 'Pay Later / 30-Day Green Trade Credit',
    shippingMethod: 'Standard Green Shipping',
    shippingAddress: {
      firstName: 'Marcus',
      lastName: 'Vance',
      streetAddress: '742 Evergreen Eco-Way, Suite 400',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      phone: '+1 (555) 234-8900',
      email: 'marcus.vance@greenbuilders.org'
    },
    items: [
      {
        id: 'prod-9',
        title: 'Mushroom Mycelium Acoustic Wall Panels',
        category: 'Insulation',
        price: 32.00,
        quantity: 12,
        unit: 'panel',
        ecoScore: 98,
        imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
        carbonSavedPerUnit: 8.5
      },
      {
        id: 'prod-14',
        title: 'Ultra-Low VOC Plant-Based Wall Paint',
        category: 'Finishes',
        price: 45.00,
        quantity: 4,
        unit: 'gallon',
        ecoScore: 88,
        imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
        carbonSavedPerUnit: 11.2
      },
      {
        id: 'prod-12',
        title: 'Cross-Laminated Timber (CLT) Beam',
        category: 'Timber & Wood',
        price: 120.00,
        quantity: 3,
        unit: 'meter',
        ecoScore: 91,
        imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=800&q=80',
        carbonSavedPerUnit: 48.0
      }
    ],
    totalUSD: 924.00,
    timeline: [
      {
        stage: 'Order Placed (Confirmed)',
        timestamp: new Date(Date.now() - 120 * 3600 * 1000).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        completed: true,
        current: false,
        detail: 'Authorized under 30-Day Green Trade Credit (#USGBC-LEED-CON-9021).'
      },
      {
        stage: 'Processing & Quality Check (Eco-certified inspection)',
        timestamp: new Date(Date.now() - 96 * 3600 * 1000).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        completed: true,
        current: false,
        detail: 'LEED v4.1 certification verified. Low-VOC sealing checked.'
      },
      {
        stage: 'Shipped & In Transit (Carrier assigned with dispatch location)',
        timestamp: new Date(Date.now() - 68 * 3600 * 1000).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        completed: true,
        current: false,
        detail: 'Assigned to CleanFreight Zero-Emission Courier. Departed Seattle Central Green Hub.'
      },
      {
        stage: 'Out for Delivery (Estimated delivery window/time)',
        timestamp: new Date(Date.now() - 28 * 3600 * 1000).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        completed: true,
        current: false,
        detail: 'Final delivery run via Heavy EV Van. Driver: Alex P.'
      },
      {
        stage: 'Delivered',
        timestamp: new Date(Date.now() - 24 * 3600 * 1000).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        completed: true,
        current: true,
        detail: 'Delivered safely at Job Site Loading Dock. Received & signed by Marcus Vance.'
      }
    ]
  }
];

export const loadStoredOrders = () => {
  try {
    const raw = localStorage.getItem(ORDERS_KEY) || localStorage.getItem(LEGACY_ORDERS_KEY);
    if (!raw) {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(SAMPLE_ORDERS));
      return SAMPLE_ORDERS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(SAMPLE_ORDERS));
      return SAMPLE_ORDERS;
    }
    return parsed;
  } catch (e) {
    console.error('Error loading orders from localStorage:', e);
    return SAMPLE_ORDERS;
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
