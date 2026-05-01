import { usePollon } from '../context/PollonContext.jsx';
import { ProductCard } from './ProductCard.jsx';

export function ProductGrid() {
  const { PRODUCTS, CATEGORY_ORDER, CATEGORY_META, currentCategory } = usePollon();

  if (currentCategory === 'todo-el-menu') {
    return (
      <div id="products-container" className="products-grid mt-4">
        {CATEGORY_ORDER.flatMap((cat) => [
          <div key={`h-${cat}`} className="cat-header" id={cat}>
            <h3>{CATEGORY_META[cat] || cat}</h3>
            <div className="cat-line" />
          </div>,
          ...(PRODUCTS[cat] || []).map((p) => (
            <ProductCard key={`${cat}-${p.name}`} product={p} category={cat} />
          )),
        ])}
      </div>
    );
  }

  const list = PRODUCTS[currentCategory] || [];

  return (
    <div id="products-container" className="products-grid mt-4">
      {list.map((p) => (
        <ProductCard key={`${currentCategory}-${p.name}`} product={p} category={currentCategory} />
      ))}
    </div>
  );
}
