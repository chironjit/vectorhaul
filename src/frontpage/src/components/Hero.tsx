import { Component, createSignal, onCleanup, onMount } from 'solid-js';
import { useLanguage } from '../context/LanguageContext';

const Hero: Component = () => {
  const { t } = useLanguage();
  const words = () => (t('hero.words') as string[]) ?? [];
  const longestWord = () =>
    words().reduce((longest, word) => (word.length > longest.length ? word : longest), '');
  const [wordIndex, setWordIndex] = createSignal(0);
  const [isAnimating, setIsAnimating] = createSignal(false);
  const [isVisible, setIsVisible] = createSignal(false);
  let flipTimeout: number | undefined;
  let resetTimeout: number | undefined;
  let interval: number | undefined;

  onMount(() => {
    // Trigger entrance animation
    requestAnimationFrame(() => setIsVisible(true));

    interval = window.setInterval(() => {
      if (isAnimating()) return;
      const w = words();
      if (!w.length) return;
      setIsAnimating(true);
      flipTimeout = window.setTimeout(() => {
        setWordIndex((current) => (current + 1) % w.length);
      }, 350);
      resetTimeout = window.setTimeout(() => {
        setIsAnimating(false);
      }, 700);
    }, 2500);
  });

  onCleanup(() => {
    if (interval) window.clearInterval(interval);
    if (flipTimeout) window.clearTimeout(flipTimeout);
    if (resetTimeout) window.clearTimeout(resetTimeout);
  });
  return (
    <div class="hero min-h-[60vh] pt-20 pb-12 bg-base-200 relative overflow-hidden">
      
      <div class="hero-content text-center relative z-10">
        <div class="max-w-3xl">
          {/* Badge */}
          <div class="badge badge-primary badge-outline mb-4 gap-2 py-3 px-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {t('hero.badge') as string}
          </div>

          {/* Main heading */}
          <h1 class={`hero-heading text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4${isVisible() ? ' is-visible' : ''}`}>
            <span class="headline-inline">
              <span class="text-base-content">{t('hero.headingUnified') as string}</span>
              <span class="headline-animated">
                <span class="flip-container">
                  <span class={`flip-word bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent${isAnimating() ? ' is-animating' : ''}`}>
                    {words()[wordIndex()]}
                  </span>
                  <span class="flip-sizer bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent" aria-hidden="true">
                    {longestWord()}
                  </span>
                </span>
              </span>
              <span class="text-base-content">{t('hero.headingTrackingPlatform') as string}</span>
            </span>
          </h1>

          {/* Tagline */}
          <p class="text-base md:text-lg text-base-content/70 mb-6 max-w-2xl mx-auto">
            {t('hero.tagline') as string}
          </p>

          {/* CTA buttons */}
          <div class="flex flex-wrap gap-4 justify-center">
            <a href="/dashboard" class="btn btn-primary btn-lg gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {t('hero.viewDashboard') as string}
            </a>
            <a href="#features" class="btn btn-outline btn-lg gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t('hero.learnMore') as string}
            </a>
          </div>

        </div>
      </div>

      <style>
        {`
          /* Entrance animation for the whole heading */
          .hero-heading {
            opacity: 0;
            transform: translateY(16px);
            transition: opacity 0.5s ease-out, 
                        transform 0.5s ease-out;
          }
          
          .hero-heading.is-visible {
            opacity: 1;
            transform: translateY(0);
          }

          /* Inline headline layout */
          .headline-inline {
            display: inline-flex;
            flex-wrap: wrap;
            justify-content: center;
            align-items: baseline;
            gap: 0.15em 0.3em;
          }

          .headline-animated {
            position: relative;
          }

          /* Flip container for the animated word */
          .flip-container {
            display: inline-grid;
            grid-template-columns: 1fr;
            grid-template-rows: 1fr;
            perspective: 1200px;
            white-space: nowrap;
          }

          .flip-word {
            display: inline-block;
            grid-column: 1;
            grid-row: 1;
            transform-origin: 50% 50%;
            transform-style: preserve-3d;
            transition: filter 0.3s ease;
            will-change: transform, opacity, filter;
          }

          .flip-sizer {
            grid-column: 1;
            grid-row: 1;
            visibility: hidden;
            pointer-events: none;
            height: 0;
          }

          /* Enhanced flip animation with glow */
          .flip-word.is-animating {
            animation: flip-word 0.7s cubic-bezier(0.4, 0, 0.2, 1);
          }

          @keyframes flip-word {
            0% {
              transform: rotateX(0deg);
              opacity: 1;
            }
            45% {
              transform: rotateX(90deg);
              opacity: 0;
            }
            55% {
              transform: rotateX(-90deg);
              opacity: 0;
            }
            100% {
              transform: rotateX(0deg);
              opacity: 1;
            }
          }

          /* Subtle pulse glow on the animated word */
          .headline-animated .flip-word:not(.is-animating) {
            animation: subtle-glow 3s ease-in-out infinite;
          }

          @keyframes subtle-glow {
            0%, 100% {
              filter: drop-shadow(0 0 4px oklch(var(--p) / 0.15));
            }
            50% {
              filter: drop-shadow(0 0 12px oklch(var(--p) / 0.25));
            }
          }

        `}
      </style>
    </div>
  );
};

export default Hero;
