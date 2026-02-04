import { type Component, createEffect } from 'solid-js';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import UseCases from './components/UseCases';
import CTA from './components/CTA';
import Footer from './components/Footer';

const AppContent: Component = () => {
  const { locale, t } = useLanguage();

  createEffect(() => {
    locale();
    const title = t('meta.title');
    const description = t('meta.description');
    if (typeof title === 'string') document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && typeof description === 'string') {
      metaDesc.setAttribute('content', description);
    }
  });

  return (
    <div class="min-h-screen bg-base-100">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <UseCases />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

const App: Component = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;
