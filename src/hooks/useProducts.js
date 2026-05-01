import { usePollon } from '../context/PollonContext.jsx';

export function useProducts() {
  const { PRODUCTS, CATEGORY_ORDER, CATEGORY_META } = usePollon();
  return { PRODUCTS, CATEGORY_ORDER, CATEGORY_META };
}
