import { useState } from 'react';
import { usePollon } from '../context/PollonContext.jsx';

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([]);
  const { jumpToCategory, scrollToMenu, setModalDelivery } = usePollon();

  const welcome = () => {
    setMsgs([{ text: '¡Hola! Soy tu asistente. Elige una opción para ayudarte 😊', who: 'bot' }]);
  };

  const toggle = () => {
    setOpen((o) => {
      const next = !o;
      if (next) welcome();
      return next;
    });
  };

  const push = (text, who) => {
    setMsgs((m) => [...m, { text, who }]);
  };

  const onChip = (action) => {
    push(action, 'user');
    switch (action) {
      case 'familiares':
        push('Los combos familiares más pedidos están en “Familiares”. Te llevo ahí ✅', 'bot');
        jumpToCategory('ofertas-familiares');
        break;
      case 'masvendidos':
        push('🔥 Platos más vendidos: Ofertón más Chaufa, Ofertón más Fideo, Chaufa Brasa, Lomo Saltado. ¿Te llevo al menú? ✅', 'bot');
        scrollToMenu();
        break;
      case 'horarios':
        push('📍 Calle Vivar 1086, Iquique.\n🕒 Horario: 12:00 – 23:30', 'bot');
        break;
      case 'delivery':
        push('🚚 Delivery aprox. $2.500–$4.000 según zona.\nPara pedir: agrega productos → abre carrito → WhatsApp.', 'bot');
        setModalDelivery(true);
        break;
      case 'pedido':
        push('Para hacer pedido: agrega productos → abre carrito → “Realizar pedido por WhatsApp” ✅', 'bot');
        break;
      case 'pagos':
        push('Métodos de pago: En el local efectivo y tarjeta. En delivery solo efectivo.', 'bot');
        break;
      case 'redes':
        push('Síguenos en Facebook / Instagram / TikTok (botones en el footer).', 'bot');
        break;
      default:
        push('Listo 😊', 'bot');
    }
  };

  return (
    <>
      <button id="chatbot-toggle" className="chatbot-toggle" type="button" aria-label="Abrir chatbot" onClick={toggle}>💬</button>
      <div id="chatbot-panel" className={`chatbot-panel ${open ? '' : 'hidden'}`} aria-label="Chatbot">
        <div className="chatbot-head">
          <div className="font-extrabold">Asistente</div>
          <button id="chatbot-close" className="chatbot-close" type="button" onClick={() => setOpen(false)}>✕</button>
        </div>
        <div id="chatbot-messages" className="chatbot-messages">
          {msgs.map((m, i) => (
            <div key={i.toString()} className={`cb-msg ${m.who === 'user' ? 'cb-user' : 'cb-bot'}`}>{m.text}</div>
          ))}
        </div>
        <div className="chatbot-chips">
          {[
            ['familiares', 'Combos familiares'],
            ['masvendidos', 'Platos más vendidos'],
            ['horarios', 'Horarios y dirección'],
            ['delivery', 'Delivery y zonas'],
            ['pedido', 'Hacer un pedido'],
            ['pagos', 'Métodos de pago'],
            ['redes', 'Redes sociales'],
          ].map(([k, label]) => (
            <button key={k} className="chip" type="button" data-chat={k} onClick={() => onChip(k)}>{label}</button>
          ))}
        </div>
      </div>
    </>
  );
}
