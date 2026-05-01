import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePollon } from '../context/PollonContext.jsx';
import { WHATSAPP_NUMBER } from '../constants/whatsapp.js';
import { buildWhatsappTextFromOrder } from '../utils/ticket.js';
import { exportFilteredOrdersPdf, printTicket80mm } from '../utils/printTicket.js';

const ADMIN_PASSWORD = '1234';

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function parseDateOnly(isoString) {
  try {
    const d = new Date(isoString);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  } catch {
    return '';
  }
}

function cycleStatus(cur) {
  const order = ['Pendiente', 'En preparación', 'En camino', 'Entregado', 'Cancelado'];
  const i = order.indexOf(cur);
  return order[(i + 1 + order.length) % order.length];
}

function statusBadgeClass(st) {
  const s = (st || 'Pendiente').toLowerCase();
  if (s.includes('pend')) return 'pendiente';
  if (s.includes('prep')) return 'prep';
  if (s.includes('camino')) return 'camino';
  if (s.includes('entreg')) return 'entregado';
  if (s.includes('cancel')) return 'cancelado';
  return 'pendiente';
}

export function AdminSuite() {
  const { orders: ordersList, money } = usePollon();
  const [loginOpen, setLoginOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [pwd, setPwd] = useState('');
  const [loginErr, setLoginErr] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);

  const [fltFrom, setFltFrom] = useState('');
  const [fltTo, setFltTo] = useState('');
  const [fltStatus, setFltStatus] = useState('');
  const [fltQ, setFltQ] = useState('');

  const audioRef = useRef(null);
  const soundEnabledRef = useRef(false);

  const openLogin = useCallback(() => {
    setPwd('');
    setLoginErr('');
    setLoginOpen(true);
  }, []);

  useEffect(() => {
    window.isAdminOpen = () => panelOpen;
    window.renderAdmin = () => {};
    return () => {
      delete window.isAdminOpen;
      delete window.renderAdmin;
    };
  }, [panelOpen]);

  const filtered = useMemo(() => ordersList.filter((o) => {
    const day = parseDateOnly(o.createdAt);
    if (fltFrom && day < fltFrom) return false;
    if (fltTo && day > fltTo) return false;
    if (fltStatus && (o.status || '') !== fltStatus) return false;
    const q = (fltQ || '').trim().toLowerCase();
    if (q) {
      const name = (o.customer?.name || '').toLowerCase();
      const phone = (o.customer?.phone || '').toLowerCase();
      if (!name.includes(q) && !phone.includes(q)) return false;
    }
    return true;
  }).sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')), [ordersList, fltFrom, fltTo, fltStatus, fltQ]);

  const stats = useMemo(() => {
    const all = ordersList;
    const today = todayISO();
    const todayOrders = all.filter((o) => parseDateOnly(o.createdAt) === today);
    const todaySales = todayOrders.reduce((acc, o) => acc + (o.total || 0), 0);
    const pending = all.filter((o) => (o.status || '') !== 'Entregado' && (o.status || '') !== 'Cancelado').length;
    const delivered = all.filter((o) => (o.status || '') === 'Entregado').length;
    const rate = all.length ? Math.round((delivered / all.length) * 100) : 0;
    const avg = all.length ? Math.round(all.reduce((acc, o) => acc + (o.total || 0), 0) / all.length) : 0;
    return {
      total: all.length,
      todayCt: todayOrders.length,
      todaySales,
      pending,
      rate: `${rate}%`,
      avg: money(avg),
      eta: '35–50 min',
    };
  }, [ordersList, money]);

  const copyOrders = useCallback(async () => {
    const rows = filtered.map((o) => ([
      o.createdAt,
      o.ticketNumber,
      o.customer?.name || '',
      o.customer?.phone || '',
      o.customer?.address || '',
      o.customer?.comment || '',
      o.total || 0,
      o.status || '',
    ]));
    const header = ['createdAt', 'ticket', 'name', 'phone', 'address', 'comment', 'total', 'status'];
    const csv = [header, ...rows].map((r) => r.map((v) => `"${String(v).replaceAll('"', '""')}"`).join('\t')).join('\n');
    try {
      await navigator.clipboard.writeText(csv);
      alert('Copiado ✅ (pega en Excel/Sheets)');
    } catch {
      alert('No se pudo copiar. Tu navegador bloqueó el portapapeles.');
    }
  }, [filtered]);

  const pdfExport = useCallback(() => {
    exportFilteredOrdersPdf(filtered, money);
  }, [filtered, money]);

  const patchOrderStatus = (id) => {
    const pollon = window.__POLLON__;
    if (!pollon) return;
    const arr = [...pollon.orders()];
    const idx = arr.findIndex((x) => x.id === id);
    if (idx < 0) return;
    arr[idx].status = cycleStatus(arr[idx].status || 'Pendiente');
    pollon.setOrders(arr);
  };

  const enableSound = useCallback(async () => {
    const audio = audioRef.current;
    const btn = document.getElementById('enable-sound-btn');
    if (!audio) return;
    try {
      audio.currentTime = 0;
      await audio.play();
      audio.pause();
      audio.currentTime = 0;
      soundEnabledRef.current = true;
      if (btn) btn.textContent = '🔔 Sonido activado';
    } catch {
      alert('El navegador bloqueó el sonido. Haz clic otra vez y revisa volumen.');
    }
  }, []);

  const openFiltersMenu = () => {
    setFiltersVisible((v) => !v);
  };

  useEffect(() => {
    if (!panelOpen) return undefined;
    const onEsc = (e) => {
      if (e.key !== 'Escape') return;
      setLoginOpen(false);
      setPanelOpen(false);
      setDrawerOpen(false);
    };
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [panelOpen]);

  useEffect(() => {
    window.onNewOrderArrived = function playNewOrderSound() {
      if (!soundEnabledRef.current) return;
      if (typeof window.isAdminOpen === 'function' && !window.isAdminOpen()) return;
      const audio = audioRef.current;
      if (!audio) return;
      audio.currentTime = 0;
      audio.play().catch(() => {});
    };
    return () => {
      window.onNewOrderArrived = () => {};
    };
  }, []);

  return (
    <>
      <audio id="new-order-sound" ref={audioRef} preload="auto">
        <source src={`${import.meta.env.BASE_URL}sounds/alarma.mp3`} type="audio/mpeg" />
      </audio>

      <div id="admin-login-modal" className={`modal ${loginOpen ? 'active' : ''}`} role="dialog" aria-modal="true" aria-label="Login Admin">
        <div className="modal-card">
          <div className="modal-head">
            <div className="modal-title">🔐 Login Admin</div>
            <button className="modal-x" type="button" onClick={() => setLoginOpen(false)}>✕</button>
          </div>
          <div className="modal-body space-y-3">
            <div>
              <label className="form-label" htmlFor="admin-password">Contraseña</label>
              <input
                id="admin-password"
                className="form-input"
                type="password"
                placeholder="••••••••"
                value={pwd}
                onChange={(e) => { setPwd(e.target.value); setLoginErr(''); }}
              />
              <div id="admin-login-error" className={`text-sm text-red-600 mt-2 ${loginErr ? '' : 'hidden'}`}>{loginErr}</div>
            </div>
          </div>
          <div className="modal-foot">
            <button className="btn-secondary" type="button" onClick={() => setLoginOpen(false)}>Cancelar</button>
            <button
              id="admin-login-btn"
              className="btn-primary"
              type="button"
              onClick={() => {
                if (pwd.trim() !== ADMIN_PASSWORD) {
                  setLoginErr('Contraseña incorrecta.');
                  return;
                }
                setLoginOpen(false);
                setPwd('');
                setDrawerOpen(false);
                setPanelOpen(true);
                setFiltersVisible(true);
              }}
            >
              Ingresar
            </button>
          </div>
        </div>
      </div>

      <div id="admin-panel-modal" className={`modal ${panelOpen ? 'active' : ''}`} role="dialog" aria-modal="true" aria-label="Panel Admin">
        <div className={`adminp-card ${filtersVisible ? 'adminp-filters-visible' : ''}`}>
          <div className="adminp-head">
            <button type="button" className="adminp-hamb adminp-hamb-left" id="admin-toggle-filters" aria-label="Menú filtros" onClick={openFiltersMenu}>☰</button>
            <div className="adminp-title">
              <span className="adminp-icon">📊</span>
              <div>
                <div className="adminp-title-main">Panel de Administración</div>
                <div className="adminp-title-sub">Gestión de pedidos recibidos desde la carta digital y WhatsApp.</div>
              </div>
            </div>
            <div className="adminp-chips">
              <button type="button" data-chipstatus="Pendiente" className={`adminp-chip ${fltStatus === 'Pendiente' ? 'is-on' : ''}`} onClick={() => setFltStatus('Pendiente')}>Pendiente</button>
              <button type="button" data-chipstatus="En preparación" className={`adminp-chip adminp-chip-blue ${fltStatus === 'En preparación' ? 'is-on' : ''}`} onClick={() => setFltStatus('En preparación')}>En preparación</button>
              <button type="button" data-chipstatus="Entregado" className={`adminp-chip adminp-chip-green ${fltStatus === 'Entregado' ? 'is-on' : ''}`} onClick={() => setFltStatus('Entregado')}>Entregado</button>
              <button type="button" data-chipstatus="Cancelado" className={`adminp-chip adminp-chip-red ${fltStatus === 'Cancelado' ? 'is-on' : ''}`} onClick={() => setFltStatus('Cancelado')}>Cancelado</button>
            </div>
            <button type="button" className="adminp-hamb adminp-hamb-right" id="admin-toggle-drawer" aria-label="Abrir acciones" onClick={() => setDrawerOpen(true)}>☰</button>
          </div>

          <div className="adminp-stats">
            <div className="adminp-stat">
              <div className="k">TOTAL PEDIDOS</div>
              <div id="st-total" className="v">{stats.total}</div>
            </div>
            <div className="adminp-stat">
              <div className="k">PEDIDOS HOY</div>
              <div id="st-today" className="v">{stats.todayCt}</div>
            </div>
            <div className="adminp-stat">
              <div className="k">VENTAS HOY</div>
              <div id="st-sales" className="v">{money(stats.todaySales)}</div>
            </div>
            <div className="adminp-stat">
              <div className="k">PENDIENTES</div>
              <div id="st-pending" className="v">{stats.pending}</div>
            </div>
            <div className="adminp-stat adminp-stat-wide">
              <div className="k">% PEDIDOS ENTREGADOS</div>
              <div id="st-rate" className="v">{stats.rate}</div>
            </div>
            <div className="adminp-stat adminp-stat-wide">
              <div className="k">TICKET PROMEDIO</div>
              <div id="st-avg" className="v">{stats.avg}</div>
            </div>
            <div className="adminp-stat adminp-stat-wide">
              <div className="k">TIEMPO PROM. ENTREGA</div>
              <div id="st-eta" className="v">{stats.eta}</div>
            </div>
          </div>

          <div className="adminp-filters-scroll">
            <div className="adminp-filters">
              <div className="adminp-field">
                <label className="adminp-label" htmlFor="flt-from">Desde</label>
                <input id="flt-from" className="adminp-input" type="date" value={fltFrom} onChange={(e) => setFltFrom(e.target.value)} />
              </div>
              <div className="adminp-field">
                <label className="adminp-label" htmlFor="flt-to">Hasta</label>
                <input id="flt-to" className="adminp-input" type="date" value={fltTo} onChange={(e) => setFltTo(e.target.value)} />
              </div>
              <div className="adminp-field">
                <label className="adminp-label" htmlFor="flt-status">Estado</label>
                <select id="flt-status" className="adminp-input" value={fltStatus} onChange={(e) => setFltStatus(e.target.value)}>
                  <option value="">Todos</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="En preparación">En preparación</option>
                  <option value="En camino">En camino</option>
                  <option value="Entregado">Entregado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>
              <div className="adminp-field adminp-field-search">
                <label className="adminp-label" htmlFor="flt-q">Buscar (nombre / teléfono)</label>
                <input id="flt-q" className="adminp-input" type="text" placeholder="Ej: Juan, +569..." value={fltQ} onChange={(e) => setFltQ(e.target.value)} />
              </div>
              <div className="adminp-actions adminp-actions-inline">
                <button id="admin-copy-btn" className="adminp-btn adminp-btn-soft" type="button" onClick={copyOrders}>📋 Copiar pedidos (Excel)</button>
                <button id="admin-refresh-btn" className="adminp-btn adminp-btn-primary" type="button">🔄 Actualizar</button>
                <button id="admin-clear-btn" className="adminp-btn adminp-btn-soft" type="button" onClick={() => { setFltFrom(''); setFltTo(''); setFltStatus(''); setFltQ(''); }}>✖ Limpiar filtros</button>
                <button id="admin-pdf-btn" className="adminp-btn adminp-btn-soft" type="button" onClick={pdfExport}>🧾 Exportar a PDF</button>
                <button id="enable-sound-btn" className="adminp-btn adminp-btn-soft" type="button" onClick={enableSound}>🔔 Activar sonido</button>
              </div>
              <div className="adminp-range-note">
                <span id="admin-range-count">{`Pedidos en el rango seleccionado: ${filtered.length}`}</span>
              </div>
            </div>
          </div>

          <div id="adminp-drawer" className={`adminp-drawer ${drawerOpen ? 'open' : ''}`} aria-hidden={drawerOpen ? 'false' : 'true'}>
            <div className="adminp-drawer-header">
              <button type="button" className="adminp-drawer-close-btn" id="admin-drawer-close" aria-label="Cerrar menú" onClick={() => setDrawerOpen(false)}>☰</button>
            </div>
            <div className="adminp-drawer-body">
              <button id="admin-copy-btn-drawer" className="adminp-drawer-item adminp-drawer-item-green" type="button" onClick={() => { copyOrders(); setDrawerOpen(false); }}>📋 Copiar pedidos (Excel)</button>
              <button id="admin-refresh-btn-drawer" className="adminp-drawer-item adminp-drawer-item-blue" type="button" onClick={() => setDrawerOpen(false)}>🔄 Actualizar</button>
              <button id="admin-clear-btn-drawer" className="adminp-drawer-item adminp-drawer-item-dark" type="button" onClick={() => { setFltFrom(''); setFltTo(''); setFltStatus(''); setFltQ(''); setDrawerOpen(false); }}>✖ Limpiar filtros</button>
              <button id="admin-pdf-btn-drawer" className="adminp-drawer-item adminp-drawer-item-red" type="button" onClick={() => { pdfExport(); setDrawerOpen(false); }}>🧾 Exportar a PDF</button>
              <button id="enable-sound-btn-drawer" className="adminp-drawer-item adminp-drawer-item-dark" type="button" onClick={() => { enableSound(); setDrawerOpen(false); }}>🔔 Activar sonido</button>
            </div>
            <div className="adminp-drawer-foot">
              <button id="admin-close-panel-drawer" className="adminp-close adminp-close-drawer" type="button" onClick={() => { setDrawerOpen(false); setPanelOpen(false); }}>Cerrar panel</button>
            </div>
          </div>

          <div className="adminp-tablewrap">
            <table className="adminp-table">
              <tbody id="admin-orders-tbody">
                {filtered.length === 0 ? (
                  <tr className="adminp-row"><td className="adminp-cell"><b>No hay pedidos con esos filtros.</b></td></tr>
                ) : (
                  filtered.map((o) => {
                    const name = (o.customer?.name || '').replaceAll('\n', ' ');
                    const phone = o.customer?.phone || '';
                    const total = money(o.total || 0);
                    const st = o.status || 'Pendiente';
                    const badgeCls = statusBadgeClass(st);
                    const fecha = new Date(o.createdAt).toLocaleString('es-CL');

                    return (
                      <tr key={o.id} className="adminp-row">
                        <td className="adminp-cell adminp-muted">{o.id || ''}</td>
                        <td className="adminp-cell"><b>{name}</b></td>
                        <td className="adminp-cell adminp-muted">{phone}</td>
                        <td className="adminp-cell adminp-money">{total}</td>
                        <td className="adminp-cell">
                          <span className={`adminp-badge ${badgeCls}`}>{st}</span>
                        </td>
                        <td className="adminp-cell adminp-muted">{fecha}</td>
                        <td className="adminp-cell">
                          <div className="adminp-actions-mini">
                            <button className="adminp-mini" type="button" onClick={() => alert(buildWhatsappTextFromOrder(o))}>Ver</button>
                            <button className="adminp-mini primary" type="button" onClick={() => patchOrderStatus(o.id)}>Estado</button>
                            <button className="adminp-mini wa" type="button" onClick={() => {
                              window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hola ${name}, sobre tu pedido Ticket ${o.ticketNumber}.`)}`, '_blank');
                            }}
                            >
                              WhatsApp
                            </button>
                            <button className="adminp-mini" type="button" onClick={() => printTicket80mm(o)}>Imprimir</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="adminp-foot">
            <button id="admin-close-panel" className="adminp-close" type="button" onClick={() => setPanelOpen(false)}>Cerrar panel</button>
          </div>
        </div>
      </div>

      <FooterAdminBridge openLogin={openLogin} />
    </>
  );
}

function FooterAdminBridge({ openLogin }) {
  useEffect(() => {
    window.__openAdminPollon__ = () => openLogin();
    return () => { delete window.__openAdminPollon__; };
  }, [openLogin]);
  return null;
}
