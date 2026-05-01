import { useEffect, useRef } from 'react';
import { usePollon } from '../context/PollonContext.jsx';
import { assetUrl } from '../utils/assetUrl.js';

export function Header() {
  const {
    setCategory,
    scrollToMenu,
    resetToHome,
    menuDdHidden,
    setMenuDdHidden,
    cartCount,
    openCartModal,
    setModalDelivery,
    setModalReservas,
    setModalRetiros,
  } = usePollon();

  const menuBtnRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (menuDdHidden) return;
      const t = e.target;
      if (panelRef.current?.contains(t) || menuBtnRef.current?.contains(t)) return;
      setMenuDdHidden(true);
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [menuDdHidden, setMenuDdHidden]);

  const onLogo = (e) => {
    e.preventDefault();
    resetToHome();
  };

  const onMenuItem = (cat) => {
    setMenuDdHidden(true);
    if (cat === 'todo-el-menu') {
      setCategory('todo-el-menu');
      scrollToMenu();
      return;
    }
    setCategory(cat);
    scrollToMenu();
  };

  return (
    <header className="sticky top-0 z-50 shadow-lg header-gradient">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 py-3">
        <div className="header-grid">
          <div className="header-left">
            <a href="#" className="flex items-center" onClick={onLogo}>
              <div className="logo">
                <img src={assetUrl('img/logo pollon.png')} alt="Logo Pollería El Pollón" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
            </a>
            <a href="#" className="brand hidden md:block leading-tight hover:opacity-90 transition" onClick={onLogo}>
              <div className="text-white font-extrabold text-lg">Pollería El Pollón</div>
              <div className="text-white/90 text-sm"> Iquique</div>
            </a>
          </div>

          <div className="header-center">
            <div className="header-question">¿Cómo desea hacer su pedido?</div>
            <div className="header-actions">
              <button id="btn-delivery" className="pedido-link" type="button" onClick={() => setModalDelivery(true)}>DELIVERY</button>
              <button id="btn-reservas" className="pedido-link" type="button" onClick={() => setModalReservas(true)}>RESERVAS</button>
              <button id="btn-retiros" className="pedido-link" type="button" onClick={() => setModalRetiros(true)}>RETIROS</button>
            </div>
          </div>

          <div className="header-right">
            <div className="relative">
              <button
                id="menu-dd-btn"
                ref={menuBtnRef}
                className="menu-dd-btn menu-dd-btn--stack"
                type="button"
                aria-haspopup="true"
                aria-expanded={!menuDdHidden}
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuDdHidden(!menuDdHidden);
                }}
              >
                <span className="menu-dd-top">MENÚ</span>
                <span className="menu-dd-bottom">
                  <span className="menu-dd-burger">☰</span>
                  <span className="menu-dd-caret">▾</span>
                </span>
              </button>

              <div id="menu-dd-panel" ref={panelRef} className={`menu-dd-panel ${menuDdHidden ? 'hidden' : ''}`} role="menu" aria-label="Menú categorías">
                <button
                  id="menu-dd-view-cart"
                  className="menu-dd-cart lg:hidden"
                  type="button"
                  onClick={() => {
                    setMenuDdHidden(true);
                    openCartModal();
                  }}
                >
                  Ver Mi Pedido
                  <span id="menu-dd-cart-badge" className="badge">{cartCount()}</span>
                </button>
                <div className="my-2 h-px bg-gray-200 lg:hidden" />
                {[
                  ['todo-el-menu', 'Todo el Menú'],
                  ['ofertas-familiares', 'Ofertas Familiares'],
                  ['ofertas-dos', 'Ofertas para Dos'],
                  ['ofertas-personales', 'Ofertas Personales'],
                  ['platos-extras', 'Platos Extras'],
                  ['agregados', 'Agregados'],
                  ['bebidas', 'Bebidas'],
                  ['descartables', 'Descartables'],
                ].map(([id, label]) => (
                  <button key={id} className="menu-dd-item" type="button" data-scrollcat={id} onClick={() => onMenuItem(id)}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-3 flex-shrink-0 whitespace-nowrap">
              <a
                href="tel:+56986925310"
                className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 ring-1 ring-white/15 hover:bg-white/15 transition whitespace-nowrap"
              >
                <span className="text-white/90 text-sm font-semibold">Llámanos</span>
                <span className="text-white text-sm font-extrabold tracking-wide whitespace-nowrap">+56 9 8692 5310</span>
              </a>
              <button
                id="view-cart-desktop"
                type="button"
                className="flex items-center gap-2 rounded-xl bg-yellow-400 px-4 py-2 font-extrabold text-black hover:bg-yellow-300 transition"
                onClick={openCartModal}
              >
                <span className="whitespace-nowrap">Ver Mi Pedido</span>
                <span id="cart-badge-desktop" className="ml-1 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-red-600 px-2 text-sm font-black text-white">
                  {cartCount()}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
