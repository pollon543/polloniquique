import { useEffect, useRef } from 'react';
import { usePollon } from '../context/PollonContext.jsx';
import { enforceWrapLimit, wrapText } from '../utils/helpers.js';

export function CheckoutModal() {
  const {
    checkoutOpen,
    setCheckoutOpen,
    checkoutSubmit,
  } = usePollon();

  const nameRef = useRef(null);
  const addressRef = useRef(null);
  const commentRef = useRef(null);

  useEffect(() => {
    if (!checkoutOpen) return;
    if (nameRef.current) enforceWrapLimit(nameRef.current, 25);
    if (addressRef.current) enforceWrapLimit(addressRef.current, 25);
    if (commentRef.current) enforceWrapLimit(commentRef.current, 25);
  }, [checkoutOpen]);

  const close = () => setCheckoutOpen(false);

  const onSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const rawName = fd.get('cust-name') ?? '';
    const rawAddress = fd.get('cust-address') ?? '';
    const phone = String(fd.get('cust-phone') ?? '').trim();
    const rawComment = fd.get('cust-comment') ?? '';

    checkoutSubmit({
      name: wrapText(String(rawName), 25),
      address: wrapText(String(rawAddress), 25),
      phone,
      comment: wrapText(String(rawComment), 25),
    });
  };

  return (
    <div id="checkout-modal" className={`modal ${checkoutOpen ? 'active' : ''}`} role="dialog" aria-modal="true" aria-label="Datos del cliente">
      <div className="modal-card">
        <div className="modal-head">
          <div className="modal-title">✅ Datos para el pedido</div>
          <button className="modal-x" type="button" id="cancel-checkout" onClick={close}>✕</button>
        </div>

        <form id="checkout-form" className="modal-body space-y-3" onSubmit={onSubmit}>
          <div>
            <label className="form-label" htmlFor="cust-name">Nombre</label>
            <textarea id="cust-name" name="cust-name" ref={nameRef} className="form-input form-textarea" rows="2" placeholder="Ej: Juan Pérez" required />
            <div className="hint-25">Máx. 25 caracteres por línea (salto automático).</div>
          </div>

          <div>
            <label className="form-label" htmlFor="cust-address">Dirección</label>
            <textarea id="cust-address" name="cust-address" ref={addressRef} className="form-input form-textarea" rows="3" placeholder="Ej: Calle..., Número..., Depto..." required />
            <div className="hint-25">Máx. 25 caracteres por línea (salto automático).</div>
          </div>

          <div>
            <label className="form-label" htmlFor="cust-phone">Teléfono</label>
            <input id="cust-phone" name="cust-phone" className="form-input" type="tel" required placeholder="Ej: +56 9 ...." />
          </div>

          <div>
            <label className="form-label" htmlFor="cust-comment">Comentario</label>
            <textarea id="cust-comment" name="cust-comment" ref={commentRef} className="form-input form-textarea" rows="4" placeholder="Ej: Más ají, bien cocido, pura pierna..." />
            <div className="hint-25">Máx. 25 caracteres por línea (salto automático).</div>
          </div>

          <div className="modal-foot !px-0">
            <button type="button" className="btn-secondary" id="cancel-checkout-2" onClick={close}>Cancelar</button>
            <button type="submit" className="btn-primary">Enviar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
