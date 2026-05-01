import { useEffect, useState } from 'react';
import { assetUrl } from '../utils/assetUrl.js';

const HERO_IMAGES = [
  'img/porcion de fideo.png',
  'img/chuleta de cerdo.png',
  'img/lomo saltado de pollo con arroz blanco.png',
  'img/oferton sin ensalada.png',
  'img/chaufa brasa.png',
  'img/bistec a lo pobre.png',
  'img/oferton con fideo.png',
  'img/pechuga a la plancha.png',
  'img/tallarin saltado de carne.png',
  'img/oferton mas chaufa.png',
];

export function HeroBanner() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % HERO_IMAGES.length), 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="hero hero--full">
      <div className="hero-card hero-card--full">
        <div id="carousel-container" className="carousel-fade" aria-label="Carrusel de imágenes">
          {HERO_IMAGES.map((src, i) => (
            <img
              key={src}
              src={assetUrl(src)}
              alt=""
              className={i === index ? 'is-active' : ''}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ))}
        </div>
      </div>
      <div className="aviso">Realice su pedido ahora mismo</div>
    </section>
  );
}
