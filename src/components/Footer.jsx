import { assetUrl } from '../utils/assetUrl.js';

export function Footer() {
  const openAdmin = () => window.__openAdminPollon__?.();

  return (
    <footer className="pollon-footer">
      <div className="pollon-footer__wrap">
        <div className="pollon-footer__col">
          <div className="pollon-footer__title">POLLERÍA EL POLLÓN</div>
          <a className="pollon-footer__link" href="#">Historia</a>
          <a className="pollon-footer__link" href="#">Misión</a>
          <a className="pollon-footer__link" href="#">Visión</a>
          <a className="pollon-footer__link" href="#">Blog</a>
          <a className="pollon-footer__link pollon-footer__link--accent" href="#">El Pollón Sostenible</a>
          <a className="pollon-footer__book" href="#" aria-label="Libro de reclamaciones">
            <img src={assetUrl('img/libro-reclamaciones.png')} alt="Libro de Reclamaciones" onError={(e) => { e.target.style.display = 'none'; }} />
          </a>
        </div>
        <div className="pollon-footer__col">
          <div className="pollon-footer__title">INFORMACIÓN</div>
          <a className="pollon-footer__link" href="#">Carta / Menú</a>
          <a className="pollon-footer__link" href="#">Alérgenos</a>
          <a className="pollon-footer__link" href="#">Promociones</a>
          <a className="pollon-footer__link" href="#">Preguntas frecuentes</a>
        </div>
        <div className="pollon-footer__col">
          <div className="pollon-footer__title">SERVICIOS</div>
          <a className="pollon-footer__link" href="#">Delivery</a>
          <a className="pollon-footer__link" href="#">Reservas</a>
          <a className="pollon-footer__link" href="#">Retiros</a>
          <a className="pollon-footer__link" href="#">Catering</a>
        </div>
        <div className="pollon-footer__col">
          <div className="pollon-footer__title">POLÍTICAS Y TÉRMINOS</div>
          <a className="pollon-footer__link" href="#">Términos y condiciones</a>
          <a className="pollon-footer__link" href="#">Política de privacidad</a>
          <a className="pollon-footer__link" href="#">Cambios y devoluciones</a>
          <a className="pollon-footer__link" href="#">Promociones comerciales</a>
        </div>
        <div className="pollon-footer__col">
          <div className="pollon-footer__title">MÉTODOS DE PAGO</div>
          <div className="pollon-footer__pay">
            <img src={assetUrl('img/pay-visa.png')} alt="Visa" onError={(e) => { e.target.style.display = 'none'; }} />
            <img src={assetUrl('img/pay-mastercard.png')} alt="Mastercard" onError={(e) => { e.target.style.display = 'none'; }} />
            <img src={assetUrl('img/pay-mercadopago.png')} alt="Mercado Pago" onError={(e) => { e.target.style.display = 'none'; }} />
          </div>
          <div className="pollon-footer__note">
            En delivery: <b>efectivo</b> (según zona).<br />
            En local: <b>efectivo y tarjeta</b>.
          </div>
        </div>
        <div className="pollon-footer__col">
          <div className="pollon-footer__title">CONTÁCTANOS</div>
          <a className="pollon-footer__link" href="mailto:contacto@elpollon.cl">Escríbenos</a>
          <a className="pollon-footer__link" href="#">Trabaja con nosotros</a>
          <a className="pollon-footer__link" href="#">Portal de Proveedores</a>
          <div className="pollon-footer__find">Encuentra un El Pollón:</div>
          <div className="pollon-footer__select">
            <span className="pollon-footer__pin">📍</span>
            <select aria-label="Sucursal">
              <option value="">SELECCIONAR</option>
              <option>Iquique - Vivar 1086</option>
            </select>
          </div>
          <div className="pollon-footer__social">
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="X">x</a>
            <a href="#" aria-label="Instagram">⌁</a>
            <a href="#" aria-label="TikTok">♪</a>
          </div>
        </div>
      </div>
      <div className="pollon-footer__bottom">
        <div className="pollon-footer__bottom-row">
          <div className="pollon-footer__copy">
            © <span id="year">{new Date().getFullYear()}</span> Pollería El Pollón. Todos los derechos reservados.
          </div>
          <button id="admin-open-btn" className="pollon-footer__admin-btn" type="button" title="Panel administrativo" onClick={openAdmin}>
            Admin
          </button>
        </div>
      </div>
    </footer>
  );
}
