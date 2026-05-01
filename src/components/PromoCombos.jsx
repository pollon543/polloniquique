import { usePollon } from '../context/PollonContext.jsx';
import { assetUrl } from '../utils/assetUrl.js';

const BLOCKS = [
  {
    id: 'ofertas-familiares',
    img: 'img/oferton mas chaufa.png',
    alt: 'Ofertón más chaufa',
    sticker: 'PIDE TU POLLITO / CON BEBIDA',
    title: 'Ofertas Familiares',
    body: 'La opción familiar perfecta para compartir en casa o con amigos. Incluye pollito + bebida y nuestro delicioso arroz chaufa, fideos al pesto, todo listo para disfrutar en segundos.',
    cta: 'Pídelo ya',
    stars: true,
  },
  {
    id: 'platos-extras',
    img: 'img/lomo saltado de pollo con arroz blanco.png',
    alt: 'Lomo saltado de pollo con arroz blanco',
    stickerAlt: true,
    sticker: 'DISFRÚTALO DE DIFERENTES MANERAS',
    title: 'Platos extras',
    body: 'Descubre nuestros deliciosos platos adicionales: desde lomo saltado hasta tallarines salteados y bistec. ¡Un mundo de sabores para probar!',
    cta: 'Explora más platos',
    stars: true,
  },
  {
    id: 'ofertas-dos',
    img: 'img/medio combo chaufa.png',
    alt: 'Medio combo chaufa',
    stickerAlt: true,
    sticker: 'DISFRÚTALO CON TU AMISTAD',
    title: 'Ofertas para dos',
    body: 'Comparte el mejor sabor con alguien especial. Combos diseñados especialmente para dos personas: pollito crocante, guarniciones y acompañamientos que alegran tu día.',
    cta: 'Ver ofertas para dos',
    heart: true,
  },
  {
    id: 'ofertas-personales',
    img: 'img/chaufa brasa con papas fritas.png',
    alt: 'Chaufa brasa con papas fritas',
    stickerAlt: true,
    sticker: 'DISFRUTA EL SABOR ',
    title: 'Ofertas Personales',
    body: 'Si quieres un plato especialmente para ti, estas opciones te encantarán. Porciones individuales con el auténtico sabor de El Pollón.',
    cta: 'Ver personales',
    heart: true,
  },
  {
    id: 'agregados',
    img: 'img/porcion de fideo.png',
    alt: 'Porción de fideo',
    stickerAlt: true,
    sticker: 'DISFRUTA EL SABOR ',
    title: 'Agregados',
    body: 'Dale un extra a tu pedido con guarniciones y complementos irresistibles. Desde papitas, arroz, fideo, ensaladas y más.',
    cta: 'Ver agregados',
    heart: true,
  },
  {
    id: 'bebidas',
    img: 'img/coca cola.png',
    alt: 'Coca Cola',
    stickerAlt: true,
    sticker: 'DISFRUTA EL SABOR ',
    title: 'Bebidas',
    body: 'Refresca tu comida con nuestras bebidas disponibles. Combínalas con tu pedido para una experiencia completa. ',
    cta: 'Ver bebidas',
    heart: true,
  },
];

export function PromoCombos() {
  const { jumpToCategory } = usePollon();

  return (
    <section className="pollon-combos mt-10" id="ofertas-familiares">
      {BLOCKS.map((b) => (
        <div key={b.id} className="combo-card">
          <div className="combo-media">
            <img src={assetUrl(b.img)} alt={b.alt} onError={(e) => { e.target.style.display = 'none'; }} />
          </div>
          <div className="combo-body">
            <div className={b.stickerAlt ? 'combo-sticker alt' : 'combo-sticker'}>{b.sticker}</div>
            <div className="combo-title">{b.title}</div>
            <div className="combo-text">{b.body}</div>
            <div className="combo-cta">
              <button className="combo-btn" type="button" data-scrollcat={b.id} onClick={() => jumpToCategory(b.id)}>{b.cta}</button>
              {b.stars ? (
                <div className="combo-stars" aria-hidden="true">
                  <span className="star s1">★</span>
                  <span className="star s2">★</span>
                  <span className="star s3">★</span>
                </div>
              ) : null}
              {b.heart ? <span className="combo-heart" aria-hidden="true">❤</span> : null}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
