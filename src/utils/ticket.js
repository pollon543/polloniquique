import { moneyTicket } from './formatPrice.js';
import { wrapText } from './helpers.js';

export function formatDateTicket(iso) {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return { date: `${dd}-${mm}-${yyyy}`, time: `${hh}:${min}` };
}

export function buildTicketText80mm(order) {
  const W = 42;
  const sep = '='.repeat(W);
  const sep2 = '-'.repeat(W);
  const { date, time } = formatDateTicket(order.createdAt);
  const pedido = pad3ticket(order.ticketNumber || '001');

  const cliente = wrapText(order.customer?.name || '', 25).split('\n');
  const direccion = wrapText(order.customer?.address || '', 25).split('\n');
  const comentario = wrapText(order.customer?.comment || '', 25).split('\n').filter(Boolean);
  const fono = (order.customer?.phone || '').trim();

  let t = '';
  t += 'POLLERÍA EL POLLÓN   - DELIVERY\n';
  t += `Pedido : ${pedido}     ${date}  ${time}\n`;
  t += `${sep}\n\n`;

  t += `Cliente\n   : ${cliente[0] || ''}\n`;
  for (let i = 1; i < cliente.length; i++) t += `           ${cliente[i]}\n`;

  t += `Fono      : ${fono}\n`;

  t += `Dirección : ${direccion[0] || ''}\n`;
  for (let i = 1; i < direccion.length; i++) t += `           ${direccion[i]}\n`;

  if (comentario.length) {
    t += `\nComentario: ${comentario[0] || ''}\n`;
    for (let i = 1; i < comentario.length; i++) t += `           ${comentario[i]}\n`;
  }

  t += `\n${sep}\n`;

  order.items.forEach((it, idx) => {
    const n = idx + 1;
    const nameLines = wrapText(it.name || '', 30).split('\n');
    const qtyTxt = `x${it.qty || 1}`;
    const left = `${n}) ${nameLines[0] || ''}`;
    const spaces = Math.max(1, W - left.length - qtyTxt.length);
    t += `${left}${' '.repeat(spaces)}${qtyTxt}\n`;

    for (let i = 1; i < nameLines.length; i++) {
      t += `   ${nameLines[i]}\n`;
    }

    if (it.drink) {
      t += `   Bebida   : ${it.drink}\n`;
    }

    if (it.bagQty && it.bagQty > 0) {
      t += `   Bolsa    : x${it.bagQty}\n`;
    }

    const sub = moneyTicket(it.subtotal || 0);
    t += `   Subtotal: ${sub}\n`;
    t += `${sep2}\n`;
  });

  t += `\n${sep}\n`;
  t += `TOTAL A PAGAR  : ${moneyTicket(order.total || 0)}\n`;
  t += `${sep}\n\n`;

  t += '♦ Delivery tiene costo adicional\n';
  t += '♦ Según la distancia $2.500 a $4.000\n';

  return t;
}

function pad3ticket(n) {
  const s = String(n);
  return s.length >= 3 ? s : (`000${s}`).slice(-3);
}

export function buildTicketHtml80mm(order) {
  const raw = buildTicketText80mm(order);
  const esc = raw.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  return esc
    .replace('POLLERÍA EL POLLÓN', '<b>POLLERÍA EL POLLÓN</b>')
    .replace('TOTAL A PAGAR', '<b>TOTAL A PAGAR</b>');
}

export function buildWhatsappTextFromOrder(order) {
  return buildTicketText80mm(order);
}
