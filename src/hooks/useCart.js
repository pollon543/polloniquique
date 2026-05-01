import { usePollon } from '../context/PollonContext.jsx';

/** Acceso cómodo al carrito desde componentes hijos */
export function useCart() {
  const p = usePollon();
  return {
    cart: p.cart,
    cartCount: p.cartCount(),
    cartSum: p.cartSum(),
    removeFromCart: p.removeFromCart,
    openCartModal: p.openCartModal,
  };
}
