import { usePollon } from '../context/PollonContext.jsx';

const BAG_PRICE = 200;

export function CartModal() {
  const {
    cartModalOpen,
    closeCartModal,
    cart,
    cartSum,
    removeFromCart,
    startCheckout,
    money,
  } = usePollon();

  return (
    <div id="cart-modal" className={`modal ${cartModalOpen ? 'active' : ''}`} role="dialog" aria-modal="true" aria-label="Carrito">
      <div className="modal-card modal-card-lg">
        <div className="modal-head">
          <div className="modal-title">🧺 Mi Pedido</div>
          <button className="modal-x" type="button" id="close-cart" onClick={closeCartModal}>✕</button>
        </div>
        <div className="modal-body">
          <div id="cart-items" className="space-y-3">
            {cart.length === 0 ? (
              <div className="p-4 rounded-2xl bg-gray-50 border text-gray-700 font-bold">Tu carrito está vacío.</div>
            ) : (
              cart.map((it, idx) => (
                <div key={`${it.name}-${idx}`} className="p-3 rounded-2xl bg-white border flex flex-col md:flex-row md:items-center md:justify-between gap-2 cart-line-pro">
                  <div>
                    <div className="font-extrabold">
                      {it.name}
                      {' '}
                      <span className="text-gray-500 font-bold">{` x${it.qty}`}</span>
                    </div>
                    {it.drink ? <div className="text-sm text-gray-600">{`🥤 ${it.drink}`}</div> : null}
                    {it.bagQty ? (
                      <div className="text-sm text-gray-600">
                        🛍️ Bolsa:
                        {' '}
                        {it.bagQty}
                        {' '}
                        x
                        {' '}
                        {money(BAG_PRICE)}
                      </div>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-2 justify-between md:justify-end">
                    <div className="font-extrabold text-red-700">{money(it.total)}</div>
                    <button className="btn-secondary" type="button" data-action="remove" data-index={idx} onClick={() => removeFromCart(idx)}>
                      Eliminar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="mt-4 flex items-center justify-between p-3 rounded-xl bg-gray-50 border">
            <div className="font-bold">Total</div>
            <div id="cart-total" className="font-extrabold text-red-700 text-xl">{money(cartSum())}</div>
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn-secondary" type="button" id="close-cart-2" onClick={closeCartModal}>Seguir comprando</button>
          <button className="btn-primary" type="button" id="checkout-btn" onClick={startCheckout}>Realizar pedido por WhatsApp</button>
        </div>
      </div>
    </div>
  );
}
