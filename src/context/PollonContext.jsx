import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { CATEGORY_META, CATEGORY_ORDER, PRODUCTS } from '../data/products.js';
import { money } from '../utils/formatPrice.js';
import { pad3, wrapText } from '../utils/helpers.js';
import {
  buildWhatsappTextFromOrder,
  buildTicketHtml80mm,
  buildTicketText80mm,
} from '../utils/ticket.js';
import {
  initOrdersBackend,
  isFirestoreActive,
  loadOrdersFromStorage,
  persistOrdersLocal,
  saveOrdersBatch,
  saveSingleOrderRemote,
} from '../services/firebaseOrders.js';
import { WHATSAPP_NUMBER } from '../constants/whatsapp.js';

const PollonCtx = createContext(null);

const BAG_PRICE = 200;
const TICKET_SEQ_KEY = 'pollon_ticket_seq_v1';

function nextTicketNumber() {
  let seq;
  try {
    seq = Number(localStorage.getItem(TICKET_SEQ_KEY) || '0') || 0;
  } catch {
    seq = 0;
  }
  const nextSeq = seq + 1;
  try {
    localStorage.setItem(TICKET_SEQ_KEY, String(nextSeq));
  } catch {
    /* localStorage puede estar deshabilitado */
  }
  return pad3(nextSeq);
}

function bagQtyRule(currentRealCategory, productQuantity, bagChoice) {
  const q = Math.max(1, Number(productQuantity) || 1);
  if (currentRealCategory === 'bebidas' || currentRealCategory === 'descartables') return 0;
  if (bagChoice !== 'add') return 0;
  if (currentRealCategory === 'ofertas-familiares') return q;
  if (
    currentRealCategory === 'ofertas-dos' ||
    currentRealCategory === 'ofertas-personales' ||
    currentRealCategory === 'platos-extras' ||
    currentRealCategory === 'agregados'
  ) {
    return Math.ceil(q / 3);
  }
  return 1;
}

function computeLiveOptionsTotal(currentProduct, productQuantity, bagChoice, currentRealCategory) {
  if (!currentProduct) return { total: 0, bagQty: 0, base: 0 };
  const base = (currentProduct.price || 0) * productQuantity;
  const bagQty = bagQtyRule(currentRealCategory, productQuantity, bagChoice);
  const total = base + bagQty * BAG_PRICE;
  return { total, bagQty, base };
}

export function PollonProvider({ children }) {
  const [orders, setOrdersState] = useState([]);
  const ordersRefMirror = useRef([]);
  useEffect(() => {
    ordersRefMirror.current = orders;
  }, [orders]);

  const setOrders = useCallback((updater) => {
    setOrdersState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      ordersRefMirror.current = next;
      return next;
    });
  }, []);

  const [cart, setCart] = useState([]);
  const [currentCategory, setCurrentCategoryState] = useState('todo-el-menu');
  const [menuDdHidden, setMenuDdHidden] = useState(true);

  const [modalDelivery, setModalDelivery] = useState(false);
  const [modalReservas, setModalReservas] = useState(false);
  const [modalRetiros, setModalRetiros] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentRealCategory, setCurrentRealCategory] = useState(null);
  const [selectedDrink, setSelectedDrink] = useState(null);
  const [productQuantity, setProductQuantity] = useState(1);
  const [bagChoice, setBagChoice] = useState(null);

  /* Firebase */
  useEffect(() => {
    const unsub = initOrdersBackend((incoming, { hasNew }) => {
      setOrders(incoming);

      if (
        hasNew &&
        typeof window.onNewOrderArrived === 'function' &&
        typeof window.isAdminOpen === 'function' &&
        window.isAdminOpen()
      ) {
        window.onNewOrderArrived();
      }
    });

    if (!isFirestoreActive()) {
      setOrders(loadOrdersFromStorage());
    }

    return unsub;
  }, [setOrders]);

  const persistOrderSingle = useCallback(async (order) => {
    try {
      await saveSingleOrderRemote(order);
    } catch {
      persistOrdersLocal(ordersRefMirror.current);
    }
  }, []);

  const cartCountFn = useCallback(() => cart.reduce((a, it) => a + (it.qty || 0), 0), [cart]);
  const cartSumFn = useCallback(() => cart.reduce((a, it) => a + (it.total || 0), 0), [cart]);

  const liveOptions = useMemo(
    () => computeLiveOptionsTotal(currentProduct, productQuantity, bagChoice, currentRealCategory),
    [currentProduct, productQuantity, bagChoice, currentRealCategory],
  );

  const closePanels = useCallback(() => setMenuDdHidden(true), []);

  const showToast = useCallback((msg) => {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
  }, []);

  const scrollToMenu = useCallback(() => {
    document.getElementById('ofertas')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const toggleHeroCarousel = useCallback((show) => {
    const heroSection = document.querySelector('.hero');
    heroSection?.classList.toggle('is-hidden', !show);
  }, []);

  const syncCategoryButtons = useCallback((cat) => {
    document.querySelectorAll('.cat-card__btn.category-btn').forEach((b) => {
      b.classList.toggle('is-active', b.dataset.cat === cat);
    });

    const titleEl = document.getElementById('category-title');
    if (titleEl) {
      if (cat === 'todo-el-menu') {
        titleEl.classList.add('is-hidden');
        titleEl.textContent = '';
      } else {
        titleEl.classList.remove('is-hidden');
        titleEl.textContent = CATEGORY_META[cat] || cat;
      }
    }

    document.getElementById('cat-slider')?.classList.remove('is-hidden');
  }, []);

  useEffect(() => {
    syncCategoryButtons('todo-el-menu');
  }, [syncCategoryButtons]);

  const setCategory = useCallback(
    (cat) => {
      setCurrentCategoryState(cat);
      syncCategoryButtons(cat);
      toggleHeroCarousel(true);
      window.dispatchEvent(new CustomEvent('pollon:category', { detail: cat }));
    },
    [syncCategoryButtons, toggleHeroCarousel],
  );

  const jumpToCategory = useCallback(
    (cat) => {
      if (cat === 'todo-el-menu') {
        setCategory('todo-el-menu');
      } else {
        setCategory(cat);
      }
      scrollToMenu();
    },
    [setCategory, scrollToMenu],
  );

  const resetToHome = useCallback(() => {
    setCategory('todo-el-menu');
    toggleHeroCarousel(true);
    scrollToMenu();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setCategory, toggleHeroCarousel, scrollToMenu]);

  const openOptionsForProduct = useCallback((p, categoryKey) => {
    setCurrentProduct(p);
    setCurrentRealCategory(categoryKey);
    setSelectedDrink(null);
    setProductQuantity(1);
    setBagChoice(null);
    setOptionsOpen(true);
  }, []);

  const confirmAddToCart = useCallback(() => {
    if (!currentProduct) return;

    if (currentRealCategory === 'ofertas-familiares' && !selectedDrink) {
      showToast('En familiares debes elegir una bebida.');
      return;
    }

    const bagRequired =
      currentRealCategory === 'ofertas-familiares' ||
      currentRealCategory === 'ofertas-dos' ||
      currentRealCategory === 'ofertas-personales' ||
      currentRealCategory === 'platos-extras';

    if (bagRequired && bagChoice !== 'add') {
      showToast('En esta categoría la bolsa es obligatoria.');
      return;
    }

    let effectiveBagChoice = bagChoice;
    if (currentRealCategory === 'bebidas' || currentRealCategory === 'descartables') {
      effectiveBagChoice = 'none';
    }

    const { total, bagQty, base } = computeLiveOptionsTotal(
      currentProduct,
      productQuantity,
      effectiveBagChoice,
      currentRealCategory,
    );
    const bagTotal = (bagQty || 0) * BAG_PRICE;

    const item = {
      name: currentProduct.name,
      price: currentProduct.price,
      qty: productQuantity,
      drink: currentRealCategory === 'ofertas-familiares' ? selectedDrink : null,
      bagQty: bagQty || 0,
      subtotal: base + bagTotal,
      total,
    };

    setCart((c) => [...c, item]);
    showToast('Agregado al carrito ✅');
    setOptionsOpen(false);
  }, [
    currentProduct,
    currentRealCategory,
    selectedDrink,
    productQuantity,
    bagChoice,
    showToast,
  ]);

  const removeFromCart = useCallback((idx) => {
    setCart((c) => c.filter((_, i) => i !== idx));
  }, []);

  const openCartModal = useCallback(() => {
    setCartModalOpen(true);
  }, []);

  const closeCartModal = useCallback(() => {
    setCartModalOpen(false);
  }, []);

  const checkoutSubmit = useCallback(
    async ({ name, address, phone, comment }) => {
      if (!cart.length) {
        showToast('Tu carrito está vacío.');
        setCheckoutOpen(false);
        return;
      }

      const ticketNumber = nextTicketNumber();
      const totalVal = cart.reduce((a, it) => a + (it.total || 0), 0);
      const order = {
        id: `P${Date.now()}`,
        createdAt: new Date().toISOString(),
        ticketNumber,
        customer: { name, address, phone, comment },
        items: cart.map((it) => ({
          name: it.name,
          qty: it.qty,
          subtotal: it.subtotal,
          drink: it.drink,
          bagQty: it.bagQty,
        })),
        total: totalVal,
        status: 'Pendiente',
      };

      const nextOrders = [...orders, order];
      setOrders(nextOrders);
      if (!isFirestoreActive()) {
        persistOrdersLocal(nextOrders);
      }

      await persistOrderSingle(order).catch(() => {
        persistOrdersLocal(nextOrders);
      });

      window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsappTextFromOrder(order))}`,
        '_blank',
      );

      setCart([]);
      setCheckoutOpen(false);
      showToast('Pedido generado ✅ (abre WhatsApp)');
    },
    [cart, orders, persistOrderSingle, setOrders, showToast],
  );

  const startCheckout = useCallback(() => {
    if (!cart.length) {
      showToast('Tu carrito está vacío.');
      return;
    }
    setCartModalOpen(false);
    setCheckoutOpen(true);
  }, [cart.length, showToast]);

  useEffect(() => {
    function onKey(e) {
      if (e.key !== 'Escape') return;
      setMenuDdHidden(true);
      setModalDelivery(false);
      setModalReservas(false);
      setModalRetiros(false);
      setOptionsOpen(false);
      setCartModalOpen(false);
      setCheckoutOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    window.__POLLON__ = {
      money,
      orders: () => ordersRefMirror.current,
      setOrders: (arr) => {
        const next = Array.isArray(arr) ? [...arr] : [];
        ordersRefMirror.current = next;
        setOrdersState(next);
        saveOrdersBatch(next);
      },
      saveOrders: () => saveOrdersBatch(ordersRefMirror.current),
      loadOrders: () => {},
      buildWhatsappTextFromOrder,
      buildTicketText80mm,
      buildTicketHtml80mm,
      WHATSAPP_NUMBER,
    };
    return () => {
      delete window.__POLLON__;
    };
  }, []);

  const value = useMemo(
    () => ({
      PRODUCTS,
      CATEGORY_META,
      CATEGORY_ORDER,
      money,
      BAG_PRICE,

      orders,
      cart,
      setCart,

      currentCategory,
      setCategory,
      jumpToCategory,
      resetToHome,

      cartCount: cartCountFn,
      cartSum: cartSumFn,
      removeFromCart,

      menuDdHidden,
      setMenuDdHidden,
      closePanels,

      modalDelivery,
      setModalDelivery,
      modalReservas,
      setModalReservas,
      modalRetiros,
      setModalRetiros,
      optionsOpen,
      setOptionsOpen,
      checkoutOpen,
      setCheckoutOpen,
      cartModalOpen,
      closeCartModal,
      openCartModal,

      currentProduct,
      currentRealCategory,
      selectedDrink,
      setSelectedDrink,
      productQuantity,
      setProductQuantity,
      bagChoice,
      setBagChoice,

      liveOptions,

      scrollToMenu,
      showToast,
      wrapText,

      openOptionsForProduct,
      confirmAddToCart,

      checkoutSubmit,
      startCheckout,

      persistOrdersLocal,

      toggleHeroCarousel,
    }),
    [
      orders,
      cart,
      currentCategory,
      setCategory,
      jumpToCategory,
      resetToHome,
      cartCountFn,
      cartSumFn,
      removeFromCart,
      menuDdHidden,
      modalDelivery,
      modalReservas,
      modalRetiros,
      optionsOpen,
      checkoutOpen,
      cartModalOpen,
      closeCartModal,
      openCartModal,
      currentProduct,
      currentRealCategory,
      selectedDrink,
      productQuantity,
      bagChoice,
      liveOptions,
      scrollToMenu,
      showToast,
      openOptionsForProduct,
      confirmAddToCart,
      checkoutSubmit,
      startCheckout,
      closePanels,
      toggleHeroCarousel,
    ],
  );

  return <PollonCtx.Provider value={value}>{children}</PollonCtx.Provider>;
}

export function usePollon() {
  const v = useContext(PollonCtx);
  if (!v) throw new Error('usePollon fuera de PollonProvider');
  return v;
}
