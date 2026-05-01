import { usePollon } from '../context/PollonContext.jsx';

/** Pedidos y utilidades públicas desde el mismo origen que el panel legacy */
export function useAdmin() {
  const { orders, money } = usePollon();
  return { orders, money };
}
