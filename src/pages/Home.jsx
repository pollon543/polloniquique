import { Header } from '../components/Header.jsx';
import { HeroBanner } from '../components/HeroBanner.jsx';
import { CategoryMenu } from '../components/CategoryMenu.jsx';
import { ProductGrid } from '../components/ProductGrid.jsx';
import { PromoCombos } from '../components/PromoCombos.jsx';
import { LocationSection } from '../components/LocationSection.jsx';
import { Footer } from '../components/Footer.jsx';
import { ModalsInfo } from '../components/ModalsInfo.jsx';
import { OptionsModal } from '../components/OptionsModal.jsx';
import { CartModal } from '../components/CartModal.jsx';
import { CheckoutModal } from '../components/CheckoutModal.jsx';
import { FloatingCart } from '../components/FloatingCart.jsx';
import { Chatbot } from '../components/Chatbot.jsx';
import { AdminSuite } from '../components/AdminSuite.jsx';

export function Home() {
  return (
    <div className="home-root bg-gray-50 text-gray-900">
      <Header />
      <HeroBanner />

      <main className="mx-auto max-w-7xl px-3 sm:px-4 pb-24 main-pad-fix" id="ofertas">
        <section className="mt-6 page-section-pro" id="plato-top">
          <div className="topbar-wrap">
            <a className="top-pill" href="#ofertas-familiares" aria-label="Ir a Ofertas familiares">
              <span className="pill-left">Top vendidos</span>
              <span className="pill-stars" aria-hidden="true">
                <span className="star">⭐</span><span className="star">⭐</span><span className="star">⭐</span>
              </span>
            </a>
            <a className="top-pill top-pill--favoritos" href="#plato-top" aria-label="Ir a Favoritos">
              <span className="pill-left">Favoritos</span>
              <span className="pill-hearts" aria-hidden="true">
                <span className="pill-heart">♥</span><span className="pill-heart">♥</span><span className="pill-heart">♥</span>
              </span>
            </a>
          </div>

          <CategoryMenu />
          <div id="category-title" className="category-title is-hidden" />
          <ProductGrid />
        </section>

        <PromoCombos />
        <LocationSection />
      </main>

      <FloatingCart />
      <Chatbot />

      <ModalsInfo />
      <OptionsModal />
      <CartModal />
      <CheckoutModal />
      <AdminSuite />

      <Footer />
    </div>
  );
}
