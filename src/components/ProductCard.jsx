import { useState } from 'react';
import { usePollon } from '../context/PollonContext.jsx';
import { money } from '../utils/formatPrice.js';
import { assetUrl } from '../utils/assetUrl.js';

const HEART_SVG = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

function burstHearts(btn) {
  if (!btn) return;
  btn.querySelectorAll('.pheart-burst').forEach((n) => n.remove());

  const wrap = document.createElement('div');
  wrap.className = 'pheart-burst';
  btn.appendChild(wrap);

  const COUNT = 11;
  const RADIUS = 26;
  const STEP_DELAY = 40;

  for (let i = 0; i < COUNT; i++) {
    const s = document.createElement('span');
    s.className = 'pheart-float';
    s.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';

    const angle = (Math.PI * 2) * (i / COUNT);
    const dx = Math.cos(angle) * RADIUS;
    const dy = Math.sin(angle) * RADIUS;

    s.style.setProperty('--dx', `${dx}px`);
    s.style.setProperty('--dy', `${dy}px`);
    s.style.animationDelay = `${i * STEP_DELAY}ms`;

    s.addEventListener('animationend', () => s.remove());
    wrap.appendChild(s);
  }

  setTimeout(() => wrap.remove(), 1600);
}

export function ProductCard({ product, category }) {
  const { openOptionsForProduct } = usePollon();
  const [imgOk, setImgOk] = useState(true);

  const onHeart = (e) => {
    e.stopPropagation();
    e.currentTarget.classList.toggle('is-on');
    burstHearts(e.currentTarget);
  };

  return (
    <div className="pcard">
      <div className="pimg">
        {imgOk ? (
          <img
            src={assetUrl(product.img || '')}
            alt={product.name}
            onLoad={() => setImgOk(true)}
            onError={() => setImgOk(false)}
          />
        ) : null}
        <div className="pimg-fallback" style={{ display: imgOk ? 'none' : 'flex' }} aria-hidden="true">🍗</div>
      </div>
      <div className="pbody">
        <div className="ptitle">{product.name}</div>
        <div className="pdesc">{product.desc || ''}</div>
        <div className="prow">
          <div className="pprice">{money(product.price)}</div>
          <button
            type="button"
            className="pheart"
            aria-label="Agregar a favoritos"
            data-action="heart"
            data-heart-id={`${category}__${product.name}`}
            onClick={onHeart}
          >
            <span className="pheart-icon">{HEART_SVG}</span>
          </button>
          <button type="button" className="padd" onClick={() => openOptionsForProduct(product, category)}>
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}
