import { useCallback, useEffect, useRef } from 'react';
import { usePollon } from '../context/PollonContext.jsx';
import { assetUrl } from '../utils/assetUrl.js';

const CATS = [
  { id: 'todo-el-menu', img: 'img/oferton mas fideo.png', label: 'Todo el Menú' },
  { id: 'ofertas-familiares', img: 'img/oferton mas chaufa.png', label: 'Familiares' },
  { id: 'ofertas-dos', img: 'img/medio combo chaufa.png', label: 'Para Dos' },
  { id: 'ofertas-personales', img: 'img/personal con papa y fideo.png', label: 'Personales' },
  { id: 'platos-extras', img: 'img/lomo saltado de pollo con arroz blanco.png', label: 'Extras' },
  { id: 'agregados', img: 'img/porcion de papa.png', label: 'Agregados' },
  { id: 'bebidas', img: 'img/coca cola cero.png', label: 'Bebidas' },
  { id: 'descartables', img: 'img/aluza ct5.png', label: 'Descartables' },
];

export function CategoryMenu() {
  const { setCategory, scrollToMenu } = usePollon();
  const trackRef = useRef(null);
  const thumbRef = useRef(null);
  const barRef = useRef(null);

  const updateThumb = useCallback(() => {
    const track = trackRef.current;
    const scrollBar = barRef.current;
    const scrollThumb = thumbRef.current;
    if (!track || !scrollBar || !scrollThumb) return;

    const maxScroll = track.scrollWidth - track.clientWidth;
    if (maxScroll <= 1) {
      scrollBar.style.display = 'none';
      return;
    }
    scrollBar.style.display = '';

    const barW = scrollBar.clientWidth || 1;
    const ratio = track.clientWidth / track.scrollWidth;
    const thumbW = Math.max(55, Math.floor(barW * ratio));
    const maxLeft = Math.max(0, barW - thumbW);
    const left = maxLeft * (track.scrollLeft / maxScroll);

    scrollThumb.style.width = `${thumbW}px`;
    scrollThumb.style.transform = `translateX(${left}px)`;
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    const onScroll = () => requestAnimationFrame(updateThumb);
    track.addEventListener('scroll', onScroll);
    window.addEventListener('resize', updateThumb);
    updateThumb();
    return () => {
      track.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateThumb);
    };
  }, [updateThumb]);

  const onPick = (cat) => {
    setCategory(cat);
    scrollToMenu();
  };

  return (
    <section className="cat-slider" id="cat-slider" aria-label="Categorías del menú">
      <div className="cat-slider__wrap">
        <div className="cat-track" id="cat-track" ref={trackRef}>
          {CATS.map((c) => (
            <article key={c.id} className="cat-card">
              <button className="cat-card__img category-btn" type="button" data-cat={c.id} onClick={() => onPick(c.id)}>
                <img src={assetUrl(c.img)} alt={c.label} loading="lazy" onError={(e) => { e.target.style.display = 'none'; }} />
              </button>
              <button className="cat-card__btn category-btn" type="button" data-cat={c.id} onClick={() => onPick(c.id)}>
                {c.label}
              </button>
            </article>
          ))}
        </div>
      </div>
      <div className="cat-scrollbar" id="cat-scrollbar" aria-hidden="true" ref={barRef}>
        <div className="cat-scrollbar__thumb" id="cat-scrollbar-thumb" ref={thumbRef} />
      </div>
    </section>
  );
}
