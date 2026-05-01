import { usePollon } from '../context/PollonContext.jsx';

export function FloatingCart() {
  const { cartCount, cartSum, money, openCartModal } = usePollon();
  const n = cartCount();
  const t = cartSum();
  const empty = n === 0;

  return (
    <button
      id="floating-cart"
      className={`floating-cart ${empty ? 'is-empty' : ''}`}
      type="button"
      aria-label="Abrir carrito"
      onClick={openCartModal}
    >
      <span className="fc-icon">🛒</span>
      <span id="floating-cart-count" className="fc-count">{n}</span>
      <span className="fc-text">Carrito</span>
      <span id="floating-cart-total" className="fc-total">{money(t)}</span>
    </button>
  );
}
