import { usePollon } from '../context/PollonContext.jsx';
import { WHATSAPP_NUMBER } from '../constants/whatsapp.js';

export function ModalsInfo() {
  const {
    modalDelivery,
    setModalDelivery,
    modalReservas,
    setModalReservas,
    modalRetiros,
    setModalRetiros,
  } = usePollon();

  return (
    <>
      <div id="modal-delivery" className={`modal ${modalDelivery ? 'active' : ''}`} role="dialog" aria-modal="true" aria-label="Modal Delivery">
        <div className="modal-card">
          <div className="modal-head">
            <div className="modal-title">🚚 Delivery</div>
            <button className="modal-x" type="button" data-close="#modal-delivery" onClick={() => setModalDelivery(false)}>✕</button>
          </div>
          <div className="modal-body">
            <ol className="list-decimal pl-5 space-y-2 text-gray-700">
              <li>Elige tus productos del menú.</li>
              <li>Presiona <b>Agregar</b> y personaliza tu pedido.</li>
              <li>Abre el carrito (botón flotante o “Ver mi pedido”).</li>
              <li>Presiona <b>Realizar pedido por WhatsApp</b>.</li>
              <li>Completa tus datos y envía el ticket.</li>
            </ol>
            <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
              Costo de delivery aproximado: <b>$2.500 – $4.000</b> (según zona).
            </div>
          </div>
          <div className="modal-foot">
            <button className="btn-secondary" type="button" onClick={() => setModalDelivery(false)}>Cerrar</button>
          </div>
        </div>
      </div>

      <div id="modal-reservas" className={`modal ${modalReservas ? 'active' : ''}`} role="dialog" aria-modal="true" aria-label="Modal Reservas">
        <div className="modal-card">
          <div className="modal-head">
            <div className="modal-title">📅 Reservas</div>
            <button className="modal-x" type="button" onClick={() => setModalReservas(false)}>✕</button>
          </div>
          <div className="modal-body text-gray-700 space-y-2">
            <div>• Consumo mínimo: <b>$200.000</b></div>
            <div>• Sujeto a disponibilidad</div>
            <div>• Confirmación con el equipo</div>
          </div>
          <div className="modal-foot">
            <button className="btn-secondary" type="button" onClick={() => setModalReservas(false)}>Cancelar</button>
            <button
              id="modal-reserva-go"
              className="btn-primary"
              type="button"
              onClick={() => {
                window.open('https://pollon543.github.io/reservas-online/', '_blank');
              }}
            >
              Realizar mi reserva
            </button>
          </div>
        </div>
      </div>

      <div id="modal-retiros" className={`modal ${modalRetiros ? 'active' : ''}`} role="dialog" aria-modal="true" aria-label="Modal Retiros">
        <div className="modal-card">
          <div className="modal-head">
            <div className="modal-title">🧾 Retiros</div>
            <button className="modal-x" type="button" onClick={() => setModalRetiros(false)}>✕</button>
          </div>
          <div className="modal-body text-gray-700 space-y-2">
            <div>• Mínimo: <b>$100.000</b></div>
            <div>• Coordinar con <b>2 horas</b> de anticipación</div>
            <div>• Confirmación por WhatsApp</div>
          </div>
          <div className="modal-foot">
            <button className="btn-secondary" type="button" onClick={() => setModalRetiros(false)}>Cancelar</button>
            <button
              id="modal-retiro-go"
              className="btn-primary"
              type="button"
              onClick={() => {
                const msg = encodeURIComponent('Hola, deseo coordinar un retiro. Mi pedido será para retiro (mínimo $100.000), gracias.');
                window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
              }}
            >
              Solicitar con retiro
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
