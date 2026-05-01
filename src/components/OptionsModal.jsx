import { useMemo } from 'react';
import { usePollon } from '../context/PollonContext.jsx';

const DRINK_OPTIONS = [
  ['Coca Cola 1.5L', 'Coca cola'],
  ['Inca Kola 1.5L', 'Inca kola'],
  ['Coca Cero 1.5L', 'Coca cero'],
  ['Sprite 1.5L', 'Sprite'],
  ['Fanta 1.5L', 'Fanta'],
];

function bagNoteText(currentRealCategory) {
  if (currentRealCategory === 'ofertas-familiares') return 'Familiares: bolsa obligatoria y se cobra por unidad (según cantidad).';
  if (
    currentRealCategory === 'ofertas-dos'
    || currentRealCategory === 'ofertas-personales'
    || currentRealCategory === 'platos-extras'
  ) return 'En esta categoría: bolsa obligatoria (1 bolsa por cada 3 unidades).';
  if (currentRealCategory === 'agregados') return 'Agregados: bolsa opcional (si eliges bolsa, se agrega 1 por cada 3 unidades).';
  return 'Bolsa ecológica según reglas de la categoría.';
}

export function OptionsModal() {
  const {
    optionsOpen,
    setOptionsOpen,
    currentProduct,
    currentRealCategory,
    money,
    productQuantity,
    setProductQuantity,
    selectedDrink,
    setSelectedDrink,
    bagChoice,
    setBagChoice,
    liveOptions,
    confirmAddToCart,
  } = usePollon();

  const bagRequired = currentRealCategory === 'ofertas-familiares'
    || currentRealCategory === 'ofertas-dos'
    || currentRealCategory === 'ofertas-personales'
    || currentRealCategory === 'platos-extras';

  const hideBag = currentRealCategory === 'bebidas' || currentRealCategory === 'descartables';

  const bagChoices = useMemo(() => {
    if (bagRequired) return [{ value: 'add', label: 'Agregar bolsa' }];
    return [
      { value: 'add', label: 'Agregar bolsa (opcional)' },
      { value: 'none', label: 'No, gracias' },
    ];
  }, [bagRequired]);

  if (!currentProduct) return null;

  const closeOpts = () => setOptionsOpen(false);
  const drinkSectionVisible = currentRealCategory === 'ofertas-familiares';

  return (
    <div id="options-modal" className={`modal ${optionsOpen ? 'active' : ''}`} role="dialog" aria-modal="true" aria-label="Personaliza tu pedido">
      <div className="modal-card modal-card-lg options-card">
        <div className="modal-head options-head">
          <div id="opt-product-name" className="options-title">{currentProduct.name}</div>
          <button className="modal-x options-close" type="button" id="cancel-options" onClick={closeOpts}>✕</button>
        </div>

        <div className="modal-body options-body">
          <div id="opt-product-desc" className="options-desc">{currentProduct.desc}</div>

          <div className="options-row-top">
            <div className="options-price-box">
              <div className="options-label">Precio base</div>
              <div id="opt-product-price" className="options-price">{money(currentProduct.price)}</div>
            </div>

            <div className="options-qty-box">
              <div className="options-label options-label-right">Cantidad</div>
              <div className="qty-row">
                <button
                  id="qty-minus"
                  className="qty-btn"
                  type="button"
                  onClick={() => setProductQuantity((q) => Math.max(1, q - 1))}
                >
                  −
                </button>
                <div id="qty-value" className="qty-value">{productQuantity}</div>
                <button
                  id="qty-plus"
                  className="qty-btn"
                  type="button"
                  onClick={() => setProductQuantity((q) => Math.min(50, q + 1))}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="options-total-box">
            <button type="button" className="options-total-label" disabled>Total en vivo</button>
            <div id="live-total" className="options-total-value">{money(liveOptions.total)}</div>
          </div>

          <div id="drink-section" className={`opt-block ${drinkSectionVisible ? '' : 'hidden'}`}>
            <div className="opt-title text-center">Elija su sabor de Bebida</div>
            <div className="opt-grid">
              {DRINK_OPTIONS.map(([value, label]) => (
                <label key={value} className="opt-radio">
                  <input type="radio" name="drink" value={value} checked={selectedDrink === value} onChange={() => setSelectedDrink(value)} />
                  {' '}
                  {label}
                </label>
              ))}
            </div>
          </div>

          <div id="bag-section" className={`opt-block ${hideBag ? 'hidden' : ''}`}>
            <div className="opt-title">
              Bolsa ecológica
              <span className="options-bag-price">(Precio: $200)</span>
            </div>
            <div id="bag-options" className="opt-grid">
              {bagChoices.map((bc) => (
                <label key={bc.value} className="opt-radio">
                  <input
                    type="radio"
                    name="bag"
                    value={bc.value}
                    checked={bagChoice === bc.value}
                    onChange={() => setBagChoice(bc.value)}
                  />
                  {' '}
                  {bc.label}
                </label>
              ))}
            </div>
            <div id="bag-note" className="options-bag-note">{bagNoteText(currentRealCategory)}</div>
          </div>

          <div className="options-actions">
            <button className="btn-secondary" type="button" id="cancel-options-2" onClick={closeOpts}>Cancelar</button>
            <button className="btn-primary" type="button" id="confirm-add" onClick={confirmAddToCart}>Agregar a carrito</button>
          </div>
        </div>
      </div>
    </div>
  );
}
