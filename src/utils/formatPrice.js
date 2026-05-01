const CURRENCY = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
});

export function money(v) {
  return CURRENCY.format(v || 0);
}

export function moneyTicket(v) {
  return money(v).replace(/\s/g, '');
}
