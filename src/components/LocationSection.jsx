export function LocationSection() {
  return (
    <section className="location-pro mt-10">
      <div className="location-card">
        <div className="location-address">
          <span className="location-address-icon" aria-hidden="true">📍</span>
          <span className="location-address-text">Calle Vivar 1086, Iquique</span>
        </div>
        <div className="location-map">
          <iframe
            title="Mapa Pollería El Pollón - Calle Vivar 1086, Iquique"
            src="https://www.google.com/maps?q=Calle%20Vivar%201086%2C%20Iquique&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
