import { Component, createSignal, onMount } from 'solid-js';
import { useLanguage } from '../context/LanguageContext';
import type { Locale } from '../translations';

const LANGUAGES: { code: Locale; labelKey: string }[] = [
  { code: 'en', labelKey: 'navbar.langEn' },
  { code: 'ms', labelKey: 'navbar.langMs' },
];

const Navbar: Component = () => {
  const { locale, setLocale, t } = useLanguage();
  const [theme, setTheme] = createSignal<'light' | 'dark'>('light');
  const [scrolled, setScrolled] = createSignal(false);

  const currentLanguageLabel = () => {
    const found = LANGUAGES.find((l) => l.code === locale());
    return found ? (t(found.labelKey) as string) : locale();
  };

  onMount(() => {
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    // Handle scroll
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  const toggleTheme = () => {
    const newTheme = theme() === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const ariaToggleTheme = () => t('navbar.ariaToggleTheme') as string;
  const ariaSelectLanguage = () => t('navbar.ariaSelectLanguage') as string;

  return (
    <nav
      class={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled() ? 'bg-base-100/95 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}
    >
      <div class="container mx-auto px-4 max-w-6xl">
        <div class="navbar min-h-16">
          {/* Logo */}
          <div class="navbar-start">
            <a href="/" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div class="bg-primary text-primary-content p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <span class="font-bold text-lg hidden sm:inline">{t('navbar.brand') as string}</span>
            </a>
          </div>

          {/* Desktop navigation */}
          <div class="navbar-center hidden md:flex">
            <ul class="menu menu-horizontal px-1 gap-1">
              <li>
                <a href="#features" class="rounded-lg">{t('navbar.features') as string}</a>
              </li>
              <li>
                <a href="#use-cases" class="rounded-lg">{t('navbar.useCases') as string}</a>
              </li>
              <li>
                <a href="#contact" class="rounded-lg">{t('navbar.contact') as string}</a>
              </li>
            </ul>
          </div>

          {/* Right side actions */}
          <div class="navbar-end gap-2">
            {/* Language selector dropdown */}
            <div class="dropdown dropdown-end" role="group" aria-label={ariaSelectLanguage()}>
              <label tabindex="0" class="btn btn-ghost btn-sm gap-1 min-h-8 h-8">
                <span>{currentLanguageLabel()}</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </label>
              <ul tabindex="0" class="menu menu-sm dropdown-content mt-2 z-[1] p-1 shadow bg-base-100 rounded-box w-40 border border-base-200">
                {LANGUAGES.map((lang) => (
                  <li>
                    <button
                      type="button"
                      class={locale() === lang.code ? 'active' : ''}
                      onClick={() => setLocale(lang.code)}
                    >
                      {t(lang.labelKey) as string}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              class="btn btn-ghost btn-circle"
              aria-label={ariaToggleTheme()}
            >
              {theme() === 'light' ? (
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>

            {/* Datahub button */}
            <a href="https://datahub.vectorhaul.com" class="btn btn-primary btn-sm md:btn-md">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {t('navbar.datahub') as string}
            </a>

            {/* Mobile menu button */}
            <div class="dropdown dropdown-end md:hidden">
              <label tabindex="0" class="btn btn-ghost btn-circle">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </label>
              <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                <li><a href="#features">{t('navbar.features') as string}</a></li>
                <li><a href="#use-cases">{t('navbar.useCases') as string}</a></li>
                <li><a href="#contact">{t('navbar.contact') as string}</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
