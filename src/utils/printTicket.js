import { buildTicketHtml80mm } from './ticket.js';

/** Misma lógica que admin.js printTicket80mm */
export function printTicket80mm(order) {
  const ticketHtml = buildTicketHtml80mm(order);
  if (!ticketHtml) return;

  const w = window.open('', '_blank');
  w.document.write(`
    <html>
      <head>
        <meta charset="utf-8"/>
        <title>Ticket ${order.ticketNumber}</title>
        <style>
          @page { size: 80mm auto; margin: 6mm; }
          body{ margin:0; padding:0; }
          .paper{
            width: 80mm;
            font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
            font-size: 12px;
            line-height: 1.25;
            white-space: pre-wrap;
          }
          b{ font-weight: 900; }
        </style>
      </head>
      <body>
        <pre class="paper">${ticketHtml}</pre>
        <script>window.print();</script>
      </body>
    </html>
  `);
  w.document.close();
}

export function exportFilteredOrdersPdf(filteredOrders, moneyFn) {
  const rowsHtml = filteredOrders
    .map((o) => {
      const fecha = new Date(o.createdAt).toLocaleString('es-CL');
      const name = (o.customer?.name || '').replaceAll('\n', '<br/>');
      const phone = o.customer?.phone || '';
      const total = moneyFn(o.total || 0);
      const st = o.status || 'Pendiente';
      return `
      <tr>
        <td>${fecha}</td>
        <td><b>${o.ticketNumber || ''}</b></td>
        <td>${name}</td>
        <td>${phone}</td>
        <td><b>${total}</b></td>
        <td><b>${st}</b></td>
      </tr>
    `;
    })
    .join('');

  const w = window.open('', '_blank');
  w.document.write(`
    <html>
      <head>
        <meta charset="utf-8"/>
        <title>Pedidos (PDF)</title>
        <style>
          body{ font-family: Arial, sans-serif; padding:20px; }
          h1{ margin:0 0 10px; }
          table{ width:100%; border-collapse: collapse; }
          th, td{ border:1px solid #ddd; padding:8px; text-align:left; vertical-align:top; }
          th{ background:#111; color:#fff; }
        </style>
      </head>
      <body>
        <h1>Pedidos filtrados</h1>
        <p>Generado: ${new Date().toLocaleString('es-CL')}</p>
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Ticket</th>
              <th>Cliente</th>
              <th>Teléfono</th>
              <th>Total</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>${rowsHtml || `<tr><td colspan="6"><b>No hay pedidos con esos filtros.</b></td></tr>`}</tbody>
        </table>
        <script>window.print();</script>
      </body>
    </html>
  `);
  w.document.close();
}
