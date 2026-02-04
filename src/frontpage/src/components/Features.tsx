import { Component, For } from 'solid-js';
import { useLanguage } from '../context/LanguageContext';
import type { FeatureEntry } from '../translations';

const FeatureIcon: Component<{ type: string }> = (props) => {
  const icons: Record<string, any> = {
    location: (
      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    data: (
      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
      </svg>
    ),
    chart: (
      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    shield: (
      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  };

  return icons[props.type] || icons.location;
};

const Features: Component = () => {
  const { t } = useLanguage();
  const features = () => (t('features.list') as FeatureEntry[]) ?? [];

  return (
    <section id="features" class="py-24 bg-base-100">
      <div class="container mx-auto px-4 max-w-6xl">
        {/* Section header */}
        <div class="text-center mb-16">
          <div class="badge badge-secondary badge-outline mb-4">{t('features.badge') as string}</div>
          <h2 class="text-4xl font-bold mb-4">
            {(t('features.title') as string)}
            <span class="text-primary">{(t('features.titleHighlight') as string)}</span>
          </h2>
          <p class="text-base-content/70 max-w-2xl mx-auto">
            {(t('features.subtitle') as string)}
          </p>
        </div>

        {/* Features grid */}
        <div class="grid md:grid-cols-2 gap-8">
          <For each={features()}>
            {(feature) => (
              <div class="card bg-base-200 hover:bg-base-300 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div class="card-body">
                  <div class="flex items-start gap-4">
                    <div class="bg-primary/10 text-primary p-4 rounded-xl">
                      <FeatureIcon type={feature.icon} />
                    </div>
                    <div>
                      <h3 class="card-title text-xl mb-2">{feature.title}</h3>
                      <p class="text-base-content/70">{feature.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </For>
        </div>
      </div>
    </section>
  );
};

export default Features;
