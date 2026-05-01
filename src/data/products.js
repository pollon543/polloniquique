/**
 * Catálogo y metadatos (misma estructura que js/app.js)
 * Rutas img relativas a public/ → /polloniquique/img/...
 */
export const PRODUCTS = {
  'ofertas-familiares': [
    { name: 'Ofertón más chaufa', price: 24500, img: 'img/oferton mas chaufa.png', desc: 'Pollo entero, papas fritas, arroz chaufa, ensalada y bebidas 1.5lt.' },
    { name: 'Ofertón más fideo', price: 24500, img: 'img/oferton mas fideo.png', desc: 'Pollo entero, papas fritas, fideos al pesto, ensalada y bebidas 1.5lt.' },
    { name: 'Ofertón más chaufa pura papa', price: 24500, img: 'img/oferton mas chaufa pura papa.png', desc: 'Pollo entero, papas, extra papa, chaufa y bebidas 1.5lt.' },
    { name: 'Ofertón con fideo', price: 23500, img: 'img/oferton con fideo.png', desc: 'Pollo entero, papas, fideos al pesto, ensalada y bebidas 1.5lt' },
    { name: 'Ofertón sin ensalada', price: 23500, img: 'img/oferton sin ensalada.png', desc: 'Pollo entero, papas, chaufa y bebidas 1.5lt' },
    { name: 'Ofertón pura papa', price: 23500, img: 'img/oferton pura papa.png', desc: 'Pollo entero, papas + 1/2 porción papa y bebidas' },
    { name: 'Ofertón familiar', price: 22500, img: 'img/oferton familiar.png', desc: 'Pollo entero, papas, ensalada y bebidas 1.5lt' },
    { name: 'Mega Familiar', price: 22500, img: 'img/oferton familiar.png', desc: 'Pollo entero, papas, ensalada y bebidas 1.5lt' },
  ],
  'ofertas-dos': [
    { name: '1/2 combo chaufa', price: 15600, img: 'img/medio combo chaufa.png', desc: 'Medio pollo + papas + chaufa' },
    { name: '1/2 combo', price: 15100, img: 'img/medio combo.png', desc: 'Medio pollo + papas + ensalada personal' },
    { name: '1/2 combo pura papa', price: 15100, img: 'img/medio combo pura papa.png', desc: 'Medio pollo + más papas' },
  ],
  'ofertas-personales': [
    { name: '1/4 combo', price: 8100, img: 'img/personal combo.png', desc: '1/4 pollo + papas personales + ensalada' },
    { name: '1/4 combo pura papa', price: 8100, img: 'img/personal combo pura papa.png', desc: '1/4 pollo + más papas' },
    { name: 'Chaufa brasa', price: 8200, img: 'img/chaufa brasa.png', desc: '1/4 pollo + chaufa' },
    { name: 'Fideo al pesto con 1/4', price: 8100, img: 'img/fideo al pesto con 1-4.png', desc: '1/4 pollo + fideos al pesto' },
    { name: 'Chaufa brasa con papas', price: 9200, img: 'img/chaufa brasa con papas fritas.png', desc: '1/4 pollo + chaufa + papas' },
    { name: '1/4 pollo con fideo y papa', price: 9300, img: 'img/personal con papa y fideo.png', desc: '1/4 pollo + fideo + papas' },
  ],
  'platos-extras': [
    { name: 'Lomo saltado de carne con chaufa', price: 12200, img: 'img/lomo saltado con arroz chaufa.png', desc: 'Plato extra con chaufa' },
    { name: 'Lomo saltado de carne con arroz blanco', price: 11700, img: 'img/lomo saltado de carne con arroz blanco.png', desc: 'Plato extra con arroz blanco' },
    { name: 'Lomo saltado de pollo con arroz blanco', price: 11700, img: 'img/lomo saltado de pollo con arroz blanco.png', desc: 'Plato extra con arroz blanco' },
    { name: 'Tallarín saltado', price: 11700, img: 'img/tallarin saltado de carne.png', desc: 'Tallarín saltado de carne' },
    { name: 'Bistec a lo pobre', price: 10700, img: 'img/bistec a lo pobre.png', desc: 'Bistec a lo pobre' },
    { name: 'Bistec con fideos al pesto', price: 10700, img: 'img/bistec con fideos al pesto.png', desc: 'Bistec + fideos al pesto' },
    { name: 'Chuleta de cerdo', price: 10700, img: 'img/chuleta de cerdo.png', desc: 'Chuleta de cerdo' },
    { name: 'Pechuga a la plancha', price: 10200, img: 'img/pechuga a la plancha.png', desc: 'Pechuga a la plancha' },
    { name: 'Combo nuggets', price: 6700, img: 'img/combo nuggets.png', desc: 'Combo nuggets' },
    { name: 'Salchipapas', price: 6700, img: 'img/salchipapas.png', desc: 'Salchipapas' },
  ],
  agregados: [
    { name: '1 Pollo entero solo', price: 15000, img: 'img/1 pollo solo.png', desc: 'Solo pollo' },
    { name: '1/2 Pollo solo', price: 9900, img: 'img/medio pollo solo.png', desc: 'Medio pollo' },
    { name: '1/4 pollo solo', price: 5800, img: 'img/cuarto pollo solo.png', desc: 'Cuarto de pollo' },
    { name: 'Porción papas familiar', price: 9000, img: 'img/porcion de papa.png', desc: 'Porción de papas familiar' },
    { name: '1/2 porción papas', price: 6100, img: 'img/1-2 porcion papas.png', desc: 'Media porción papas' },
    { name: 'Porción arroz chaufa', price: 5300, img: 'img/porcion arroz chaufa.png', desc: 'Porción de arroz chaufa' },
    { name: 'Porción fideos al pesto', price: 5300, img: 'img/porcion de fideo.png', desc: 'Porción de fideos al pesto' },
    { name: 'Ensalada familiar', price: 5400, img: 'img/ensalada familiar.png', desc: 'Ensalada familiar' },
    { name: 'Ensalada personal', price: 3700, img: 'img/ensalada personal.png', desc: 'Ensalada personal' },
  ],
  bebidas: [
    { name: 'Coca Cola 1.5L', price: 3800, img: 'img/coca cola.png', desc: 'Bebida 1.5L' },
    { name: 'Coca Cola Cero', price: 3800, img: 'img/coca cola cero.png', desc: 'Bebida 1.5L' },
    { name: 'Inca Kola', price: 3800, img: 'img/inca kola.png', desc: 'Bebida 1.5L' },
    { name: 'Fanta', price: 3800, img: 'img/fanta.png', desc: 'Bebida 1.5L' },
    { name: 'Sprite', price: 3800, img: 'img/sprite.png', desc: 'Bebida 1.5L' },
    { name: 'Sprite Cero', price: 3800, img: 'img/sprite cero.png', desc: 'Bebida 1.5L' },
    { name: 'Agua sin gas 500ml', price: 1200, img: 'img/agua sin gas.png', desc: 'Agua 500ml' },
    { name: 'Agua con gas 500ml', price: 1200, img: 'img/agua con gas.png', desc: 'Agua 500ml' },
  ],
  descartables: [
    { name: 'Aluza CT5', price: 300, img: 'img/aluza ct5.png', desc: 'Envase descartable Aluza CT5' },
    { name: 'Aluza CT3', price: 400, img: 'img/aluza ct3.png', desc: 'Envase descartable Aluza CT3' },
    { name: 'Tenedor descartable', price: 200, img: 'img/servicio descartable.png', desc: 'Tenedor y cuchillo plástico descartable.' },
    { name: 'Bolsa ecológica', price: 200, img: 'img/bolsa ecologica.png', desc: 'Bolsa ecológica' },
    { name: 'Vaso descartable', price: 50, img: 'img/vaso.png', desc: 'Descartable' },
  ],
};

export const CATEGORY_META = {
  'todo-el-menu': '📋 Todo el Menú',
  'ofertas-familiares': '👨‍👩‍👧‍👦 Ofertas Familiares',
  'ofertas-dos': '👫 Ofertas para Dos',
  'ofertas-personales': '🍗 Ofertas Personales',
  'platos-extras': '🍽️ Platos Extras',
  agregados: '➕ Agregados',
  bebidas: '🥤 Bebidas',
  descartables: '🧾 Descartables',
};

export const CATEGORY_ORDER = [
  'ofertas-familiares',
  'ofertas-dos',
  'ofertas-personales',
  'platos-extras',
  'agregados',
  'bebidas',
  'descartables',
];
